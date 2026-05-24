/**
 * 簡易 RSS 2.0 解析（零依賴）
 */

function decodeEntities(s) {
  return String(s || '')
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]+>/g, '')
    .trim();
}

function pickTag(block, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i');
  const m = block.match(re);
  return m ? decodeEntities(m[1]) : '';
}

export function parseRss(xml) {
  const items = [];
  const re = /<item>([\s\S]*?)<\/item>/gi;
  let m;
  while ((m = re.exec(xml))) {
    const block = m[1];
    const title = pickTag(block, 'title');
    const link = pickTag(block, 'link');
    const pubDate = pickTag(block, 'pubDate');
    const description = pickTag(block, 'description');
    if (!title) continue;
    items.push({ title, link, pubDate, description });
  }
  return items;
}

export function splitGoogleTitle(title) {
  const parts = title.split(' - ');
  if (parts.length < 2) return { headline: title, publisher: '' };
  const publisher = parts.pop();
  return { headline: parts.join(' - ').trim(), publisher };
}

export function pubDateToIso(pubDate) {
  if (!pubDate) return new Date().toISOString().slice(0, 10);
  const d = new Date(pubDate);
  if (Number.isNaN(d.getTime())) return new Date().toISOString().slice(0, 10);
  return d.toISOString().slice(0, 10);
}
