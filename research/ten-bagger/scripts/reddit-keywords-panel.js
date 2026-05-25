/**
 * Reddit 熱詞區塊 · reddit-keywords.json
 */
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

export function renderRedditKeywords(host, data) {
  if (!host || !data?.keywords?.length) {
    if (host) {
      host.innerHTML =
        '<p class="kw-hint">尚無熱詞 · 執行 <code>node scripts/update-reddit-keywords.mjs</code></p>';
    }
    return;
  }
  const top = data.keywords.slice(0, 24);
  host.innerHTML = `
    <div class="kw-meta">${data.postsScanned} 帖 · ${(data.subreddits || []).map((s) => `r/${s}`).slice(0, 3).join(' ')}… · <a href="./reddit-keywords.md">完整</a></div>
    <div class="kw-chips">${top
      .map((k) => {
        const cls = k.type === 'ticker' ? 'kw-ticker' : k.type === 'phrase' ? 'kw-phrase' : 'kw-theme';
        const title = `${TYPE_LABEL[k.type] || k.type} · 分 ${k.score} · ${k.posts} 帖`;
        return `<span class="kw-chip ${cls}" title="${escapeHtml(title)}">${escapeHtml(k.term)}</span>`;
      })
      .join('')}</div>`;
}
