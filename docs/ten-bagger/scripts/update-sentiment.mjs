#!/usr/bin/env node
/**
 * 從 Reddit 討論區抓取最新帖文 → sentiment.json + 嵌入 index.html
 * 用法：node research/ten-bagger/scripts/update-sentiment.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { translateToZh } from './lib/translate.mjs';
import { REDDIT_QUERY } from './lib/tickers.mjs';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');

const UA = 'ten-bagger-sentiment/1.0 (personal research; read-only)';

const TICKER_QUERY = REDDIT_QUERY;

const SUBREDDITS = ['stocks', 'wallstreetbets', 'investing'];

const BULL_RE =
  /\b(bullish|buy the dip|btfd|calls?|long|moon|undervalued|beat estimates?|upgrade|breakout|rally|gem|loaded|adding)\b/gi;
const BEAR_RE =
  /\b(bearish|sell|puts?|short|overvalued|crash|miss(ed)?|downgrade|bubble|dump|overpriced|top is in|dead cat|bagholder)\b/gi;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function classifyText(text) {
  const bull = (text.match(BULL_RE) || []).length;
  const bear = (text.match(BEAR_RE) || []).length;
  if (bull > bear + 1) return 'bullish';
  if (bear > bull + 1) return 'bearish';
  return 'neutral';
}

function moodLabel(mood) {
  if (mood === 'bullish') return '偏多';
  if (mood === 'bearish') return '偏空';
  return '中性';
}

async function searchSubreddit(subreddit, query) {
  const url = `https://www.reddit.com/r/${subreddit}/search.json?q=${encodeURIComponent(query)}&restrict_sr=1&sort=new&limit=12&t=month`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`r/${subreddit}: HTTP ${res.status}`);
  const data = await res.json();
  return data?.data?.children || [];
}

function postToItem(ticker, child) {
  const d = child.data;
  const text = `${d.title || ''} ${d.selftext || ''}`.slice(0, 4000);
  const created = new Date((d.created_utc || 0) * 1000);
  const snippet = (d.selftext || '').replace(/\s+/g, ' ').trim().slice(0, 140);
  return {
    id: d.id,
    date: created.toISOString().slice(0, 10),
    tickers: [ticker],
    subreddit: d.subreddit,
    title: d.title,
    snippet: snippet || null,
    sentiment: classifyText(text),
    score: d.score ?? 0,
    comments: d.num_comments ?? 0,
    url: d.permalink ? `https://www.reddit.com${d.permalink}` : d.url,
  };
}

const seen = new Set();
const items = [];

for (const [ticker, query] of Object.entries(TICKER_QUERY)) {
  for (const sub of SUBREDDITS) {
    try {
      const children = await searchSubreddit(sub, query);
      for (const c of children) {
        const id = c?.data?.id;
        if (!id || seen.has(id)) continue;
        seen.add(id);
        items.push(postToItem(ticker, c));
      }
    } catch (e) {
      console.warn(ticker, sub, e.message);
    }
    await sleep(900);
  }
  console.log(ticker, 'done');
}

items.sort((a, b) => {
  const da = `${a.date}T00:00:00`;
  const db = `${b.date}T00:00:00`;
  if (db !== da) return db.localeCompare(da);
  return (b.score || 0) - (a.score || 0);
});

const translateTop = Number(process.env.TRANSLATE_TOP || 50);
console.log('Translating top', translateTop, 'posts…');
for (const item of items.slice(0, translateTop)) {
  if (!item.title) continue;
  const t = await translateToZh(item.title);
  item.titleZh = t.zh;
  item.titleEn = t.en;
  item.translated = t.translated;
  if (item.snippet && item.snippet.length > 12) {
    const s = await translateToZh(item.snippet);
    item.snippetZh = s.zh;
    item.snippetEn = s.en;
  }
}
for (const item of items.slice(translateTop)) {
  item.titleEn = item.title;
  item.titleZh = item.title;
  item.translated = false;
}

const tickers = {};
for (const t of Object.keys(TICKER_QUERY)) {
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
  if (net > 0.15) mood = 'bullish';
  else if (net < -0.15) mood = 'bearish';

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

const asOf = new Date().toISOString().slice(0, 10);
const payload = {
  asOf,
  source: 'Reddit',
  subreddits: SUBREDDITS,
  translateMode: process.env.TRANSLATE_MODE || (process.env.OPENAI_API_KEY ? 'openai' : 'mymemory'),
  translateTop,
  note: '關鍵字粗分情緒 · 標題自動翻譯繁中 · 僅供研究',
  tickers,
  items: items.slice(0, 80),
};

const jsonPath = join(root, 'sentiment.json');
writeFileSync(jsonPath, JSON.stringify(payload, null, 2) + '\n');

const htmlPath = join(root, 'index.html');
let html = readFileSync(htmlPath, 'utf8');
const compact = JSON.stringify(payload);
const start = '<!-- SENTIMENT_START -->';
const end = '<!-- SENTIMENT_END -->';
const re = new RegExp(`${start}[\\s\\S]*?${end}`);
if (re.test(html)) {
  html = html.replace(
    re,
    `${start}\n  <script type="application/json" id="sentiment-data">${compact}</script>\n  ${end}`,
  );
} else {
  html = html.replace(
    '<!-- NEWS_END -->',
    `<!-- NEWS_END -->\n\n  ${start}\n  <script type="application/json" id="sentiment-data">${compact}</script>\n  ${end}`,
  );
}
writeFileSync(htmlPath, html);

const mdPath = join(root, 'sentiment.md');
const topByTicker = Object.keys(TICKER_QUERY)
  .map((t) => {
    const posts = items.filter((i) => i.tickers.includes(t)).slice(0, 3);
    if (!posts.length) return '';
    const s = tickers[t];
    return `### ${t} · ${s?.label || '—'}（${s?.posts || 0} 帖）\n${posts
      .map(
        (p) =>
          `- **${p.date}** [r/${p.subreddit}](${p.url}) ↑${p.score} · ${p.sentiment}\n  ${p.title}`,
      )
      .join('\n')}`;
  })
  .filter(Boolean)
  .join('\n\n');

writeFileSync(
  mdPath,
  `# Reddit 討論情緒

> 自動更新：**${asOf}** · 來源：${SUBREDDITS.map((s) => `r/${s}`).join(' · ')} · [sentiment.json](./sentiment.json)

**非投資建議** · 關鍵字粗分偏多/偏空/中性

## 更新

\`\`\`bash
cd research/ten-bagger && node scripts/update-sentiment.mjs
\`\`\`

## 各股摘要

${topByTicker || '_尚無帖文_'}

## 熱門帖（全板）

${items
  .slice(0, 12)
  .map(
    (p) =>
      `- **${(p.tickers || []).join(',')}** ${p.date} [r/${p.subreddit}](${p.url}) ↑${p.score}\n  ${p.title}`,
  )
  .join('\n')}
`,
);

console.log('Wrote', jsonPath, `· ${items.length} posts · embedded index.html ·`, mdPath);
