/**
 * 期權籌碼 · options.json
 */
export async function loadOptions() {
  const el = document.getElementById('options-data');
  if (el?.textContent) {
    try {
      const data = JSON.parse(el.textContent);
      if (data?.tickers) return data;
    } catch {
      /* fall through */
    }
  }
  const res = await fetch('./options.json');
  if (!res.ok) throw new Error('options.json 載入失敗');
  return res.json();
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function daysUntil(dateStr) {
  const a = new Date(`${dateStr}T12:00:00`);
  const b = new Date(`${todayStr()}T12:00:00`);
  return Math.round((a - b) / 86400000);
}

const OUTLOOK_CLASS = {
  bullish: 'positive',
  lean_bull: 'positive',
  neutral: 'neutral',
  lean_bear: 'down',
  bearish: 'down',
};

export function renderOptionsSummary(host, data, activeTicker) {
  if (!host || !data?.tickers) return;
  const keys = Object.keys(data.tickers).filter((t) => data.tickers[t]?.available);
  host.innerHTML = keys
    .map((t) => {
      const x = data.tickers[t];
      const active = t === activeTicker ? ' active' : '';
      const cls = OUTLOOK_CLASS[x.outlook] || 'neutral';
      return `<button type="button" class="opt-chip${active}" data-opt-ticker="${t}" title="${escapeHtml(x.outlookNote || '')}">
        <span class="sent-dot ${cls}"></span>
        <b>${t}</b>
        <span class="sent-label">${x.outlookLabel}</span>
      </button>`;
    })
    .join('');
}

export function renderOptionsDetail(host, ticker, data) {
  if (!host) return;
  const x = data?.tickers?.[ticker];
  if (!x?.available) {
    const hint =
      data?.opend == null && data?.source?.includes('Yahoo')
        ? `${ticker}：無期權 · 可啟動 OpenD 後執行 update-options.mjs`
        : `${ticker}：無期權鏈或流動性不足`;
    host.innerHTML = `<p class="kw-hint">${hint}</p>`;
    return;
  }
  const mp =
    x.maxPain != null && x.spot != null
      ? `$${x.maxPain} (${x.maxPainVsSpotPct > 0 ? '+' : ''}${x.maxPainVsSpotPct}%)`
      : '—';
  const via = x.dataVia === 'opend' ? 'OpenD' : x.dataVia === 'yahoo' ? 'Yahoo' : '—';
  host.innerHTML = `
    <div class="kw-meta">來源 <b>${escapeHtml(via)}</b>${x.futuCode ? ` · ${escapeHtml(x.futuCode)}` : ''}</div>
    <div class="opt-detail-grid">
      <div><span>現價</span><b>$${x.spot ?? '—'}</b></div>
      <div><span>分析到期</span><b>${x.expiry}</b> <small>${x.dte}d</small></div>
      <div><span>P/C (OI)</span><b>${x.pcRatioOi ?? '—'}</b></div>
      <div><span>P/C (量)</span><b>${x.pcRatioVol ?? '—'}</b></div>
      <div><span>Max Pain</span><b>${mp}</b></div>
      <div><span>IV偏斜</span><b>${x.ivSkew != null ? x.ivSkew : '—'}</b></div>
    </div>
    <p class="opt-note">${escapeHtml(x.outlookNote || '')}</p>
    <p class="opt-disclaimer">${escapeHtml(x.disclaimer || data.note || '')}</p>
    ${
      x.topCalls?.length
        ? `<div class="opt-oi-row"><span>Call OI</span>${x.topCalls.map((c) => `<code>${c.strike}×${c.oi}</code>`).join(' ')}</div>`
        : ''
    }
    ${
      x.topPuts?.length
        ? `<div class="opt-oi-row"><span>Put OI</span>${x.topPuts.map((c) => `<code>${c.strike}×${c.oi}</code>`).join(' ')}</div>`
        : ''
    }`;
}

export function renderOpexList(host, data, ticker = null) {
  if (!host) return;
  const market = (data?.marketExpiries || []).map((e) => ({ ...e, scope: 'market' }));
  let tickerItems = [];
  if (ticker && data?.tickers?.[ticker]?.expiries) {
    tickerItems = data.tickers[ticker].expiries.map((e) => ({
      date: e.date,
      kind: 'opex',
      title: `${ticker} 到期`,
      detail: `DTE ${e.dte} · OI≈${e.oi}`,
      impact: e.dte <= 7 ? 'high' : 'medium',
    }));
  }
  const list = [...tickerItems, ...market]
    .filter((e) => e.date >= todayStr())
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 12);

  if (!list.length) {
    host.innerHTML = '<li><span class="news-detail">無近期結算日</span></li>';
    return;
  }

  host.innerHTML = list
    .map((e) => {
      const d = daysUntil(e.date);
      const when = d === 0 ? '今日' : d === 1 ? '明日' : `${d}日後`;
      const quad = e.opexType === 'quad' ? '四重' : e.kind === 'vix' ? 'VIX' : e.scope === 'market' ? '市場' : e.title?.split(' ')[0] || '';
      return `<li class="cal-item ${d <= 3 ? 'cal-soon' : ''}">
        <div class="news-meta">
          <span class="cal-kind cal-opex">結算</span>
          <b>${quad}</b>
          <time>${e.date.slice(5)}</time>
          <span class="cal-countdown">${when}</span>
        </div>
        <div class="news-head">${escapeHtml(e.title)}</div>
        ${e.detail ? `<div class="news-detail">${escapeHtml(e.detail)}</div>` : ''}
      </li>`;
    })
    .join('');
}

/** 頂部 pill：資料源 + 當前股下一個到期 */
export function renderOptionsHeaderPill(data, ticker = null) {
  const el = document.getElementById('stat-opt');
  if (!el) return;
  const src = data?.source?.includes('OpenD') ? 'OpenD' : 'Yahoo';
  let extra = src;
  if (ticker && data?.tickers?.[ticker]?.available) {
    const x = data.tickers[ticker];
    extra = `${x.outlookLabel}·${x.dte}d`;
    el.title = x.outlookNote || '';
  } else {
    const next = (data?.marketExpiries || []).find((e) => e.date >= todayStr());
    if (next) {
      const d = daysUntil(next.date);
      const when = d === 0 ? '今日' : d === 1 ? '明日' : `${d}日`;
      extra = `${when} ${next.title?.slice(0, 6) || '結算'}`;
      el.title = `${next.date} ${next.detail || ''}`;
    }
  }
  el.textContent = `期權 ${extra}`;
  el.className = `pill opt ${ticker && data?.tickers?.[ticker] ? OUTLOOK_CLASS[data.tickers[ticker].outlook] || 'neutral' : ''}`;
}

/** K 線區：當前標的期權摘要 */
export function renderOptionsChartBar(host, ticker, data) {
  if (!host) return;
  const x = data?.tickers?.[ticker];
  if (!x?.available) {
    host.classList.add('hidden');
    host.innerHTML = '';
    return;
  }
  host.classList.remove('hidden');
  const via = x.dataVia === 'opend' ? 'OpenD' : 'Yahoo';
  const mp =
    x.maxPain != null ? `MP $${x.maxPain}` : '';
  host.innerHTML = `<span class="opt-chart-label">期權</span>
    <span class="opt-chart-via">${via}</span>
    <span class="opt-chart-outlook ${OUTLOOK_CLASS[x.outlook] || 'neutral'}">${x.outlookLabel}</span>
    <span>P/C ${x.pcRatioOi ?? '—'}</span>
    ${mp ? `<span>${mp}</span>` : ''}
    <span>到期 ${x.expiry?.slice(5) || '—'} (${x.dte}d)</span>
    <button type="button" class="opt-chart-more" data-goto-opt-tab>詳情</button>`;
  host.title = x.outlookNote || '';
}

/** 訊號列：籌碼偏多/偏空標的 + 近月結算 */
export function renderOptionsStrip(data, activeTicker = null) {
  const strip = document.getElementById('opt-strip');
  const chips = document.getElementById('opt-chips');
  if (!strip || !chips || !data) return;

  const items = [];
  for (const [t, x] of Object.entries(data.tickers || {})) {
    if (!x?.available) continue;
    items.push({ t, x, score: Math.abs((x.pcRatioOi ?? 1) - 1) });
  }
  items.sort((a, b) => b.score - a.score);

  const opex = (data.marketExpiries || [])
    .filter((e) => e.date >= todayStr())
    .slice(0, 2);

  if (!items.length && !opex.length) {
    strip.classList.add('hidden');
    return;
  }
  strip.classList.remove('hidden');

  const chipHtml = [
    ...items.slice(0, 8).map(({ t, x }) => {
      const cls = OUTLOOK_CLASS[x.outlook] || 'neutral';
      const active = t === activeTicker ? ' active' : '';
      return `<button type="button" class="opt-strip-chip ${cls}${active}" data-opt-strip-ticker="${t}" title="${escapeHtml(x.outlookNote || '')}">${t} ${x.outlookLabel}</button>`;
    }),
    ...opex.map((e) => {
      const d = daysUntil(e.date);
      const when = d === 0 ? '今日' : e.date.slice(5);
      const label = e.opexType === 'quad' ? '四重' : e.kind === 'vix' ? 'VIX' : '月選';
      return `<button type="button" class="opt-strip-chip opex" data-goto-cal-date="${e.date}" title="${escapeHtml(e.title)}">${when} ${label}</button>`;
    }),
  ].join('');

  chips.innerHTML = chipHtml;
}

export function bindOptionsUi(handlers) {
  const { onTicker, onOpenTab, onCalDate } = handlers;

  document.getElementById('opt-chips')?.addEventListener('click', (e) => {
    const t = e.target.closest('[data-opt-strip-ticker]');
    if (t) {
      onTicker?.(t.dataset.optStripTicker);
      return;
    }
    const cal = e.target.closest('[data-goto-cal-date]');
    if (cal) onCalDate?.(cal.dataset.gotoCalDate);
  });

  document.getElementById('opt-chart-bar')?.addEventListener('click', (e) => {
    if (e.target.closest('[data-goto-opt-tab]')) onOpenTab?.();
  });

  document.getElementById('stat-opt')?.addEventListener('click', () => onOpenTab?.());
}

export function applyOptionsBadges(data) {
  if (!data?.tickers) return;
  document.querySelectorAll('[data-opt-badge]').forEach((el) => {
    const t = el.dataset.optBadge;
    const x = data.tickers[t];
    if (!x?.available) {
      el.textContent = '期權 —';
      el.className = 'badge opt neutral';
      return;
    }
    const cls = OUTLOOK_CLASS[x.outlook] || 'neutral';
    el.textContent = x.outlookLabel;
    el.className = `badge opt ${cls}`;
    el.title = x.outlookNote || '';
  });
}
