/**
 * 規則式綜合報導（繁中）
 */

const THEME_RULES = [
  { re: /\b(earnings|revenue|eps|guidance|quarter|results|beat|miss)\b/i, label: '財報/指引' },
  { re: /\b(upgrade|downgrade|rating|target price|analyst|buy|sell|hold)\b/i, label: '評級' },
  { re: /\b(ai|artificial intelligence|gpu|data center|chip|semiconductor)\b/i, label: 'AI/晶片' },
  { re: /\b(stablecoin|usdc|usdt|crypto|bitcoin)\b/i, label: '加密/穩定幣' },
  { re: /\b(fed|rate|inflation|cpi|treasury|yield)\b/i, label: '宏觀利率' },
  { re: /\b(merger|acquisition|deal|partnership)\b/i, label: '併購/合作' },
  { re: /\b(lawsuit|sec|probe|investigation|regulat)\b/i, label: '監管/法律' },
  { re: /\b(share repurchase|buyback|dividend)\b/i, label: '回購/股息' },
];

const POS_RE =
  /\b(surge|rally|beat|upgrade|record|soar|jump|bullish|buy|outperform|strong)\b/i;
const NEG_RE =
  /\b(fall|drop|plunge|miss|downgrade|cut|bearish|sell|underperform|weak|crash)\b/i;

export function classifySentiment(text) {
  const t = String(text || '');
  const p = (t.match(POS_RE) || []).length;
  const n = (t.match(NEG_RE) || []).length;
  if (p > n + 1) return 'positive';
  if (n > p + 1) return 'down';
  if (p > 0 && n > 0) return 'mixed';
  return 'neutral';
}

export function extractThemes(texts) {
  const found = new Set();
  for (const text of texts) {
    for (const rule of THEME_RULES) {
      if (rule.re.test(text)) found.add(rule.label);
    }
  }
  return [...found].slice(0, 5);
}

export function synthesizeTickerBrief(ticker, items) {
  if (!items.length) {
    return { brief: `【${ticker}】近期無外部新聞條目。`, themes: [], sentiment: 'neutral', count: 0 };
  }

  const texts = items.map((i) => `${i.headline || ''} ${i.headlineEn || ''} ${i.detail || ''}`);
  const themes = extractThemes(texts);
  const sentiments = items.map((i) => i.sentiment || classifySentiment(texts[0]));
  const pos = sentiments.filter((s) => s === 'positive').length;
  const neg = sentiments.filter((s) => s === 'down').length;
  const neu = sentiments.length - pos - neg;

  let mood = 'neutral';
  if (pos > neg + 1) mood = 'positive';
  else if (neg > pos + 1) mood = 'down';
  else if (pos > 0 && neg > 0) mood = 'mixed';

  const lead = items[0];
  const themeStr = themes.length ? themes.join('、') : '一般動態';
  const moodStr =
    mood === 'positive'
      ? '媒體語氣偏正面'
      : mood === 'down'
        ? '媒體語氣偏負面'
        : mood === 'mixed'
          ? '多空訊號混雜'
          : '語氣中性';

  const brief = `【${ticker}】近 ${items.length} 則外部報導：主題「${themeStr}」。${moodStr}（多${pos}/空${neg}/中${neu}）。焦點：${lead.headline}。`;

  return { brief, themes, sentiment: mood, count: items.length };
}

export function synthesizeMarketBrief(tickerBriefs, feedCount) {
  const hot = Object.entries(tickerBriefs)
    .filter(([, b]) => b.count > 0)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5);

  if (!hot.length) {
    return '市場綜述：尚無外部 RSS 條目，請執行 update-news-feed.mjs。';
  }

  const lines = hot.map(([t, b]) => `${t}（${b.count}則·${b.themes.slice(0, 2).join('/')}）`);
  return `市場綜述（共 ${feedCount} 則外部來源）：${lines.join('；')}。詳見各股摘要。`;
}
