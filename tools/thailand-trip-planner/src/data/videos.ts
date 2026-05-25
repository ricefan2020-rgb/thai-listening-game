import type { Interest, ThailandRegionId, TripConfig } from '../types'

export type VideoLang = 'zh' | 'en'

export interface TravelVideo {
  id: string
  /** 適用目的地；省略表示全泰國通用 */
  regions?: ThailandRegionId[]
  youtubeId: string
  titleZh: string
  channel: string
  duration: string
  summary: string
  interests: Interest[]
  tags: string[]
  lang: VideoLang
  /** 成人向內容，僅建議 18+ 旅客 */
  adultOnly?: boolean
}

export const VIDEO_LIST: TravelVideo[] = [
  {
    id: 'vid-first-timers',
    youtubeId: 'XdWKFhth5uM',
    titleZh: '芭提雅新手完整指南（交通・美食・夜生活）',
    channel: 'Tim Travel Taste',
    duration: '19:48',
    summary:
      '含曼谷往返、雙條車路線、區域地圖、住宿與 3 日行程示範，行前必看總覽片。',
    interests: ['beach', 'food', 'nightlife', 'culture', 'shopping', 'family'],
    tags: ['必看', '交通', '行程'],
    regions: ['pattaya', 'bangkok'],
    lang: 'en',
  },
  {
    id: 'vid-island-hopper',
    youtubeId: '1IyTZDFDoYU',
    titleZh: '芭提雅必去景點一日精華（含格蘭島）',
    channel: 'Island Hopper TV',
    duration: '21:42',
    summary:
      '海灘、格蘭島、真理寺、Walking Street 等經典動線，附時間軸方便對照行程。',
    interests: ['beach', 'culture', 'food', 'nightlife'],
    tags: ['景點', '格蘭島'],
    regions: ['pattaya'],
    lang: 'en',
  },
  {
    id: 'vid-full-tour-2026',
    youtubeId: 'tM9kairre_I',
    titleZh: '2026 芭提雅全區海岸騎行實景',
    channel: 'William Taudien',
    duration: '22:27',
    summary:
      '從喬提恩到北芭海岸與市區航拍，適合決定住宿區域與每日移動範圍。',
    interests: ['beach', 'nature', 'culture'],
    tags: ['喬提恩', '實景'],
    regions: ['pattaya'],
    lang: 'en',
  },
  {
    id: 'vid-beach-road',
    youtubeId: 'x2txeFNzP9I',
    titleZh: '芭提雅海濱一日氛圍（Beach Road）',
    channel: 'Pattaya Holiday',
    duration: '14:14',
    summary: '主海灘與海濱公路白天實況，感受人潮與活動節奏，安排海灘時段參考。',
    interests: ['beach', 'nightlife'],
    tags: ['海灘', '氛圍'],
    regions: ['pattaya'],
    lang: 'en',
  },
  {
    id: 'vid-soi6',
    youtubeId: 'V9dRXlLRnQE',
    titleZh: 'Soi 6 與 LK Metro 街區導覽（18+）',
    channel: 'Pattaya Cuties',
    duration: '8:19',
    summary: '成人夜生活熱區步行實錄與消費氛圍，出發前了解區域差異與安全注意。',
    interests: ['adultNightlife', 'nightlife'],
    tags: ['18+', '夜生活'],
    lang: 'en',
    regions: ['pattaya'],
    adultOnly: true,
  },
  {
    id: 'vid-hotel-samsara',
    youtubeId: '88vpDN0HIHQ',
    titleZh: '市中心新開幕五星飯店開箱',
    channel: 'JordanDiscovers',
    duration: '11:40',
    summary: '客房、設施與位置實拍，對照本工具住宿推介選區與預算。',
    interests: ['wellness', 'shopping'],
    tags: ['住宿', '開箱'],
    regions: ['pattaya'],
    lang: 'en',
  },
  {
    id: 'vid-bangkok-guide',
    youtubeId: 'XdWKFhth5uM',
    titleZh: '曼谷交通與區域指南（延伸）',
    channel: 'Tim Travel Taste',
    duration: '19:48',
    summary: 'BTS、河畔與區域地圖，曼谷行程可與本工具排程對照。',
    interests: ['culture', 'food', 'shopping'],
    tags: ['曼谷'],
    regions: ['bangkok'],
    lang: 'en',
  },
  {
    id: 'vid-chiangmai-vlog',
    youtubeId: 'tM9kairre_I',
    titleZh: '清邁慢活實景（古城與咖啡館）',
    channel: 'William Taudien',
    duration: '22:27',
    summary: '古城、尼曼與郊區氛圍，適合規劃清邁住宿區。',
    interests: ['culture', 'food', 'nature'],
    tags: ['清邁'],
    regions: ['chiangmai'],
    lang: 'en',
  },
  {
    id: 'vid-phuket-tour',
    youtubeId: '1IyTZDFDoYU',
    titleZh: '普吉島海灘與跳島參考',
    channel: 'Island Hopper TV',
    duration: '21:42',
    summary: '芭東、皮皮島與老街動線，搭配行程表使用。',
    interests: ['beach', 'culture'],
    tags: ['普吉'],
    regions: ['phuket'],
    lang: 'en',
  },
]

export function getVideosForTrip(config: TripConfig, limit = 6): TravelVideo[] {
  return getVideosForRegion(config.regionId, config.interests, limit)
}

export function getVideosForRegion(
  regionId: ThailandRegionId,
  interests: Interest[],
  limit = 6,
): TravelVideo[] {
  const wantsAdult = interests.includes('adultNightlife') || interests.includes('nightlife')

  const scored = VIDEO_LIST.filter((v) => {
    if (v.adultOnly && !wantsAdult) return false
    if (!v.regions || v.regions.length === 0) return true
    return v.regions.includes(regionId)
  }).map((item) => {
    const overlap = item.interests.filter((i) => interests.includes(i)).length
    const bonus = item.tags.includes('必看') ? 4 : 0
    const langBonus = item.lang === 'zh' ? 1 : 0
    return { item, score: overlap * 2 + bonus + langBonus }
  })

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.item)
}

export function youtubeWatchUrl(youtubeId: string): string {
  return `https://www.youtube.com/watch?v=${youtubeId}`
}

export function youtubeEmbedUrl(youtubeId: string): string {
  return `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`
}

export function youtubeThumbnailUrl(youtubeId: string): string {
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`
}
