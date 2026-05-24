#!/usr/bin/env node
/**
 * 打包靜態站 → docs/ten-bagger（GitHub Pages）
 * 用法：node scripts/prepare-pages.mjs
 * 環境：PAGES_BASE=/thai-listening-game/ten-bagger/ （預設）
 */
import { cpSync, mkdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = join(root, '../..');
const outDir = join(repoRoot, 'docs/ten-bagger');
const base = process.env.PAGES_BASE || '/thai-listening-game/ten-bagger/';

console.log('Embedding latest data into index.html…');
execSync('node scripts/embed-data.mjs', { cwd: root, stdio: 'inherit' });

const jsonFiles = [
  'prices.json',
  'ohlc.json',
  'news.json',
  'news-feed.json',
  'news-digest.json',
  'sentiment.json',
  'calendar.json',
  'metrics.json',
  'stablecoins.json',
  'yields.json',
];

const staticFiles = [
  'index.html',
  'phone.html',
  'manifest.webmanifest',
  'icon-192.svg',
  'icon-512.svg',
];

mkdirSync(outDir, { recursive: true });
mkdirSync(join(outDir, 'scripts'), { recursive: true });
mkdirSync(join(outDir, 'scripts/lib'), { recursive: true });
mkdirSync(join(outDir, 'companies'), { recursive: true });

for (const f of staticFiles) {
  cpSync(join(root, f), join(outDir, f));
}

for (const f of jsonFiles) {
  const p = join(root, f);
  if (existsSync(p)) cpSync(p, join(outDir, f));
}

cpSync(join(root, 'scripts'), join(outDir, 'scripts'), { recursive: true });
if (existsSync(join(root, 'companies'))) {
  cpSync(join(root, 'companies'), join(outDir, 'companies'), { recursive: true });
}

writeFileSync(join(outDir, '.nojekyll'), '');

let html = readFileSync(join(outDir, 'index.html'), 'utf8');
const baseTag = `<base href="${base}" />`;
if (!html.includes('<base href')) {
  html = html.replace('<head>', `<head>\n  ${baseTag}`);
}
html = html.replace(
  /<link rel="manifest" href="\.\/manifest/,
  '<link rel="manifest" href="manifest',
);
writeFileSync(join(outDir, 'index.html'), html);

let phone = readFileSync(join(outDir, 'phone.html'), 'utf8');
if (!phone.includes('<base href')) {
  phone = phone.replace('<head>', `<head>\n  ${baseTag}`);
}
writeFileSync(join(outDir, 'phone.html'), phone);

const manifest = JSON.parse(readFileSync(join(outDir, 'manifest.webmanifest'), 'utf8'));
manifest.start_url = `${base}index.html`;
manifest.scope = base;
writeFileSync(join(outDir, 'manifest.webmanifest'), JSON.stringify(manifest, null, 2) + '\n');

const landing = `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="refresh" content="0; url=ten-bagger/index.html" />
  <title>10x 觀察板</title>
</head>
<body>
  <p><a href="ten-bagger/index.html">開啟 10x 觀察板</a></p>
</body>
</html>
`;
mkdirSync(join(repoRoot, 'docs'), { recursive: true });
writeFileSync(join(repoRoot, 'docs/index.html'), landing);
writeFileSync(join(repoRoot, 'docs/.nojekyll'), '');

console.log('Wrote', outDir);
console.log('GitHub Pages URL → https://<user>.github.io/thai-listening-game/ten-bagger/index.html');
