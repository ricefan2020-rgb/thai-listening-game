export type BudgetLevel = 'budget' | 'mid' | 'luxury'

export type CurrencyCode = 'TWD' | 'HKD' | 'CNY' | 'USD' | 'THB'

export type FlightOrigin = 'taiwan' | 'hongkong' | 'china' | 'macau' | 'other'

export type Interest =
  | 'beach'
  | 'nightlife'
  | 'adultNightlife'
  | 'family'
  | 'culture'
  | 'food'
  | 'shopping'
  | 'nature'
  | 'wellness'

export type TimeSlot = 'morning' | 'afternoon' | 'evening' | 'night'

export interface Place {
  id: string
  nameZh: string
  nameTh: string
  category: Interest
  area: string
  durationHours: number
  costThb: Record<BudgetLevel, number>
  bestSlots: TimeSlot[]
  description: string
  tip: string
  mapQuery: string
  lat: number
  lng: number
  transportHint: string
  /** 成人向娛樂（酒吧、夜店等），需滿 18 歲 */
  adultOnly?: boolean
}

export interface ScheduledItem {
  id: string
  placeId: string
  slot: TimeSlot
  note?: string
}

export interface DayPlan {
  day: number
  label: string
  items: ScheduledItem[]
}

export interface TripConfig {
  title: string
  startDate: string
  days: number
  travelers: number
  budget: BudgetLevel
  interests: Interest[]
  pace: 'relaxed' | 'balanced' | 'packed'
  hotelArea: 'central' | 'jomtien' | 'north'
  /** 顯示與試算用的幣別 */
  currency: CurrencyCode
  /** 1 泰銖可兌換多少該幣別 */
  exchangeRate: number
  /** 整趟旅行預算上限（顯示幣別，可選） */
  tripBudgetForeign?: number
  /** 曼谷↔芭提雅預設交通方式（見 transport.ts） */
  arrivalTransportId?: string
  /** 是否計入來回機票（預設 true） */
  includeFlights?: boolean
  /** 出發地（影響機票參考價） */
  flightOrigin?: FlightOrigin
  /** 自訂機票總價（泰銖，選填；有值時覆蓋自動估算） */
  customFlightTotalThb?: number
}

export interface TripPlan {
  config: TripConfig
  days: DayPlan[]
  updatedAt: string
}

/** 公開分享的旅遊筆記（類小紅書帖文） */
export interface TravelNote {
  id: string
  plan: TripPlan
  authorName: string
  publishedAt: string
  excerpt: string
  /** 一句話心得（顯示在卡片與公開頁） */
  caption?: string
  /** 標籤，例如 #芭提雅 #小資 */
  tags?: string[]
  /** 雲端筆記按讚數（僅 Supabase 廣場） */
  likeCount?: number
}

export const INTEREST_LABELS: Record<Interest, string> = {
  beach: '海灘戲水',
  nightlife: '夜生活',
  adultNightlife: '成人夜生活（18+）',
  family: '親子同樂',
  culture: '文化古蹟',
  food: '美食市集',
  shopping: '購物商場',
  nature: '自然綠意',
  wellness: 'SPA 放鬆',
}

export const SLOT_LABELS: Record<TimeSlot, string> = {
  morning: '上午',
  afternoon: '下午',
  evening: '傍晚',
  night: '夜晚',
}

export const BUDGET_LABELS: Record<BudgetLevel, string> = {
  budget: '小資',
  mid: '舒適',
  luxury: '奢享',
}
