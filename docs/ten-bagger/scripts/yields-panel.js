/**
 * 國債收益率側欄 · yields.json
 */

const CURVE_KEYS = ['y2', 'y5', 'y10', 'y30'];

export async function loadYields() {
  const el = document.getElementById('yields-data');
  if (el?.textContent) {
    try {
      const data = JSON.parse(el.textContent);
      if (data?.series) return data;
    } catch {
      /* fall through */
    }
  }
  const res = await fetch('./yields.json');
  if (!res.ok) throw new Error('yields.json 載入失敗');
  const data = await res.json();
  if (el) el.textContent = JSON.stringify(data);
  return data;
}

function bpsClass(bps) {
  if (bps == null) return '';
  if (bps > 0) return 'up';
  if (bps < 0) return 'down';
  return '';
}

export function renderYieldsHeader(data) {
  const el = document.getElementById('stat-yields');
  if (!el || !data?.series) return;
  const y10 = data.series.y10;
  const sp = data.series.spread10y2y;
  el.textContent = `10Y ${y10?.value?.toFixed(2) ?? '—'}% · ${sp?.tenor || '2s10s'} ${sp?.valueFmt?.replace('%', '') ?? '—'}`;
  el.title = `SOFR ${data.series.sofr?.valueFmt} · ${data.curve?.shapeLabel} · ${data.asOf}`;
}

export function renderYieldsStrip(data) {
  const strip = document.getElementById('yields-strip');
  const chips = document.getElementById('yields-chips');
  if (!strip || !chips || !data?.series) return;

  const y10 = data.series.y10;
  if (!y10?.valueFmt) {
    strip.classList.add('hidden');
    return;
  }

  strip.classList.remove('hidden');
  const items = [
    data.series.y2,
    data.series.y10,
    data.series.sofr,
    data.series.spread10y2y,
  ].filter(Boolean);

  chips.innerHTML = items
    .map((s) => {
      const chg = s.change7dFmt || '—';
      const inv = s.spread && s.value < 0 ? ' inverted' : '';
      return `<span class="yield-chip${inv}" title="7日 ${chg} · 30日 ${s.change30dFmt || '—'}"><b>${s.tenor}</b> ${s.valueFmt} <em>${chg}</em></span>`;
    })
    .join('');
}

export function renderYieldsPanel(data) {
  const host = document.getElementById('yields-panel');
  const asOfEl = document.getElementById('yields-as-of');
  if (!host || !data?.series) return;
  if (asOfEl) asOfEl.textContent = data.asOf || '—';

  const maxY = Math.max(
    ...CURVE_KEYS.map((k) => data.series[k]?.value ?? 0),
    0.01,
  );

  const bars = CURVE_KEYS.map((k) => {
    const s = data.series[k];
    if (!s) return '';
    const w = Math.round((s.value / maxY) * 100);
    return `<div class="yield-bar-row">
      <span class="yield-bar-label">${s.tenor}</span>
      <div class="yield-bar-track"><div class="yield-bar-fill" style="width:${w}%"></div></div>
      <span class="yield-bar-val">${s.valueFmt}</span>
      <span class="yield-bar-chg ${bpsClass(s.change7dBps)}">${s.change7dFmt}</span>
    </div>`;
  }).join('');

  const extras = ['spread10y2y', 'sofr', 'fedFunds']
    .map((k) => data.series[k])
    .filter(Boolean);

  host.innerHTML = `
    <p class="yield-curve-tag ${data.curve?.shape === 'inverted' ? 'inverted' : ''}">曲線 · <b>${data.curve?.shapeLabel || '—'}</b> · 利差 ${data.curve?.spreadFmt || '—'}</p>
    <div class="yield-bars">${bars}</div>
    <table class="yield-table">
      <thead><tr><th>指標</th><th>水準</th><th>7日</th><th>30日</th></tr></thead>
      <tbody>${extras
        .map(
          (s) =>
            `<tr><td><b>${s.label}</b></td><td>${s.valueFmt}</td><td class="${bpsClass(s.change7dBps)}">${s.change7dFmt}</td><td class="${bpsClass(s.change30dBps)}">${s.change30dFmt}</td></tr>`,
        )
        .join('')}</tbody>
    </table>
    <ul class="yield-notes">
      <li><b>CRCL</b> ${data.watchlist?.crcl || ''}</li>
      <li><b>成長股</b> ${data.watchlist?.growth || ''}</li>
      <li><b>宏觀</b> ${data.watchlist?.macro || ''}</li>
    </ul>
  `;
}

export function applyYieldsBadge(data) {
  const el = document.querySelector('[data-yields-badge="CRCL"]');
  if (!el || !data?.series?.sofr) return;
  const sofr = data.series.sofr;
  el.textContent = `SOFR ${sofr.value?.toFixed(2)}%`;
  el.className = 'badge yields';
  el.title = `10Y ${data.series.y10?.valueFmt} · 利差 ${data.curve?.spreadFmt}`;
}
