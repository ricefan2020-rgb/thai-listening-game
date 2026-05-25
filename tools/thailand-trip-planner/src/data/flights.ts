import type { BudgetLevel, FlightOrigin, ThailandRegionId, TripConfig } from '../types'
import { getRegionMeta } from './regions'

export interface FlightOriginOption {
  id: FlightOrigin
  label: string
  airports: string
}

const AIRPORT_SUFFIX: Record<ThailandRegionId, string> = {
  pattaya: 'BKK（再轉芭提雅）',
  bangkok: 'BKK／DMK',
  chiangmai: 'CNX（或 BKK 轉機）',
  phuket: 'HKT',
  krabi: 'KBV（或 HKT 轉車）',
}

export function getFlightAirportLabel(regionId: ThailandRegionId, origin: FlightOrigin): string {
  const opt = FLIGHT_ORIGINS.find((o) => o.id === origin)
  const suffix = AIRPORT_SUFFIX[regionId]
  if (origin === 'taiwan') return `桃園／台北／高雄 → ${suffix}`
  if (origin === 'hongkong') return `HKG → ${suffix}`
  if (origin === 'china') return `滬廣深等 → ${suffix}`
  if (origin === 'macau') return `MFM → ${suffix}`
  return `${opt?.airports?.split('→')[0] ?? ''} → ${suffix}`
}

/** 相對曼谷航線的機票係數（參考用） */
const REGION_FLIGHT_FACTOR: Record<ThailandRegionId, number> = {
  pattaya: 1,
  bangkok: 1,
  chiangmai: 0.92,
  phuket: 1.08,
  krabi: 1.05,
}

export const FLIGHT_ORIGINS: FlightOriginOption[] = [
  { id: 'taiwan', label: '台灣', airports: '桃園／台北／高雄' },
  { id: 'hongkong', label: '香港', airports: 'HKG' },
  { id: 'china', label: '中國大陸', airports: '滬廣深等' },
  { id: 'macau', label: '澳門', airports: 'MFM' },
  { id: 'other', label: '其他地區', airports: '依出發地' },
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
  const regionId = config.regionId ?? 'pattaya'
  const factor = REGION_FLIGHT_FACTOR[regionId]
  const perPerson = FLIGHT_PER_PERSON_THB[origin][config.budget]
  const regionMeta = getRegionMeta(regionId)

  return {
    min: Math.round(perPerson.min * factor * config.travelers),
    max: Math.round(perPerson.max * factor * config.travelers),
    note: `${getFlightAirportLabel(regionId, origin)} · 來回 · ${config.travelers} 人 · ${regionMeta.airportLabel}`,
  }
}

export function getFlightTips(regionId: ThailandRegionId): string[] {
  const meta = getRegionMeta(regionId)
  const base = [
    '機票為參考區間，旺季、連假與臨近日出發可能高出 30–50%。',
  ]
  if (meta.needsHubTransfer) {
    return [
      ...base,
      `若直飛 ${meta.airportCode} 通常更省時；飛曼谷需另計「${meta.hubTransferLabel}」。`,
    ]
  }
  return [...base, `建議直飛 ${meta.labelZh}主要機場（${meta.airportCode}）。`]
}

/** @deprecated */
export const FLIGHT_TIPS = getFlightTips('pattaya')
