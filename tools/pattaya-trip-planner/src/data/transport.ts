import type { BudgetLevel, Interest, TripConfig } from '../types'

export interface TransportCostEstimate {
  minThb: number
  maxThb: number
  /** true = 每人；false = 整車／趟 */
  perTraveler: boolean
}

export interface TransportOption {
  id: string
  nameZh: string
  nameTh: string
  duration: string
  costHint: Record<BudgetLevel, string>
  costEstimate: Record<BudgetLevel, TransportCostEstimate>
  description: string
  tip: string
  mapQuery: string
}

export interface LocalTransport {
  id: string
  nameZh: string
  nameTh: string
  priceHint: string
  description: string
  tip: string
}

/** 曼谷 → 芭提雅 */
export const GETTING_TO_PATTAYA: TransportOption[] = [
  {
    id: 'airport-bus',
    nameZh: '素萬那普機場巴士（389 路）',
    nameTh: 'รถบัสจากสนามบินสุวรรณภูมิ',
    duration: '約 2–2.5 小時',
    costHint: { budget: '฿134', mid: '฿134', luxury: '฿134' },
    costEstimate: {
      budget: { minThb: 134, maxThb: 134, perTraveler: true },
      mid: { minThb: 134, maxThb: 134, perTraveler: true },
      luxury: { minThb: 134, maxThb: 134, perTraveler: true },
    },
    description: '機場 1 樓 Gate 8，直達 Pattaya Bus Terminal（北芭）。',
    tip: '班次約 1 小時一班；可提前在機場櫃台買票，行李有專位。',
    mapQuery: 'Suvarnabhumi+Airport+Bus+Terminal',
  },
  {
    id: 'ekamai-van',
    nameZh: '曼谷 Ekkamai 小巴',
    nameTh: 'รถตู้จากเอกมัย',
    duration: '約 2 小時',
    costHint: { budget: '฿150–180', mid: '฿150–180', luxury: '฿150–180' },
    costEstimate: {
      budget: { minThb: 150, maxThb: 180, perTraveler: true },
      mid: { minThb: 150, maxThb: 180, perTraveler: true },
      luxury: { minThb: 150, maxThb: 180, perTraveler: true },
    },
    description: 'BTS Ekkamai 站旁巴士站，小巴直達芭提雅中北區。',
    tip: '客滿即發；建議下午前搭乘，傍晚曼谷易塞車。',
    mapQuery: 'Ekkamai+Bus+Terminal+Bangkok',
  },
  {
    id: 'mochit-bus',
    nameZh: 'Mo Chit 長途巴士',
    nameTh: 'รถบัสจากหมอชิต',
    duration: '約 2.5 小時',
    costHint: { budget: '฿120–160', mid: '฿160–220', luxury: '฿250+' },
    costEstimate: {
      budget: { minThb: 120, maxThb: 160, perTraveler: true },
      mid: { minThb: 160, maxThb: 220, perTraveler: true },
      luxury: { minThb: 250, maxThb: 350, perTraveler: true },
    },
    description: '空調大巴，可選普通／VIP 座，終點 Pattaya Bus Terminal。',
    tip: '可在 12Go、Bus Online Ticket 或車站櫃台購票。',
    mapQuery: 'Mo+Chit+Bus+Terminal',
  },
  {
    id: 'private-car',
    nameZh: '包車／Grab 直達',
    nameTh: 'รถส่วนตัว / Grab',
    duration: '約 1.5–2 小時（視交通）',
    costHint: { budget: '฿1,200+', mid: '฿1,500+', luxury: '฿2,000+' },
    costEstimate: {
      budget: { minThb: 1200, maxThb: 1500, perTraveler: false },
      mid: { minThb: 1500, maxThb: 1800, perTraveler: false },
      luxury: { minThb: 2000, maxThb: 2800, perTraveler: false },
    },
    description: '門到門最方便，適合 3–4 人分攤或帶行李／小孩。',
    tip: '曼谷尖峰時段可能 3 小時；可請飯店代訂可靠司機。',
    mapQuery: 'Pattaya+Thailand',
  },
]

export const LOCAL_TRANSPORT: LocalTransport[] = [
  {
    id: 'songthaew',
    nameZh: '雙條車（Songthaew）',
    nameTh: 'รถสองแถว',
    priceHint: '市區約 ฿10／人；包車 ฿100–300',
    description: '芭提雅最常用，沿固定路線繞行，招手即停。',
    tip: '上車前說目的地並確認價格；夜間或偏遠區域建議先講價。',
  },
  {
    id: 'motorbike-taxi',
    nameZh: '摩托計程車',
    nameTh: 'วินมอเตอร์ไซค์',
    priceHint: '短程 ฿30–80',
    description: '單人快速穿梭小巷，適合短距離或塞車時段。',
    tip: '記得戴安全帽；議價後再出發。',
  },
  {
    id: 'grab',
    nameZh: 'Grab / Bolt',
    nameTh: 'แอปเรียกรถ',
    priceHint: '依 App 計價，通常 ฿50–250',
    description: '可叫轿车或摩托，價格透明，適合夜間返程。',
    tip: '需泰國 SIM 或漫遊；機場／碼頭網路較差可先截圖地址。',
  },
  {
    id: 'rent-scooter',
    nameZh: '租機車',
    nameTh: 'เช่ามอเตอร์ไซค์',
    priceHint: '約 ฿200–350／天',
    description: '自由度高，適合會騎且熟悉右側行車者。',
    tip: '需護照押金；戴安全帽，注意查酒駕與無照罰款。',
  },
  {
    id: 'boat',
    nameZh: '渡船／快艇',
    nameTh: 'เรือ / เรือเร็ว',
    priceHint: '格蘭島來回 ฿30–150',
    description: 'Bali Hai Pier 出發至 Koh Larn 或海上活動。',
    tip: '早班船較穩；選有救生衣的合法船家。',
  },
]

const HOTEL_HUB: Record<TripConfig['hotelArea'], { nameZh: string; lat: number; lng: number }> = {
  central: { nameZh: '市中心 Beach Road', lat: 12.9356, lng: 100.883 },
  jomtien: { nameZh: '喬提恩海灘', lat: 12.8777, lng: 100.8676 },
  north: { nameZh: '北芭／阿卡莎一帶', lat: 12.9508, lng: 100.8887 },
}

export function getHotelHub(area: TripConfig['hotelArea']) {
  return HOTEL_HUB[area]
}

const DEFAULT_ARRIVAL_ID: Record<BudgetLevel, string> = {
  budget: 'airport-bus',
  mid: 'ekamai-van',
  luxury: 'private-car',
}

export function getDefaultArrivalOption(budget: BudgetLevel): TransportOption {
  const id = DEFAULT_ARRIVAL_ID[budget]
  return GETTING_TO_PATTAYA.find((o) => o.id === id) ?? GETTING_TO_PATTAYA[0]
}

export function estimateTransportOptionCost(
  option: TransportOption,
  budget: BudgetLevel,
  travelers: number,
): { min: number; max: number } {
  const c = option.costEstimate[budget]
  if (c.perTraveler) {
    return { min: c.minThb * travelers, max: c.maxThb * travelers }
  }
  return { min: c.minThb, max: c.maxThb }
}

/** 曼谷↔芭提雅單程（依預算等級預設交通方式） */
export function estimateArrivalTransferCost(
  budget: BudgetLevel,
  travelers: number,
  optionId?: string,
): { min: number; max: number; option: TransportOption } {
  const option =
    GETTING_TO_PATTAYA.find((o) => o.id === optionId) ?? getDefaultArrivalOption(budget)
  const cost = estimateTransportOptionCost(option, budget, travelers)
  return { ...cost, option }
}

/** 曼谷↔芭提雅來回 */
export function estimateRoundTripTransferCost(
  budget: BudgetLevel,
  travelers: number,
  optionId?: string,
): { min: number; max: number; option: TransportOption } {
  const oneWay = estimateArrivalTransferCost(budget, travelers, optionId)
  return {
    min: oneWay.min * 2,
    max: oneWay.max * 2,
    option: oneWay.option,
  }
}

export function estimateLocalTransportCost(
  budget: BudgetLevel,
  days: number,
  travelers: number,
): { min: number; max: number } {
  const perDay =
    budget === 'budget'
      ? { min: 80, max: 200 }
      : budget === 'mid'
        ? { min: 150, max: 400 }
        : { min: 300, max: 800 }
  const totalMin = perDay.min * days * Math.ceil(travelers / 2)
  const totalMax = perDay.max * days * travelers
  return { min: totalMin, max: totalMax }
}

/** 依行程景點數估算額外打車／雙條（趟） */
export function estimateItineraryLegTransport(
  activityCount: number,
  budget: BudgetLevel,
  travelers: number,
): { min: number; max: number } {
  if (activityCount === 0) return { min: 0, max: 0 }
  const perLeg =
    budget === 'budget'
      ? { min: 50, max: 150 }
      : budget === 'mid'
        ? { min: 80, max: 250 }
        : { min: 150, max: 400 }
  return {
    min: activityCount * perLeg.min * Math.ceil(travelers / 2),
    max: activityCount * perLeg.max * travelers,
  }
}

export const ADULT_NIGHTLIFE_TIPS: string[] = [
  '僅限 18 歲以上；拒絕任何未明確報價的服務。',
  '進店前問清：入場費、最低消費、小姐飲料（lady drink）單價。',
  '帳單當場核對，勿將護照押給陌生人。',
  '飲酒適量，結伴同行；深夜優先 Grab 返回飯店。',
  'Soi 6、LK Metro、Walking Street 可排同一晚，但不宜趕場太多家。',
]

export function getTransportTipsForArea(area: TripConfig['hotelArea']): string[] {
  const base = [
    '雙條車沿 Beach Road ↔ Walking Street 最密集，傍晚易塞可改 Grab。',
    '去格蘭島、東芭、羅摩衍那等郊區景點，建議包車半日或跟團。',
  ]
  if (area === 'jomtien') {
    return [...base, '喬提恩↔市區雙條約 15–25 分鐘，夜間班次較少可預留 Grab。']
  }
  if (area === 'north') {
    return [...base, '北芭去真理寺、阿卡莎可步行或短程雙條；去南芭海灘需 20 分鐘以上。']
  }
  return [...base, '住市中心步行可至 Beach Road，但真理寺、銀湖等需搭車。']
}

export const TRANSPORT_PHRASES: { th: string; zh: string }[] = [
  { th: 'ไปพัทยาเท่าไหร่', zh: '去芭提雅多少錢？' },
  { th: 'หยุดตรงนี้ได้ไหม', zh: '可以在這裡停嗎？' },
  { th: 'ไกลจากที่นี่ไหม', zh: '離這裡遠嗎？' },
  { th: 'ใช้เวลานานเท่าไหร่', zh: '要多久？' },
  { th: 'ไปท่าเรือบาลีไฮ', zh: '去 Bali Hai 碼頭' },
]
