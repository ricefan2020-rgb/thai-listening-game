#!/usr/bin/env node
/**
 * Reddit 股市版熱門關鍵字（hot + top/day）
 * 用法：node scripts/update-reddit-keywords.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import {
  FINANCE_SUBREDDITS,
  aggregateKeywords,
  fetchRedditListing,
  childToPost,
} from './lib/reddit-keywords.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const UA = 'ten-bagger-keywords/1.0 (personal research; read-only)';
const LIMIT = Number(process.env.REDDIT_KEYWORD_LIMIT || 40);

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

const seen = new Set();
const posts = [];

for (const { sub, weight } of FINANCE_SUBREDDITS) {
  for (const sort of ['hot', 'top']) {
    try {
      const children = await fetchRedditListing(sub, sort, LIMIT, UA);
      for (const c of children) {
        const id = c?.data?.id;
        if (!id || seen.has(id)) continue;
        seen.add(id);
        posts.push(childToPost(c, sub, weight));
      }
      console.log(`r/${sub} ${sort}: ${children.length}`);
    } catch (e) {
      console.warn(`r/${sub} ${sort}:`, e.message);
    }
    await sleep(800);
  }
}

const keywords = aggregateKeywords(posts).slice(0, 60);
const asOf = new Date().toISOString().slice(0, 10);

const payload = {
  asOf,
  source: 'Reddit',
  sorts: ['hot', 'top/day'],
  subreddits: FINANCE_SUBREDDITS.map((s) => s.sub),
  postsScanned: posts.length,
  note: '標題加權熱詞 · $代號與常見片語 · 非投資建議',
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
    })),
};

const jsonPath = join(root, 'reddit-keywords.json');
writeFileSync(jsonPath, JSON.stringify(payload, null, 2) + '\n');

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

> 更新：**${asOf}** · 掃描 **${posts.length}** 則（${payload.subreddits.map((s) => `r/${s}`).join(' · ')} · hot + top/day）

\`\`\`bash
cd research/ten-bagger && node scripts/update-reddit-keywords.mjs
\`\`\`

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
  .map((p) => `- [r/${p.subreddit}](${p.url}) ↑${p.score} · ${p.title}`)
  .join('\n')}
`,
);

console.log('Wrote', jsonPath, `· ${keywords.length} terms ·`, mdPath);
