#!/usr/bin/env python3
"""
富途 OpenD → 期權鏈（供 Node analyzeChain 使用）
需本機已啟動 FutuOpenD（預設 127.0.0.1:11111）並登入行情權限。

用法：
  python3 scripts/update-options-opend.py
  OPEND_HOST=127.0.0.1 OPEND_PORT=11111 python3 scripts/update-options-opend.py

輸出：stdout JSON { ok, chains: { NVDA: { quote, options } } }
"""
from __future__ import annotations

import json
import os
import socket
import sys
from datetime import date, datetime, timedelta

# 觀察板 13 檔（與 tickers.mjs 同步）
WATCH = [
    "GOOGL", "NVDA", "AMD", "ARM", "ANET", "VRT", "SMCI", "IREN",
    "PLTR", "CRCL", "SNOW", "SIVE", "POET",
]
FUTU_OVERRIDE = {"SIVE": "US.SIVEF"}


def futu_code(ticker: str) -> str:
    if ticker in FUTU_OVERRIDE:
        return FUTU_OVERRIDE[ticker]
    return f"US.{ticker}"


def opend_reachable(host: str, port: int, timeout: float = 2.0) -> bool:
    try:
        with socket.create_connection((host, port), timeout=timeout):
            return True
    except OSError:
        return False


def parse_expiry_dates(exp_df):
    if exp_df is None or exp_df.empty:
        return []
    col = "strike_time" if "strike_time" in exp_df.columns else exp_df.columns[0]
    out = []
    for raw in exp_df[col].tolist():
        if raw is None:
            continue
        s = str(raw)[:10]
        try:
            datetime.strptime(s, "%Y-%m-%d")
            out.append(s)
        except ValueError:
            continue
    return sorted(set(out))


def chunk_ranges(dates, max_days=28):
    """Futu get_option_chain 單次查詢到期跨度最多約一個月。"""
    if not dates:
        return []
    parsed = sorted(datetime.strptime(d, "%Y-%m-%d").date() for d in dates)
    ranges = []
    i = 0
    while i < len(parsed):
        start = parsed[i]
        end = start
        j = i
        while j < len(parsed) and (parsed[j] - start).days <= max_days:
            end = parsed[j]
            j += 1
        ranges.append((start.isoformat(), end.isoformat()))
        i = j
    return ranges


def strike_time_to_unix(strike_time: str) -> int:
    dt = datetime.strptime(str(strike_time)[:10], "%Y-%m-%d")
    return int(dt.replace(hour=21, minute=0).timestamp())  # 美东收盘近似


def fetch_ticker_chain(ctx, ticker: str, max_expiries: int = 6):
    from futu import RET_OK

    code = futu_code(ticker)
    ret, spot_df = ctx.get_market_snapshot([code])
    if ret != RET_OK or spot_df is None or spot_df.empty:
        raise RuntimeError(f"{ticker}: 無法取得現價 snapshot")
    spot = float(spot_df.iloc[0].get("last_price") or 0)
    if spot <= 0:
        raise RuntimeError(f"{ticker}: 現價無效")

    ret, exp_df = ctx.get_option_expiration_date(code=code)
    if ret != RET_OK:
        raise RuntimeError(f"{ticker}: get_option_expiration_date 失敗")

    today = date.today()
    horizon = today + timedelta(days=90)
    expiries = [
        d
        for d in parse_expiry_dates(exp_df)
        if today <= datetime.strptime(d, "%Y-%m-%d").date() <= horizon
    ][:max_expiries]

    if not expiries:
        return {"quote": {"regularMarketPrice": spot}, "options": []}

    option_codes = set()
    expiry_strikes = {}  # date -> list of {strike, call_code, put_code}

    for start, end in chunk_ranges(expiries):
        ret, chain_df = ctx.get_option_chain(code, start=start, end=end)
        if ret != RET_OK or chain_df is None or chain_df.empty:
            continue
        for _, row in chain_df.iterrows():
            strike_time = str(
                row.get("strike_time") or row.get("strikeTime") or start
            )[:10]
            strike = row.get("strike_price") or row.get("strikePrice")
            if strike is None:
                continue
            try:
                strike_f = float(strike)
            except (TypeError, ValueError):
                continue
            call_code = row.get("call_code") or row.get("callCode")
            put_code = row.get("put_code") or row.get("putCode")
            if strike_time not in expiry_strikes:
                expiry_strikes[strike_time] = []
            expiry_strikes[strike_time].append(
                {
                    "strike": strike_f,
                    "call_code": call_code if call_code and str(call_code) != "nan" else None,
                    "put_code": put_code if put_code and str(put_code) != "nan" else None,
                }
            )
            if call_code and str(call_code) != "nan":
                option_codes.add(str(call_code))
            if put_code and str(put_code) != "nan":
                option_codes.add(str(put_code))

    snap_map = {}
    codes = list(option_codes)
    batch = 180
    for i in range(0, len(codes), batch):
        part = codes[i : i + batch]
        if not part:
            continue
        ret, snap = ctx.get_market_snapshot(part)
        if ret != RET_OK or snap is None:
            continue
        for _, r in snap.iterrows():
            snap_map[str(r["code"])] = r

    def contract_from_snap(strike, opt_code, side):
        if not opt_code or opt_code not in snap_map:
            return {
                "strike": strike,
                "openInterest": 0,
                "volume": 0,
                "impliedVolatility": None,
            }
        r = snap_map[opt_code]
        iv = r.get("option_implied_volatility")
        if iv is not None:
            try:
                iv = float(iv)
                if iv > 3:  # 可能是百分比
                    iv = iv / 100.0
            except (TypeError, ValueError):
                iv = None
        oi = int(r.get("option_open_interest") or 0)
        vol = int(r.get("volume") or 0)
        return {
            "strike": strike,
            "openInterest": oi,
            "volume": vol,
            "impliedVolatility": iv,
        }

    options = []
    for strike_time in sorted(expiry_strikes.keys()):
        calls = []
        puts = []
        for item in expiry_strikes[strike_time]:
            if item["call_code"]:
                calls.append(
                    contract_from_snap(item["strike"], item["call_code"], "call")
                )
            if item["put_code"]:
                puts.append(
                    contract_from_snap(item["strike"], item["put_code"], "put")
                )
        options.append(
            {
                "expirationDate": strike_time_to_unix(strike_time),
                "expirationDateStr": strike_time,
                "calls": calls,
                "puts": puts,
            }
        )

    return {"quote": {"regularMarketPrice": spot}, "options": options}


def main():
    host = os.environ.get("OPEND_HOST", "127.0.0.1")
    port = int(os.environ.get("OPEND_PORT", "11111"))
    tickers = os.environ.get("OPEND_TICKERS", ",".join(WATCH)).split(",")
    tickers = [t.strip() for t in tickers if t.strip()]

    if not opend_reachable(host, port):
        print(
            json.dumps(
                {
                    "ok": False,
                    "error": f"OpenD 未連線 ({host}:{port}) · 請先啟動 FutuOpenD 並登入",
                    "chains": {},
                },
                ensure_ascii=False,
            )
        )
        sys.exit(2)

    from futu import OpenQuoteContext

    ctx = OpenQuoteContext(host=host, port=port)
    chains = {}
    errors = {}
    try:
        for ticker in tickers:
            try:
                chains[ticker] = fetch_ticker_chain(ctx, ticker)
            except Exception as e:
                errors[ticker] = str(e)
                chains[ticker] = {
                    "quote": {"regularMarketPrice": None},
                    "options": [],
                    "error": str(e),
                }
    finally:
        ctx.close()

    out = {
        "ok": True,
        "host": host,
        "port": port,
        "asOf": date.today().isoformat(),
        "chains": chains,
        "errors": errors,
    }
    print(json.dumps(out, ensure_ascii=False))


if __name__ == "__main__":
    main()
