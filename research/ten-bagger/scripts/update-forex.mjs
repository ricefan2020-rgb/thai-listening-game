#!/usr/bin/env node
/**
 * 從 forex.json 生成 forex.md 摘要區塊（手動維護 json 後執行）
 * 用法：node research/ten-bagger/scripts/update-forex.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(readFileSync(join(root, 'forex.json'), 'utf8'));

const ORDER = ['USD', 'RMB', 'JPY', 'HKD'];
const tableRows = ORDER.map((k) => {
  const c = data.currencies[k];
  if (!c) return '';
  return `| **${c.nameZh}** | ${c.shortTerm} | ${c.mediumTerm} | ${(c.drivers || []).slice(0, 2).join('；')} |`;
}).join('\n');

const md = `# 四幣匯率 · RMB / USD / JPY / HKD

> 更新：**${data.asOf}** · [forex.json](./forex.json) · ${data.source || '研究筆記'}

**非投資建議** · 非即時報價

## 升跌變化（${data.horizon || '—'}）

| 幣種 | 短線 | 中期方向 | 關鍵驅動 |
|------|------|----------|----------|
${tableRows}

## 資產配置（方案 D）

| 類型 | RMB | USD | HKD | JPY |
|------|-----|-----|-----|-----|
| 保守 | ${data.allocation?.conservative?.RMB ?? '—'}% | ${data.allocation?.conservative?.USD ?? '—'}% | ${data.allocation?.conservative?.HKD ?? '—'}% | ${data.allocation?.conservative?.JPY ?? '—'}% |
| 平衡 | ${data.allocation?.balanced?.RMB ?? '—'}% | ${data.allocation?.balanced?.USD ?? '—'}% | ${data.allocation?.balanced?.HKD ?? '—'}% | ${data.allocation?.balanced?.JPY ?? '—'}% |
| 進取 | ${data.allocation?.aggressive?.RMB ?? '—'}% | ${data.allocation?.aggressive?.USD ?? '—'}% | ${data.allocation?.aggressive?.HKD ?? '—'}% | ${data.allocation?.aggressive?.JPY ?? '—'}% |

## 觀察板

側欄 **「匯率」** · [index.html](./index.html)

## 更新

\`\`\`bash
cd research/ten-bagger
# 編輯 forex.json 後：
node scripts/update-forex.mjs
node scripts/embed-data.mjs
node scripts/prepare-pages.mjs
\`\`\`
`;

writeFileSync(join(root, 'forex.md'), md);
console.log('Wrote forex.md');
