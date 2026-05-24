#!/usr/bin/env node
/**
 * 為既有 sentiment.json 補繁中翻譯（不重新抓 Reddit）
 * 用法：node scripts/translate-sentiment.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { translateToZh } from './lib/translate.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const path = join(root, 'sentiment.json');
const data = JSON.parse(readFileSync(path, 'utf8'));
const top = Number(process.env.TRANSLATE_TOP || 60);

const items = data.items || [];
let n = 0;
for (const item of items.slice(0, top)) {
  if (!item.title) continue;
  const t = await translateToZh(item.title);
  item.titleZh = t.zh;
  item.titleEn = t.en;
  item.translated = t.translated;
  if (item.snippet && item.snippet.length > 15) {
    const s = await translateToZh(item.snippet);
    item.snippetZh = s.zh;
    item.snippetEn = s.en;
  }
  n++;
  if (n % 10 === 0) console.log('translated', n);
}

data.translateAsOf = new Date().toISOString().slice(0, 10);
data.translateMode = process.env.TRANSLATE_MODE || (process.env.OPENAI_API_KEY ? 'openai' : 'mymemory');
writeFileSync(path, JSON.stringify(data, null, 2) + '\n');

const htmlPath = join(root, 'index.html');
let html = readFileSync(htmlPath, 'utf8');
const compact = JSON.stringify(data);
const re = /<!-- SENTIMENT_START -->[\s\S]*?<!-- SENTIMENT_END -->/;
html = html.replace(
  re,
  `<!-- SENTIMENT_START -->\n  <script type="application/json" id="sentiment-data">${compact}</script>\n  <!-- SENTIMENT_END -->`,
);
writeFileSync(htmlPath, html);
console.log('Translated', n, 'posts · embedded index.html');
