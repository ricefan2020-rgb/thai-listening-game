#!/usr/bin/env node
/**
 * Reddit 股市版熱門關鍵字（hot + top/day + rising）· 標記突然爆火
 * 用法：node scripts/update-reddit-keywords.mjs
 */
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import {
  FINANCE_SUBREDDITS,
  aggregateKeywords,
  detectSurgingKeywords,
  fetchRedditListing,
  childToPost,
  surgeReasonLabel,
} from './lib/reddit-keywords.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const UA = 'ten-bagger-keywords/1.1 (personal research; read-only)';
const LIMIT = Number(process.env.REDDIT_KEYWORD_LIMIT || 40);
const SORTS = ['hot', 'top', 'rising'];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function loadPreviousKeywords() {
  const prevPath = join(root, 'reddit-keywords-prev.json');
  if (existsSync(prevPath)) {
    try {
      return JSON.parse(readFileSync(prevPath, 'utf8')).keywords || [];
    } catch {
      /* fall through */
    }
  }
  const curPath = join(root, 'reddit-keywords.json');
  if (existsSync(curPath)) {
    try {
      return JSON.parse(readFileSync(curPath, 'utf8')).keywords || [];
    } catch {
      /* */
    }
  }
  return [];
}

const seen = new Set();
const posts = [];

for (const { sub, weight } of FINANCE_SUBREDDITS) {
  for (const sort of SORTS) {
    try {
      const children = await fetchRedditListing(sub, sort, LIMIT, UA);
      for (const c of children) {
        const id = c?.data?.id;
        if (!id || seen.has(id)) continue;
        seen.add(id);
        posts.push(childToPost(c, sub, weight, sort));
      }
      console.log(`r/${sub} ${sort}: ${children.length}`);
    } catch (e) {
      console.warn(`r/${sub} ${sort}:`, e.message);
    }
    await sleep(800);
  }
}

const keywords = aggregateKeywords(posts).slice(0, 60);
const risingKeywords = aggregateKeywords(
  posts.filter((p) => p.listingSort === 'rising'),
).slice(0, 40);
const previous = loadPreviousKeywords();
const surging = detectSurgingKeywords({
  current: keywords,
  previous,
  rising: risingKeywords,
});

const asOf = new Date().toISOString().slice(0, 10);
let baselineAsOf = asOf;
const prevMetaPath = join(root, 'reddit-keywords-prev.json');
if (existsSync(prevMetaPath)) {
  try {
    baselineAsOf = JSON.parse(readFileSync(prevMetaPath, 'utf8')).asOf || asOf;
  } catch {
    /* */
  }
}

const payload = {
  asOf,
  source: 'Reddit',
  sorts: ['hot', 'top/day', 'rising'],
  subreddits: FINANCE_SUBREDDITS.map((s) => s.sub),
  postsScanned: posts.length,
  baselineAsOf,
  note: '標題加權熱詞 · 與上一輪比對標「突然爆火」 · 非投資建議',
  surging,
  keywords,
  topPosts: [...posts]
    .sort((a, b) => b.score + b.comments * 2 - (a.score + a.comments * 2))
    .slice(0, 8)
    .map((p) => ({
      title: p.title,
      subreddit: p.subreddit,
      score: p.score,
      comments: p.comments,
      url: p.url,
      date: p.created,
      sort: p.listingSort,
    })),
};

const jsonPath = join(root, 'reddit-keywords.json');
writeFileSync(jsonPath, JSON.stringify(payload, null, 2) + '\n');
writeFileSync(
  join(root, 'reddit-keywords-prev.json'),
  JSON.stringify({ asOf, keywords }, null, 2) + '\n',
);

const htmlPath = join(root, 'index.html');
let html = readFileSync(htmlPath, 'utf8');
const compact = JSON.stringify(payload);
const start = '<!-- REDDIT_KW_START -->';
const end = '<!-- REDDIT_KW_END -->';
const re = new RegExp(`${start}[\\s\\S]*?${end}`);
if (re.test(html)) {
  html = html.replace(
    re,
    `${start}\n  <script type="application/json" id="reddit-keywords-data">${compact}</script>\n  ${end}`,
  );
} else {
  html = html.replace(
    '<!-- SENTIMENT_END -->',
    `<!-- SENTIMENT_END -->\n\n  ${start}\n  <script type="application/json" id="reddit-keywords-data">${compact}</script>\n  ${end}`,
  );
}
writeFileSync(htmlPath, html);

const byType = (t) => keywords.filter((k) => k.type === t).slice(0, 15);
const mdPath = join(root, 'reddit-keywords.md');
writeFileSync(
  mdPath,
  `# Reddit 股市熱詞

> 更新：**${asOf}** · 掃描 **${posts.length}** 則（${payload.subreddits.map((s) => `r/${s}`).join(' · ')} · hot + top/day + rising） · 對照 **${baselineAsOf}**

\`\`\`bash
cd research/ten-bagger && node scripts/update-reddit-keywords.mjs
\`\`\`

## 突然爆火（相對上一輪 / rising）

${
  surging.length
    ? surging
        .map(
          (k) =>
            `- **${k.term}** (${k.type}) · ${surgeReasonLabel(k.surgeReason)} · 現 ${k.score}（前 ${k.prevScore}）· ${k.posts} 帖`,
        )
        .join('\n')
    : '_本輪無明顯爆火詞（請隔幾小時再跑以累積對照）_'
}

## 代號（$TICKER / 大寫）

${byType('ticker')
  .map((k) => `- **${k.term}** · 分 ${k.score} · ${k.posts} 帖 · ${k.subs.map((s) => `r/${s}`).join(', ')}`)
  .join('\n') || '_無_'}

## 片語

${byType('phrase')
  .map((k) => `- **${k.term}** · 分 ${k.score} · ${k.posts} 帖`)
  .join('\n') || '_無_'}

## 主題詞

${byType('theme')
  .map((k) => `- ${k.term} · ${k.score} · ${k.posts} 帖`)
  .join('\n') || '_無_'}

## 高分帖（標題）

${payload.topPosts
  .map((p) => `- [r/${p.subreddit}](${p.url}) ↑${p.score} · \`${p.sort}\` · ${p.title}`)
  .join('\n')}
`,
);

console.log(
  'Wrote',
  jsonPath,
  `· ${keywords.length} terms · ${surging.length} surging ·`,
  mdPath,
);
