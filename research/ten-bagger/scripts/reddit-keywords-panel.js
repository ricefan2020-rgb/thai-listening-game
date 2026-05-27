/**
 * Reddit 熱詞 · 含「突然爆火」
 */
import { surgeReasonLabel } from './lib/reddit-keywords.mjs';

export async function loadRedditKeywords() {
  const el = document.getElementById('reddit-keywords-data');
  if (el?.textContent) {
    try {
      const data = JSON.parse(el.textContent);
      if (data?.keywords) return data;
    } catch {
      /* fall through */
    }
  }
  const res = await fetch('./reddit-keywords.json');
  if (!res.ok) return null;
  return res.json();
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const TYPE_LABEL = { ticker: '代號', phrase: '片語', theme: '主題' };

function chipHtml(k, { surge = false } = {}) {
  const cls =
    k.type === 'ticker' ? 'kw-ticker' : k.type === 'phrase' ? 'kw-phrase' : 'kw-theme';
  const extra = surge ? ' kw-surge' : '';
  const title = surge
    ? `爆火·${surgeReasonLabel(k.surgeReason)} · 現 ${k.score} 前 ${k.prevScore} · ${k.posts} 帖`
    : `${TYPE_LABEL[k.type] || k.type} · 分 ${k.score} · ${k.posts} 帖`;
  const tag = surge
    ? `<span class="kw-surge-tag">${escapeHtml(surgeReasonLabel(k.surgeReason))}</span>`
    : '';
  return `<span class="kw-chip ${cls}${extra}" title="${escapeHtml(title)}">${tag}${escapeHtml(k.term)}</span>`;
}

export function renderRedditKeywords(host, data) {
  if (!host) return;
  if (!data?.keywords?.length) {
    host.innerHTML =
      '<p class="kw-hint">尚無熱詞 · 執行 <code>node scripts/update-reddit-keywords.mjs</code></p>';
    return;
  }

  const surging = data.surging || [];
  const top = data.keywords.slice(0, 20);
  const surgeBlock = surging.length
    ? `<div class="kw-surge-section">
        <div class="kw-surge-head">突然爆火 <small>對照 ${escapeHtml(data.baselineAsOf || '—')}</small></div>
        <div class="kw-chips kw-surge-chips">${surging.map((k) => chipHtml(k, { surge: true })).join('')}</div>
      </div>`
    : `<p class="kw-hint kw-surge-empty">暫無爆火詞 · 多跑幾次腳本會與上一輪比對</p>`;

  host.innerHTML = `
    <div class="kw-meta">${data.postsScanned} 帖 · ${(data.subreddits || []).map((s) => `r/${s}`).slice(0, 3).join(' ')}… · <a href="./reddit-keywords.md">完整</a></div>
    ${surgeBlock}
    <div class="kw-regular-head">熱詞榜</div>
    <div class="kw-chips">${top.map((k) => chipHtml(k)).join('')}</div>`;
}

/** 訊號列：突然爆火 chip */
export function renderKwSurgeStrip(data) {
  const strip = document.getElementById('kw-surge-strip');
  const chips = document.getElementById('kw-surge-chips');
  if (!strip || !chips) return;

  const surging = data?.surging || [];
  if (!surging.length) {
    strip.classList.add('hidden');
    chips.innerHTML = '';
    return;
  }
  strip.classList.remove('hidden');
  chips.innerHTML = surging
    .slice(0, 10)
    .map((k) => {
      const cls = k.type === 'ticker' ? 'ticker' : k.type === 'phrase' ? 'phrase' : 'theme';
      const title = `${surgeReasonLabel(k.surgeReason)} · ${k.score}（前${k.prevScore}）· ${k.posts}帖`;
      return `<button type="button" class="kw-strip-chip ${cls}" data-kw-surge-term="${escapeHtml(k.term)}" title="${escapeHtml(title)}">${escapeHtml(k.term)}</button>`;
    })
    .join('');
}

export function bindKwSurgeUi({ onOpenSentTab }) {
  document.getElementById('kw-surge-chips')?.addEventListener('click', () => {
    onOpenSentTab?.();
  });
  document.getElementById('stat-kw-surge')?.addEventListener('click', () => {
    onOpenSentTab?.();
  });
}
