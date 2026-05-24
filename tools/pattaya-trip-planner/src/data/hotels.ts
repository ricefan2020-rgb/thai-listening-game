import type { BudgetLevel, Interest, TripConfig } from '../types'

export type HotelArea = TripConfig['hotelArea']

export interface HotelRecommendation {
  id: string
  nameZh: string
  nameTh: string
  area: HotelArea
  /** 適合的預算等級 */
  tiers: BudgetLevel[]
  pricePerNightThb: { min: number; max: number }
  highlights: string[]
  suitableFor: Interest[]
  pros: string
  cons?: string
  tip: string
  mapQuery: string
}

export const HOTEL_AREA_LABELS: Record<HotelArea, string> = {
  central: '市中心 / Beach Road',
  jomtien: '喬提恩海灘',
  north: '北芭（Terminal 21、人妖秀一帶）',
}

export const HOTEL_AREA_INTRO: Record<HotelArea, string> = {
  central:
    '步行可至 Beach Road、Central Festival，雙條與夜市密集；夜生活吵雜，適合首次到訪、想省交通時間的旅客。',
  jomtien:
    '沙灘較長、水質通常優於市中心，氛圍偏度假；去 Walking Street 約 15–25 分鐘車程，適合家庭與想安靜的旅客。',
  north:
    '近真理寺、阿卡莎人妖秀、Terminal 21；去南芭海灘需搭車，適合已去過芭提雅、行程以北芭景點為主者。',
}

export const HOTELS: HotelRecommendation[] = [
  // —— 市中心 ——
  {
    id: 'sawasdee-coco',
    nameZh: 'Sawasdee Coco（考山路集團風）',
    nameTh: 'สวัสดี โคโค่',
    area: 'central',
    tiers: ['budget'],
    pricePerNightThb: { min: 650, max: 950 },
    highlights: ['近 Beach Road', '設計旅宿', '含簡易早餐（視房型）'],
    suitableFor: ['nightlife', 'beach', 'food'],
    pros: '價格親民、位置熱鬧，適合年輕旅客與短住。',
    cons: '房間偏小、夜間較吵。',
    tip: '預訂時註明高樓層或背向街道，減少摩托聲。',
    mapQuery: 'Sawasdee+Coco+Pattaya',
  },
  {
    id: 'red-planet-pattaya',
    nameZh: 'Red Planet Pattaya',
    nameTh: 'เรด แพลนเน็ต พัทยา',
    area: 'central',
    tiers: ['budget', 'mid'],
    pricePerNightThb: { min: 800, max: 1200 },
    highlights: ['連鎖品牌', '近海灘', '房況穩定'],
    suitableFor: ['beach', 'shopping', 'family'],
    pros: '品質一致、前台英語可溝通，性價比高。',
    tip: 'Agoda／官網常見早鳥價，週末建議提前訂。',
    mapQuery: 'Red+Planet+Pattaya',
  },
  {
    id: 'ibis-pattaya',
    nameZh: 'ibis Pattaya',
    nameTh: 'ไอบิส พัทยา',
    area: 'central',
    tiers: ['mid'],
    pricePerNightThb: { min: 1400, max: 2200 },
    highlights: ['近 Beach Road', '連鎖標準化', '早餐可選'],
    suitableFor: ['beach', 'shopping', 'food', 'culture'],
    pros: '位置與價格平衡，適合首次旅客的中價位選擇。',
    cons: '景觀房有限，旺季漲價明顯。',
    tip: '搭配 Central Festival 逛街與海灘步行動線佳。',
    mapQuery: 'ibis+Pattaya',
  },
  {
    id: 'holiday-inn-pattaya',
    nameZh: 'Holiday Inn Pattaya',
    nameTh: 'ฮอลิเดย์ อินน์ พัทยา',
    area: 'central',
    tiers: ['mid', 'luxury'],
    pricePerNightThb: { min: 2200, max: 3800 },
    highlights: ['北芭海灣景', '泳池', '家庭友善'],
    suitableFor: ['family', 'beach', 'wellness'],
    pros: '設施完整、親子與長輩接受度高。',
    tip: '選面向海灣房型，日落景致佳。',
    mapQuery: 'Holiday+Inn+Pattaya',
  },
  {
    id: 'hilton-pattaya',
    nameZh: 'Hilton Pattaya',
    nameTh: 'ฮิลตัน พัทยา',
    area: 'central',
    tiers: ['luxury'],
    pricePerNightThb: { min: 4500, max: 8500 },
    highlights: ['Central Festival 上蓋', '高空泳池', '景觀餐廳'],
    suitableFor: ['shopping', 'nightlife', 'wellness'],
    pros: '購物與交通樞紐一體，奢華旅客首選之一。',
    cons: '價格高，周末與假期需提早訂房。',
    tip: '下午茶與高空酒吧可當行程景點，不必住滿也可體驗。',
    mapQuery: 'Hilton+Pattaya',
  },
  // —— 喬提恩 ——
  {
    id: 'jomtien-guesthouse',
    nameZh: '喬提恩海灘民宿區（Jomtien Beach Road）',
    nameTh: 'เจ้าของบ้านพักจอมเทียน',
    area: 'jomtien',
    tiers: ['budget'],
    pricePerNightThb: { min: 600, max: 1000 },
    highlights: ['近沙灘', '長住友善', '摩托出租多'],
    suitableFor: ['beach', 'food', 'nature'],
    pros: '便宜、生活感強，適合長住與自己煮食。',
    cons: '品質落差大，需看評價挑選。',
    tip: '優先選 Agoda 評分 8+ 且有近期評論的房源。',
    mapQuery: 'Jomtien+Beach+Road+Pattaya',
  },
  {
    id: 'd-varee-jomtien',
    nameZh: 'D Varee Jomtien Beach',
    nameTh: 'ดี วารี จอมเทียน บีช',
    area: 'jomtien',
    tiers: ['mid'],
    pricePerNightThb: { min: 1500, max: 2600 },
    highlights: ['沙灘步行 3–5 分', '泳池', '海景房'],
    suitableFor: ['beach', 'family', 'wellness'],
    pros: '度假感強於市中心，價格仍屬中價位。',
    tip: '傍晚可在 Jomtien Beach Road 海鮮大排檔用餐。',
    mapQuery: 'D+Varee+Jomtien+Beach',
  },
  {
    id: 'centara-grand-mirage',
    nameZh: 'Centara Grand Mirage Beach Resort',
    nameTh: 'เซ็นทารา แกรนด์ มิราจ',
    area: 'jomtien',
    tiers: ['mid', 'luxury'],
    pricePerNightThb: { min: 3500, max: 7000 },
    highlights: ['親子水上樂園', '私人海灘通道', '適合家庭'],
    suitableFor: ['family', 'beach', 'wellness'],
    pros: '親子設施完整，可待在飯店一整天。',
    cons: '離 Walking Street 較遠，需 Grab。',
    tip: '若行程以親子為主，可減少每日移動趟數。',
    mapQuery: 'Centara+Grand+Mirage+Beach+Resort+Pattaya',
  },
  {
    id: 'veranda-resort-jomtien',
    nameZh: 'Veranda Resort Pattaya Na Jomtien',
    nameTh: 'เวอร์แอนดา รีสอร์ท นาจอมเทียน',
    area: 'jomtien',
    tiers: ['luxury'],
    pricePerNightThb: { min: 5000, max: 9500 },
    highlights: ['設計度假風', '無邊際泳池', '海景'],
    suitableFor: ['beach', 'wellness', 'nature'],
    pros: '安靜、拍照質感高，適合蜜月與放鬆假期。',
    tip: '附近 Na Jomtien 海鮮餐廳選擇多，建議預約。',
    mapQuery: 'Veranda+Resort+Pattaya+Na+Jomtien',
  },
  // —— 北芭 ——
  {
    id: 'pattaya-bus-terminal-area',
    nameZh: '北芭車站周邊旅館（Pattaya Bus Terminal）',
    nameTh: 'โรงแรมใกล้สถานีขนส่งพัทยา',
    area: 'north',
    tiers: ['budget'],
    pricePerNightThb: { min: 550, max: 900 },
    highlights: ['近機場巴士終點', '轉車方便', '價格低'],
    suitableFor: ['culture', 'food'],
    pros: '抵達當晚或離開前一夜方便，適合過渡住宿。',
    cons: '離海灘遠，不適合整趟都以海灘為主。',
    tip: '若主要玩真理寺、阿卡莎，可接受；否則建議換區。',
    mapQuery: 'Pattaya+Bus+Terminal',
  },
  {
    id: 'grande-centre-point',
    nameZh: 'Grande Centre Point Pattaya',
    nameTh: 'แกรนด์ เซ็นเตอร์ พอยท์ พัทยา',
    area: 'north',
    tiers: ['mid', 'luxury'],
    pricePerNightThb: { min: 2800, max: 4800 },
    highlights: ['近 Terminal 21', '高空泳池', '家庭套房'],
    suitableFor: ['shopping', 'family', 'culture'],
    pros: '北芭新商圈，購物吃飯一體，去阿卡莎秀近。',
    tip: '真理寺可安排半天，搭配飯店泳池休息。',
    mapQuery: 'Grande+Centre+Point+Pattaya',
  },
  {
    id: 'best-western-nexen',
    nameZh: 'Best Western Plus Nexen Pattaya',
    nameTh: 'เบสต์ เวสเทิร์น พลัส เน็กเซ่น',
    area: 'north',
    tiers: ['mid'],
    pricePerNightThb: { min: 1600, max: 2800 },
    highlights: ['近 Tiffany Show', '交通樞紐', '早餐評價佳'],
    suitableFor: ['nightlife', 'culture', 'shopping'],
    pros: '看秀與北芭景點方便，價格比五星親民。',
    tip: '看秀當晚可步行或短程 Grab，避開尖峰塞車。',
    mapQuery: 'Best+Western+Plus+Nexen+Pattaya',
  },
  {
    id: 'royal-cliff',
    nameZh: 'Royal Cliff Beach Hotel',
    nameTh: 'รอยัล คลิฟ บีช',
    area: 'north',
    tiers: ['luxury'],
    pricePerNightThb: { min: 4000, max: 7500 },
    highlights: ['多棟客房區', '會議度假', '海景園區'],
    suitableFor: ['wellness', 'family', 'culture'],
    pros: '園區大、適合長住與活動，偏安靜度假。',
    cons: '離市中心夜市遠，需搭車。',
    tip: 'Pratumnak 山丘上，空氣較好，適合長輩休養。',
    mapQuery: 'Royal+Cliff+Beach+Hotel+Pattaya',
  },
]

function scoreHotel(hotel: HotelRecommendation, config: TripConfig): number {
  if (hotel.area !== config.hotelArea) return -1
  let score = 0
  if (hotel.tiers.includes(config.budget)) score += 20
  else if (
    (config.budget === 'mid' && hotel.tiers.includes('budget')) ||
    (config.budget === 'luxury' && hotel.tiers.includes('mid'))
  ) {
    score += 8
  }
  for (const interest of config.interests) {
    if (hotel.suitableFor.includes(interest)) score += 3
  }
  if (config.interests.includes('family') && hotel.suitableFor.includes('family')) score += 5
  if (config.interests.includes('adultNightlife') && config.hotelArea === 'central') score += 2
  return score
}

export function getRecommendedHotels(
  config: TripConfig,
  limit = 5,
): HotelRecommendation[] {
  return HOTELS.filter((h) => h.area === config.hotelArea)
    .map((h) => ({ h, score: scoreHotel(h, config) }))
    .filter((x) => x.score >= 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.h)
}

export function getTopHotel(config: TripConfig): HotelRecommendation | undefined {
  return getRecommendedHotels(config, 1)[0]
}

export function nightsForStay(days: number): number {
  return Math.max(1, days - 1)
}
