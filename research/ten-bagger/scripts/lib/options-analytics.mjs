/**
 * 期權鏈摘要：P/C、Max Pain、IV 偏斜、方向提示（規則摘要，非預測）
 */

function cleanContracts(list) {
  return (list || [])
    .filter((c) => c.strike != null && (c.openInterest > 0 || c.volume > 0))
    .map((c) => ({
      strike: c.strike,
      oi: c.openInterest || 0,
      vol: c.volume || 0,
      iv: c.impliedVolatility ?? null,
    }));
}

export function maxPainStrike(calls, puts) {
  const strikes = new Set();
  for (const c of calls) strikes.add(c.strike);
  for (const p of puts) strikes.add(p.strike);
  if (!strikes.size) return null;

  let best = null;
  let minVal = Infinity;
  for (const S of strikes) {
    let v = 0;
    for (const c of calls) {
      if (S > c.strike) v += (S - c.strike) * c.oi;
    }
    for (const p of puts) {
      if (S < p.strike) v += (p.strike - S) * p.oi;
    }
    if (v < minVal) {
      minVal = v;
      best = S;
    }
  }
  return best;
}

export function sumOi(contracts) {
  return contracts.reduce((n, c) => n + c.oi, 0);
}

export function sumVol(contracts) {
  return contracts.reduce((n, c) => n + c.vol, 0);
}

/** 選流動性最好的到期日（21–60 DTE 優先） */
export function pickExpiryChain(optionChainResult) {
  const spot = optionChainResult?.quote?.regularMarketPrice;
  const chains = optionChainResult?.options || [];
  if (!chains.length) return null;

  const now = Date.now() / 1000;
  let best = null;
  let bestScore = -1;

  for (const ch of chains) {
    const dte = (ch.expirationDate - now) / 86400;
    if (dte < 2) continue;
    const calls = cleanContracts(ch.calls);
    const puts = cleanContracts(ch.puts);
    const oi = sumOi(calls) + sumOi(puts);
    const vol = sumVol(calls) + sumVol(puts);
    if (oi < 50 && vol < 20) continue;
    let score = Math.log10(oi + 10) + Math.log10(vol + 10) * 0.5;
    if (dte >= 14 && dte <= 55) score += 2;
    if (dte >= 7 && dte < 14) score += 0.5;
    if (score > bestScore) {
      bestScore = score;
      best = { chain: ch, dte: Math.round(dte), calls, puts, spot };
    }
  }

  if (!best && chains[0]) {
    const ch = chains.find((c) => c.expirationDate > now) || chains[0];
    best = {
      chain: ch,
      dte: Math.max(0, Math.round((ch.expirationDate - now) / 86400)),
      calls: cleanContracts(ch.calls),
      puts: cleanContracts(ch.puts),
      spot,
    };
  }
  return best;
}

/** 預設：量/OI ≥ 1.5，或當日量超過鏈上自適應閾值 */
export const FLOW_DEFAULTS = {
  minVolOi: 1.5,
  minVolFloor: 150,
};

/**
 * 標記異動成交：當日量 > 閾值，或 量/OI > N（分析用選定到期日）
 * @returns {{ unusualFlow: object[], volThreshold: number, minVolOi: number }}
 */
export function findUnusualContracts(calls, puts, opts = {}) {
  const minVolOi = opts.minVolOi ?? FLOW_DEFAULTS.minVolOi;
  const minVolFloor = opts.minVolFloor ?? FLOW_DEFAULTS.minVolFloor;
  const all = [
    ...calls.map((c) => ({ ...c, side: 'C' })),
    ...puts.map((c) => ({ ...c, side: 'P' })),
  ].filter((c) => c.vol > 0);

  if (!all.length) {
    return { unusualFlow: [], volThreshold: minVolFloor, minVolOi };
  }

  const vols = all.map((c) => c.vol).sort((a, b) => a - b);
  const median = vols[Math.floor(vols.length / 2)] || 0;
  const p90 = vols[Math.floor(vols.length * 0.9)] || median;
  const volThreshold = Math.max(
    minVolFloor,
    Math.round(Math.max(median * 2.5, p90 * 0.9)),
  );

  const hits = [];
  for (const c of all) {
    const volOi = c.oi > 0 ? c.vol / c.oi : null;
    const reasons = [];
    if (c.vol >= volThreshold) reasons.push('vol');
    if (volOi != null && volOi >= minVolOi) reasons.push('vol_oi');
    if (c.oi === 0 && c.vol >= volThreshold * 1.2) reasons.push('vol');

    if (!reasons.length) continue;

    hits.push({
      side: c.side,
      strike: c.strike,
      vol: c.vol,
      oi: c.oi,
      volOi: volOi != null ? Math.round(volOi * 100) / 100 : null,
      reasons: [...new Set(reasons)],
      score: Math.round(c.vol + (volOi != null && volOi >= minVolOi ? volOi * 400 : 0)),
    });
  }

  return {
    unusualFlow: hits.sort((a, b) => b.score - a.score).slice(0, 10),
    volThreshold,
    minVolOi,
  };
}

/** 觀察名單內異動成交 Top N（訊號列用） */
export function buildUnusualFlowTop(tickers, limit = 14) {
  const rows = [];
  for (const [ticker, x] of Object.entries(tickers || {})) {
    if (!x?.unusualFlow?.length) continue;
    for (const u of x.unusualFlow.slice(0, 4)) {
      rows.push({ ticker, ...u });
    }
  }
  return rows.sort((a, b) => b.score - a.score).slice(0, limit);
}

function atmIv(contracts, spot) {
  if (!spot || !contracts.length) return null;
  let best = null;
  let dist = Infinity;
  for (const c of contracts) {
    if (c.iv == null) continue;
    const d = Math.abs(c.strike - spot);
    if (d < dist) {
      dist = d;
      best = c.iv;
    }
  }
  return best;
}

export function analyzeChain(optionChainResult) {
  const picked = pickExpiryChain(optionChainResult);
  if (!picked) return { available: false };

  const { chain, dte, calls, puts, spot } = picked;
  const callOi = sumOi(calls);
  const putOi = sumOi(puts);
  const callVol = sumVol(calls);
  const putVol = sumVol(puts);
  const pcOi = callOi > 0 ? Math.round((putOi / callOi) * 100) / 100 : null;
  const pcVol = callVol > 0 ? Math.round((putVol / callVol) * 100) / 100 : null;
  const maxPain = maxPainStrike(calls, puts);
  const maxPainPct =
    maxPain && spot ? Math.round(((maxPain / spot - 1) * 100) * 10) / 10 : null;

  const ivCall = atmIv(calls, spot);
  const ivPut = atmIv(puts, spot);
  const ivSkew =
    ivCall != null && ivPut != null
      ? Math.round((ivPut - ivCall) * 1000) / 1000
      : null;

  const topCalls = [...calls].sort((a, b) => b.oi - a.oi).slice(0, 3);
  const topPuts = [...puts].sort((a, b) => b.oi - a.oi).slice(0, 3);
  const flow = findUnusualContracts(calls, puts);

  let score = 0;
  const reasons = [];

  if (pcOi != null) {
    if (pcOi < 0.75) {
      score += 1;
      reasons.push(`P/C(OI) ${pcOi} 偏低·Call 籌碼多`);
    } else if (pcOi > 1.25) {
      score -= 1;
      reasons.push(`P/C(OI) ${pcOi} 偏高·Put 避險多`);
    } else {
      reasons.push(`P/C(OI) ${pcOi} 中性`);
    }
  }

  if (maxPainPct != null) {
    if (maxPainPct > 2) {
      score += 0.5;
      reasons.push(`Max Pain $${maxPain} 高於現價 ${maxPainPct}%`);
    } else if (maxPainPct < -2) {
      score -= 0.5;
      reasons.push(`Max Pain $${maxPain} 低於現價 ${maxPainPct}%`);
    } else {
      reasons.push(`Max Pain $${maxPain} 近現價`);
    }
  }

  if (ivSkew != null && ivSkew > 0.05) {
    score -= 0.5;
    reasons.push('Put IV 高於 Call（偏防守）');
  } else if (ivSkew != null && ivSkew < -0.03) {
    score += 0.3;
    reasons.push('Call IV 相對高（偏進攻）');
  }

  if (flow.unusualFlow.length) {
    const top = flow.unusualFlow[0];
    const tag = `${top.side}$${top.strike} 量${top.vol}`;
    reasons.push(`異動 ${tag}`);
    if (top.side === 'C') score += 0.25;
    else score -= 0.25;
  }

  let outlook = 'neutral';
  let outlookLabel = '中性';
  if (score >= 1.2) {
    outlook = 'bullish';
    outlookLabel = '籌碼偏多';
  } else if (score <= -1.2) {
    outlook = 'bearish';
    outlookLabel = '籌碼偏空';
  } else if (score >= 0.4) {
    outlook = 'lean_bull';
    outlookLabel = '略偏多';
  } else if (score <= -0.4) {
    outlook = 'lean_bear';
    outlookLabel = '略偏空';
  }

  const expDate = new Date(chain.expirationDate * 1000).toISOString().slice(0, 10);

  return {
    available: true,
    spot: spot != null ? Math.round(spot * 100) / 100 : null,
    expiry: expDate,
    dte,
    pcRatioOi: pcOi,
    pcRatioVol: pcVol,
    maxPain,
    maxPainVsSpotPct: maxPainPct,
    ivCallAtm: ivCall != null ? Math.round(ivCall * 1000) / 1000 : null,
    ivPutAtm: ivPut != null ? Math.round(ivPut * 1000) / 1000 : null,
    ivSkew,
    callOi,
    putOi,
    topCalls: topCalls.map((c) => ({ strike: c.strike, oi: c.oi })),
    topPuts: topPuts.map((c) => ({ strike: c.strike, oi: c.oi })),
    unusualFlow: flow.unusualFlow,
    flowVolThreshold: flow.volThreshold,
    flowMinVolOi: flow.minVolOi,
    outlook,
    outlookLabel,
    outlookNote: reasons.join(' · '),
    disclaimer: '僅反映未平倉結構·非價格預測·小盤期權可能失真',
  };
}

export function listUpcomingExpiries(optionChainResult, limit = 6) {
  const now = Date.now() / 1000;
  return (optionChainResult?.options || [])
    .map((ch) => ({
      date: new Date(ch.expirationDate * 1000).toISOString().slice(0, 10),
      dte: Math.max(0, Math.round((ch.expirationDate - now) / 86400)),
      oi: sumOi(cleanContracts(ch.calls)) + sumOi(cleanContracts(ch.puts)),
    }))
    .filter((e) => e.dte >= 0)
    .sort((a, b) => a.dte - b.dte)
    .slice(0, limit);
}
