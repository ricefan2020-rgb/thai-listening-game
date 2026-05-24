/**
 * 數字分析面板 · 合併 metrics.json + 即時報價 + K線衍生
 */
import { fetchCandles, yahooSymbol } from './chart-kdj.js';

export async function loadMetrics() {
  const res = await fetch('./metrics.json');
  if (!res.ok) throw new Error('metrics.json 載入失敗');
  return res.json();
}

function fmtPct(n, digits = 1) {
  if (n == null || Number.isNaN(n)) return '—';
  const sign = n > 0 ? '+' : '';
  return `${sign}${n.toFixed(digits)}%`;
}

function fmtUsd(n) {
  if (n == null) return '—';
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  return `$${n.toFixed(2)}`;
}

import { calcPullback } from './pullback.js';

/** 從 K 線算技術數字 */
export async function techNumbers(ticker) {
  try {
    const candles = await fetchCandles(ticker);
    if (!candles.length) return {};
    const closes = candles.map((c) => c.close);
    const last = closes.at(-1);
    const high = Math.max(...candles.map((c) => c.high));
    const low = Math.min(...candles.map((c) => c.low));
    const avg20 = closes.slice(-20).reduce((a, b) => a + b, 0) / Math.min(20, closes.length);
    const avg50 =
      closes.length >= 50
        ? closes.slice(-50).reduce((a, b) => a + b, 0) / 50
        : null;
    const pb = calcPullback(candles);
    return {
      last,
      fromHigh: ((last / high - 1) * 100),
      fromLow: ((last / low - 1) * 100),
      vsMa20: ((last / avg20 - 1) * 100),
      vsMa50: avg50 ? ((last / avg50 - 1) * 100) : null,
      high,
      low,
      fromHigh20: pb?.fromHigh20,
      fromHigh60: pb?.fromHigh60,
      fromHigh1y: pb?.fromHigh1y,
      pullback: pb,
    };
  } catch {
    return {};
  }
}

export function renderNumbersPanel(container, ticker, metrics, quote, tech, kdjSig) {
  const m = metrics.tickers?.[ticker];
  if (!m) {
    container.innerHTML = `<p class="num-empty">無 ${ticker} 數字檔</p>`;
    return;
  }

  const price = quote?.price;
  const chg = quote?.chgPct;
  const shares5k = price ? Math.floor(5000 / price) : null;

  const techRows = [
    ['現價', price != null ? fmtUsd(price) : '—', chg != null ? fmtPct(chg) : ''],
    ['60日高位回調', tech.fromHigh60 != null ? fmtPct(tech.fromHigh60) : '—', ''],
    ['20日高位回調', tech.fromHigh20 != null ? fmtPct(tech.fromHigh20) : '—', ''],
    ['1年高位回調', tech.fromHigh1y != null ? fmtPct(tech.fromHigh1y) : '—', ''],
    ['距 6M 低', tech.fromLow != null ? fmtPct(tech.fromLow) : '—', ''],
    ['vs MA20', tech.vsMa20 != null ? fmtPct(tech.vsMa20) : '—', ''],
    ['vs MA50', tech.vsMa50 != null ? fmtPct(tech.vsMa50) : '—', ''],
    ['$5k 約股數', shares5k != null ? `~${shares5k} 股` : '—', ''],
    ['KDJ', kdjSig?.label || '—', kdjSig?.k != null ? `K${kdjSig.k.toFixed(0)}` : ''],
  ];

  const kpiHtml = (m.kpis || [])
    .map(
      (row) => `
    <div class="num-kpi">
      <span class="num-k">${row.k}</span>
      <span class="num-v">${row.v}</span>
      ${row.yoy ? `<span class="num-yoy">${row.yoy}</span>` : ''}
      ${row.hint ? `<span class="num-hint">${row.hint}</span>` : ''}
    </div>`,
    )
    .join('');

  const flags = (m.flags || []).map((f) => `<span class="num-flag">${f}</span>`).join('');
  const sc = m.scenarios || {};

  container.innerHTML = `
    <div class="num-header">
      <div>
        <b class="num-ticker">${ticker}</b>
        <span class="num-name">${m.name}</span>
      </div>
      <div class="num-tags">${flags}</div>
    </div>
    <div class="num-scenarios">
      <span>Bull <b>${sc.bull || '—'}</b></span>
      <span>Base <b>${sc.base || '—'}</b></span>
      <span>Bear <b>${sc.bear || '—'}</b></span>
      <span class="num-rate">加息敏感 <b>${m.rateSens || '—'}</b></span>
    </div>
    <div class="num-section-label">市場 · 技術</div>
    <div class="num-tech-grid">
      ${techRows
        .map(
          ([k, v, extra]) => `
        <div class="num-tech-row">
          <span>${k}</span>
          <span class="num-mono">${v}</span>
          ${extra ? `<span class="num-extra">${extra}</span>` : ''}
        </div>`,
        )
        .join('')}
    </div>
    <div class="num-section-label">基本面 · 季報/檔案</div>
    <div class="num-kpi-grid">${kpiHtml}</div>
  `;
}

export function renderCompareTable(tableEl, tickers, metrics, quotes, kdjMap = {}, pbMap = {}) {
  const rows = tickers
    .map((t) => {
      const m = metrics.tickers?.[t];
      const q = quotes?.[t];
      const k1 = m?.kpis?.[0];
      const k2 = m?.kpis?.[1];
      const kdj = kdjMap[t]?.label || '…';
      const pb = pbMap[t]?.fromHigh60;
      const pbCls = pb != null && pb < -8 ? 'down' : pb != null && pb < -3 ? 'warn' : '';
      return `<tr data-ticker="${t}">
        <td><b>${t}</b></td>
        <td class="num-mono">${q?.price != null ? fmtUsd(q.price) : '—'}</td>
        <td class="num-mono ${q?.chgPct > 0 ? 'up' : q?.chgPct < 0 ? 'down' : ''}">${q?.chgPct != null ? fmtPct(q.chgPct) : '—'}</td>
        <td class="num-mono ${pbCls}">${pb != null ? fmtPct(pb) : '—'}</td>
        <td>${k1 ? `${k1.v}${k1.yoy ? ` <em>${k1.yoy}</em>` : ''}` : '—'}</td>
        <td>${k2 ? `${k2.v}${k2.yoy ? ` <em>${k2.yoy}</em>` : ''}` : '—'}</td>
        <td>${m?.tenX || '—'}</td>
        <td class="num-kdj-cell">${kdj}</td>
      </tr>`;
    })
    .join('');

  tableEl.innerHTML = `
    <table class="num-table">
      <thead>
        <tr>
          <th>代碼</th><th>現價</th><th>日%</th><th>60日高</th><th>核心①</th><th>核心②</th><th>10x</th><th>KDJ</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}
