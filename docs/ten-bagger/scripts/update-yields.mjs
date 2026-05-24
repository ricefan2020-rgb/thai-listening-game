#!/usr/bin/env node
/**
 * 美國國債收益率 + SOFR（FRED）→ yields.json + 嵌入 index.html
 * 用法：node research/ten-bagger/scripts/update-yields.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const UA = 'ten-bagger-yields/1.0 (personal research)';

const SERIES = [
  { id: 'DGS2', key: 'y2', label: '2年期', tenor: '2Y', fred: 'DGS2' },
  { id: 'DGS5', key: 'y5', label: '5年期', tenor: '5Y', fred: 'DGS5' },
  { id: 'DGS10', key: 'y10', label: '10年期', tenor: '10Y', fred: 'DGS10' },
  { id: 'DGS30', key: 'y30', label: '30年期', tenor: '30Y', fred: 'DGS30' },
  { id: 'SOFR', key: 'sofr', label: 'SOFR', tenor: 'O/N', fred: 'SOFR', crcl: true },
  { id: 'DFF', key: 'fedFunds', label: '聯邦基金', tenor: 'FF', fred: 'DFF' },
  { id: 'T10Y2Y', key: 'spread10y2y', label: '10Y−2Y 利差', tenor: '2s10s', fred: 'T10Y2Y', spread: true },
];

async function fetchFred(id) {
  const url = `https://fred.stlouisfed.org/graph/fredgraph.csv?id=${id}`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`FRED ${id}: HTTP ${res.status}`);
  return res.text();
}

function parseFredCsv(text) {
  return text
    .trim()
    .split('\n')
    .slice(1)
    .map((line) => {
      const [date, raw] = line.split(',');
      const value = parseFloat(raw);
      if (!date || raw === '.' || Number.isNaN(value)) return null;
      return { date, value };
    })
    .filter(Boolean);
}

function valueOnOrBefore(series, daysAgo) {
  if (!series.length) return null;
  const target = new Date();
  target.setDate(target.getDate() - daysAgo);
  const targetStr = target.toISOString().slice(0, 10);
  let best = null;
  for (const p of series) {
    if (p.date <= targetStr) best = p;
    else break;
  }
  return best?.value ?? series[0]?.value ?? null;
}

function bpsDelta(now, then) {
  if (now == null || then == null) return null;
  return Math.round((now - then) * 100);
}

function fmtPct(v) {
  if (v == null) return '—';
  return `${v.toFixed(2)}%`;
}

function fmtBps(v) {
  if (v == null) return '—';
  const sign = v > 0 ? '+' : '';
  return `${sign}${v}bp`;
}

const seriesOut = {};
let latestDate = '';

for (const s of SERIES) {
  const csv = await fetchFred(s.id);
  const hist = parseFredCsv(csv);
  const last = hist.at(-1);
  if (!last) {
    console.warn('No data for', s.id);
    continue;
  }
  if (last.date > latestDate) latestDate = last.date;

  const v = last.value;
  const d7 = valueOnOrBefore(hist, 7);
  const d30 = valueOnOrBefore(hist, 30);
  const d90 = valueOnOrBefore(hist, 90);

  seriesOut[s.key] = {
    label: s.label,
    tenor: s.tenor,
    fred: s.fred,
    date: last.date,
    value: v,
    valueFmt: s.spread ? `${v >= 0 ? '+' : ''}${v.toFixed(2)}%` : fmtPct(v),
    change7dBps: bpsDelta(v, d7),
    change30dBps: bpsDelta(v, d30),
    change90dBps: bpsDelta(v, d90),
    change7dFmt: fmtBps(bpsDelta(v, d7)),
    change30dFmt: fmtBps(bpsDelta(v, d30)),
    crcl: !!s.crcl,
    spread: !!s.spread,
  };
}

const y2 = seriesOut.y2?.value;
const y10 = seriesOut.y10?.value;
const spread = seriesOut.spread10y2y?.value;
const sofr = seriesOut.sofr?.value;

const payload = {
  asOf: latestDate || new Date().toISOString().slice(0, 10),
  source: 'FRED (Federal Reserve Economic Data)',
  note: '常數到期國債收益率 · 非即時報價 · 僅供研究',
  series: seriesOut,
  curve: {
    shape: spread != null && spread < 0 ? 'inverted' : spread != null && spread < 0.25 ? 'flat' : 'normal',
    shapeLabel:
      spread != null && spread < 0 ? '倒掛' : spread != null && spread < 0.25 ? '平坦' : '正常',
    spread10y2y: spread,
    spreadFmt: seriesOut.spread10y2y?.valueFmt,
    y2: y2,
    y10: y10,
  },
  watchlist: {
    crcl: `SOFR ${fmtPct(sofr)} · 儲備利息敏感`,
    growth: `10Y ${fmtPct(y10)} · 估值分母`,
    macro: spread != null && spread < 0 ? '利差倒掛 · 衰退警訊歷史參考' : `10Y−2Y ${seriesOut.spread10y2y?.valueFmt || '—'}`,
  },
};

const jsonPath = join(root, 'yields.json');
writeFileSync(jsonPath, JSON.stringify(payload, null, 2) + '\n');

const curveRows = ['y2', 'y5', 'y10', 'y30']
  .map((k) => seriesOut[k])
  .filter(Boolean)
  .map((r) => `| ${r.label} | ${r.valueFmt} | ${r.change7dFmt} | ${r.change30dFmt} |`)
  .join('\n');

const mdPath = join(root, 'yields.md');
writeFileSync(
  mdPath,
  `# 美國國債收益率

> 更新：**${payload.asOf}** · [yields.json](./yields.json) · 來源 FRED

**非投資建議**

## 收益率曲線 · ${payload.curve.shapeLabel}

| 期限 | 收益率 | 7日 | 30日 |
|------|--------|-----|------|
${curveRows}
| **10Y−2Y** | **${seriesOut.spread10y2y?.valueFmt || '—'}** | ${seriesOut.spread10y2y?.change7dFmt || '—'} | ${seriesOut.spread10y2y?.change30dFmt || '—'} |
| **SOFR** | **${seriesOut.sofr?.valueFmt || '—'}** | ${seriesOut.sofr?.change7dFmt || '—'} | ${seriesOut.sofr?.change30dFmt || '—'} |
| **聯邦基金** | **${seriesOut.fedFunds?.valueFmt || '—'}** | ${seriesOut.fedFunds?.change7dFmt || '—'} | ${seriesOut.fedFunds?.change30dFmt || '—'} |

## 觀察名單關聯

- **CRCL**：${payload.watchlist.crcl}
- **成長股**（NVDA/PLTR/SNOW…）：${payload.watchlist.growth}
- **宏觀**：${payload.watchlist.macro}

## 更新

\`\`\`bash
cd research/ten-bagger && node scripts/update-yields.mjs
\`\`\`
`,
);

const htmlPath = join(root, 'index.html');
let html = readFileSync(htmlPath, 'utf8');
const compact = JSON.stringify(payload);
const start = '<!-- YIELDS_START -->';
const end = '<!-- YIELDS_END -->';
const re = new RegExp(`${start}[\\s\\S]*?${end}`);
const block = `${start}\n  <script type="application/json" id="yields-data">${compact}</script>\n  ${end}`;
if (re.test(html)) {
  html = html.replace(re, block);
} else {
  html = html.replace('<!-- STABLECOINS_END -->', `<!-- STABLECOINS_END -->\n\n  ${block}`);
}
writeFileSync(htmlPath, html);

console.log(
  'Wrote',
  jsonPath,
  `· 10Y ${seriesOut.y10?.valueFmt}`,
  `2s10s ${seriesOut.spread10y2y?.valueFmt}`,
  `SOFR ${seriesOut.sofr?.valueFmt}`,
);
