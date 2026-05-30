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

const com = data.commodities;
let commMd = '';
if (com?.gold || com?.silver || com?.btc) {
  const rows = [com.gold, com.silver, com.btc]
    .filter(Boolean)
    .map((x) => `| **${x.nameZh}** | ${x.priceFmt || '—'} | ${x.symbol || '—'} | ${x.source || '—'} |`)
    .join('\n');
  commMd = `
## 金 · 銀 · 比特幣（腳本更新）

> 抓取：**${com.fetchedAt?.slice(0, 19) || '—'}**（UTC）· ${com.delayNote || ''}

| 品項 | 牌價 | 代號 | 來源 |
|------|------|------|------|
${rows}

\`node scripts/update-commodities.mjs\` · 再 \`update-forex.mjs\` / \`prepare-pages.mjs\`
`;
}

const md = `# 四幣匯率 · RMB / USD / JPY / HKD

> 更新：**${data.asOf}** · [forex.json](./forex.json) · ${data.source || '研究筆記'}

**非投資建議** · 非即時報價

## 升跌變化（${data.horizon || '—'}）

| 幣種 | 短線 | 中期方向 | 關鍵驅動 |
|------|------|----------|----------|
${tableRows}
${commMd}
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
node scripts/update-commodities.mjs   # 金銀 BTC 牌價 → forex.json（需網路）
node scripts/update-forex.mjs
node scripts/embed-data.mjs
node scripts/prepare-pages.mjs
\`\`\`
`;

writeFileSync(join(root, 'forex.md'), md);
console.log('Wrote forex.md');
