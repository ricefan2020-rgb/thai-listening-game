/** 觀察板 ticker → 富途 OpenD 代碼（US 市場） */
import { yahooSymbol } from './tickers.mjs';

const OVERRIDES = {
  SIVE: 'US.SIVEF',
};

export function futuCode(ticker) {
  if (OVERRIDES[ticker]) return OVERRIDES[ticker];
  const sym = yahooSymbol(ticker);
  return `US.${sym}`;
}
