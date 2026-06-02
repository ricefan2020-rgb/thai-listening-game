#!/usr/bin/env node
/**
 * 期權鏈分析 + 結算日 → options.json · 合併 calendar.json
 * 預設：富途 OpenD（本機 FutuOpenD + futu-api）
 * 備援：OPTIONS_SOURCE=yahoo 或 OpenD 未連線
 *
 * 用法：
 *   node scripts/update-options.mjs
 *   OPTIONS_SOURCE=yahoo node scripts/update-options.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { WATCH_TICKERS, yahooSymbol } from './lib/tickers.mjs';
import { fetchOptionChain } from './lib/yahoo-options.mjs';
import { fetchOpenDChains, chainForTicker, futuCode } from './lib/opend-fetch.mjs';
import {
  analyzeChain,
  listUpcomingExpiries,
  buildUnusualFlowTop,
} from './lib/options-analytics.mjs';
import { buildMarketOpexCalendar } from './lib/opex-calendar.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DELAY_MS = Number(process.env.OPTIONS_DELAY_MS || 800);
const FORCE_YAHOO = process.env.OPTIONS_SOURCE === 'yahoo';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function loadJson(path, fallback) {
  if (!existsSync(path)) return fallback;
  return JSON.parse(readFileSync(path, 'utf8'));
}

const asOf = new Date().toISOString().slice(0, 10);
const marketExpiries = buildMarketOpexCalendar(10, asOf);
const tickers = {};

let dataSource = 'Yahoo Finance options';
let opendPayload = null;

if (!FORCE_YAHOO) {
  try {
    console.log('OpenD: 連線中…', process.env.OPEND_HOST || '127.0.0.1', process.env.OPEND_PORT || '11111');
    opendPayload = await fetchOpenDChains(WATCH_TICKERS);
    dataSource = `Futu OpenD (${opendPayload.host}:${opendPayload.port})`;
    console.log('OpenD: 已連線');
  } catch (e) {
    console.warn('OpenD 不可用，改用 Yahoo:', e.message);
  }
}

for (const ticker of WATCH_TICKERS) {
  const sym = yahooSymbol(ticker);
  const fcode = futuCode(ticker);
  try {
    let chain = null;
    let via = 'yahoo';

    if (opendPayload) {
      chain = chainForTicker(opendPayload, ticker);
      if (chain?.options?.length) via = 'opend';
    }

    if (!chain?.options?.length && !FORCE_YAHOO && opendPayload?.errors?.[ticker]) {
      console.warn(ticker, 'OpenD:', opendPayload.errors[ticker]);
    }

    const opendOi =
      chain?.options?.reduce(
        (n, o) => n + (o.openInterest || 0),
        0,
      ) ?? 0;

    if (!chain?.options?.length || (via === 'opend' && opendOi === 0)) {
      if (via === 'opend' && opendOi === 0) {
        console.warn(ticker, 'OpenD 期權 OI 為空，改用 Yahoo');
      }
      chain = await fetchOptionChain(sym);
      via = 'yahoo';
      await sleep(DELAY_MS);
    }

    const analysis = analyzeChain(chain);
    const expiries = listUpcomingExpiries(chain, 8);
    tickers[ticker] = {
      futuCode: fcode,
      yahooSymbol: sym,
      dataVia: via,
      ...analysis,
      expiries,
    };
    console.log(
      ticker,
      via === 'opend' ? 'OpenD' : 'Yahoo',
      analysis.available ? analysis.outlookLabel : '無期權',
      analysis.available ? `@ ${analysis.expiry}` : '',
    );
  } catch (e) {
    tickers[ticker] = {
      futuCode: fcode,
      yahooSymbol: sym,
      available: false,
      outlookLabel: '無資料',
      outlookNote: e.message,
      dataVia: 'none',
    };
    console.warn(ticker, e.message);
  }
}

const payload = {
  asOf,
  source: dataSource,
  opend: opendPayload
    ? { host: opendPayload.host, port: opendPayload.port, errors: opendPayload.errors }
    : null,
  note: 'P/C·Max Pain·IV·異動成交(量/量OI) · 預設 OpenD · 非投資建議',
  flowRule: '當日量≥鏈上閾值 或 量/OI≥1.5',
  unusualFlowTop: buildUnusualFlowTop(tickers),
  marketExpiries,
  tickers,
};

const optionsPath = join(root, 'options.json');
writeFileSync(optionsPath, JSON.stringify(payload, null, 2) + '\n');

const calPath = join(root, 'calendar.json');
const cal = loadJson(calPath, { items: [], asOf, timezone: 'America/New_York' });
const existing = new Set(
  (cal.items || []).map((e) => `${e.date}|${e.kind}|${e.title}`),
);
const merged = [...(cal.items || [])];
for (const e of marketExpiries) {
  const key = `${e.date}|${e.kind}|${e.title}`;
  if (!existing.has(key)) {
    merged.push(e);
    existing.add(key);
  }
}
for (const [ticker, t] of Object.entries(tickers)) {
  if (!t.available || !t.expiry) continue;
  const title = `${ticker} 期權到期`;
  const key = `${t.expiry}|opex_ticker|${title}`;
  if (existing.has(key)) continue;
  merged.push({
    date: t.expiry,
    kind: 'opex',
    title,
    detail: `DTE ${t.dte} · ${t.outlookLabel} · P/C ${t.pcRatioOi ?? '—'} · ${t.dataVia === 'opend' ? 'OpenD' : 'Yahoo'}`,
    impact: 'medium',
    tickers: [ticker],
  });
  existing.add(key);
}
merged.sort((a, b) => a.date.localeCompare(b.date));
cal.asOf = asOf;
cal.items = merged;
cal.optionsNote = '含 update-options.mjs（OpenD 優先）產生的月選/VIX/各股到期';
writeFileSync(calPath, JSON.stringify(cal, null, 2) + '\n');

const htmlPath = join(root, 'index.html');
let html = readFileSync(htmlPath, 'utf8');
const compact = JSON.stringify(payload);
const start = '<!-- OPTIONS_START -->';
const end = '<!-- OPTIONS_END -->';
const re = new RegExp(`${start}[\\s\\S]*?${end}`);
if (re.test(html)) {
  html = html.replace(
    re,
    `${start}\n  <script type="application/json" id="options-data">${compact}</script>\n  ${end}`,
  );
} else {
  html = html.replace(
    '<!-- REDDIT_KW_END -->',
    `<!-- REDDIT_KW_END -->\n\n  ${start}\n  <script type="application/json" id="options-data">${compact}</script>\n  ${end}`,
  );
}
writeFileSync(htmlPath, html);

const mdPath = join(root, 'options.md');
const rows = WATCH_TICKERS.map((t) => {
  const x = tickers[t];
  if (!x?.available) return `| ${t} | — | 無期權或流動性不足 | — | — |`;
  const via = x.dataVia === 'opend' ? 'OpenD' : 'Yahoo';
  return `| ${t} | ${x.outlookLabel} | P/C ${x.pcRatioOi ?? '—'} · MP $${x.maxPain ?? '—'} | ${x.expiry} (${x.dte}d) | ${via} |`;
});
writeFileSync(
  mdPath,
  `# 期權籌碼摘要

> 更新：**${asOf}** · 資料源：**${dataSource}** · [options.json](./options.json)

## 更新（OpenD 優先）

1. 啟動 **FutuOpenD**（牛牛 / moomoo 開放平台）並登入，確認本機 \`127.0.0.1:11111\` 可連
2. \`pip install -r requirements-opend.txt\`
3. \`node scripts/update-options.mjs\`

強制 Yahoo：\`OPTIONS_SOURCE=yahoo node scripts/update-options.mjs\`

**說明**：OpenD 提供 OI / IV / 到期日；規則摘要輸出籌碼偏多/偏空/中性，**不是**價格預測。結算日併入 [calendar.json](./calendar.json)。

## 異動成交（${payload.flowRule}）

${
  payload.unusualFlowTop?.length
    ? payload.unusualFlowTop
        .map(
          (u) =>
            `- **${u.ticker}** ${u.side}$${u.strike} · 量 ${u.vol}${u.oi ? ` · OI ${u.oi}` : ''}${u.volOi != null ? ` · 量/OI ${u.volOi}` : ''}`,
        )
        .join('\n')
    : '_本輪無達標異動（多為鏈上成交量為 0，需 OpenD 行情權限）_'
}

## 觀察板代號

| Ticker | 籌碼提示 | 摘要 | 分析到期日 | 來源 |
|--------|----------|------|------------|------|
${rows.join('\n')}

## 市場級結算（近月）

${marketExpiries
  .slice(0, 8)
  .map((e) => `- **${e.date}** ${e.title} — ${e.detail}`)
  .join('\n')}
`,
);

console.log('Wrote', optionsPath, '·', dataSource, '· merged', calPath);
