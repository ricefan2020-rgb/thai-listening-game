/**
 * 重要數據日 · calendar.json
 */

const KIND_LABEL = {
  holiday: '休市',
  early: '早收',
  macro: '宏觀',
  earnings: '財報',
  opex: '期權結算',
  vix: 'VIX到期',
};

const KIND_CLASS = {
  holiday: 'cal-holiday',
  early: 'cal-early',
  macro: 'cal-macro',
  earnings: 'cal-earn',
  opex: 'cal-opex',
  vix: 'cal-vix',
};

export async function loadCalendar() {
  const el = document.getElementById('calendar-data');
  if (el?.textContent) {
    try {
      const data = JSON.parse(el.textContent);
      if (data?.items) return data;
    } catch {
      /* fall through */
    }
  }
  const res = await fetch('./calendar.json');
  if (!res.ok) throw new Error('calendar.json 載入失敗');
  const data = await res.json();
  if (el) el.textContent = JSON.stringify(data);
  return data;
}

function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function daysUntil(dateStr) {
  const a = new Date(`${dateStr}T12:00:00`);
  const b = new Date(`${todayStr()}T12:00:00`);
  return Math.round((a - b) / 86400000);
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function upcomingItems(data, days = 45, ticker = null) {
  const now = todayStr();
  let list = (data?.items || []).filter((e) => e.date >= now);
  if (ticker) {
    list = list.filter(
      (e) =>
        e.kind === 'holiday' ||
        e.kind === 'early' ||
        !e.tickers?.length ||
        e.tickers.includes(ticker),
    );
  }
  list.sort((a, b) => a.date.localeCompare(b.date));
  return list.slice(0, days);
}

export function nextEvent(data) {
  const list = upcomingItems(data, 1);
  return list[0] || null;
}

export function renderCalendarList(host, data, options = {}) {
  const { ticker = null, limit = 16 } = options;
  const asOfEl = document.getElementById('cal-as-of');
  if (asOfEl) asOfEl.textContent = data?.asOf || '—';

  if (!host) return;
  const list = upcomingItems(data, limit, ticker);

  if (!list.length) {
    host.innerHTML = `<li><span class="news-detail">未來 ${limit} 日內無項目</span></li>`;
    return;
  }

  host.innerHTML = list
    .map((e) => {
      const d = daysUntil(e.date);
      const dLabel =
        d === 0 ? '今日' : d === 1 ? '明日' : d < 0 ? '' : `${d}日後`;
      const tickers = (e.tickers || []).join(',');
      const kind = KIND_LABEL[e.kind] || e.kind;
      const kCls = KIND_CLASS[e.kind] || 'cal-macro';
      const time = e.time ? ` ${e.time}` : '';
      return `<li class="cal-item ${d <= 2 ? 'cal-soon' : ''}">
        <div class="news-meta">
          <span class="cal-kind ${kCls}">${kind}</span>
          ${tickers ? `<b>${tickers}</b>` : '<b>全市場</b>'}
          <time>${e.date.slice(5)}${time}</time>
          ${dLabel ? `<span class="cal-countdown">${dLabel}</span>` : ''}
        </div>
        <div class="news-head">${escapeHtml(e.title)}</div>
        ${e.detail ? `<div class="news-detail">${escapeHtml(e.detail)}</div>` : ''}
      </li>`;
    })
    .join('');
}

export function renderEarningsFocus(host, data) {
  if (!host || !data?.earningsFocus) return;
  host.innerHTML = data.earningsFocus
    .map(
      (e) =>
        `<div><b>${e.ticker}</b><span>${e.period} · ${e.window} · ${e.focus}</span></div>`,
    )
    .join('');
}

export function renderNextCalPill(data) {
  const el = document.getElementById('stat-cal');
  if (!el) return;
  const n = nextEvent(data);
  if (!n) {
    el.textContent = '數據 —';
    el.title = '';
    return;
  }
  const d = daysUntil(n.date);
  const when = d === 0 ? '今日' : d === 1 ? '明日' : `${d}日`;
  const kind = KIND_LABEL[n.kind] || '';
  el.textContent = `${when} ${kind}`;
  el.title = `${n.date} ${n.title}${n.detail ? ' · ' + n.detail : ''}`;
}

export function renderCalStrip(data) {
  const strip = document.getElementById('cal-strip');
  const chips = document.getElementById('cal-chips');
  if (!strip || !chips) return;

  const soon = upcomingItems(data, 5).filter((e) => daysUntil(e.date) <= 14);
  if (!soon.length) {
    strip.classList.add('hidden');
    return;
  }
  strip.classList.remove('hidden');
  chips.innerHTML = soon
    .map((e) => {
      const d = daysUntil(e.date);
      const when = d === 0 ? '今日' : d === 1 ? '明日' : e.date.slice(5);
      const kind = KIND_LABEL[e.kind] || '';
      return `<button type="button" class="cal-chip" data-cal-date="${e.date}" title="${escapeHtml(e.title)}">${when} ${kind} ${e.tickers?.[0] || ''}</button>`;
    })
    .join('');
}
