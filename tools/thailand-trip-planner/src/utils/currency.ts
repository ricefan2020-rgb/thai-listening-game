import type { BudgetLevel, CurrencyCode } from '../types'

export type { CurrencyCode }

export interface CurrencyOption {
  code: CurrencyCode
  label: string
  symbol: string
  /** 1 泰銖可兌換多少該幣別（例：1 THB ≈ 0.9 TWD） */
  defaultUnitsPerThb: number
}

export const CURRENCIES: CurrencyOption[] = [
  { code: 'HKD', label: '港幣', symbol: 'HK$', defaultUnitsPerThb: 0.23 },
  { code: 'CNY', label: '人民幣', symbol: 'CN¥', defaultUnitsPerThb: 0.22 },
  { code: 'TWD', label: '新台幣', symbol: 'NT$', defaultUnitsPerThb: 0.9 },
  { code: 'USD', label: '美元', symbol: 'US$', defaultUnitsPerThb: 0.028 },
  { code: 'THB', label: '泰銖', symbol: '฿', defaultUnitsPerThb: 1 },
]

export function getCurrency(code: CurrencyCode): CurrencyOption {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0]
}

/** 泰銖 → 顯示幣別 */
export function thbToForeign(thb: number, unitsPerThb: number): number {
  if (!Number.isFinite(thb) || !Number.isFinite(unitsPerThb)) return 0
  return Math.round(thb * unitsPerThb)
}

/** 顯示幣別 → 泰銖 */
export function foreignToThb(foreign: number, unitsPerThb: number): number {
  if (!unitsPerThb || unitsPerThb <= 0) return 0
  return Math.round(foreign / unitsPerThb)
}

export function formatThb(amount: number): string {
  return `฿${amount.toLocaleString('zh-Hant')}`
}

export function formatForeign(
  amount: number,
  code: CurrencyCode,
  symbol?: string,
): string {
  const sym = symbol ?? getCurrency(code).symbol
  if (code === 'THB') return formatThb(amount)
  return `${sym}${amount.toLocaleString('zh-Hant')}`
}

function rateFor(code: CurrencyCode, primary: CurrencyCode, primaryRate: number): number {
  if (code === primary) return primaryRate
  return getCurrency(code).defaultUnitsPerThb
}

/** 泰銖 + 主要幣別 + 港幣／人民幣參考 */
export function formatMoneyWithCnyHkd(
  thb: number,
  primaryCode: CurrencyCode,
  primaryRate: number,
): string {
  const parts: string[] = []

  if (primaryCode !== 'THB' && primaryCode !== 'HKD' && primaryCode !== 'CNY') {
    parts.push(formatForeign(thbToForeign(thb, primaryRate), primaryCode))
  }
  if (primaryCode === 'HKD') {
    parts.push(formatForeign(thbToForeign(thb, primaryRate), 'HKD'))
  } else {
    parts.push(
      `港 ${formatForeign(thbToForeign(thb, rateFor('HKD', primaryCode, primaryRate)), 'HKD')}`,
    )
  }
  if (primaryCode === 'CNY') {
    parts.push(formatForeign(thbToForeign(thb, primaryRate), 'CNY'))
  } else {
    parts.push(
      `人民 ${formatForeign(thbToForeign(thb, rateFor('CNY', primaryCode, primaryRate)), 'CNY')}`,
    )
  }

  return `${formatThb(thb)}（約 ${parts.join(' · ')}）`
}

export function formatMoneyDual(
  thb: number,
  code: CurrencyCode,
  unitsPerThb: number,
): string {
  return formatMoneyWithCnyHkd(thb, code, unitsPerThb)
}

export function formatRangeWithCnyHkd(
  minThb: number,
  maxThb: number,
  primaryCode: CurrencyCode,
  primaryRate: number,
): string {
  if (minThb === maxThb) return formatMoneyWithCnyHkd(minThb, primaryCode, primaryRate)
  return `${formatThb(minThb)}–${formatThb(maxThb)}（約 ${formatRangeForeign(minThb, maxThb, primaryCode, primaryRate)}）`
}

function formatRangeForeign(
  minThb: number,
  maxThb: number,
  primaryCode: CurrencyCode,
  primaryRate: number,
): string {
  const segments: string[] = []

  if (primaryCode !== 'THB' && primaryCode !== 'HKD' && primaryCode !== 'CNY') {
    const sym = getCurrency(primaryCode).symbol
    segments.push(
      `${sym}${thbToForeign(minThb, primaryRate).toLocaleString('zh-Hant')}–${thbToForeign(maxThb, primaryRate).toLocaleString('zh-Hant')}`,
    )
  }

  const hkdRate = rateFor('HKD', primaryCode, primaryRate)
  const cnyRate = rateFor('CNY', primaryCode, primaryRate)
  const hkdSym = getCurrency('HKD').symbol
  const cnySym = getCurrency('CNY').symbol

  if (primaryCode === 'HKD') {
    segments.push(
      `${hkdSym}${thbToForeign(minThb, primaryRate).toLocaleString('zh-Hant')}–${thbToForeign(maxThb, primaryRate).toLocaleString('zh-Hant')}`,
    )
  } else {
    segments.push(
      `港 ${hkdSym}${thbToForeign(minThb, hkdRate).toLocaleString('zh-Hant')}–${thbToForeign(maxThb, hkdRate).toLocaleString('zh-Hant')}`,
    )
  }

  if (primaryCode === 'CNY') {
    segments.push(
      `${cnySym}${thbToForeign(minThb, primaryRate).toLocaleString('zh-Hant')}–${thbToForeign(maxThb, primaryRate).toLocaleString('zh-Hant')}`,
    )
  } else {
    segments.push(
      `人民 ${cnySym}${thbToForeign(minThb, cnyRate).toLocaleString('zh-Hant')}–${thbToForeign(maxThb, cnyRate).toLocaleString('zh-Hant')}`,
    )
  }

  return segments.join(' · ')
}

export function formatRangeDual(
  minThb: number,
  maxThb: number,
  code: CurrencyCode,
  unitsPerThb: number,
): string {
  return formatRangeWithCnyHkd(minThb, maxThb, code, unitsPerThb)
}

/** 每晚住宿預估（泰銖／房） */
const HOTEL_PER_NIGHT: Record<BudgetLevel, { min: number; max: number }> = {
  budget: { min: 700, max: 1200 },
  mid: { min: 1400, max: 2800 },
  luxury: { min: 3500, max: 7500 },
}

/** 每人每日餐飲預估（泰銖） */
const FOOD_PER_DAY: Record<BudgetLevel, { min: number; max: number }> = {
  budget: { min: 350, max: 550 },
  mid: { min: 600, max: 900 },
  luxury: { min: 1200, max: 2000 },
}

export function getHotelEstimateThb(
  budget: BudgetLevel,
  nights: number,
): { min: number; max: number } {
  const r = HOTEL_PER_NIGHT[budget]
  return { min: r.min * nights, max: r.max * nights }
}

export function getFoodEstimateThb(
  budget: BudgetLevel,
  days: number,
  travelers: number,
): { min: number; max: number } {
  const r = FOOD_PER_DAY[budget]
  return {
    min: r.min * days * travelers,
    max: r.max * days * travelers,
  }
}
