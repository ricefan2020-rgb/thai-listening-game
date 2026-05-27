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

export function renderForexHeader(data) {
  const el = document.getElementById('stat-forex');
  if (!el || !data?.currencies) return;
  const usd = data.currencies.USD;
  const jpy = data.currencies.JPY;
  el.textContent = `USD ${usd?.directionLabel || '—'} · JPY ${jpy?.directionLabel || '—'}`;
  el.title = `${data.horizon || ''} · ${data.asOf || ''}`;
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
  host.innerHTML = `
    <p class="fx-horizon">${data.horizon || ''}</p>
    <div class="fx-cards">${rows}</div>
    <h4 class="fx-sub">配置方案 D</h4>
    <table class="fx-table">
      <thead><tr><th>類型</th><th>RMB</th><th>USD</th><th>HKD</th><th>JPY</th></tr></thead>
      <tbody>${allocRows}</tbody>
    </table>
    <ul class="fx-notes">${(data.execution || []).map((x) => `<li>${x}</li>`).join('')}</ul>
    <h4 class="fx-sub">觀察</h4>
    <ul class="fx-watch">
      <li><b>USD</b> ${watch.usd || '—'}</li>
      <li><b>RMB</b> ${watch.rmb || '—'}</li>
      <li><b>JPY</b> ${watch.jpy || '—'}</li>
      <li><b>HKD</b> ${watch.hkd || '—'}</li>
    </ul>
  `;
}
