#!/usr/bin/env node
/**
 * Stocktwits → stocktwits.json · 合併進 sentiment.json
 * STOCKTWITS_ACCESS_TOKEN=xxx node scripts/update-stocktwits.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { translateToZh } from './lib/translate.mjs';
import {
  TICKERS,
  aggregateTickers,
  fetchSymbolStream,
  messageToItem,
  stocktwitsSymbol,
} from './lib/stocktwits.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function moodLabel(mood) {
  if (mood === 'bullish') return '偏多';
  if (mood === 'bearish') return '偏空';
  return '中性';
}

function mergeTickerStats(reddit, stocktwits) {
  const out = {};
  for (const t of TICKERS) {
    const r = reddit?.[t];
    const s = stocktwits?.[t];
    if (!r && !s) continue;
    const posts = (r?.posts || 0) + (s?.posts || 0);
    const bullish = (r?.bullish || 0) + (s?.bullish || 0);
    const bearish = (r?.bearish || 0) + (s?.bearish || 0);
    const neutral = (r?.neutral || 0) + (s?.neutral || 0);
    const net =
      posts > 0
        ? Math.round(
            (((r?.netScore || 0) * (r?.posts || 0) + (s?.netScore || 0) * (s?.posts || 0)) / posts) *
              100,
          ) / 100
        : 0;
    let mood = 'neutral';
    if (net > 0.12) mood = 'bullish';
    else if (net < -0.12) mood = 'bearish';
    out[t] = {
      mood,
      label: moodLabel(mood),
      posts,
      bullish,
      bearish,
      neutral,
      netScore: net,
      reddit: r ? { posts: r.posts, label: r.label, netScore: r.netScore } : null,
      stocktwits: s ? { posts: s.posts, label: s.label, netScore: s.netScore } : null,
    };
  }
  return out;
}

const token = process.env.STOCKTWITS_ACCESS_TOKEN || '';
if (!token) {
  console.warn('未設定 STOCKTWITS_ACCESS_TOKEN · API 可能被擋 · 觀察板可用「載入 ST」');
}

const seen = new Set();
const items = [];
let fetchErrors = 0;

for (const ticker of TICKERS) {
  const sym = stocktwitsSymbol(ticker);
  try {
    const { messages } = await fetchSymbolStream(sym, { accessToken: token });
    for (const msg of messages) {
      if (!msg?.id || seen.has(msg.id)) continue;
      seen.add(msg.id);
      items.push(messageToItem(ticker, msg));
    }
    console.log(ticker, messages.length);
  } catch (e) {
    fetchErrors++;
    console.warn(ticker, e.message);
  }
  await sleep(1100);
}

items.sort((a, b) => b.date.localeCompare(a.date) || (b.score || 0) - (a.score || 0));

const translateTop = Number(process.env.TRANSLATE_TOP || 20);
for (const item of items.slice(0, translateTop)) {
  const t = await translateToZh(item.title);
  item.titleZh = t.zh;
  item.titleEn = t.en;
  item.translated = t.translated;
}
for (const item of items.slice(translateTop)) {
  item.titleEn = item.title;
  item.titleZh = item.title;
}

const asOf = new Date().toISOString().slice(0, 10);
const stTickers = aggregateTickers(items);
writeFileSync(
  join(root, 'stocktwits.json'),
  JSON.stringify(
    {
      asOf,
      source: 'Stocktwits',
      fetchErrors,
      hasToken: Boolean(token),
      tickers: stTickers,
      items: items.slice(0, 60),
    },
    null,
    2,
  ) + '\n',
);

const sentPath = join(root, 'sentiment.json');
let sentiment = { tickers: {}, items: [] };
if (existsSync(sentPath)) sentiment = JSON.parse(readFileSync(sentPath, 'utf8'));

const redditTickers = {};
for (const t of TICKERS) {
  const r = sentiment.tickers?.[t];
  if (r?.reddit) redditTickers[t] = r.reddit;
  else if (r && !r.stocktwits) redditTickers[t] = r;
}

const redditItems = (sentiment.items || []).filter((i) => i.source !== 'stocktwits');
const merged = {
  ...sentiment,
  asOf,
  sources: items.length ? ['Reddit', 'Stocktwits'] : sentiment.sources || ['Reddit'],
  stocktwitsAsOf: items.length ? asOf : sentiment.stocktwitsAsOf,
  tickers: mergeTickerStats(redditTickers, stTickers),
  items: [...redditItems, ...items].sort((a, b) => b.date.localeCompare(a.date) || (b.score || 0) - (a.score || 0)).slice(0, 100),
};

writeFileSync(sentPath, JSON.stringify(merged, null, 2) + '\n');

const htmlPath = join(root, 'index.html');
if (existsSync(htmlPath)) {
  let html = readFileSync(htmlPath, 'utf8');
  const re = /<!-- SENTIMENT_START -->[\s\S]*?<!-- SENTIMENT_END -->/;
  if (re.test(html)) {
    html = html.replace(
      re,
      `<!-- SENTIMENT_START -->\n  <script type="application/json" id="sentiment-data">${JSON.stringify(merged)}</script>\n  <!-- SENTIMENT_END -->`,
    );
    writeFileSync(htmlPath, html);
  }
}

console.log('stocktwits:', items.length, 'msgs · merged sentiment');
process.exit(items.length ? 0 : 1);
