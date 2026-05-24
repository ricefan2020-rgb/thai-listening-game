/**
 * 英→繁中翻譯 · MyMemory（免 key）或 OpenAI（可選）
 */

const cache = new Map();
const UA = 'ten-bagger-translate/1.0';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function hasCjk(s) {
  return /[\u4e00-\u9fff]/.test(s);
}

async function myMemory(text, target = 'zh-TW') {
  const q = encodeURIComponent(text.slice(0, 450));
  const url = `https://api.mymemory.translated.net/get?q=${q}&langpair=en|${target}`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`MyMemory HTTP ${res.status}`);
  const j = await res.json();
  const out = j.responseData?.translatedText;
  if (!out || out === text) throw new Error('empty translation');
  return out;
}

async function openAiTranslate(text) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('no OPENAI_API_KEY');
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.2,
      messages: [
        {
          role: 'system',
          content:
            'Translate financial news headlines to Traditional Chinese (Taiwan). Keep tickers, $ amounts, percentages. Output translation only.',
        },
        { role: 'user', content: text },
      ],
    }),
  });
  if (!res.ok) throw new Error(`OpenAI HTTP ${res.status}`);
  const j = await res.json();
  return j.choices?.[0]?.message?.content?.trim() || text;
}

export async function translateToZh(text, { delayMs = 350 } = {}) {
  const raw = String(text || '').trim();
  if (!raw || hasCjk(raw)) return { zh: raw, en: raw, translated: false };

  if (cache.has(raw)) return cache.get(raw);

  let zh = raw;
  let translated = false;
  const mode = process.env.TRANSLATE_MODE || 'auto';

  try {
    if (mode === 'off') {
      /* keep English */
    } else if (mode === 'openai' || (mode === 'auto' && process.env.OPENAI_API_KEY)) {
      zh = await openAiTranslate(raw);
      translated = true;
    } else {
      await sleep(delayMs);
      zh = await myMemory(raw);
      translated = true;
    }
  } catch (e) {
    console.warn('translate skip:', raw.slice(0, 50), e.message);
  }

  const result = { zh, en: raw, translated };
  cache.set(raw, result);
  return result;
}
