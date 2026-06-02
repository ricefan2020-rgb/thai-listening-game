/**
 * 四幣匯率側欄 · forex.json
 */

const ORDER = ['USD', 'RMB', 'JPY', 'HKD'];

const DIR_CLASS = {
  strong: 'fx-up',
  range: 'fx-neutral',
  'weak-then-recover': 'fx-mixed',
  peg: 'fx-peg',
};

export async function loadForex() {
  const el = document.getElementById('forex-data');
  if (el?.textContent) {
    try {
      const data = JSON.parse(el.textContent);
      if (data?.currencies) return data;
    } catch {
      /* fall through */
    }
  }
  const res = await fetch('./forex.json');
  if (!res.ok) throw new Error('forex.json 載入失敗');
  const data = await res.json();
  if (el) el.textContent = JSON.stringify(data);
  return data;
}

function shortUsd(n) {
  if (n == null || Number.isNaN(n)) return '—';
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(n >= 1e5 ? 0 : 1)}k`;
  return String(Math.round(n));
}

export function renderForexHeader(data) {
  const el = document.getElementById('stat-forex');
  if (!el || !data?.currencies) return;
  const usd = data.currencies.USD;
  const jpy = data.currencies.JPY;
  const com = data.commodities;
  let line = `USD ${usd?.directionLabel || '—'} · JPY ${jpy?.directionLabel || '—'}`;
  let tip = `${data.horizon || ''} · ${data.asOf || ''}`;
  if (com?.gold?.price != null && com?.btc?.price != null) {
    const sg = com.silver?.price != null ? ` · 銀 $${shortUsd(com.silver.price)}` : '';
    line = `金 $${shortUsd(com.gold.price)}${sg} · BTC $${shortUsd(com.btc.price)}`;
    tip = [tip, com.delayNote, com.fetchedAt ? `抓取 ${com.fetchedAt.slice(0, 16)}` : ''].filter(Boolean).join(' · ');
  }
  el.textContent = line;
  el.title = tip;
}

export function renderForexPanel(data) {
  const host = document.getElementById('forex-panel');
  const asOfEl = document.getElementById('forex-as-of');
  if (!host || !data?.currencies) return;
  if (asOfEl) asOfEl.textContent = data.asOf || '—';

  const rows = ORDER.map((k) => data.currencies[k])
    .filter(Boolean)
    .map((c) => {
      const cls = DIR_CLASS[c.direction] || 'fx-neutral';
      const lv =
        c.levels?.support && c.levels?.resistance
          ? `<span class="fx-lv">支 ${c.levels.support} · 阻 ${c.levels.resistance}</span>`
          : '';
      return `<div class="fx-card ${cls}">
        <div class="fx-card-head"><b>${c.nameZh}</b> <em>${c.pair}</em> <span>${c.spotFmt || '—'}</span></div>
        <p class="fx-dir"><strong>${c.directionLabel}</strong> · ${c.shortTerm}</p>
        <p class="fx-med">${c.mediumTerm}</p>
        ${lv}
        <ul class="fx-drivers">${(c.drivers || [])
          .slice(0, 3)
          .map((d) => `<li>${d}</li>`)
          .join('')}</ul>
      </div>`;
    })
    .join('');

  const alloc = data.allocation || {};
  const allocRows = ['conservative', 'balanced', 'aggressive']
    .map((key) => {
      const p = alloc[key];
      if (!p) return '';
      return `<tr><td>${p.label || key}</td><td>${p.RMB}%</td><td>${p.USD}%</td><td>${p.HKD}%</td><td>${p.JPY}%</td></tr>`;
    })
    .join('');

  const watch = data.watchlist || {};
  const com = data.commodities;
  let commHtml = '';
  if (com?.gold || com?.silver || com?.btc) {
    const chips = [com.gold, com.silver, com.btc]
      .filter(Boolean)
      .map(
        (x) =>
          `<span class="fx-comm-chip" title="${x.source || ''}"><b>${x.nameZh}</b> ${x.priceFmt || '—'}</span>`,
      )
      .join('');
    commHtml = `<h4 class="fx-sub">金 · 銀 · BTC</h4>
    <p class="fx-comm-note">${com.delayNote || ''}</p>
    <div class="fx-comm-row">${chips}</div>
    <div id="fx-chart-commodities" class="fx-chart-block"></div>`;
  }

  host.innerHTML = `
    <p class="fx-horizon">${data.horizon || ''}</p>
    ${commHtml}
    <h4 class="fx-sub">四幣 / 美元指數 · ${data.chartRange || '6mo'}</h4>
    <div id="fx-chart-fx" class="fx-chart-block"></div>
    <div class="fx-cards">${rows}</div>
    <h4 class="fx-sub">配置方案 D</h4>
    <div id="fx-chart-alloc" class="fx-alloc-block"></div>
    <table class="fx-table">
      <thead><tr><th>類型</th><th>RMB</th><th>USD</th><th>HKD</th><th>JPY</th></tr></thead>
      <tbody>${allocRows}</tbody>
    </table>
    <ul class="fx-notes">${(data.execution || []).map((x) => `<li>${x}</li>`).join('')}</ul>
    <h4 class="fx-sub">股間相關（觀察名單）</h4>
    <div id="fx-chart-corr" class="fx-corr-block"></div>
    <h4 class="fx-sub">觀察</h4>
    <ul class="fx-watch">
      <li><b>USD</b> ${watch.usd || '—'}</li>
      <li><b>RMB</b> ${watch.rmb || '—'}</li>
      <li><b>JPY</b> ${watch.jpy || '—'}</li>
      <li><b>HKD</b> ${watch.hkd || '—'}</li>
    </ul>
  `;
}
