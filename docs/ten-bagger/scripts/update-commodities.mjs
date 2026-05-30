#!/usr/bin/env node
/**
 * 金 / 銀 / 比特幣 牌價 → 寫入 forex.json 的 commodities 欄位
 * 金銀：Yahoo Finance COMEX GC=F、SI=F（延遲報價）
 * BTC：Binance BTCUSDT 現貨
 * 用法：node research/ten-bagger/scripts/update-commodities.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const UA = 'ten-bagger-commodities/1.0 (personal research)';

function fmtUsd(n, suffix = '') {
  if (n == null || Number.isNaN(n)) return '—';
  const s = n >= 1000 ? n.toLocaleString('en-US', { maximumFractionDigits: 0 }) : String(n);
  return `$${s}${suffix}`;
}

async function yahooLastPrice(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`Yahoo ${symbol}: ${res.status}`);
  const j = await res.json();
  const r = j.chart?.result?.[0];
  if (!r) throw new Error(`Yahoo ${symbol}: no result`);
  const p = r.meta?.regularMarketPrice;
  if (typeof p !== 'number' || Number.isNaN(p)) throw new Error(`Yahoo ${symbol}: no price`);
  return { price: p, shortName: r.meta?.shortName || symbol, exchange: r.meta?.exchangeName };
}

async function binanceBtc() {
  const res = await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT', {
    headers: { 'User-Agent': UA },
  });
  if (!res.ok) throw new Error(`Binance: ${res.status}`);
  const j = await res.json();
  const p = parseFloat(j.price);
  if (Number.isNaN(p)) throw new Error('Binance: bad price');
  return p;
}

const forexPath = join(root, 'forex.json');
const forex = JSON.parse(readFileSync(forexPath, 'utf8'));

const commodities = {
  delayNote: '金銀為 COMEX 期貨延遲牌價（Yahoo）；BTC 為 Binance 現貨',
  fetchedAt: new Date().toISOString(),
};

async function safe(name, fn) {
  try {
    return await fn();
  } catch (e) {
    console.warn(name, e.message);
    return null;
  }
}

const gold = await safe('gold', () => yahooLastPrice('GC=F'));
if (gold) {
  commodities.gold = {
    nameZh: '金',
    symbol: 'GC=F',
    unit: 'USD/oz',
    price: gold.price,
    priceFmt: fmtUsd(gold.price, '/oz'),
    source: `Yahoo · ${gold.shortName}`,
  };
}

const silver = await safe('silver', () => yahooLastPrice('SI=F'));
if (silver) {
  commodities.silver = {
    nameZh: '銀',
    symbol: 'SI=F',
    unit: 'USD/oz',
    price: silver.price,
    priceFmt: `$${silver.price.toFixed(2)}/oz`,
    source: `Yahoo · ${silver.shortName}`,
  };
}

const btcPx = await safe('btc', binanceBtc);
if (btcPx != null) {
  commodities.btc = {
    nameZh: '比特幣',
    symbol: 'BTCUSDT',
    unit: 'USD',
    price: btcPx,
    priceFmt: fmtUsd(btcPx),
    source: 'Binance',
  };
}

forex.commodities = commodities;
writeFileSync(forexPath, JSON.stringify(forex, null, 2) + '\n');
console.log('Updated forex.json commodities', commodities.fetchedAt);
