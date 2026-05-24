/**
 * 瀏覽器端英→繁中（MyMemory）· localStorage 快取
 */

const CACHE_KEY = 'ten-bagger-zh-v1';

export function hasCjk(s) {
  return /[\u4e00-\u9fff]/.test(s);
}

function loadCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveCache(cache) {
  try {
    const keys = Object.keys(cache);
    if (keys.length > 400) {
      for (const k of keys.slice(0, keys.length - 300)) delete cache[k];
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    /* quota */
  }
}

export function isAutoTranslateOn() {
  const el = document.getElementById('auto-translate');
  if (!el) return true;
  return el.checked;
}

export async function translateEnToZh(text) {
  const raw = String(text || '').trim();
  if (!raw || hasCjk(raw)) {
    return { zh: raw, en: raw, translated: false };
  }

  const cache = loadCache();
  if (cache[raw]) return cache[raw];

  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(raw.slice(0, 450))}&langpair=en|zh-TW`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`translate HTTP ${res.status}`);
  const j = await res.json();
  let zh = j.responseData?.translatedText || raw;
  if (zh.toUpperCase() === raw.toUpperCase()) {
    zh = raw;
  }
  const result = { zh, en: raw, translated: zh !== raw };
  cache[raw] = result;
  saveCache(cache);
  return result;
}

export async function translateFields(item, fields = ['title', 'snippet']) {
  const out = { ...item };
  for (const f of fields) {
    const raw = item[f];
    if (!raw) continue;
    const keyZh = `${f}Zh`;
    if (item[keyZh] && hasCjk(item[keyZh])) {
      out[keyZh] = item[keyZh];
      out[`${f}En`] = item[`${f}En`] || raw;
      continue;
    }
    if (!isAutoTranslateOn()) {
      out[keyZh] = raw;
      out[`${f}En`] = raw;
      continue;
    }
    try {
      const t = await translateEnToZh(raw);
      out[keyZh] = t.zh;
      out[`${f}En`] = t.en;
      out.translated = out.translated || t.translated;
      await new Promise((r) => setTimeout(r, 280));
    } catch {
      out[keyZh] = raw;
      out[`${f}En`] = raw;
    }
  }
  return out;
}

export function displayHeadline(item) {
  const zh = item.titleZh || item.headlineZh || item.headline || item.title;
  const en = item.titleEn || item.headlineEn;
  const showEn = en && en !== zh && !hasCjk(en);
  return { zh, en: showEn ? en : null };
}

export function displaySnippet(item) {
  const zh = item.snippetZh || item.snippet;
  const en = item.snippetEn;
  const showEn = en && en !== zh && !hasCjk(en);
  return { zh, en: showEn ? en : null };
}
