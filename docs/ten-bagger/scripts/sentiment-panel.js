/**
 * 討論區情緒側欄 · sentiment.json · 自動翻譯
 */
import {
  displayHeadline,
  displaySnippet,
  isAutoTranslateOn,
  translateFields,
} from './translate-client.js';

export async function loadSentiment() {
  const el = document.getElementById('sentiment-data');
  if (el?.textContent) {
    try {
      const data = JSON.parse(el.textContent);
      if (data?.items) return data;
    } catch {
      /* fall through */
    }
  }
  const res = await fetch('./sentiment.json');
  if (!res.ok) throw new Error('sentiment.json 載入失敗');
  const data = await res.json();
  if (el) el.textContent = JSON.stringify(data);
  return data;
}

const MOOD_CLASS = {
  bullish: 'positive',
  bearish: 'down',
  neutral: 'neutral',
};

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function itemHtml(p) {
  const tickers = (p.tickers || []).join(',');
  const href = p.url ? `href="${escapeHtml(p.url)}" target="_blank" rel="noopener"` : '';
  const sent = p.sentiment || 'neutral';
  const { zh: head, en: headEn } = displayHeadline(p);
  const { zh: snip, en: snipEn } = displaySnippet(p);
  const meta = [
    p.subreddit ? `r/${p.subreddit}` : '',
    p.score != null ? `↑${p.score}` : '',
    p.comments ? `💬${p.comments}` : '',
    p.translated ? '譯' : '',
  ]
    .filter(Boolean)
    .join(' · ');
  return `<li data-post-id="${escapeHtml(p.id || '')}">
    <a ${href}>
      <div class="news-meta">
        <span class="news-dot ${sent === 'bullish' ? 'positive' : sent === 'bearish' ? 'down' : 'neutral'}"></span>
        <b>${tickers}</b>
        <time>${(p.date || '').slice(5)}</time>
      </div>
      <div class="news-head" data-field="title">${escapeHtml(head)}</div>
      ${headEn ? `<div class="news-en">${escapeHtml(headEn)}</div>` : ''}
      ${snip ? `<div class="news-detail" data-field="snippet">${escapeHtml(snip)}</div>` : ''}
      ${snipEn ? `<div class="news-en">${escapeHtml(snipEn)}</div>` : ''}
      ${meta ? `<div class="news-detail sent-meta">${escapeHtml(meta)}</div>` : ''}
    </a>
  </li>`;
}

export function renderSentimentSummary(host, tickers, activeTicker) {
  if (!host || !tickers) return;
  const keys = Object.keys(tickers).sort();
  host.innerHTML = keys
    .map((t) => {
      const s = tickers[t];
      const active = t === activeTicker ? ' active' : '';
      const cls = MOOD_CLASS[s.mood] || 'neutral';
      return `<button type="button" class="sent-chip${active}" data-sent-ticker="${t}" title="${s.posts} 帖 · 多${s.bullish} 空${s.bearish}">
        <span class="sent-dot ${cls}"></span>
        <b>${t}</b>
        <span class="sent-label">${s.label}</span>
      </button>`;
    })
    .join('');
}

export function renderSentimentList(host, items, filterTicker, asOf, data) {
  if (!host) return;
  const asOfEl = document.getElementById('sent-as-of');
  const modeEl = document.getElementById('sent-translate-mode');
  if (asOfEl) asOfEl.textContent = asOf || '—';
  if (modeEl) {
    modeEl.textContent = data?.translateMode
      ? `自動翻譯·${data.translateMode}`
      : isAutoTranslateOn()
        ? '自動翻譯·開'
        : '';
  }

  let list = items || [];
  if (filterTicker) list = list.filter((i) => (i.tickers || []).includes(filterTicker));

  if (!list.length) {
    host.innerHTML = `<li><span class="news-detail">無討論帖 · 請執行 update-sentiment.mjs</span></li>`;
    return list;
  }

  host.innerHTML = list.slice(0, 14).map((p) => itemHtml(p)).join('');
  return list.slice(0, 14);
}

/** 瀏覽器即時補翻譯尚未有 titleZh 的帖 */
export async function hydrateSentimentTranslations(host, items) {
  if (!host || !isAutoTranslateOn() || !items?.length) return;

  for (let i = 0; i < items.length; i++) {
    const p = items[i];
    const id = (p.id || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const li = host.querySelector(`[data-post-id="${id}"]`);
    if (!li) continue;
    if (p.titleZh && p.titleZh !== p.title) continue;

    const updated = await translateFields(p, ['title', 'snippet']);
    items[i] = updated;
    const tmp = document.createElement('div');
    tmp.innerHTML = itemHtml(updated);
    const fresh = tmp.firstElementChild;
    if (fresh) li.replaceWith(fresh);
  }
}

export function applySentimentBadges(tickers) {
  if (!tickers) return;
  document.querySelectorAll('[data-sent-badge]').forEach((el) => {
    const t = el.dataset.sentBadge;
    const s = tickers[t];
    if (!s || !s.posts) {
      el.textContent = '';
      el.className = 'badge sent neutral';
      return;
    }
    el.textContent = s.label;
    el.className = `badge sent ${s.mood}`;
    el.title = `Reddit ${s.posts} 帖 · 偏多 ${s.bullish} · 偏空 ${s.bearish}`;
  });
}

export function renderSentimentHeader(tickers) {
  const el = document.getElementById('stat-sent');
  if (!el || !tickers) return;
  const bull = Object.values(tickers).filter((s) => s.mood === 'bullish').length;
  const bear = Object.values(tickers).filter((s) => s.mood === 'bearish').length;
  const posts = Object.values(tickers).reduce((n, s) => n + (s.posts || 0), 0);
  if (!posts) {
    el.textContent = '討論 —';
    return;
  }
  el.textContent = bull || bear ? `討論 ↑${bull} ↓${bear}` : `討論 ${posts}帖`;
  el.title = `Reddit · ${posts} 帖 · 偏多 ${bull} · 偏空 ${bear}`;
}

export function renderRedditStrip(data) {
  const strip = document.getElementById('reddit-strip');
  const chips = document.getElementById('reddit-chips');
  if (!strip || !chips) return;

  const items = (data?.items || []).filter((p) => {
    const d = new Date(`${p.date}T12:00:00`);
    const days = (Date.now() - d) / 86400000;
    return days <= 14;
  });

  if (!items.length) {
    strip.classList.add('hidden');
    return;
  }

  strip.classList.remove('hidden');
  chips.innerHTML = items
    .slice(0, 8)
    .map((p) => {
      const t = (p.tickers || [])[0] || '?';
      const mood = p.sentiment === 'bullish' ? '↑' : p.sentiment === 'bearish' ? '↓' : '·';
      const label = p.titleZh || p.title || '';
      return `<a class="reddit-chip" href="${p.url}" target="_blank" rel="noopener" title="${escapeHtml(label)}">${t} ${mood}${p.score}</a>`;
    })
    .join('');
}
