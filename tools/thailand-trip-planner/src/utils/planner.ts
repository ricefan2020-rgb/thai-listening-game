import { FOOD_CATEGORY_LABELS, getRecommendedFoods } from '../data/foods'
import { getVideosForTrip, youtubeWatchUrl } from '../data/videos'
import { getRecommendedHotels, nightsForStay } from '../data/hotels'
import { getPlaceById, getPlacesForRegion } from '../data/places'
import { getRegionMeta, getHotelAreaLabel } from '../data/regions'
import { REGION_LABELS } from '../types'
import type {
  BudgetLevel,
  DayPlan,
  Interest,
  Place,
  ScheduledItem,
  TimeSlot,
  TripConfig,
  TripPlan,
} from '../types'
import { calculateTripBudget } from './budget'
import {
  formatMoneyDual,
  formatRangeDual,
  formatThb,
  getCurrency,
} from './currency'

export {
  formatForeign,
  formatMoneyDual,
  formatMoneyWithCnyHkd,
  formatRangeDual,
  formatRangeWithCnyHkd,
  formatThb,
} from './currency'

const SLOTS_BY_PACE: Record<TripConfig['pace'], TimeSlot[]> = {
  relaxed: ['morning', 'afternoon', 'evening'],
  balanced: ['morning', 'afternoon', 'evening', 'night'],
  packed: ['morning', 'afternoon', 'evening', 'night'],
}

const MAX_PER_SLOT: Record<TripConfig['pace'], number> = {
  relaxed: 1,
  balanced: 1,
  packed: 2,
}

function scorePlace(place: Place, config: TripConfig): number {
  if (place.adultOnly && !config.interests.includes('adultNightlife')) return -1000
  if (place.adultOnly && config.interests.includes('family')) return -1000

  let score = 0
  if (config.interests.includes(place.category)) score += 10
  if (place.adultOnly && config.interests.includes('adultNightlife')) score += 5
  if (config.interests.length === 0) score += 3
  const cost = place.costThb[config.budget]
  if (config.budget === 'budget' && cost <= 600) score += 2
  if (config.budget === 'luxury' && cost >= 1000) score += 1
  return score
}

function pickPlaces(config: TripConfig): Place[] {
  const slotsPerDay = SLOTS_BY_PACE[config.pace].length
  const totalNeeded = config.days * slotsPerDay
  const pool = getPlacesForRegion(config.regionId)
  const ranked = [...pool].sort((a, b) => scorePlace(b, config) - scorePlace(a, config))
  const picked: Place[] = []
  const used = new Set<string>()

  for (const place of ranked) {
    if (picked.length >= totalNeeded) break
    if (used.has(place.id)) continue
    picked.push(place)
    used.add(place.id)
  }

  for (const place of pool) {
    if (picked.length >= totalNeeded) break
    if (!used.has(place.id)) {
      picked.push(place)
      used.add(place.id)
    }
  }

  return picked
}

export const DEFAULT_CONFIG: TripConfig = {
  regionId: 'pattaya',
  title: '芭提雅之旅',
  startDate: new Date().toISOString().slice(0, 10),
  days: 3,
  travelers: 2,
  budget: 'mid',
  interests: ['beach', 'food', 'culture'],
  pace: 'balanced',
  hotelArea: 'central',
  currency: 'TWD',
  exchangeRate: 0.9,
  includeFlights: true,
  flightOrigin: 'taiwan',
}

export function normalizeConfig(config: TripConfig): TripConfig {
  const currency = config.currency ?? 'TWD'
  const curMeta = getCurrency(currency)
  const regionId = config.regionId ?? 'pattaya'
  const regionMeta = getRegionMeta(regionId)
  const hotelValid = regionMeta.hotelAreas.some((a) => a.id === config.hotelArea)
  const hotelArea = hotelValid ? config.hotelArea : regionMeta.defaultHotelArea
  const title =
    config.title?.trim() ||
    regionMeta.defaultTitle

  return {
    ...DEFAULT_CONFIG,
    ...config,
    regionId,
    hotelArea,
    title,
    currency,
    exchangeRate:
      config.exchangeRate > 0 ? config.exchangeRate : curMeta.defaultUnitsPerThb,
    includeFlights: config.includeFlights !== false,
    flightOrigin: config.flightOrigin ?? 'taiwan',
  }
}

export function generateItinerary(config: TripConfig): TripPlan {
  const normalized = normalizeConfig(config)
  const places = pickPlaces(normalized)
  const daySlots = SLOTS_BY_PACE[normalized.pace]
  const maxPerSlot = MAX_PER_SLOT[normalized.pace]
  const days: DayPlan[] = []
  let placeIndex = 0

  for (let d = 1; d <= normalized.days; d++) {
    const items: ScheduledItem[] = []
    const slotCounts: Record<string, number> = {}

    for (const slot of daySlots) {
      if (placeIndex >= places.length) break
      const count = slotCounts[slot] ?? 0
      if (count >= maxPerSlot) continue

      const place = places[placeIndex]
      if (!place.bestSlots.includes(slot) && normalized.pace === 'relaxed') {
        const alt = places.find(
          (p, i) =>
            i >= placeIndex &&
            p.bestSlots.includes(slot) &&
            !items.some((it) => it.placeId === p.id),
        )
        if (alt) {
          items.push({
            id: `${d}-${slot}-${alt.id}`,
            placeId: alt.id,
            slot,
          })
          placeIndex = places.indexOf(alt) + 1
          slotCounts[slot] = count + 1
          continue
        }
      }

      items.push({
        id: `${d}-${slot}-${place.id}`,
        placeId: place.id,
        slot,
      })
      placeIndex++
      slotCounts[slot] = count + 1
    }

    days.push({
      day: d,
      label: `第 ${d} 天`,
      items,
    })
  }

  return {
    config: normalized,
    days,
    updatedAt: new Date().toISOString(),
  }
}

export function estimateDayCost(
  day: DayPlan,
  budget: BudgetLevel,
  travelers: number,
): number {
  return day.items.reduce((sum, item) => {
    const place = getPlaceById(item.placeId)
    if (!place) return sum
    return sum + place.costThb[budget] * travelers
  }, 0)
}

export function estimateTripCost(plan: TripPlan): number {
  return plan.days.reduce(
    (sum, day) => sum + estimateDayCost(day, plan.config.budget, plan.config.travelers),
    0,
  )
}

export const PACKING_BY_INTEREST: Record<Interest, string[]> = {
  beach: ['泳衣、防曬、沙灘鞋', '防水袋'],
  nightlife: ['輕便外出服', '現金零錢'],
  adultNightlife: ['護照或身分證件（部分夜店查驗）', '現金與小面額泰銖', '行動電源'],
  family: ['兒童防曬、常備藥', '小零食'],
  culture: ['遮肩衣物（進寺廟）', '舒適步行鞋'],
  food: ['腸胃藥', '濕紙巾'],
  shopping: ['折疊購物袋', '護照影本（退稅）'],
  nature: ['防蚊液', '帽子'],
  wellness: ['寬鬆衣物', '替換內衣'],
}

export function buildPackingList(interests: Interest[]): string[] {
  const base = [
    '護照、簽證/入境卡',
    '泰銖現金與信用卡',
    '手機、轉接頭（A/C/F 型）',
    '常備藥與個人藥品',
  ]
  const extra = new Set<string>()
  for (const i of interests) {
    for (const item of PACKING_BY_INTEREST[i]) extra.add(item)
  }
  return [...base, ...extra]
}

export function exportPlanMarkdown(plan: TripPlan): string {
  const { config } = plan
  const lines: string[] = [
    `# ${config.title}`,
    '',
    `- 目的地：${REGION_LABELS[config.regionId]}`,
    `- 出發日：${config.startDate || '未定'}`,
    `- 天數：${config.days} 天 · ${config.travelers} 人`,
    `- 預算等級：${config.budget}`,
    `- 機票：${config.includeFlights === false ? '不計入' : `含來回（${config.flightOrigin ?? 'taiwan'}）`}`,
  ]

  for (const day of plan.days) {
    lines.push('', `## ${day.label}`, '')
  for (const item of day.items) {
      const place = getPlaceById(item.placeId)
      if (!place) continue
      lines.push(
        `### ${item.slot === 'morning' ? '上午' : item.slot === 'afternoon' ? '下午' : item.slot === 'evening' ? '傍晚' : '夜晚'} · ${place.nameZh}${place.adultOnly ? '（18+）' : ''}`,
        `- 泰文：${place.nameTh}`,
        `- ${place.description}`,
        `- 預估：${formatMoneyDual(place.costThb[config.budget] * config.travelers, config.currency, config.exchangeRate)}（${config.travelers} 人）`,
        `- 交通：${place.transportHint}`,
        `- 提示：${place.tip}`,
        ...(item.note?.trim() ? [`- 備註：${item.note.trim()}`] : []),
        '',
      )
    }
  }

  const nights = nightsForStay(config.days)
  const hotels = getRecommendedHotels(config, 5)
  lines.push('', '## 住宿推介', '')
  lines.push(
    `- 區域：${getHotelAreaLabel(config.regionId, config.hotelArea)} · 約 ${nights} 晚`,
    '',
  )
  for (const hotel of hotels) {
    lines.push(
      `### ${hotel.nameZh}`,
      `- 泰文：${hotel.nameTh}`,
      `- 每晚：${formatRangeDual(hotel.pricePerNightThb.min, hotel.pricePerNightThb.max, config.currency, config.exchangeRate)}`,
      `- ${nights} 晚約：${formatRangeDual(hotel.pricePerNightThb.min * nights, hotel.pricePerNightThb.max * nights, config.currency, config.exchangeRate)}`,
      `- ${hotel.pros}`,
      `- 提示：${hotel.tip}`,
      '',
    )
  }

  const videos = getVideosForTrip(config, 5)
  lines.push('', '## 相關影片', '')
  for (const video of videos) {
    lines.push(
      `- [${video.titleZh}](${youtubeWatchUrl(video.youtubeId)}) — ${video.channel}（${video.duration}）`,
      `  - ${video.summary}`,
    )
  }

  const foods = getRecommendedFoods(config, 6)
  lines.push('', '## 美食推介', '')
  lines.push(`- 區域：${getHotelAreaLabel(config.regionId, config.hotelArea)}`, '')
  for (const food of foods) {
    lines.push(
      `### ${food.nameZh}`,
      `- 泰文：${food.nameTh}`,
      `- 類型：${FOOD_CATEGORY_LABELS[food.category]}`,
      `- 每人：${formatRangeDual(food.pricePerPersonThb.min, food.pricePerPersonThb.max, config.currency, config.exchangeRate)}`,
      `- 必點：${food.mustTry.join('、')}`,
      `- ${food.pros}`,
      `- 提示：${food.tip}`,
      '',
    )
  }

  const budget = calculateTripBudget(plan)
  lines.push('', '## 預算試算', '')
  for (const line of budget.lines) {
    const cost =
      line.minThb === line.maxThb
        ? formatMoneyDual(line.minThb, config.currency, config.exchangeRate)
        : formatRangeDual(line.minThb, line.maxThb, config.currency, config.exchangeRate)
    lines.push(`- ${line.label}：${cost}`)
  }
  lines.push(
    '',
    `**預估總花費：** ${formatRangeDual(budget.totalMinThb, budget.totalMaxThb, config.currency, config.exchangeRate)}`,
  )
  if (config.tripBudgetForeign) {
    lines.push(`- 你的預算上限：${config.tripBudgetForeign} ${config.currency}`)
  }
  lines.push('', '_由泰國旅遊計劃（Thailand Travel Journal）產生_')
  return lines.join('\n')
}
