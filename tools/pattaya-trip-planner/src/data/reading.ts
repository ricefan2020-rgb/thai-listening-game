import type { Interest } from '../types'

export type ReadingSource = 'app' | 'guide'

export interface ReadingRecommendation {
  id: string
  source: ReadingSource
  titleZh: string
  summary: string
  /** 主程式短文 id，連結至泰文聽力遊戲 */
  articleId?: string
  interests: Interest[]
  tags: string[]
  readMinutes: number
  /** 工具內建指南全文（source=guide） */
  content?: string
}

export const READING_LIST: ReadingRecommendation[] = [
  {
    id: 'guide-pattaya-transport',
    source: 'guide',
    titleZh: '芭提雅交通實用指南',
    summary: '雙條車講價、機場巴士、Grab 與包車時機一次搞懂。',
    interests: ['beach', 'food', 'nightlife', 'family', 'culture', 'shopping', 'nature', 'wellness'],
    tags: ['交通', '必讀'],
    readMinutes: 5,
    content: `## 抵達芭提雅
從素萬那普機場可搭 389 機場巴士（約 ฿134），或到 Ekkamai 搭小巴。若 3–4 人同行，包車分攤有時更划算。

## 市區移動
**雙條車**沿 Beach Road 與 Second Road 循環，一般 ฿10／人；若包車去非固定路線，先講價。  
**Grab**適合夜間從 Walking Street 返回飯店。  
**租機車**自由但需注意安全帽、右側行車與臨檢。

## 郊區景點
東芭、羅摩衍那、銀湖等距離遠，建議：
- 跟半日團（含門票與接送）
- 飯店代訂包車（4 小時約 ฿1,200–1,800）
- Klook / GetYourGuide 預訂含接送方案

## 實用泰文
- ไป…เท่าไหร่（去…多少錢？）
- หยุดตรงนี้（停在這裡）
- ใกล้ไหม（近嗎？）`,
  },
  {
    id: 'guide-pattaya-beach',
    source: 'guide',
    titleZh: '芭提雅海灘與離島攻略',
    summary: '主海灘、喬提恩、格蘭島差異與最佳時段。',
    interests: ['beach', 'family', 'nature'],
    tags: ['海灘', '格蘭島'],
    readMinutes: 4,
    content: `## 三大海灘區
**Pattaya Beach（主海灘）**：交通最方便，水上活動多，人潮也最多。  
**Jomtien（喬提恩）**：沙質較細、較安靜，適合家庭與長住。  
**Koh Larn（格蘭島）**：需從 Bali Hai Pier 搭船，建議早去早回。

## 時間建議
- 上午：格蘭島浮潛、主海灘游泳
- 傍晚：喬提恩看夕陽
- 避免正午長時間曝曬

## 安全提示
選有救生員的海域；浮潛不觸碰珊瑚；暈船者備暈船藥。`,
  },
  {
    id: 'guide-pattaya-food',
    source: 'guide',
    titleZh: '芭提雅美食地圖',
    summary: '海鮮碼頭、浮動市集、路邊小吃與商場美食樓。',
    interests: ['food', 'nightlife', 'shopping'],
    tags: ['美食', '夜市'],
    readMinutes: 4,
    content: `## 必試體驗
**Naklua 海鮮**：現挑現煮，記得確認計價單位（公斤／份）。  
**四方水上市場**：傍晚拍照＋河畔小吃。  
**Terminal 21 / Central**：冷氣美食廣場，適合中午避暑。

## 點餐小提示
- ไม่เผ็ด（不要辣）、เผ็ดน้อย（小辣）
- ขอใบเสร็จ（請給收據）
- 路邊攤準備小面額泰銖

## 搭配行程
海鮮適合排傍晚；料理課程適合上午；夜市與 Walking Street 可同一晚。`,
  },
  {
    id: 'guide-pattaya-adult-nightlife',
    source: 'guide',
    titleZh: '芭提雅成人夜生活安全指南',
    summary: '酒吧計價、防詐騙、深夜交通與 18+ 注意事項（僅供成年旅客）。',
    interests: ['adultNightlife', 'nightlife'],
    tags: ['成人夜生活', '必讀', '18+'],
    readMinutes: 6,
    content: `## 適用對象
本指南僅供 **年滿 18 歲** 且了解當地娛樂文化的成年旅客。親子行程請勿安排此類景點。

## 主要區域
- **Soi 6**：短巷酒吧密集，氣氛直接，建議先問最低消費。
- **Soi 7 / 8**：鄰近海灘，選擇多，可與 Beach Road 啤酒吧串連。
- **LK Metro**：室內複合酒吧區，雨天備選。
- **Soi Buakhao**：價格通常較親民，在地氛圍。
- **Walking Street 後段**：大型夜店，約 22:00 後最熱鬧。

## 計價與防詐
- 進店前確認：入場費、座位費、小姐飲料（lady drink）價格。
- 自己的酒水與服務人員飲料分開結帳。
- 不押護照、不跟陌生人去第二現場。
- 現金為主，保留小面額；離店前當場對帳。

## 安全與交通
- 結伴同行，飲酒適量；手機與錢包貼身保管。
- 23:00 後 Grab 回程較穩；避免無照摩托「黑車」。
- 遇糾紛優先離開現場，必要時聯絡旅遊警察（1155）。

## 實用泰文
- เท่าไหร่（多少錢？）
- ไม่เอา（不要）
- คิดเงิน（結帳）
- แพงไป（太貴了）`,
  },
  {
    id: 'ar1',
    source: 'app',
    articleId: 'ar1',
    titleZh: '第一次到曼谷',
    summary: '機場轉乘、寺廟參訪與夜市體驗，適合行前暖身閱讀。',
    interests: ['culture', 'food'],
    tags: ['泰文短文', '曼谷轉機'],
    readMinutes: 3,
  },
  {
    id: 'ar5',
    source: 'app',
    articleId: 'ar5',
    titleZh: '清邁之旅',
    summary: '慢活旅行節奏參考：單車、步行街與手作紀念品。',
    interests: ['culture', 'shopping', 'food'],
    tags: ['泰文短文', '旅行節奏'],
    readMinutes: 3,
  },
  {
    id: 'ar7',
    source: 'app',
    articleId: 'ar7',
    titleZh: '搭 BTS 逛曼谷',
    summary: '看標示、問站務與換線技巧，曼谷轉車必備。',
    interests: ['shopping', 'food'],
    tags: ['泰文短文', '曼谷交通'],
    readMinutes: 3,
  },
  {
    id: 'ar15',
    source: 'app',
    articleId: 'ar15',
    titleZh: '普吉島的海灘',
    summary: '海島家庭旅遊敘事，可對照芭提雅海灘差異。',
    interests: ['beach', 'family'],
    tags: ['泰文短文', '海島'],
    readMinutes: 3,
  },
  {
    id: 'ar3',
    source: 'app',
    articleId: 'ar3',
    titleZh: '泰國的早餐',
    summary: '糯米飯、烤豬與泰式冰茶，出發前學會點餐詞彙。',
    interests: ['food'],
    tags: ['泰文短文', '飲食'],
    readMinutes: 3,
  },
  {
    id: 'ar4',
    source: 'app',
    articleId: 'ar4',
    titleZh: '微笑的國度',
    summary: '合十禮儀與問候文化，進寺廟與互動必知。',
    interests: ['culture'],
    tags: ['泰文短文', '禮儀'],
    readMinutes: 3,
  },
  {
    id: 'ar16',
    source: 'app',
    articleId: 'ar16',
    titleZh: '水燈節的晚上',
    summary: '泰國節慶氛圍與傳統詞彙，若行程遇節日可參考。',
    interests: ['culture'],
    tags: ['泰文短文', '節慶'],
    readMinutes: 3,
  },
]

export function getRecommendationsForTrip(interests: Interest[], limit = 6): ReadingRecommendation[] {
  const scored = READING_LIST.map((item) => {
    const overlap = item.interests.filter((i) => interests.includes(i)).length
    const bonus = item.tags.includes('必讀') ? 3 : 0
    const guideBonus = item.source === 'guide' ? 2 : 0
    return { item, score: overlap * 2 + bonus + guideBonus }
  })
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.item)
}

/** 主程式根路徑（開發與 build 後皆可用） */
export function appArticleUrl(articleId: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/tools\/pattaya-trip-planner\/?$/, '/')
  return `${base}?source=pattaya&article=${articleId}`
}

export function googleMapsDirUrl(fromLat: number, fromLng: number, toLat: number, toLng: number): string {
  return `https://www.google.com/maps/dir/?api=1&origin=${fromLat},${fromLng}&destination=${toLat},${toLng}&travelmode=driving`
}

export function googleMapsPlaceUrl(lat: number, lng: number, label: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(label)}`
}
