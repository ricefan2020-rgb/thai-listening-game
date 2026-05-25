import type { BudgetLevel, ThailandRegionId, TripConfig } from '../types'
import { getRegionMeta, getRegionHotelArea } from './regions'
import { ARRIVAL_BY_REGION, LOCAL_BY_REGION } from './transport-regions'

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

export function getHotelHub(regionId: ThailandRegionId, areaId: string) {
  const area = getRegionHotelArea(regionId, areaId)
  if (area) return area.hub
  const meta = getRegionMeta(regionId)
  return meta.hotelAreas[0]?.hub ?? { nameZh: meta.labelZh, lat: 13.7563, lng: 100.5018 }
}

export function getArrivalOptions(regionId: ThailandRegionId): TransportOption[] {
  if (regionId === 'pattaya') return GETTING_TO_PATTAYA
  return ARRIVAL_BY_REGION[regionId] ?? []
}

export function getLocalTransportOptions(regionId: ThailandRegionId): LocalTransport[] {
  if (regionId === 'pattaya') return LOCAL_TRANSPORT
  return LOCAL_BY_REGION[regionId] ?? LOCAL_TRANSPORT
}

const DEFAULT_ARRIVAL_ID: Record<BudgetLevel, string> = {
  budget: 'airport-bus',
  mid: 'ekamai-van',
  luxury: 'private-car',
}

export function getDefaultArrivalOption(
  regionId: ThailandRegionId,
  budget: BudgetLevel,
): TransportOption {
  const options = getArrivalOptions(regionId)
  if (options.length === 0) {
    return GETTING_TO_PATTAYA[0]
  }
  const id = DEFAULT_ARRIVAL_ID[budget]
  return options.find((o) => o.id === id) ?? options[0]
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

/** 樞紐↔目的地單程（依預算等級預設交通方式） */
export function estimateArrivalTransferCost(
  regionId: ThailandRegionId,
  budget: BudgetLevel,
  travelers: number,
  optionId?: string,
): { min: number; max: number; option: TransportOption } {
  const options = getArrivalOptions(regionId)
  const option =
    options.find((o) => o.id === optionId) ??
    getDefaultArrivalOption(regionId, budget)
  const cost = estimateTransportOptionCost(option, budget, travelers)
  return { ...cost, option }
}

/** 樞紐↔目的地來回（曼谷直達目的地則為 0） */
export function estimateRoundTripTransferCost(
  config: TripConfig,
): { min: number; max: number; option: TransportOption | null } {
  const meta = getRegionMeta(config.regionId)
  if (!meta.needsHubTransfer) {
    return { min: 0, max: 0, option: null }
  }
  const oneWay = estimateArrivalTransferCost(
    config.regionId,
    config.budget,
    config.travelers,
    config.arrivalTransportId,
  )
  if (oneWay.min === 0 && oneWay.max === 0) {
    return { min: 0, max: 0, option: oneWay.option }
  }
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

export function getTransportTipsForArea(
  regionId: ThailandRegionId,
  areaId: string,
): string[] {
  const meta = getRegionMeta(regionId)
  if (regionId === 'pattaya') {
    const base = [
      '雙條車沿 Beach Road ↔ Walking Street 最密集，傍晚易塞可改 Grab。',
      '去格蘭島、東芭、羅摩衍那等郊區景點，建議包車半日或跟團。',
    ]
    if (areaId === 'jomtien') {
      return [...base, '喬提恩↔市區雙條約 15–25 分鐘，夜間班次較少可預留 Grab。']
    }
    if (areaId === 'north') {
      return [...base, '北芭去真理寺、阿卡莎可步行或短程雙條；去南芭海灘需 20 分鐘以上。']
    }
    return [...base, '住市中心步行可至 Beach Road，但真理寺、銀湖等需搭車。']
  }
  if (regionId === 'bangkok') {
    return [
      '尖峰時段 BTS/MRT 優先，Grab 可能塞車。',
      '大皇宮、臥佛寺建議早到；河畔景點可搭快船串連。',
      '機場快線與市區 MRT 銜接，預留轉乘時間。',
    ]
  }
  if (regionId === 'chiangmai') {
    return [
      '古城適合步行或租腳踏車；郊區瀑布建議包車。',
      '紅色雙條需議價；夜間 Grab 較穩。',
      '若飛 BKK 再轉清邁，火車夜車可省一晚住宿。',
    ]
  }
  if (regionId === 'phuket') {
    return [
      '芭東↔卡塔↔老街以 Grab 最方便；跳島需預留碼頭時間。',
      '雨季注意出海取消政策；暈船者備藥。',
      '機場在島北，確認住宿區車程。',
    ]
  }
  return [
    `${meta.labelZh}：奧南搭船去萊雷與四島最方便。`,
    'Grab 到碼頭後改搭長尾船；雨季注意海況。',
    '機場 KBV 距奧南約 30 分鐘車程。',
  ]
}

export const TRANSPORT_PHRASES: { th: string; zh: string }[] = [
  { th: 'ไปพัทยาเท่าไหร่', zh: '去芭提雅多少錢？' },
  { th: 'หยุดตรงนี้ได้ไหม', zh: '可以在這裡停嗎？' },
  { th: 'ไกลจากที่นี่ไหม', zh: '離這裡遠嗎？' },
  { th: 'ใช้เวลานานเท่าไหร่', zh: '要多久？' },
  { th: 'ไปท่าเรือบาลีไฮ', zh: '去 Bali Hai 碼頭' },
]
