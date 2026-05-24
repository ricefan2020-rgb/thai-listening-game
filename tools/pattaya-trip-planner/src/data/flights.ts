import type { BudgetLevel, FlightOrigin, TripConfig } from '../types'

export interface FlightOriginOption {
  id: FlightOrigin
  label: string
  airports: string
}

export const FLIGHT_ORIGINS: FlightOriginOption[] = [
  { id: 'taiwan', label: '台灣', airports: '桃園／台北／高雄 → BKK' },
  { id: 'hongkong', label: '香港', airports: 'HKG → BKK' },
  { id: 'china', label: '中國大陸', airports: '滬廣深等 → BKK' },
  { id: 'macau', label: '澳門', airports: 'MFM → BKK（多需轉機）' },
  { id: 'other', label: '其他地區', airports: '→ 曼谷素萬那普／廊曼' },
]

/** 來回機票／人（泰銖，含稅參考） */
const FLIGHT_PER_PERSON_THB: Record<
  FlightOrigin,
  Record<BudgetLevel, { min: number; max: number }>
> = {
  taiwan: {
    budget: { min: 7_500, max: 11_500 },
    mid: { min: 11_000, max: 17_500 },
    luxury: { min: 18_000, max: 32_000 },
  },
  hongkong: {
    budget: { min: 4_500, max: 8_500 },
    mid: { min: 8_000, max: 13_500 },
    luxury: { min: 14_000, max: 24_000 },
  },
  china: {
    budget: { min: 5_500, max: 9_500 },
    mid: { min: 9_000, max: 15_500 },
    luxury: { min: 16_000, max: 28_000 },
  },
  macau: {
    budget: { min: 6_000, max: 10_000 },
    mid: { min: 10_000, max: 16_000 },
    luxury: { min: 17_000, max: 30_000 },
  },
  other: {
    budget: { min: 9_000, max: 16_000 },
    mid: { min: 14_000, max: 22_000 },
    luxury: { min: 22_000, max: 40_000 },
  },
}

export function getFlightOriginLabel(origin: FlightOrigin): string {
  return FLIGHT_ORIGINS.find((o) => o.id === origin)?.label ?? origin
}

export function estimateFlightCost(
  config: TripConfig,
): { min: number; max: number; note: string } | null {
  if (config.includeFlights === false) return null

  if (config.customFlightTotalThb != null && config.customFlightTotalThb > 0) {
    const total = config.customFlightTotalThb
    return {
      min: total,
      max: total,
      note: `自訂機票總價 · ${config.travelers} 人`,
    }
  }

  const origin = config.flightOrigin ?? 'taiwan'
  const perPerson = FLIGHT_PER_PERSON_THB[origin][config.budget]
  const opt = FLIGHT_ORIGINS.find((o) => o.id === origin)

  return {
    min: perPerson.min * config.travelers,
    max: perPerson.max * config.travelers,
    note: `${opt?.airports ?? '↔ BKK'} · 來回 · ${config.travelers} 人 · 依${config.budget === 'budget' ? '小資' : config.budget === 'mid' ? '舒適' : '奢享'}艙等參考`,
  }
}

export const FLIGHT_TIPS: string[] = [
  '機票為參考區間，旺季、連假與臨近日出發可能高出 30–50%。',
  '抵達曼谷後仍需預留曼谷↔芭提雅交通（已另列於預算）。',
  '若飛廊曼（DMK）且住芭提雅，可評估直達巴士是否較省時。',
]
