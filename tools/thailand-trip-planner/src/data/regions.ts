import type { ThailandRegionId } from '../types'

export interface RegionHotelArea {
  id: string
  label: string
  intro: string
  hub: { nameZh: string; lat: number; lng: number }
}

export interface RegionMeta {
  id: ThailandRegionId
  labelZh: string
  labelShort: string
  defaultTitle: string
  defaultHotelArea: string
  hotelAreas: RegionHotelArea[]
  /** 主要入境機場代碼 */
  airportCode: 'BKK' | 'DMK' | 'CNX' | 'HKT' | 'KBV' | 'UTP'
  airportLabel: string
  /** 是否需要另計「樞紐↔目的地」交通（如曼谷↔芭提雅） */
  needsHubTransfer: boolean
  hubTransferLabel: string
  mapZoom: number
  supportsAdultNightlife: boolean
}

export const REGIONS: RegionMeta[] = [
  {
    id: 'pattaya',
    labelZh: '芭提雅',
    labelShort: '芭提雅',
    defaultTitle: '芭提雅之旅',
    defaultHotelArea: 'central',
    hotelAreas: [
      {
        id: 'central',
        label: '市中心 / Beach Road',
        intro:
          '步行可至 Beach Road、Central Festival；夜生活熱鬧，適合首次到訪。',
        hub: { nameZh: '市中心 Beach Road', lat: 12.9356, lng: 100.883 },
      },
      {
        id: 'jomtien',
        label: '喬提恩海灘',
        intro: '沙灘較安靜，適合家庭與長住；去 Walking Street 需搭車。',
        hub: { nameZh: '喬提恩海灘', lat: 12.8777, lng: 100.8676 },
      },
      {
        id: 'north',
        label: '北芭',
        intro: '近真理寺、Terminal 21；去南芭海灘需搭車。',
        hub: { nameZh: '北芭／阿卡莎一帶', lat: 12.9508, lng: 100.8887 },
      },
    ],
    airportCode: 'BKK',
    airportLabel: '曼谷素萬那普／廊曼 → 芭提雅',
    needsHubTransfer: true,
    hubTransferLabel: '曼谷↔芭提雅來回',
    mapZoom: 12,
    supportsAdultNightlife: true,
  },
  {
    id: 'bangkok',
    labelZh: '曼谷',
    labelShort: '曼谷',
    defaultTitle: '曼谷之旅',
    defaultHotelArea: 'sukhumvit',
    hotelAreas: [
      {
        id: 'sukhumvit',
        label: '素坤逸 / Asok',
        intro: 'BTS 沿線、商場與餐廳密集，交通最方便。',
        hub: { nameZh: 'Asok 交匯站', lat: 13.7373, lng: 100.5601 },
      },
      {
        id: 'oldtown',
        label: '舊城 / 大皇宮',
        intro: '寺廟與湄南河景點集中，適合文化行程。',
        hub: { nameZh: '大皇宮一帶', lat: 13.75, lng: 100.4915 },
      },
      {
        id: 'riverside',
        label: '河畔 / ICONSIAM',
        intro: '河景飯店與夜市，適合首次造訪曼谷。',
        hub: { nameZh: 'ICONSIAM', lat: 13.7267, lng: 100.5105 },
      },
    ],
    airportCode: 'BKK',
    airportLabel: '曼谷素萬那普／廊曼',
    needsHubTransfer: false,
    hubTransferLabel: '',
    mapZoom: 11,
    supportsAdultNightlife: false,
  },
  {
    id: 'chiangmai',
    labelZh: '清邁',
    labelShort: '清邁',
    defaultTitle: '清邁之旅',
    defaultHotelArea: 'oldtown',
    hotelAreas: [
      {
        id: 'oldtown',
        label: '古城區',
        intro: '寺廟、週日夜市步行可達，氛圍悠閒。',
        hub: { nameZh: '清邁古城', lat: 18.7877, lng: 98.9933 },
      },
      {
        id: 'nimman',
        label: '尼曼路',
        intro: '咖啡館、設計小店與年輕氛圍。',
        hub: { nameZh: '尼曼海明路', lat: 18.7965, lng: 98.9682 },
      },
      {
        id: 'outskirts',
        label: '郊區／山區',
        intro: '近大象自然公園、瀑布，適合自然行程。',
        hub: { nameZh: '清邁北郊', lat: 18.873, lng: 98.965 },
      },
    ],
    airportCode: 'CNX',
    airportLabel: '清邁國際機場（CNX）',
    needsHubTransfer: true,
    hubTransferLabel: '曼谷↔清邁來回（若飛 BKK）',
    mapZoom: 12,
    supportsAdultNightlife: false,
  },
  {
    id: 'phuket',
    labelZh: '普吉島',
    labelShort: '普吉',
    defaultTitle: '普吉島之旅',
    defaultHotelArea: 'patong',
    hotelAreas: [
      {
        id: 'patong',
        label: '芭東',
        intro: '最熱鬧海灘與夜生活，交通與餐廳選擇多。',
        hub: { nameZh: '芭東海灘', lat: 7.8965, lng: 98.2956 },
      },
      {
        id: 'kata',
        label: '卡塔 / 卡倫',
        intro: '沙灘較安靜，適合家庭與潛水。',
        hub: { nameZh: '卡塔海灘', lat: 7.8204, lng: 98.2983 },
      },
      {
        id: 'oldtown',
        label: '普吉老街',
        intro: '南洋建築與咖啡廳，適合半日文化散步。',
        hub: { nameZh: '普吉老街', lat: 7.8881, lng: 98.3975 },
      },
    ],
    airportCode: 'HKT',
    airportLabel: '普吉國際機場（HKT）',
    needsHubTransfer: false,
    hubTransferLabel: '',
    mapZoom: 11,
    supportsAdultNightlife: false,
  },
  {
    id: 'krabi',
    labelZh: '喀比',
    labelShort: '喀比',
    defaultTitle: '喀比之旅',
    defaultHotelArea: 'aonang',
    hotelAreas: [
      {
        id: 'aonang',
        label: '奧南',
        intro: '出海跳島與夕陽餐廳最方便的海灘區。',
        hub: { nameZh: '奧南海灘', lat: 8.0456, lng: 98.8234 },
      },
      {
        id: 'railay',
        label: '萊雷',
        intro: '石灰岩景觀與攀岩，需搭船進入。',
        hub: { nameZh: '萊雷西灘', lat: 8.0112, lng: 98.8367 },
      },
      {
        id: 'town',
        label: '喀比鎮',
        intro: '物價較低、近機場與夜市。',
        hub: { nameZh: '喀比鎮', lat: 8.0863, lng: 98.9063 },
      },
    ],
    airportCode: 'KBV',
    airportLabel: '喀比機場（KBV）',
    needsHubTransfer: false,
    hubTransferLabel: '',
    mapZoom: 11,
    supportsAdultNightlife: false,
  },
]

export const REGION_LIST = REGIONS

export function getRegionMeta(regionId: ThailandRegionId): RegionMeta {
  return REGIONS.find((r) => r.id === regionId) ?? REGIONS[0]
}

export function getRegionHotelArea(
  regionId: ThailandRegionId,
  areaId: string,
): RegionHotelArea | undefined {
  return getRegionMeta(regionId).hotelAreas.find((a) => a.id === areaId)
}

export function getHotelAreaLabel(regionId: ThailandRegionId, areaId: string): string {
  return getRegionHotelArea(regionId, areaId)?.label ?? areaId
}

export function getHotelAreaIntro(regionId: ThailandRegionId, areaId: string): string {
  return getRegionHotelArea(regionId, areaId)?.intro ?? ''
}
