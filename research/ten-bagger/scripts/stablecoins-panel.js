/**
 * USDC / USDT 流通量側欄 · stablecoins.json
 */

export async function loadStablecoins() {
  const el = document.getElementById('stablecoins-data');
  if (el?.textContent) {
    try {
      const data = JSON.parse(el.textContent);
      if (data?.coins) return data;
    } catch {
      /* fall through */
    }
  }
  const res = await fetch('./stablecoins.json');
  if (!res.ok) throw new Error('stablecoins.json 載入失敗');
  const data = await res.json();
  if (el) el.textContent = JSON.stringify(data);
  return data;
}

function fmtPct(n) {
  if (n == null || Number.isNaN(n)) return '—';
  const sign = n > 0 ? '+' : '';
  return `${sign}${n}%`;
}

export function renderStableHeader(data) {
  const el = document.getElementById('stat-stable');
  if (!el || !data?.coins) return;
  const u = data.coins.USDC;
  const t = data.coins.USDT;
  const share = data.market?.usdcSharePct;
  el.textContent = `USDC ${u?.circulatingFmt?.replace('$', '') || '—'} · ${share ?? '—'}%`;
  el.title = `USDT ${t?.circulatingFmt} · USDC 佔雙幣 ${share}% · ${data.asOf || ''}`;
}

export function renderStableStrip(data) {
  const strip = document.getElementById('stable-strip');
  const chips = document.getElementById('stable-chips');
  if (!strip || !chips || !data?.coins) return;

  const u = data.coins.USDC;
  const t = data.coins.USDT;
  if (!u?.circulatingFmt) {
    strip.classList.add('hidden');
    return;
  }

  strip.classList.remove('hidden');
  chips.innerHTML = [
    `<span class="stable-chip usdc" title="Circle · 7日 ${fmtPct(u.change7dPct)}">USDC <b>${u.circulatingFmt}</b> <em>${fmtPct(u.change30dPct)} 30d</em></span>`,
    `<span class="stable-chip usdt" title="Tether · 7日 ${fmtPct(t.change7dPct)}">USDT <b>${t.circulatingFmt}</b> <em>${fmtPct(t.change30dPct)} 30d</em></span>`,
    `<span class="stable-chip share" title="USDC+USDT 口徑">份額 <b>${data.market.usdcSharePct}%</b> / ${data.market.usdtSharePct}%</span>`,
    `<a class="stable-chip link" href="./companies/CRCL.md">CRCL →</a>`,
  ].join('');
}

export function renderStablePanel(data) {
  const host = document.getElementById('stable-panel');
  const asOfEl = document.getElementById('stable-as-of');
  if (!host || !data) return;
  if (asOfEl) asOfEl.textContent = data.asOf || '—';

  const u = data.coins.USDC;
  const t = data.coins.USDT;
  const d = data.coins.DAI;

  const rows = [
    ['USDC', u.circulatingFmt, fmtPct(u.change7dPct), fmtPct(u.change30dPct), u.vsQ1FilingPct != null ? `vs Q1 ${fmtPct(u.vsQ1FilingPct)}` : ''],
    ['USDT', t.circulatingFmt, fmtPct(t.change7dPct), fmtPct(t.change30dPct), ''],
  ];
  if (d) rows.push(['DAI', d.circulatingFmt, '—', '—', '']);

  host.innerHTML = `
    <div class="stable-duopoly">
      <div class="stable-bar" role="img" aria-label="USDC USDT 份額">
        <div class="stable-bar-usdc" style="width:${data.market.usdcSharePct}%"></div>
      </div>
      <div class="stable-bar-labels">
        <span>USDC ${data.market.usdcSharePct}%</span>
        <span>USDT ${data.market.usdtSharePct}%</span>
      </div>
      <p class="stable-note">${data.market.gapFmt} 差距 · 領先 ${data.market.leader}</p>
    </div>
    <table class="stable-table">
      <thead><tr><th>幣</th><th>流通</th><th>7日</th><th>30日</th><th></th></tr></thead>
      <tbody>${rows
        .map(
          ([sym, circ, d7, d30, extra]) =>
            `<tr><td><b>${sym}</b></td><td>${circ}</td><td class="${d7.startsWith('+') ? 'up' : d7.startsWith('-') ? 'down' : ''}">${d7}</td><td>${d30}</td><td class="muted">${extra}</td></tr>`,
        )
        .join('')}</tbody>
    </table>
    <div class="stable-chains">
      <div class="num-section-label">USDC 鏈分布（Circle）</div>
      <ul class="stable-chain-list">${(u.topChains || [])
        .map((c) => `<li><b>${c.chain}</b><span>${c.amountFmt} · ${c.sharePct}%</span></li>`)
        .join('')}</ul>
    </div>
    <p class="stable-crcl">CRCL：${data.crcl?.revenueDriver || ''}</p>
  `;
}

export function applyStableBadge(data) {
  const el = document.querySelector('[data-stable-badge="CRCL"]');
  if (!el || !data?.crcl) return;
  el.textContent = `USDC ${data.market.usdcSharePct}%`;
  el.className = 'badge stable';
  el.title = `${data.crcl.usdcCirculatingFmt} · 佔 USDC+USDT ${data.market.usdcSharePct}%`;
}
