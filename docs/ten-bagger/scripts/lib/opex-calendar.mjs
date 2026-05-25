/**
 * 美股期權結算日（美東）· 月選第三個週五 · 四重到期
 */

function thirdFriday(year, month) {
  const d = new Date(Date.UTC(year, month, 1));
  let count = 0;
  while (d.getUTCMonth() === month) {
    if (d.getUTCDay() === 5) {
      count += 1;
      if (count === 3) {
        const y = d.getUTCFullYear();
        const m = String(d.getUTCMonth() + 1).padStart(2, '0');
        const day = String(d.getUTCDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
      }
    }
    d.setUTCDate(d.getUTCDate() + 1);
  }
  return null;
}

/** VIX 期權通常為 SPX 月選前約 30 天的週三（近似：月選週的前一週三） */
function vixExpiryWednesday(opexDate) {
  const d = new Date(`${opexDate}T17:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 30);
  while (d.getUTCDay() !== 3) d.setUTCDate(d.getUTCDate() - 1);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

const QUAD_MONTHS = new Set([2, 5, 8, 11]); // 0-indexed: Mar Jun Sep Dec

/**
 * @param {number} monthsAhead
 * @param {string} fromDate ISO YYYY-MM-DD
 */
export function buildMarketOpexCalendar(monthsAhead = 8, fromDate = null) {
  const start = fromDate ? new Date(`${fromDate}T12:00:00`) : new Date();
  const items = [];
  const seen = new Set();
  let y = start.getFullYear();
  let m = start.getMonth();

  for (let i = 0; i < monthsAhead + 2; i++) {
    const date = thirdFriday(y, m);
    if (date && date >= (fromDate || '2020-01-01') && !seen.has(date)) {
      seen.add(date);
      const isQuad = QUAD_MONTHS.has(m);
      items.push({
        date,
        kind: 'opex',
        title: isQuad ? '四重到期（月選）' : '美股月選到期',
        detail: isQuad
          ? 'SPX/NDX/Russell/單股月選同日結算 · 波動常放大'
          : '多數美股月選合約到期 · 第三個週五',
        impact: isQuad ? 'high' : 'high',
        opexType: isQuad ? 'quad' : 'monthly',
      });
      const vix = vixExpiryWednesday(date);
      if (vix >= (fromDate || '2020-01-01') && !seen.has(`vix:${vix}`)) {
        seen.add(`vix:${vix}`);
        items.push({
          date: vix,
          kind: 'vix',
          title: 'VIX 期權到期（近似）',
          detail: `通常早於 ${date.slice(5)} 月選 · 波動率產品`,
          impact: 'medium',
        });
      }
    }
    m += 1;
    if (m > 11) {
      m = 0;
      y += 1;
    }
  }

  items.sort((a, b) => a.date.localeCompare(b.date));
  return items.slice(0, monthsAhead * 2 + 4);
}
