/** 觀察板標的（單一來源，腳本共用） */
export const WATCH_TICKERS = [
  'GOOGL',
  'NVDA',
  'MU',
  'AMD',
  'ARM',
  'ANET',
  'VRT',
  'SMCI',
  'IREN',
  'PLTR',
  'CRCL',
  'SNOW',
  'SIVE',
  'POET',
];

export const YAHOO_SYMBOL = {
  SIVE: 'SIVEF',
};

export function yahooSymbol(ticker) {
  return YAHOO_SYMBOL[ticker] || ticker;
}

export const REDDIT_QUERY = {
  GOOGL: 'GOOGL OR Alphabet',
  NVDA: 'NVDA OR NVIDIA',
  MU: 'MU OR Micron OR "Micron Technology"',
  AMD: 'AMD',
  ARM: 'ARM OR "Arm Holdings"',
  ANET: 'ANET OR Arista',
  VRT: 'VRT OR Vertiv',
  SMCI: 'SMCI OR Supermicro',
  IREN: 'IREN OR "Iris Energy"',
  PLTR: 'PLTR OR Palantir',
  CRCL: 'CRCL OR Circle',
  SNOW: 'SNOW OR Snowflake',
  SIVE: 'SIVEF OR SIVE OR "Sivers Semiconductors"',
  POET: 'POET OR "POET Technologies"',
};
