import type { BudgetLevel, Interest, ThailandRegionId, TripConfig } from '../types'
import { getHotelAreaLabel } from './regions'
import { REGION_FOODS } from './foods-regions'

export type FoodArea = string | 'any'

export type FoodCategory = 'seafood' | 'thai' | 'market' | 'mall' | 'cafe' | 'international'

export interface FoodRecommendation {
  id: string
  regionId: ThailandRegionId
  nameZh: string
  nameTh: string
  area: FoodArea
  category: FoodCategory
  tiers: BudgetLevel[]
  /** 每人每餐參考（泰銖） */
  pricePerPersonThb: { min: number; max: number }
  highlights: string[]
  mustTry: string[]
  suitableFor: Interest[]
  pros: string
  tip: string
  openHours?: string
  mapQuery: string
}

export const FOOD_CATEGORY_LABELS: Record<FoodCategory, string> = {
  seafood: '海鮮',
  thai: '泰式料理',
  market: '夜市／市集',
  mall: '商場美食',
  cafe: '咖啡甜點',
  international: '西式／其他',
}

export const FOOD_AREA_ANY_LABEL = '全區適用'

export function getFoodAreaLabel(regionId: ThailandRegionId, area: FoodArea): string {
  if (area === 'any') return FOOD_AREA_ANY_LABEL
  return getHotelAreaLabel(regionId, area)
}

type FoodInput = Omit<FoodRecommendation, 'regionId'>

function tagPattaya(foods: FoodInput[]): FoodRecommendation[] {
  return foods.map((f) => ({ ...f, regionId: 'pattaya' as ThailandRegionId }))
}

const PATTAYA_FOODS_RAW: FoodInput[] = [
  {
    id: 'na-jomtien-seafood',
    nameZh: 'Na Jomtien 海鮮',
    nameTh: 'แนจอมเทียน ซีฟู้ด',
    area: 'jomtien',
    category: 'seafood',
    tiers: ['budget', 'mid'],
    pricePerPersonThb: { min: 400, max: 900 },
    highlights: ['現挑活海鮮', '海邊座位', '適合日落晚餐'],
    mustTry: ['烤虎蝦', '冬蔭功', '清蒸魚'],
    suitableFor: ['food', 'beach', 'family'],
    pros: '喬提恩最具代表性的海鮮餐廳之一，價格比市中心透明。',
    tip: '先問清楚每公斤價格；人多的時段建議預約靠海座位。',
    openHours: '約 11:00–22:00',
    mapQuery: 'Na+Jomtien+Seafood+Pattaya',
  },
  {
    id: 'king-seafood-naklua',
    nameZh: 'King Seafood（Naklua）',
    nameTh: 'คิง ซีฟู้ด',
    area: 'north',
    category: 'seafood',
    tiers: ['budget', 'mid'],
    pricePerPersonThb: { min: 450, max: 1000 },
    highlights: ['北芭魚市場旁', '平價海鮮', '本地客多'],
    mustTry: ['酸辣炒蛤蜊', '炸軟殼蟹', '椰子冰'],
    suitableFor: ['food', 'culture'],
    pros: '靠近 Naklua 魚市場，新鮮度好，適合想吃正宗泰式海鮮的人。',
    tip: '可下午逛魚市場、傍晚用餐；計價以公斤為主。',
    mapQuery: 'King+Seafood+Naklua+Pattaya',
  },
  {
    id: 'mum-aroi',
    nameZh: 'Mum Aroi 泰菜',
    nameTh: 'มัมอร่อย',
    area: 'central',
    category: 'thai',
    tiers: ['budget', 'mid'],
    pricePerPersonThb: { min: 250, max: 550 },
    highlights: ['老牌泰菜', '份量足', '近市區'],
    mustTry: ['青木瓜沙拉', '咖喱蟹', '泰式炒河粉'],
    suitableFor: ['food', 'culture', 'nightlife'],
    pros: '口味地道、價格親民，適合不想只吃觀光客餐廳的旅客。',
    tip: '尖峰 18:00–20:00 建議提早到；可外帶。',
    mapQuery: 'Mum+Aroi+Pattaya',
  },
  {
    id: 'the-glass-house',
    nameZh: 'The Glass House',
    nameTh: 'เดอะ กลาส เฮาส์',
    area: 'jomtien',
    category: 'international',
    tiers: ['mid', 'luxury'],
    pricePerPersonThb: { min: 600, max: 1400 },
    highlights: ['海景餐廳', '泰西融合', '約會氛圍'],
    mustTry: ['海鮮義大利麵', '烤魚排', '芒果甜點'],
    suitableFor: ['food', 'beach', 'wellness'],
    pros: '環境舒服、適合慶生或紀念日，喬提恩海灘步行可達。',
    tip: '日落時段景觀最佳，建議預約；著裝休閒即可。',
    openHours: '約 11:00–23:00',
    mapQuery: 'The+Glass+House+Pattaya',
  },
  {
    id: 'thepprasit-market',
    nameZh: 'Thepprasit 週末夜市',
    nameTh: 'ตลาดเทพประสิทธิ์',
    area: 'central',
    category: 'market',
    tiers: ['budget'],
    pricePerPersonThb: { min: 150, max: 400 },
    highlights: ['週五至週日', '路邊小吃', '海鮮燒烤'],
    mustTry: ['烤魷魚', '船麵', '芒果糯米飯'],
    suitableFor: ['food', 'nightlife', 'shopping'],
    pros: '在地夜市氛圍濃，適合邊逛邊吃、預算可控。',
    tip: '主要營業週末；帶現金，部分攤位不收卡。',
    openHours: '週五–日 約 17:00–23:00',
    mapQuery: 'Thepprasit+Night+Market+Pattaya',
  },
  {
    id: 'jomtien-night-market',
    nameZh: '喬提恩夜市',
    nameTh: 'ตลาดโต้รุ่งจอมเทียน',
    area: 'jomtien',
    category: 'market',
    tiers: ['budget', 'mid'],
    pricePerPersonThb: { min: 120, max: 350 },
    highlights: ['每日營業', '海鮮燒烤', '比市中心安靜'],
    mustTry: ['烤蝦', '泰式奶茶', '炸香蕉'],
    suitableFor: ['food', 'beach', 'family'],
    pros: '住在喬提恩時最方便，價格通常比 Walking Street 友善。',
    tip: '傍晚 18:00 後最熱鬧；可搭配海灘散步。',
    openHours: '約 17:00–22:30',
    mapQuery: 'Jomtien+Night+Market',
  },
  {
    id: 'terminal21-food',
    nameZh: 'Terminal 21 美食廣場',
    nameTh: 'เทอร์มินอล 21 ฟู้ดคอร์ท',
    area: 'north',
    category: 'mall',
    tiers: ['budget', 'mid'],
    pricePerPersonThb: { min: 80, max: 250 },
    highlights: ['冷氣', '選擇多', '近北芭景點'],
    mustTry: ['船麵', '海南雞飯', '泰式奶茶'],
    suitableFor: ['food', 'shopping', 'family', 'culture'],
    pros: '中午避暑、雨天備案，一個人也能輕鬆吃。',
    tip: '先買儲值卡再點餐；人潮中午較多。',
    mapQuery: 'Terminal+21+Pattaya+food+court',
  },
  {
    id: 'central-festival-food',
    nameZh: 'Central Festival 美食樓',
    nameTh: 'เซ็นทรัล เฟสติวัล ฟู้ดฮอลล์',
    area: 'central',
    category: 'mall',
    tiers: ['budget', 'mid'],
    pricePerPersonThb: { min: 100, max: 350 },
    highlights: ['海景商場', '連鎖＋在地攤', '逛街順便吃'],
    mustTry: ['泰式火鍋', '日式拉麵', '排隊甜品'],
    suitableFor: ['food', 'shopping', 'beach'],
    pros: '位置核心，吃完可逛 Beach Road 或海灘。',
    tip: '促銷常在平日午餐；可搭配商場停車場。',
    mapQuery: 'Central+Festival+Pattaya+food',
  },
  {
    id: 'ruen-tamarind',
    nameZh: 'Ruen Tamarind 傳統泰菜',
    nameTh: 'เรือนทามารินด์',
    area: 'central',
    category: 'thai',
    tiers: ['mid', 'luxury'],
    pricePerPersonThb: { min: 500, max: 1200 },
    highlights: ['庭院老宅', '擺盤精緻', '適合招待'],
    mustTry: ['宮廷式咖喱', '炸魚餅', '椰奶甜品'],
    suitableFor: ['food', 'culture', 'wellness'],
    pros: '氣氛佳、適合想體驗「泰式家宴感」的晚餐。',
    tip: '建議預約；著裝 smart casual。',
    mapQuery: 'Ruen+Tamarind+Pattaya',
  },
  {
    id: 'casa-pascal',
    nameZh: 'Casa Pascal 歐陸料理',
    nameTh: 'คาซ่า ปาสคาล',
    area: 'central',
    category: 'international',
    tiers: ['luxury'],
    pricePerPersonThb: { min: 1200, max: 2500 },
    highlights: ['精緻西餐', '酒單完整', '慶祝場合'],
    mustTry: ['法式前菜', '牛排', '侍酒師推薦酒款'],
    suitableFor: ['food', 'wellness'],
    pros: '芭提雅少數高水準西餐之一，適合特殊日子。',
    tip: '需預約；著裝較正式。',
    mapQuery: 'Casa+Pascal+Pattaya',
  },
  {
    id: 'pattaya-floating-market-food',
    nameZh: '四方水上市場小吃',
    nameTh: 'ตลาดน้ำสี่ภาค อาหาร',
    area: 'any',
    category: 'market',
    tiers: ['budget', 'mid'],
    pricePerPersonThb: { min: 200, max: 500 },
    highlights: ['河畔市集', '泰式小吃', '拍照＋用餐'],
    mustTry: ['船麵', '烤糯米', '椰子冰淇淋'],
    suitableFor: ['food', 'culture', 'family'],
    pros: '一次體驗多種小吃，適合半日行程順道用餐。',
    tip: '門票與船票另計；傍晚燈光較美。',
    mapQuery: 'Pattaya+Floating+Market',
  },
  {
    id: 'breeze-cafe-jomtien',
    nameZh: 'Breeze 海灘咖啡',
    nameTh: 'บรีซ คาเฟ่ จอมเทียน',
    area: 'jomtien',
    category: 'cafe',
    tiers: ['mid'],
    pricePerPersonThb: { min: 150, max: 350 },
    highlights: ['海景咖啡', '早午餐', '拍照友善'],
    mustTry: ['泰式冰咖啡', '班尼迪克蛋', '鬆餅'],
    suitableFor: ['food', 'beach', 'wellness'],
    pros: '適合悠閒早晨或下午歇腳，搭配喬提恩海灘。',
    tip: '周末中午可能需候位；防曬後進室內休息佳。',
    mapQuery: 'Breeze+cafe+Jomtien+Pattaya',
  },
  {
    id: 'je-je-buddha-belly',
    nameZh: 'Je Je Buddha Belly 路邊名店',
    nameTh: 'เจ๊เจ๊ บุดด้า เบลลี่',
    area: 'central',
    category: 'thai',
    tiers: ['budget'],
    pricePerPersonThb: { min: 120, max: 280 },
    highlights: ['排隊名店', '平價泰菜', '在地人推薦'],
    mustTry: ['酸辣炒肉', '炸魚', '泰式奶茶'],
    suitableFor: ['food', 'nightlife'],
    pros: 'CP 值高，適合預算有限仍想吃好泰菜的人。',
    tip: '尖峰需排隊；可外帶。',
    mapQuery: 'Je+Je+Buddha+Belly+Pattaya',
  },
  {
    id: 'mantra-restaurant',
    nameZh: 'Mantra 亞洲融合',
    nameTh: 'มนตรา',
    area: 'north',
    category: 'international',
    tiers: ['luxury'],
    pricePerPersonThb: { min: 900, max: 1800 },
    highlights: ['五星飯店餐廳', '亞洲融合', '夜景'],
    mustTry: ['壽司拼盤', '泰式前菜', '主廚套餐'],
    suitableFor: ['food', 'wellness', 'culture'],
    pros: '服務與環境一流，適合商務或紀念日晚餐。',
    tip: '建議預約窗邊位；著裝 smart casual。',
    mapQuery: 'Mantra+Restaurant+Pattaya',
  },
]

export const ALL_FOODS: FoodRecommendation[] = [
  ...tagPattaya(PATTAYA_FOODS_RAW),
  ...REGION_FOODS,
]

/** @deprecated */
export const FOODS = ALL_FOODS

function scoreFood(food: FoodRecommendation, config: TripConfig): number {
  if (food.regionId !== config.regionId) return -1000
  if (food.area !== 'any' && food.area !== config.hotelArea) return -1
  let score = 0
  if (food.tiers.includes(config.budget)) score += 20
  else if (
    (config.budget === 'mid' && food.tiers.includes('budget')) ||
    (config.budget === 'luxury' && food.tiers.includes('mid'))
  ) {
    score += 8
  }
  for (const interest of config.interests) {
    if (food.suitableFor.includes(interest)) score += 3
  }
  if (config.interests.includes('food')) score += 8
  if (food.category === 'seafood' && config.interests.includes('food')) score += 4
  if (food.category === 'market' && config.budget === 'budget') score += 3
  return score
}

export function getRecommendedFoods(
  config: TripConfig,
  limit = 8,
): FoodRecommendation[] {
  return ALL_FOODS.map((f) => ({ f, score: scoreFood(f, config) }))
    .filter((x) => x.score >= 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.f)
}

export function getTopFood(config: TripConfig): FoodRecommendation | undefined {
  return getRecommendedFoods(config, 1)[0]
}
