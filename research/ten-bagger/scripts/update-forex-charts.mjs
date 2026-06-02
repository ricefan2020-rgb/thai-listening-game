#!/usr/bin/env node
/**
 * 金銀 BTC + 四幣代理 + DXY 日線 → forex-charts.json
 * 同步更新 forex.json commodities 現價
 * 用法：node research/ten-bagger/scripts/update-forex-charts.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const UA = 'ten-bagger-forex-charts/1.0 (personal research)';
const RANGE = process.env.FOREX_CHART_RANGE || '6mo';

const SERIES = [
  { key: 'gold', nameZh: '金', symbol: 'GC=F', unit: 'USD/oz', kind: 'commodity' },
  { key: 'silver', nameZh: '銀', symbol: 'SI=F', unit: 'USD/oz', kind: 'commodity' },
  { key: 'btc', nameZh: '比特幣', symbol: 'BTC-USD', unit: 'USD', kind: 'commodity' },
  { key: 'dxy', nameZh: '美元指數', symbol: 'DX-Y.NYB', unit: 'index', kind: 'fx' },
  { key: 'usdjpy', nameZh: 'USD/JPY', symbol: 'JPY=X', unit: 'JPY', kind: 'fx' },
  { key: 'usdcny', nameZh: 'USD/CNY', symbol: 'CNY=X', unit: 'CNY', kind: 'fx' },
  { key: 'usdhkd', nameZh: 'USD/HKD', symbol: 'HKD=X', unit: 'HKD', kind: 'fx' },
];

function fmtUsd(n, suffix = '') {
  if (n == null || Number.isNaN(n)) return '—';
  if (n >= 1000) return `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}${suffix}`;
  return `$${n.toFixed(2)}${suffix}`;
}

async function fetchCloses(symbol, range = RANGE) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=${range}`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${symbol}: HTTP ${res.status}`);
  const data = await res.json();
  const r = data.chart?.result?.[0];
  if (!r) throw new Error(`${symbol}: no result`);
  const q = r.indicators?.quote?.[0];
  const ts = r.timestamp || [];
  const points = [];
  for (let i = 0; i < ts.length; i++) {
    const c = q?.close?.[i];
    if (c == null || Number.isNaN(c)) continue;
    points.push({ t: ts[i], c: Math.round(c * 10000) / 10000 });
  }
  const spot = r.meta?.regularMarketPrice ?? points.at(-1)?.c;
  return {
    points,
    spot,
    shortName: r.meta?.shortName || symbol,
    currency: r.meta?.currency,
  };
}

function pctChange(points) {
  if (!points?.length || points.length < 2) return null;
  const a = points[0].c;
  const b = points.at(-1).c;
  if (!a) return null;
  return Math.round(((b - a) / a) * 1000) / 10;
}

const outSeries = {};
let asOf = '';
const fetchedAt = new Date().toISOString();

for (const s of SERIES) {
  try {
    const { points, spot, shortName } = await fetchCloses(s.symbol);
    if (!points.length) {
      console.warn('skip', s.key, 'empty');
      continue;
    }
    const lastDate = new Date(points.at(-1).t * 1000).toISOString().slice(0, 10);
    if (lastDate > asOf) asOf = lastDate;
    outSeries[s.key] = {
      nameZh: s.nameZh,
      symbol: s.symbol,
      unit: s.unit,
      kind: s.kind,
      spot,
      changePct: pctChange(points),
      source: `Yahoo · ${shortName}`,
      points,
    };
    console.log(s.key, points.length, 'bars', spot);
  } catch (e) {
    console.warn(s.key, e.message);
  }
}

const payload = {
  asOf,
  fetchedAt,
  range: RANGE,
  source: 'Yahoo Finance',
  note: '日收盤 · 非即時 · 僅供研究',
  series: outSeries,
};

writeFileSync(join(root, 'forex-charts.json'), JSON.stringify(payload, null, 2) + '\n');
console.log('Wrote forex-charts.json', asOf);

// sync commodities into forex.json
const forexPath = join(root, 'forex.json');
const forex = JSON.parse(readFileSync(forexPath, 'utf8'));
const g = outSeries.gold;
const sv = outSeries.silver;
const b = outSeries.btc;
forex.commodities = {
  delayNote: '金銀 COMEX 期貨延遲（Yahoo）；BTC 為 Yahoo BTC-USD',
  fetchedAt,
  ...(g && {
    gold: {
      nameZh: '金',
      symbol: g.symbol,
      unit: g.unit,
      price: g.spot,
      priceFmt: fmtUsd(g.spot, '/oz'),
      changePct: g.changePct,
      source: g.source,
    },
  }),
  ...(sv && {
    silver: {
      nameZh: '銀',
      symbol: sv.symbol,
      unit: sv.unit,
      price: sv.spot,
      priceFmt: `$${sv.spot.toFixed(2)}/oz`,
      changePct: sv.changePct,
      source: sv.source,
    },
  }),
  ...(b && {
    btc: {
      nameZh: '比特幣',
      symbol: b.symbol,
      unit: b.unit,
      price: b.spot,
      priceFmt: fmtUsd(b.spot),
      changePct: b.changePct,
      source: b.source,
    },
  }),
};
writeFileSync(forexPath, JSON.stringify(forex, null, 2) + '\n');
console.log('Updated forex.json commodities');
