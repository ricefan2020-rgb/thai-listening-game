#!/usr/bin/env node
/**
 * 更新 prices.json 並同步 index.html 內嵌報價
 * 用法：node research/ten-bagger/scripts/update-prices.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');

const MAP = [
  ['NVDA', 'NVDA'],
  ['AMD', 'AMD'],
  ['ARM', 'ARM'],
  ['ANET', 'ANET'],
  ['VRT', 'VRT'],
  ['SMCI', 'SMCI'],
  ['PLTR', 'PLTR'],
  ['SNOW', 'SNOW'],
  ['SIVE', 'SIVEF'],
  ['GOOGL', 'GOOGL'],
  ['IREN', 'IREN'],
  ['CRCL', 'CRCL'],
];

async function quote(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d`;
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  if (!res.ok) throw new Error(`${symbol}: HTTP ${res.status}`);
  const data = await res.json();
  const r = data.chart.result[0];
  const closes = r.indicators.quote[0].close.filter((c) => c != null);
  const last = closes.at(-1) ?? r.meta.regularMarketPrice;
  const prev = closes.at(-2) ?? r.meta.previousClose;
  const chgPct = prev ? ((last / prev - 1) * 100) : 0;
  const d = new Date((r.meta.regularMarketTime ?? Date.now() / 1000) * 1000);
  return {
    price: Math.round(last * 100) / 100,
    chgPct: Math.round(chgPct * 100) / 100,
    currency: r.meta.currency || 'USD',
    date: d.toISOString().slice(0, 10),
  };
}

const quotes = {};
let asOf = '';

for (const [key, sym] of MAP) {
  const q = await quote(sym);
  quotes[key] = { price: q.price, chgPct: q.chgPct, currency: q.currency };
  if (!asOf || q.date > asOf) asOf = q.date;
}

const siveSt = await quote('SIVE.ST');
quotes.SIVE.also = {
  price: siveSt.price,
  chgPct: siveSt.chgPct,
  currency: siveSt.currency,
};

const payload = {
  asOf,
  source: 'Yahoo Finance',
  note: 'SIVE 列 SIVEF (OTC USD)；瑞典掛牌見 SIVE.ST',
  quotes,
};

const json = JSON.stringify(payload, null, 2) + '\n';
writeFileSync(join(root, 'prices.json'), json);

const htmlPath = join(root, 'index.html');
let html = readFileSync(htmlPath, 'utf8');
const compact = JSON.stringify(payload);
const start = '<!-- PRICES_START -->';
const end = '<!-- PRICES_END -->';
const re = new RegExp(`${start}[\\s\\S]*?${end}`);
if (!re.test(html)) {
  console.warn('PRICES markers not found in index.html');
} else {
  html = html.replace(
    re,
    `${start}\n  <script type="application/json" id="prices-data">${compact}</script>\n  ${end}`,
  );
  writeFileSync(htmlPath, html);
}

try {
  const metrics = readFileSync(join(root, 'metrics.json'), 'utf8').trim();
  const mStart = '<!-- METRICS_START -->';
  const mEnd = '<!-- METRICS_END -->';
  const mRe = new RegExp(`${mStart}[\\s\\S]*?${mEnd}`);
  if (mRe.test(html)) {
    html = html.replace(
      mRe,
      `${mStart}\n  <script type="application/json" id="metrics-data">${metrics}</script>\n  ${mEnd}`,
    );
    writeFileSync(htmlPath, html);
  }
} catch {
  /* metrics.json optional */
}

console.log('Updated prices.json + index.html embed, asOf', asOf);
console.log('Tip: run node scripts/update-ohlc.mjs for K-line history');
console.log('Tip: run node scripts/update-sentiment.mjs for Reddit mood');
