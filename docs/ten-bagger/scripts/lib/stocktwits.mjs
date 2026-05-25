/**
 * Stocktwits API v2 · streams/symbol/{symbol}.json
 */
import { WATCH_TICKERS, YAHOO_SYMBOL } from './tickers.mjs';

const API = 'https://api.stocktwits.com/api/2';

export const TICKERS = WATCH_TICKERS;

export const SYMBOL_MAP = YAHOO_SYMBOL;

export function stocktwitsSymbol(ticker) {
  return SYMBOL_MAP[ticker] || ticker;
}

function moodLabel(mood) {
  if (mood === 'bullish') return '偏多';
  if (mood === 'bearish') return '偏空';
  return '中性';
}

export function sentimentFromMessage(msg) {
  const basic = msg?.entities?.sentiment?.basic;
  if (basic === 'Bullish') return 'bullish';
  if (basic === 'Bearish') return 'bearish';
  return 'neutral';
}

export function messageToItem(ticker, msg) {
  const created = msg.created_at ? new Date(msg.created_at) : new Date();
  const body = (msg.body || '').replace(/\s+/g, ' ').trim();
  const sym = stocktwitsSymbol(ticker);
  const url =
    msg?.links?.[0]?.url ||
    (msg.id ? `https://stocktwits.com/symbol/${sym}/message/${msg.id}` : `https://stocktwits.com/symbol/${sym}`);

  return {
    id: `st-${msg.id}`,
    date: created.toISOString().slice(0, 10),
    tickers: [ticker],
    source: 'stocktwits',
    channel: 'stocktwits',
    title: body.slice(0, 280) || '(無文字)',
    snippet: body.length > 280 ? `${body.slice(280, 420)}…` : null,
    sentiment: sentimentFromMessage(msg),
    score: msg?.likes?.total ?? 0,
    comments: msg?.conversation?.replies ?? 0,
    url,
    stSentiment: msg?.entities?.sentiment?.basic || null,
  };
}

export async function fetchSymbolStream(symbol, opts = {}) {
  const token = opts.accessToken || process.env.STOCKTWITS_ACCESS_TOKEN || '';
  const limit = Math.min(opts.limit ?? 30, 30);
  const params = new URLSearchParams({ limit: String(limit) });
  if (token) params.set('access_token', token);

  const url = `${API}/streams/symbol/${encodeURIComponent(symbol)}.json?${params}`;
  const headers = {
    Accept: 'application/json',
    'User-Agent': 'ten-bagger-stocktwits/1.0 (personal research)',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { headers });
  const text = await res.text();
  if (!res.ok) {
    const hint = text.includes('Just a moment')
      ? 'Cloudflare 阻擋 · 請設定 STOCKTWITS_ACCESS_TOKEN'
      : text.slice(0, 120);
    throw new Error(`${symbol}: HTTP ${res.status} · ${hint}`);
  }

  const data = JSON.parse(text);
  return { symbol: data?.symbol?.symbol || symbol, messages: data?.messages || [] };
}

export function aggregateTickers(items) {
  const tickers = {};
  for (const t of TICKERS) {
    const subset = items.filter((i) => i.tickers.includes(t));
    let bullW = 0;
    let bearW = 0;
    let neuW = 0;
    for (const p of subset) {
      const w = Math.log10((p.score || 0) + (p.comments || 0) + 2);
      if (p.sentiment === 'bullish') bullW += w;
      else if (p.sentiment === 'bearish') bearW += w;
      else neuW += w;
    }
    const total = bullW + bearW + neuW || 1;
    const net = (bullW - bearW) / total;
    let mood = 'neutral';
    if (net > 0.12) mood = 'bullish';
    else if (net < -0.12) mood = 'bearish';
    tickers[t] = {
      mood,
      label: moodLabel(mood),
      posts: subset.length,
      bullish: subset.filter((p) => p.sentiment === 'bullish').length,
      bearish: subset.filter((p) => p.sentiment === 'bearish').length,
      neutral: subset.filter((p) => p.sentiment === 'neutral').length,
      netScore: Math.round(net * 100) / 100,
    };
  }
  return tickers;
}
