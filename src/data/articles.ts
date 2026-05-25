import type { ArticleCategory, ArticlePracticeTopic, StudyItem } from '../types'
import { ARTICLES_EXT } from './articles-ext'
import { ARTICLES_EXT2 } from './articles-ext2'
import { ARTICLES_EXT3 } from './articles-ext3'
import { ARTICLES_NEWS } from './articles-news'
import { ARTICLES_NEWS_EXT } from './articles-news-ext'
import { ARTICLES_HOLIDAY } from './articles-holiday'
import { ARTICLES_EXT4 } from './articles-ext4'

export const ARTICLE_CATEGORY_LABELS: Record<ArticleCategory, string> = {
  travel: '旅遊見聞',
  daily: '日常生活',
  food: '飲食文化',
  culture: '文化禮儀',
  news: '網上新聞',
}

export interface Article {
  id: string
  category: ArticleCategory
  titleZh: string
  contentTh: string
  translationZh: string
  questions: StudyItem[]
}

export const ARTICLES: Article[] = [
  {
    id: 'ar1',
    category: 'travel',
    titleZh: '第一次到曼谷',
    contentTh: `สวัสดีครับ ผมมาถึงกรุงเทพเป็นครั้งแรกเมื่อเช้านี้ อากาศร้อนมากแต่ผู้คนเป็นมิตรมาก

ผมเดินไปที่วัดพระแก้ว สถาปัตยกรรมสวยงามมาก มีนักท่องเที่ยวจากหลายประเทศมาเยี่ยมชม

ตอนเย็นผมไปตลาดนัด กินผลไม้สดและอาหารทะเล รสชาติอร่อยมาก ผมชอบมะม่วงเป็นพิเศษ

ก่อนนอนผมคิดว่าประเทศไทยเป็นประเทศที่น่าสนใจมาก ผมอยากเรียนภาษาไทยต่อไป`,
    translationZh: `你好，我今天早上第一次到達曼谷。天氣很熱，但人們非常友善。

我走到玉佛寺，建築非常美麗，有來自各國的遊客前來參觀。

傍晚我去了夜市，吃了新鮮水果和海鮮，味道很好吃，我特別喜歡芒果。

睡前我想，泰國是一個非常有趣的國家，我想繼續學泰文。`,
    questions: [
      { id: 'ar1-q1', thai: 'มาถึงกรุงเทพเป็นครั้งแรก', meaning: '第一次到達曼谷' },
      { id: 'ar1-q2', thai: 'อากาศร้อนมาก', meaning: '天氣很熱' },
      { id: 'ar1-q3', thai: 'ผู้คนเป็นมิตรมาก', meaning: '人們非常友善' },
      { id: 'ar1-q4', thai: 'สถาปัตยกรรมสวยงามมาก', meaning: '建築非常美麗' },
      { id: 'ar1-q5', thai: 'ไปตลาดนัด', meaning: '去夜市' },
      { id: 'ar1-q6', thai: 'รสชาติอร่อยมาก', meaning: '味道很好吃' },
      { id: 'ar1-q7', thai: 'ชอบมะม่วงเป็นพิเศษ', meaning: '特別喜歡芒果' },
      { id: 'ar1-q8', thai: 'อยากเรียนภาษาไทยต่อไป', meaning: '想繼續學泰文' },
    ],
  },
  {
    id: 'ar2',
    category: 'daily',
    titleZh: '週末的早晨',
    contentTh: `ทุกวันเสาร์ผมตื่นเช้า ผมชอบออกกำลังกายที่สวนสาธารณะใกล้บ้าน มีคนเดินและวิ่งจำนวนมาก

หลังออกกำลังกายผมซื้อกาแฟและขนมปัง ผมนั่งอ่านหนังสือใต้ต้นไม้ใหญ่ รู้สึกสงบและผ่อนคลาย

บ่ายผมโทรหาเพื่อนเพื่อนัดเจอ เราไปดูหนังและกินอาหารเย็นด้วยกัน เป็นวันที่ดีมาก`,
    translationZh: `每個星期六我早起，我喜歡在家附近的公園運動，有很多人在走路和跑步。

運動後我買咖啡和麵包，坐在大樹下看書，感覺很平靜、很放鬆。

下午我打電話給朋友約見面，我們去看電影並一起吃晚餐，是非常好的一天。`,
    questions: [
      { id: 'ar2-q1', thai: 'ตื่นเช้า', meaning: '早起' },
      { id: 'ar2-q2', thai: 'ออกกำลังกายที่สวนสาธารณะ', meaning: '在公園運動' },
      { id: 'ar2-q3', thai: 'รู้สึกสงบและผ่อนคลาย', meaning: '感覺平靜放鬆' },
      { id: 'ar2-q4', thai: 'โทรหาเพื่อน', meaning: '打電話給朋友' },
      { id: 'ar2-q5', thai: 'ไปดูหนัง', meaning: '去看電影' },
      { id: 'ar2-q6', thai: 'กินอาหารเย็นด้วยกัน', meaning: '一起吃晚餐' },
      { id: 'ar2-q7', thai: 'เป็นวันที่ดีมาก', meaning: '是非常好的一天' },
      { id: 'ar2-q8', thai: 'ซื้อกาแฟและขนมปัง', meaning: '買咖啡和麵包' },
    ],
  },
  {
    id: 'ar3',
    category: 'food',
    titleZh: '泰國的早餐',
    contentTh: `อาหารเช้าในประเทศไทยมีหลากหลายมาก บางคนกินข้าวต้มกับหมูหรือปลา บางคนกินก๋วยเตี๋ยว

ผมชอบกินข้าวเหนียวกับหมูปิ้ง กินกับไข่ต้มและผักสด อร่อยและทำให้อิ่มนาน

เครื่องดื่มยอดนิยมคือชาเย็นและกาแฟโบราณ หวานและเย็นชื่นใจมาก โดยเฉพาะในวันที่อากาศร้อน`,
    translationZh: `泰國的早餐非常多樣，有人吃粥配豬肉或魚，有人吃河粉。

我喜歡吃糯米飯配烤豬，配水煮蛋和新鮮蔬菜，好吃而且很有飽足感。

受歡迎的飲料是泰式冰茶和古早味咖啡，又甜又冰很解渴，尤其是在天氣熱的日子。`,
    questions: [
      { id: 'ar3-q1', thai: 'อาหารเช้ามีหลากหลายมาก', meaning: '早餐非常多樣' },
      { id: 'ar3-q2', thai: 'กินข้าวต้ม', meaning: '吃粥' },
      { id: 'ar3-q3', thai: 'ข้าวเหนียวกับหมูปิ้ง', meaning: '糯米飯配烤豬' },
      { id: 'ar3-q4', thai: 'อร่อยและทำให้อิ่มนาน', meaning: '好吃且很有飽足感' },
      { id: 'ar3-q5', thai: 'ชาเย็น', meaning: '泰式冰茶' },
      { id: 'ar3-q6', thai: 'หวานและเย็นชื่นใจ', meaning: '又甜又冰很解渴' },
      { id: 'ar3-q7', thai: 'ในวันที่อากาศร้อน', meaning: '在天氣熱的日子' },
      { id: 'ar3-q8', thai: 'กินก๋วยเตี๋ยว', meaning: '吃河粉' },
    ],
  },
  {
    id: 'ar4',
    category: 'culture',
    titleZh: '微笑的國度',
    contentTh: `ประเทศไทยมีชื่อเสียงว่าเป็นดินแดนแห่งรอยยิ้ม คนไทยมักยิ้มเมื่อทักทายหรือขอบคุณ

เมื่อเจอผู้ใหญ่ควรไหว้ด้วยความเคารพ การไหว้แสดงถึงความสุภาพและความขอบคุณ

ในโรงเรียนและที่ทำงาน ความสุภาพและการทักทายเป็นสิ่งสำคัญ การเรียนรู้วัฒนธรรมท้องถิ่นช่วยให้เข้าใจผู้คนมากขึ้น`,
    translationZh: `泰國以微笑之國聞名，泰國人問候或道謝時常帶著微笑。

遇到長輩應該恭敬地合十問候，合十代表禮貌與感謝。

在學校和職場，禮貌和問候很重要，了解當地文化能幫助你更理解人們。`,
    questions: [
      { id: 'ar4-q1', thai: 'ดินแดนแห่งรอยยิ้ม', meaning: '微笑之國' },
      { id: 'ar4-q2', thai: 'ควรไหว้ด้วยความเคารพ', meaning: '應恭敬地合十' },
      { id: 'ar4-q3', thai: 'แสดงถึงความสุภาพ', meaning: '代表禮貌' },
      { id: 'ar4-q4', thai: 'การทักทายเป็นสิ่งสำคัญ', meaning: '問候很重要' },
      { id: 'ar4-q5', thai: 'เรียนรู้วัฒนธรรมท้องถิ่น', meaning: '了解當地文化' },
      { id: 'ar4-q6', thai: 'เข้าใจผู้คนมากขึ้น', meaning: '更理解人們' },
      { id: 'ar4-q7', thai: 'ขอบคุณ', meaning: '道謝' },
      { id: 'ar4-q8', thai: 'ยิ้มเมื่อทักทาย', meaning: '問候時微笑' },
    ],
  },
  {
    id: 'ar5',
    category: 'travel',
    titleZh: '清邁之旅',
    contentTh: `เมื่อสัปดาห์ที่แล้วผมไปเชียงใหม่ อากาศเย็นกว่ากรุงเทพมาก ผมชอบมาก

ผมขี่จักรยานรอบเมืองเก่า มีร้านกาแฟและร้านของฝางมากมาย ของฝางทำด้วยมือสวยงาม

ตอนกลางคืนผมไปเดินตลาดถนนคนเดิน มีดนตรีและอาหารพื้นเมือง บรรยากาศอบอุ่นและสนุกสนาน`,
    translationZh: `上週我去了清邁，天氣比曼谷涼爽很多，我非常喜歡。

我騎腳踏車繞舊城，有很多咖啡館和紀念品店，手工紀念品很漂亮。

晚上我去逛步行街，有音樂和當地食物，氣氛溫暖又熱鬧。`,
    questions: [
      { id: 'ar5-q1', thai: 'อากาศเย็นกว่ากรุงเทพ', meaning: '天氣比曼谷涼爽' },
      { id: 'ar5-q2', thai: 'ขี่จักรยานรอบเมืองเก่า', meaning: '騎腳踏車繞舊城' },
      { id: 'ar5-q3', thai: 'ของฝางทำด้วยมือ', meaning: '手工紀念品' },
      { id: 'ar5-q4', thai: 'ตลาดถนนคนเดิน', meaning: '步行街' },
      { id: 'ar5-q5', thai: 'อาหารพื้นเมือง', meaning: '當地食物' },
      { id: 'ar5-q6', thai: 'บรรยากาศอบอุ่น', meaning: '氣氛溫暖' },
      { id: 'ar5-q7', thai: 'สนุกสนาน', meaning: '熱鬧有趣' },
      { id: 'ar5-q8', thai: 'ร้านกาแฟ', meaning: '咖啡館' },
    ],
  },
  {
    id: 'ar6',
    category: 'daily',
    titleZh: '在泰國工作',
    contentTh: `ผมทำงานในบริษัทไทยมาหกเดือนแล้ว เพื่อนร่วมงานช่วยเหลือผมมากเมื่อมีปัญหา

ทุกเช้าเราทักทายกันด้วยรอยยิ้ม การสื่อสารที่ดีทำให้งานราบรื่น

วันศุกร์บางครั้งเราไปกินข้าวด้วยกันหลังเลิกงาน เป็นโอกาสดีในการฝึกภาษาไทยและสร้างความสัมพันธ์`,
    translationZh: `我在泰國公司工作六個月了，同事有問題時經常幫助我。

每天早上我們微笑著問候，良好的溝通讓工作更順利。

有時週五下班後我們一起吃飯，是練泰文和建立關係的好機會。`,
    questions: [
      { id: 'ar6-q1', thai: 'ทำงานมาหกเดือนแล้ว', meaning: '工作六個月了' },
      { id: 'ar6-q2', thai: 'เพื่อนร่วมงานช่วยเหลือ', meaning: '同事幫助' },
      { id: 'ar6-q3', thai: 'การสื่อสารที่ดี', meaning: '良好的溝通' },
      { id: 'ar6-q4', thai: 'งานราบรื่น', meaning: '工作順利' },
      { id: 'ar6-q5', thai: 'ไปกินข้าวด้วยกัน', meaning: '一起吃飯' },
      { id: 'ar6-q6', thai: 'ฝึกภาษาไทย', meaning: '練泰文' },
      { id: 'ar6-q7', thai: 'สร้างความสัมพันธ์', meaning: '建立關係' },
      { id: 'ar6-q8', thai: 'หลังเลิกงาน', meaning: '下班後' },
    ],
  },

  ...ARTICLES_EXT,
  ...ARTICLES_EXT2,
  ...ARTICLES_EXT3,
  ...ARTICLES_NEWS,
  ...ARTICLES_NEWS_EXT,
  ...ARTICLES_HOLIDAY,
  ...ARTICLES_EXT4,
]

export const ARTICLE_COUNT = ARTICLES.length
export const ARTICLES_PER_ROUND = 10

export const ARTICLE_CATEGORIES: ArticleCategory[] = ['travel', 'daily', 'food', 'culture', 'news']

export function getArticlesByCategory(category: ArticleCategory): Article[] {
  return ARTICLES.filter((a) => a.category === category)
}

export function getArticleById(id: string): Article | undefined {
  return ARTICLES.find((a) => a.id === id)
}

export function getAllArticleQuestions(): StudyItem[] {
  return ARTICLES.flatMap((a) => a.questions)
}

export function getArticleTopicLabel(topic: ArticlePracticeTopic): string {
  return topic === 'all' ? '短文 · 全部隨機' : `短文 · ${ARTICLE_CATEGORY_LABELS[topic]}`
}

export function getArticleRoundSize(topic: ArticlePracticeTopic): number {
  const pool =
    topic === 'all'
      ? getAllArticleQuestions()
      : getArticlesByCategory(topic).flatMap((a) => a.questions)
  return Math.min(pool.length, ARTICLES_PER_ROUND)
}
