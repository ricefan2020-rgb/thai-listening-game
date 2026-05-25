/**
 * 瀏覽器 JSONP 載入 Stocktwits
 */
const ST_API = 'https://api.stocktwits.com/api/2/streams/symbol';
const SYMBOL_MAP = { SIVE: 'SIVEF' };

export function stocktwitsSymbol(ticker) {
  return SYMBOL_MAP[ticker] || ticker;
}

function sentimentFromMessage(msg) {
  const basic = msg?.entities?.sentiment?.basic;
  if (basic === 'Bullish') return 'bullish';
  if (basic === 'Bearish') return 'bearish';
  return 'neutral';
}

export function messageToItem(ticker, msg) {
  const created = msg.created_at ? new Date(msg.created_at) : new Date();
  const body = (msg.body || '').replace(/\s+/g, ' ').trim();
  const sym = stocktwitsSymbol(ticker);
  const url =
    msg?.links?.[0]?.url ||
    (msg.id ? `https://stocktwits.com/symbol/${sym}/message/${msg.id}` : `https://stocktwits.com/symbol/${sym}`);

  return {
    id: `st-${msg.id}`,
    date: created.toISOString().slice(0, 10),
    tickers: [ticker],
    source: 'stocktwits',
    channel: 'stocktwits',
    title: body.slice(0, 280) || '(無文字)',
    snippet: null,
    sentiment: sentimentFromMessage(msg),
    score: msg?.likes?.total ?? 0,
    comments: msg?.conversation?.replies ?? 0,
    url,
    stSentiment: msg?.entities?.sentiment?.basic || null,
  };
}

export function fetchSymbolJsonp(symbol) {
  return new Promise((resolve, reject) => {
    const cb = `stcb_${Date.now()}`;
    const script = document.createElement('script');
    const t = window.setTimeout(() => {
      cleanup();
      reject(new Error('timeout'));
    }, 15000);
    window[cb] = (data) => {
      window.clearTimeout(t);
      cleanup();
      resolve(data);
    };
    function cleanup() {
      delete window[cb];
      script.remove();
    }
    script.onerror = () => {
      window.clearTimeout(t);
      cleanup();
      reject(new Error('load error'));
    };
    script.src = `${ST_API}/${encodeURIComponent(symbol)}.json?callback=${cb}&limit=30`;
    document.head.appendChild(script);
  });
}

export async function hydrateStocktwitsFromBrowser(tickers) {
  const items = [];
  const seen = new Set();
  for (const ticker of tickers) {
    try {
      const data = await fetchSymbolJsonp(stocktwitsSymbol(ticker));
      for (const msg of data?.messages || []) {
        if (!msg?.id || seen.has(msg.id)) continue;
        seen.add(msg.id);
        items.push(messageToItem(ticker, msg));
      }
    } catch {
      /* skip */
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  return items;
}
