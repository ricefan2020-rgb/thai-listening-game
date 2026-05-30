#!/usr/bin/env node
/**
 * 從 ohlc.json 計算觀察名單日報酬 Pearson 相關係數 → 寫入 correlations-computed.json
 * 並更新 correlations.md 中 CORR_COMPUTED 區塊
 * 用法：node research/ten-bagger/scripts/analyze-correlations.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const MIN_POINTS = 30;

function pearson(a, b) {
  const n = a.length;
  if (n < 2) return null;
  let sumA = 0;
  let sumB = 0;
  for (let i = 0; i < n; i++) {
    sumA += a[i];
    sumB += b[i];
  }
  const meanA = sumA / n;
  const meanB = sumB / n;
  let num = 0;
  let denA = 0;
  let denB = 0;
  for (let i = 0; i < n; i++) {
    const da = a[i] - meanA;
    const db = b[i] - meanB;
    num += da * db;
    denA += da * da;
    denB += db * db;
  }
  const den = Math.sqrt(denA * denB);
  if (den === 0) return null;
  return num / den;
}

/** 對齊 t，回傳兩條報酬序列（長度 = 對齊點數 - 1） */
function alignedReturns(seriesA, seriesB) {
  const mapB = new Map(seriesB.map((p) => [p.t, p.c]));
  const closesA = [];
  const closesB = [];
  for (const p of seriesA) {
    const cb = mapB.get(p.t);
    if (cb != null) {
      closesA.push(p.c);
      closesB.push(cb);
    }
  }
  if (closesA.length < MIN_POINTS + 1) return null;
  const ra = [];
  const rb = [];
  for (let i = 1; i < closesA.length; i++) {
    if (closesA[i - 1] === 0) continue;
    ra.push((closesA[i] - closesA[i - 1]) / closesA[i - 1]);
    rb.push((closesB[i] - closesB[i - 1]) / closesB[i - 1]);
  }
  return ra.length >= MIN_POINTS ? { ra, rb } : null;
}

const ohlcPath = join(root, 'ohlc.json');
if (!existsSync(ohlcPath)) {
  console.error('Missing ohlc.json');
  process.exit(1);
}

const ohlc = JSON.parse(readFileSync(ohlcPath, 'utf8'));
const tickers = Object.keys(ohlc.tickers || {}).sort();
const pairs = [];

for (let i = 0; i < tickers.length; i++) {
  for (let j = i + 1; j < tickers.length; j++) {
    const ta = tickers[i];
    const tb = tickers[j];
    const ar = alignedReturns(ohlc.tickers[ta], ohlc.tickers[tb]);
    if (!ar) continue;
    const r = pearson(ar.ra, ar.rb);
    if (r == null || Number.isNaN(r)) continue;
    pairs.push({ a: ta, b: tb, r, n: ar.ra.length });
  }
}

pairs.sort((x, y) => Math.abs(y.r) - Math.abs(x.r));

const computed = {
  asOf: ohlc.asOf || new Date().toISOString().slice(0, 10),
  source: ohlc.source || 'Yahoo Finance',
  range: ohlc.range || '1y',
  note: `日報酬 Pearson · 僅含同 t 對齊樣本 n≥${MIN_POINTS}`,
  minPoints: MIN_POINTS,
  topPositive: pairs.filter((p) => p.r >= 0.35).slice(0, 12),
  topNegative: pairs.filter((p) => p.r <= -0.15).slice(0, 12),
  topAbs: pairs.slice(0, 15),
};

writeFileSync(join(root, 'correlations-computed.json'), JSON.stringify(computed, null, 2) + '\n');
console.log('Wrote correlations-computed.json', pairs.length, 'pairs total, top', computed.topAbs.length, 'by |r|');

const mdPath = join(root, 'correlations.md');
let md = readFileSync(mdPath, 'utf8');
const fmt = (x) => (x >= 0 ? '+' : '') + x.toFixed(2);
const tableTop = computed.topAbs
  .map((p) => `| ${p.a} / ${p.b} | ${fmt(p.r)} | ${p.n} |`)
  .join('\n');

const block = `## 股間相關係數（腳本計算）

> 資料：**${computed.asOf}** · ${computed.range} · ${computed.note}

| 標的對 | r | 樣本數 |
|--------|---|--------|
${tableTop}

- **正相關高**：同產業敘事、同 beta（例如 AI / 算力鏈）常同漲跌。
- **負相關**：較少見；可能反映資金在板塊內輪動或對沖結構（樣本短時不穩）。

完整 JSON：[correlations-computed.json](./correlations-computed.json)
`;

const START = '<!-- CORR_COMPUTED_START -->';
const END = '<!-- CORR_COMPUTED_END -->';
if (!md.includes(START)) {
  console.warn('correlations.md missing markers; append block');
  md += `\n\n${START}\n${block}\n${END}\n`;
} else {
  md = md.replace(new RegExp(`${START}[\\s\\S]*?${END}`), `${START}\n${block}\n${END}`);
}
writeFileSync(mdPath, md);
console.log('Updated correlations.md computed section');
