/**
 * 綜合報導 + 外部新聞 · news-digest.json · 自動翻譯
 */
import { displayHeadline, isAutoTranslateOn, translateFields } from './translate-client.js';

export async function loadNewsDigest() {
  const el = document.getElementById('news-digest-data');
  if (el?.textContent) {
    try {
      const data = JSON.parse(el.textContent);
      if (data?.feed != null || data?.marketBrief) return data;
    } catch {
      /* fall through */
    }
  }
  const res = await fetch('./news-digest.json');
  if (!res.ok) throw new Error('news-digest.json 載入失敗');
  const data = await res.json();
  if (el) el.textContent = JSON.stringify(data);
  return data;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderDigestSummary(host, data) {
  if (!host || !data) return;
  const mode = data.translateMode ? `翻譯·${data.translateMode}` : '';
  host.innerHTML = `
    <div class="digest-market">${escapeHtml(data.marketBrief || '')}</div>
    <div class="digest-meta">${data.feed?.length || 0} 則外部 · ${data.curatedCount || 0} 則精選 · ${mode}</div>
  `;
}

export function renderDigestChips(host, tickers, activeTicker) {
  if (!host || !tickers) return;
  const keys = Object.keys(tickers).filter((t) => tickers[t].count > 0).sort();
  if (!keys.length) {
    host.innerHTML = '';
    return;
  }
  host.innerHTML = keys
    .map((t) => {
      const b = tickers[t];
      const active = t === activeTicker ? ' active' : '';
      const cls = b.sentiment === 'positive' ? 'positive' : b.sentiment === 'down' ? 'down' : 'neutral';
      return `<button type="button" class="digest-chip${active}" data-digest-ticker="${t}">
        <span class="news-dot ${cls}"></span><b>${t}</b><span>${b.count}則</span>
      </button>`;
    })
    .join('');
}

export function renderDigestTickerBrief(host, ticker, tickers) {
  if (!host) return;
  const b = tickers?.[ticker];
  if (!b?.brief) {
    host.classList.add('hidden');
    return;
  }
  host.classList.remove('hidden');
  host.textContent = b.brief;
}

export function renderFeedList(host, items, filterTicker, showCuratedOnly, showExternalOnly) {
  if (!host) return;
  let list = items || [];
  if (filterTicker) list = list.filter((i) => (i.tickers || []).includes(filterTicker));
  if (showCuratedOnly) list = list.filter((i) => i.sourceType === 'curated');
  if (showExternalOnly) list = list.filter((i) => i.sourceType === 'external');

  if (!list.length) {
    host.innerHTML = `<li><span class="news-detail">無條目 · 執行 update-news-feed.mjs</span></li>`;
    return;
  }

  host.innerHTML = list
    .slice(0, 16)
    .map((n, idx) => feedItemHtml(n, idx))
    .join('');
  return list.slice(0, 16);
}

function feedItemHtml(n, idx) {
  const tickers = (n.tickers || []).join(',');
  const href = n.url ? `href="${escapeHtml(n.url)}" target="_blank" rel="noopener"` : '';
  const ext = n.sourceType === 'external';
  const srcBadge = ext
    ? `<span class="news-src external">${escapeHtml(n.source || '外部')}</span>`
    : `<span class="news-src curated">精選</span>`;
  const { zh: head, en: headEn } = displayHeadline({
    title: n.headline,
    titleZh: n.headline,
    titleEn: n.headlineEn,
    headline: n.headline,
    headlineEn: n.headlineEn,
  });
  const sub = headEn ? `<div class="news-en">${escapeHtml(headEn)}</div>` : '';
  return `<li data-feed-idx="${idx}"><a ${href}>
    <div class="news-meta">
      <span class="news-dot ${n.sentiment || 'neutral'}"></span>
      <b>${tickers}</b>
      ${srcBadge}
      <time>${(n.date || '').slice(5)}</time>
    </div>
    <div class="news-head">${escapeHtml(head)}</div>
    ${sub}
    ${n.detail ? `<div class="news-detail">${escapeHtml(n.detail)}</div>` : ''}
  </a></li>`;
}

export async function hydrateFeedTranslations(host, items) {
  if (!host || !isAutoTranslateOn() || !items?.length) return;
  for (let i = 0; i < items.length; i++) {
    const n = items[i];
    if (n.translated || n.sourceType === 'curated') continue;
    const en = n.headlineEn || n.headline;
    if (!en) continue;
    const updated = await translateFields(
      { title: en, headline: n.headline, headlineEn: en },
      ['title'],
    );
    n.headline = updated.titleZh;
    n.headlineEn = updated.titleEn;
    n.translated = updated.translated;
    const li = host.querySelector(`[data-feed-idx="${i}"]`);
    if (li) {
      const tmp = document.createElement('div');
      tmp.innerHTML = feedItemHtml(n, i);
      li.replaceWith(tmp.firstElementChild);
    }
  }
}

export function mergeNewsLists(digest, curatedItems) {
  const curated = (curatedItems || []).map((i) => ({
    ...i,
    sourceType: 'curated',
    source: i.source || '研究筆記',
  }));
  const feed = digest?.feed || [];
  const seen = new Set();
  const out = [];
  for (const item of [...curated, ...feed]) {
    const key = item.url || `${item.headline}|${item.date}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}
