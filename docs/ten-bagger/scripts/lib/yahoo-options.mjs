import { yahooGetJson } from './yahoo-session.mjs';

export async function fetchOptionChain(symbol) {
  const url = `https://query1.finance.yahoo.com/v7/finance/options/${encodeURIComponent(symbol)}`;
  const data = await yahooGetJson(url);
  const result = data?.optionChain?.result?.[0];
  if (!result) throw new Error(`${symbol}: 無期權鏈`);
  return result;
}
