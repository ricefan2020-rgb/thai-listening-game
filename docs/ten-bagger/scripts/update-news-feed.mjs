#!/usr/bin/env node
/**
 * 外部 RSS → 翻譯（繁中）→ 綜合報導 → news-feed.json + news-digest.json + 嵌入 index.html
 *
 * 用法：
 *   node scripts/update-news-feed.mjs
 *   TRANSLATE_MODE=off node scripts/update-news-feed.mjs        # 不翻譯
 *   OPENAI_API_KEY=sk-... node scripts/update-news-feed.mjs   # OpenAI 翻譯
 *
 * 環境變數：
 *   TRANSLATE_MODE=auto|mymemory|openai|off
 *   OPENAI_API_KEY · OPENAI_MODEL（可選 gpt-4o-mini）
 *   MAX_PER_TICKER=6 · TRANSLATE_DELAY_MS=350
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { parseRss, splitGoogleTitle, pubDateToIso } from './lib/rss-parse.mjs';
import { translateToZh } from './lib/translate.mjs';
import {
  classifySentiment,
  synthesizeTickerBrief,
  synthesizeMarketBrief,
} from './lib/news-synthesize.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const UA = 'ten-bagger-news-feed/1.0 (personal research)';
const MAX_PER_TICKER = Number(process.env.MAX_PER_TICKER || 6);
const MACRO_MAX = Number(process.env.MACRO_MAX || 4);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchRss(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ' + UA + ')' },
    redirect: 'follow',
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

function loadJson(path, fallback) {
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, 'utf8'));
}

const sources = loadJson(join(root, 'news-sources.json'), { tickers: {}, feeds: [] });
const curated = loadJson(join(root, 'news.json'), { items: [], asOf: '' });
const feedTpl = sources.feeds?.[0]?.template;

const seen = new Set();
const feedItems = [];

async function ingestTicker(ticker, query) {
  if (!feedTpl) return;
  const url = feedTpl.replace('{query}', encodeURIComponent(query));
  let xml;
  try {
    xml = await fetchRss(url);
  } catch (e) {
    console.warn(ticker, e.message);
    return;
  }

  const parsed = parseRss(xml).slice(0, MAX_PER_TICKER);
  for (const row of parsed) {
    const { headline, publisher } = splitGoogleTitle(row.title);
    const key = `${ticker}|${headline.toLowerCase().slice(0, 80)}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const { zh, en, translated } = await translateToZh(headline);
    const detailRaw = row.description?.slice(0, 200) || '';
    let detailZh = '';
    if (detailRaw && detailRaw.length > 20) {
      const d = await translateToZh(detailRaw);
      detailZh = d.zh;
    }

    feedItems.push({
      id: key.replace(/[^a-z0-9|]/gi, '_').slice(0, 64),
      date: pubDateToIso(row.pubDate),
      tickers: [ticker],
      source: publisher || 'Google News',
      sourceType: 'external',
      url: row.link,
      headline: zh,
      headlineEn: en,
      detail: detailZh || publisher || '',
      translated,
      sentiment: classifySentiment(`${en} ${detailRaw}`),
      impact: 'medium',
    });
  }
  console.log(ticker, parsed.length, 'items');
  await sleep(400);
}

for (const [ticker, cfg] of Object.entries(sources.tickers || {})) {
  await ingestTicker(ticker, cfg.query);
}

for (const macro of sources.macroFeeds || []) {
  const url = feedTpl.replace('{query}', encodeURIComponent(macro.query));
  try {
    const xml = await fetchRss(url);
    const parsed = parseRss(xml).slice(0, MACRO_MAX);
    for (const row of parsed) {
      const { headline, publisher } = splitGoogleTitle(row.title);
      const key = `MACRO|${headline.toLowerCase().slice(0, 80)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const { zh, en, translated } = await translateToZh(headline);
      feedItems.push({
        id: key.replace(/[^a-z0-9|]/gi, '_').slice(0, 64),
        date: pubDateToIso(row.pubDate),
        tickers: ['MACRO'],
        source: publisher || macro.name,
        sourceType: 'external',
        url: row.link,
        headline: zh,
        headlineEn: en,
        detail: macro.name,
        translated,
        sentiment: classifySentiment(en),
        impact: 'medium',
      });
    }
    console.log('macro', macro.name, parsed.length);
  } catch (e) {
    console.warn('macro', e.message);
  }
  await sleep(400);
}

feedItems.sort((a, b) => b.date.localeCompare(a.date));

const tickerBriefs = {};
for (const t of Object.keys(sources.tickers || {})) {
  const subset = feedItems.filter((i) => (i.tickers || []).includes(t));
  tickerBriefs[t] = synthesizeTickerBrief(t, subset);
}

const digest = {
  asOf: new Date().toISOString().slice(0, 10),
  translateMode: process.env.TRANSLATE_MODE || (process.env.OPENAI_API_KEY ? 'openai' : 'mymemory'),
  sources: ['Google News RSS'],
  note: '外部自動抓取+翻譯 · 綜合報導為規則摘要 · 非投資建議',
  marketBrief: synthesizeMarketBrief(tickerBriefs, feedItems.length),
  tickers: tickerBriefs,
  feed: feedItems,
  curatedCount: curated.items?.length || 0,
};

const mergedItems = [
  ...(curated.items || []).map((i) => ({
    ...i,
    sourceType: 'curated',
    source: i.source || '研究筆記',
    headlineEn: i.headlineEn || null,
    translated: false,
  })),
  ...feedItems,
].sort((a, b) => b.date.localeCompare(a.date));

const feedPath = join(root, 'news-feed.json');
writeFileSync(
  feedPath,
  JSON.stringify(
    {
      asOf: digest.asOf,
      items: feedItems,
    },
    null,
    2,
  ) + '\n',
);

const digestPath = join(root, 'news-digest.json');
writeFileSync(digestPath, JSON.stringify(digest, null, 2) + '\n');

const mdPath = join(root, 'news-digest.md');
const briefLines = Object.entries(tickerBriefs)
  .filter(([, b]) => b.count > 0)
  .map(([t, b]) => `### ${t}\n\n${b.brief}\n`)
  .join('\n');

writeFileSync(
  mdPath,
  `# 綜合報導 · 外部新聞

> 更新：**${digest.asOf}** · 翻譯：${digest.translateMode} · [news-digest.json](./news-digest.json)

**非投資建議**

## 市場綜述

${digest.marketBrief}

## 各股摘要

${briefLines || '_尚無外部條目_'}

## 更新

\`\`\`bash
cd research/ten-bagger && node scripts/update-news-feed.mjs
\`\`\`

精選新聞仍見 [news.md](./news.md) · [news.json](./news.json)
`,
);

const htmlPath = join(root, 'index.html');
let html = readFileSync(htmlPath, 'utf8');
const compact = JSON.stringify(digest);
const start = '<!-- NEWS_DIGEST_START -->';
const end = '<!-- NEWS_DIGEST_END -->';
const re = new RegExp(`${start}[\\s\\S]*?${end}`);
const block = `${start}\n  <script type="application/json" id="news-digest-data">${compact}</script>\n  ${end}`;
if (re.test(html)) {
  html = html.replace(re, block);
} else {
  html = html.replace(
    '<!-- NEWS_END -->',
    `<!-- NEWS_END -->\n\n  ${block}`,
  );
}
writeFileSync(htmlPath, html);

console.log(
  'Wrote',
  feedPath,
  digestPath,
  `· feed ${feedItems.length}`,
  `· merged ${mergedItems.length}`,
);
