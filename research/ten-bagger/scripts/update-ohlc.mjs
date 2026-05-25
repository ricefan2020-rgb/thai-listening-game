#!/usr/bin/env node
/**
 * 下載日 K 線 → ohlc.json，並嵌入 index.html（解決瀏覽器 CORS）
 * 用法：node research/ten-bagger/scripts/update-ohlc.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { WATCH_TICKERS, yahooSymbol } from './lib/tickers.mjs';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');

const MAP = WATCH_TICKERS.map((t) => [t, yahooSymbol(t)]);

async function fetchCandles(symbol, range = '1y') {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=${range}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok) throw new Error(`${symbol}: HTTP ${res.status}`);
  const data = await res.json();
  const r = data.chart?.result?.[0];
  if (!r) throw new Error(`${symbol}: 無數據`);
  const q = r.indicators.quote[0];
  const ts = r.timestamp || [];
  const out = [];
  for (let i = 0; i < ts.length; i++) {
    const o = q.open[i];
    const h = q.high[i];
    const l = q.low[i];
    const c = q.close[i];
    const v = q.volume?.[i];
    if (o == null || h == null || l == null || c == null) continue;
    const bar = {
      t: ts[i],
      o: Math.round(o * 100) / 100,
      h: Math.round(h * 100) / 100,
      l: Math.round(l * 100) / 100,
      c: Math.round(c * 100) / 100,
    };
    if (v != null && v > 0) bar.v = Math.round(v);
    out.push(bar);
  }
  return out;
}

const tickers = {};
let asOf = '';

for (const [key, sym] of MAP) {
  const bars = await fetchCandles(sym, '1y');
  tickers[key] = bars;
  if (bars.length) {
    const d = new Date(bars.at(-1).t * 1000).toISOString().slice(0, 10);
    if (!asOf || d > asOf) asOf = d;
  }
  console.log(key, bars.length, 'bars');
}

const payload = {
  asOf,
  range: '1y',
  source: 'Yahoo Finance',
  note: 't=unix秒; ohlc+v 壓縮欄位（v=成交量）',
  tickers,
};

const jsonPath = join(root, 'ohlc.json');
writeFileSync(jsonPath, JSON.stringify(payload) + '\n');

const htmlPath = join(root, 'index.html');
let html = readFileSync(htmlPath, 'utf8');
const compact = JSON.stringify(payload);
const start = '<!-- OHLC_START -->';
const end = '<!-- OHLC_END -->';
const re = new RegExp(`${start}[\\s\\S]*?${end}`);
if (re.test(html)) {
  html = html.replace(
    re,
    `${start}\n  <script type="application/json" id="ohlc-data">${compact}</script>\n  ${end}`,
  );
} else {
  html = html.replace(
    '<!-- METRICS_END -->',
    `<!-- METRICS_END -->\n\n  ${start}\n  <script type="application/json" id="ohlc-data">${compact}</script>\n  ${end}`,
  );
}
writeFileSync(htmlPath, html);
console.log('Wrote', jsonPath, 'and embedded index.html, asOf', asOf);
