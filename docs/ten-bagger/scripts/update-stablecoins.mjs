#!/usr/bin/env node
/**
 * 抓取 USDC / USDT 流通量（Circle API + DeFiLlama）→ stablecoins.json + 嵌入 index.html
 * 用法：node research/ten-bagger/scripts/update-stablecoins.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const UA = 'ten-bagger-stablecoins/1.0 (personal research)';

const LLAMA_IDS = { USDT: 1, USDC: 2, DAI: 5 };
const Q1_USDC_B = 77; // Circle Q1'26 披露 $77B，供對照

function fmtB(usd) {
  if (usd >= 1e12) return `$${(usd / 1e12).toFixed(2)}T`;
  if (usd >= 1e9) return `$${(usd / 1e9).toFixed(1)}B`;
  if (usd >= 1e6) return `$${(usd / 1e6).toFixed(0)}M`;
  return `$${usd.toFixed(0)}`;
}

function pctChange(now, then) {
  if (!then || !now) return null;
  return Math.round(((now / then - 1) * 1000)) / 10;
}

async function fetchJson(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
  return res.json();
}

function pickHistoryPoint(series, daysAgo) {
  if (!series?.length) return null;
  const target = Date.now() / 1000 - daysAgo * 86400;
  let best = series[0];
  for (const p of series) {
    const t = Number(p.date);
    if (t <= target && t >= Number(best.date)) best = p;
  }
  const usd = best.totalCirculating?.peggedUSD ?? best.totalCirculatingUSD?.peggedUSD;
  return usd ?? null;
}

async function fetchCircleUsdc() {
  const j = await fetchJson('https://api.circle.com/v1/stablecoins');
  const usdc = j.data?.find((c) => c.symbol === 'USDC');
  if (!usdc) throw new Error('Circle API: USDC not found');
  const total = Number(usdc.totalAmount);
  const chains = (usdc.chains || [])
    .map((c) => ({ chain: c.chain, amount: Number(c.amount) }))
    .filter((c) => c.amount > 0)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8);
  return { total, chains };
}

async function fetchLlamaList() {
  const j = await fetchJson('https://stablecoins.llama.fi/stablecoins?includePrices=true');
  const out = {};
  for (const s of j.peggedAssets || []) {
    if (['USDT', 'USDC', 'DAI'].includes(s.symbol) && !out[s.symbol]) {
      out[s.symbol] = {
        circulatingUsd: s.circulating?.peggedUSD ?? s.circulating,
        id: s.id,
      };
    }
  }
  return out;
}

async function fetchLlamaHistory(symbol) {
  const id = LLAMA_IDS[symbol];
  const series = await fetchJson(
    `https://stablecoins.llama.fi/stablecoincharts/all?stablecoin=${id}`,
  );
  const now = series.at(-1)?.totalCirculating?.peggedUSD;
  return {
    now,
    d7: pickHistoryPoint(series, 7),
    d30: pickHistoryPoint(series, 30),
    d90: pickHistoryPoint(series, 90),
  };
}

const circle = await fetchCircleUsdc();
const llama = await fetchLlamaList();
const usdcHist = await fetchLlamaHistory('USDC');
const usdtHist = await fetchLlamaHistory('USDT');

const usdcUsd = circle.total;
const usdtUsd = llama.USDT?.circulatingUsd ?? usdtHist.now;
const daiUsd = llama.DAI?.circulatingUsd;

const duopoly = usdcUsd + usdtUsd;
const usdcShare = Math.round((usdcUsd / duopoly) * 1000) / 10;
const usdtShare = Math.round((usdtUsd / duopoly) * 1000) / 10;

const payload = {
  asOf: new Date().toISOString().slice(0, 10),
  sources: ['Circle API (USDC)', 'DeFiLlama (USDT/USDC/DAI)'],
  note: '流通量為鏈上+託管口徑 · 與季報披露可能有日差 · 非投資建議',
  coins: {
    USDC: {
      issuer: 'Circle (CRCL)',
      circulatingUsd: usdcUsd,
      circulatingFmt: fmtB(usdcUsd),
      source: 'circle',
      change7dPct: pctChange(usdcUsd, usdcHist.d7),
      change30dPct: pctChange(usdcUsd, usdcHist.d30),
      change90dPct: pctChange(usdcUsd, usdcHist.d90),
      vsQ1FilingPct: pctChange(usdcUsd, Q1_USDC_B * 1e9),
      q1FilingFmt: `$${Q1_USDC_B}B`,
      topChains: circle.chains.map((c) => ({
        chain: c.chain,
        amountFmt: fmtB(c.amount),
        sharePct: Math.round((c.amount / usdcUsd) * 1000) / 10,
      })),
    },
    USDT: {
      issuer: 'Tether',
      circulatingUsd: usdtUsd,
      circulatingFmt: fmtB(usdtUsd),
      source: 'defillama',
      change7dPct: pctChange(usdtUsd, usdtHist.d7),
      change30dPct: pctChange(usdtUsd, usdtHist.d30),
      change90dPct: pctChange(usdtUsd, usdtHist.d90),
    },
    DAI: daiUsd
      ? {
          issuer: 'MakerDAO',
          circulatingUsd: daiUsd,
          circulatingFmt: fmtB(daiUsd),
          source: 'defillama',
        }
      : null,
  },
  market: {
    usdcPlusUsdtUsd: duopoly,
    usdcSharePct: usdcShare,
    usdtSharePct: usdtShare,
    usdcShareLabel: `USDC 佔 USDC+USDT ${usdcShare}%`,
    leader: usdtUsd >= usdcUsd ? 'USDT' : 'USDC',
    gapFmt: fmtB(Math.abs(usdtUsd - usdcUsd)),
  },
  crcl: {
    ticker: 'CRCL',
    usdcCirculatingFmt: fmtB(usdcUsd),
    usdcShareOfDuopoly: usdcShare,
    revenueDriver: '儲備利息 ∝ USDC 流通 × SOFR',
  },
};

const jsonPath = join(root, 'stablecoins.json');
writeFileSync(jsonPath, JSON.stringify(payload, null, 2) + '\n');

const mdPath = join(root, 'stablecoins.md');
writeFileSync(
  mdPath,
  `# 穩定幣流通量 · USDC / USDT

> 更新：**${payload.asOf}** · [stablecoins.json](./stablecoins.json)

| 幣種 | 流通量 | 7日 | 30日 | 備註 |
|------|--------|-----|------|------|
| **USDC** | **${payload.coins.USDC.circulatingFmt}** | ${payload.coins.USDC.change7dPct ?? '—'}% | ${payload.coins.USDC.change30dPct ?? '—'}% | Circle · Q1 披露 ${payload.coins.USDC.q1FilingFmt} |
| **USDT** | **${payload.coins.USDT.circulatingFmt}** | ${payload.coins.USDT.change7dPct ?? '—'}% | ${payload.coins.USDT.change30dPct ?? '—'}% | Tether · DeFiLlama |
| **份額** | USDC **${usdcShare}%** · USDT **${usdtShare}%** | | | 僅 USDC+USDT 口徑 |

## 更新

\`\`\`bash
cd research/ten-bagger && node scripts/update-stablecoins.mjs
\`\`\`

## USDC 鏈分布（Circle）

${payload.coins.USDC.topChains.map((c) => `- **${c.chain}** ${c.amountFmt}（${c.sharePct}%）`).join('\n')}

**CRCL** 收入與 **USDC 流通量**、**SOFR** 高度相關 → [CRCL.md](./companies/CRCL.md)
`,
);

const htmlPath = join(root, 'index.html');
let html = readFileSync(htmlPath, 'utf8');
const compact = JSON.stringify(payload);
const start = '<!-- STABLECOINS_START -->';
const end = '<!-- STABLECOINS_END -->';
const re = new RegExp(`${start}[\\s\\S]*?${end}`);
const block = `${start}\n  <script type="application/json" id="stablecoins-data">${compact}</script>\n  ${end}`;
if (re.test(html)) {
  html = html.replace(re, block);
} else {
  html = html.replace(
    '<!-- SENTIMENT_END -->',
    `<!-- SENTIMENT_END -->\n\n  ${block}`,
  );
}
writeFileSync(htmlPath, html);

console.log(
  'Wrote',
  jsonPath,
  `· USDC ${payload.coins.USDC.circulatingFmt}`,
  `USDT ${payload.coins.USDT.circulatingFmt}`,
  `· share ${usdcShare}% / ${usdtShare}%`,
);
