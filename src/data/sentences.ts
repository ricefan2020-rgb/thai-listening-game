import type { SentenceCategory, SentenceItem, SentencePracticeTopic } from '../types'
import { SENTENCES_EXT } from './sentences-ext'
import { SENTENCES_EXT2 } from './sentences-ext2'
import { SENTENCES_EXT3 } from './sentences-ext3'
import { SENTENCES_EXT4 } from './sentences-ext4'
import { SENTENCES_EXT5 } from './sentences-ext5'
import { SENTENCES_EXT6 } from './sentences-ext6'

export const SENTENCE_CATEGORY_LABELS: Record<SentenceCategory, string> = {
  greeting: '問候交際',
  travel: '旅遊實用',
  daily: '日常生活',
  food: '餐飲點餐',
  shopping: '購物消費',
}

export const SENTENCES: SentenceItem[] = [
  // 問候交際
  {
    id: 'sg1',
    thai: 'สวัสดีครับ',
    meaning: '你好（男性禮貌）',
    category: 'greeting',
  },
  {
    id: 'sg2',
    thai: 'สวัสดีค่ะ',
    meaning: '你好（女性禮貌）',
    category: 'greeting',
  },
  {
    id: 'sg3',
    thai: 'ยินดีที่ได้รู้จักครับ',
    meaning: '很高興認識你',
    category: 'greeting',
  },
  {
    id: 'sg4',
    thai: 'คุณสบายดีไหม',
    meaning: '你好嗎？',
    category: 'greeting',
  },
  {
    id: 'sg5',
    thai: 'ผมสบายดี ขอบคุณ',
    meaning: '我很好，謝謝',
    category: 'greeting',
  },
  {
    id: 'sg6',
    thai: 'ขอโทษครับ',
    meaning: '對不起',
    category: 'greeting',
  },
  {
    id: 'sg7',
    thai: 'ไม่เป็นไรครับ',
    meaning: '沒關係',
    category: 'greeting',
  },
  {
    id: 'sg8',
    thai: 'ลาก่อนครับ',
    meaning: '再見',
    category: 'greeting',
  },
  {
    id: 'sg9',
    thai: 'ขอโทษที่รบกวน',
    meaning: '抱歉打擾了',
    category: 'greeting',
  },
  {
    id: 'sg10',
    thai: 'ยินดีช่วยเหลือ',
    meaning: '樂意幫忙',
    category: 'greeting',
  },
  {
    id: 'sg11',
    thai: 'ขอให้โชคดี',
    meaning: '祝你好運',
    category: 'greeting',
  },
  {
    id: 'sg12',
    thai: 'สุขสันต์วันเกิด',
    meaning: '生日快樂',
    category: 'greeting',
  },
  {
    id: 'sg13',
    thai: 'ขอให้หายเร็วๆ',
    meaning: '祝你早日康復',
    category: 'greeting',
  },
  {
    id: 'sg14',
    thai: 'ฝันดี',
    meaning: '晚安（祝好夢）',
    category: 'greeting',
  },
  {
    id: 'sg15',
    thai: 'ยินดีที่ได้พบ',
    meaning: '很高興見到你',
    category: 'greeting',
  },

  // 旅遊實用
  {
    id: 'st1',
    thai: 'ห้องน้ำอยู่ที่ไหน',
    meaning: '洗手間在哪裡？',
    category: 'travel',
  },
  {
    id: 'st2',
    thai: 'ไปสนามบินได้อย่างไร',
    meaning: '怎麼去機場？',
    category: 'travel',
  },
  {
    id: 'st3',
    thai: 'ช่วยเรียกแท็กซี่ให้หน่อย',
    meaning: '請幫我叫計程車',
    category: 'travel',
  },
  {
    id: 'st4',
    thai: 'ฉันมีการจองห้อง',
    meaning: '我有訂房',
    category: 'travel',
  },
  {
    id: 'st5',
    thai: 'แผนที่อยู่ตรงไหน',
    meaning: '地圖在哪裡？',
    category: 'travel',
  },
  {
    id: 'st6',
    thai: 'คุณพูดภาษาอังกฤษได้ไหม',
    meaning: '你會說英語嗎？',
    category: 'travel',
  },
  {
    id: 'st7',
    thai: 'ฉันหลงทาง',
    meaning: '我迷路了',
    category: 'travel',
  },
  {
    id: 'st8',
    thai: 'ช่วยถ่ายรูปให้หน่อยได้ไหม',
    meaning: '可以幫我拍照嗎？',
    category: 'travel',
  },
  {
    id: 'st9',
    thai: 'รถไฟฟ้าอยู่ที่ไหน',
    meaning: '捷運／空鐵在哪？',
    category: 'travel',
  },
  {
    id: 'st10',
    thai: 'ซื้อตั๋วที่ไหน',
    meaning: '在哪裡買票？',
    category: 'travel',
  },
  {
    id: 'st11',
    thai: 'เช็คอินกี่โมง',
    meaning: '幾點 check in？',
    category: 'travel',
  },
  {
    id: 'st12',
    thai: 'ห้องพักมีวิวทะเลไหม',
    meaning: '房間有海景嗎？',
    category: 'travel',
  },
  {
    id: 'st13',
    thai: 'มีไวไฟฟรีไหม',
    meaning: '有免費 WiFi 嗎？',
    category: 'travel',
  },
  {
    id: 'st14',
    thai: 'ช่วยเก็บกระเป๋าให้หน่อย',
    meaning: '請幫我保管行李',
    category: 'travel',
  },
  {
    id: 'st15',
    thai: 'ตรงนี้ปลอดภัยไหม',
    meaning: '這裡安全嗎？',
    category: 'travel',
  },
  {
    id: 'st16',
    thai: 'ฉันต้องการความช่วยเหลือ',
    meaning: '我需要幫助',
    category: 'travel',
  },

  // 日常生活
  {
    id: 'sd1',
    thai: 'วันนี้อากาศร้อนมาก',
    meaning: '今天天氣很熱',
    category: 'daily',
  },
  {
    id: 'sd2',
    thai: 'ตอนนี้กี่โมงแล้ว',
    meaning: '現在幾點了？',
    category: 'daily',
  },
  {
    id: 'sd3',
    thai: 'ฉันไม่เข้าใจ',
    meaning: '我不明白',
    category: 'daily',
  },
  {
    id: 'sd4',
    thai: 'ช้าๆ หน่อยได้ไหม',
    meaning: '可以說慢一點嗎？',
    category: 'daily',
  },
  {
    id: 'sd5',
    thai: 'กรุณารอสักครู่',
    meaning: '請稍等一下',
    category: 'daily',
  },
  {
    id: 'sd6',
    thai: 'ฉันมาจากไต้หวัน',
    meaning: '我來自台灣',
    category: 'daily',
  },
  {
    id: 'sd7',
    thai: 'คุณชื่ออะไร',
    meaning: '你叫什麼名字？',
    category: 'daily',
  },
  {
    id: 'sd8',
    thai: 'พรุ่งนี้ฉันจะกลับบ้าน',
    meaning: '我明天要回家',
    category: 'daily',
  },
  {
    id: 'sd9',
    thai: 'วันนี้ฝนตก',
    meaning: '今天下雨',
    category: 'daily',
  },
  {
    id: 'sd10',
    thai: 'ฉันเหนื่อยมาก',
    meaning: '我很累',
    category: 'daily',
  },
  {
    id: 'sd11',
    thai: 'ฉันมีความสุข',
    meaning: '我很開心',
    category: 'daily',
  },
  {
    id: 'sd12',
    thai: 'ฉันกำลังเรียนภาษาไทย',
    meaning: '我正在學泰文',
    category: 'daily',
  },
  {
    id: 'sd13',
    thai: 'คุณทำงานอะไร',
    meaning: '你做什麼工作？',
    category: 'daily',
  },
  {
    id: 'sd14',
    thai: 'ฉันอยู่ที่กรุงเทพ',
    meaning: '我住在曼谷',
    category: 'daily',
  },
  {
    id: 'sd15',
    thai: 'ขอถามหน่อยได้ไหม',
    meaning: '可以請教一下嗎？',
    category: 'daily',
  },
  {
    id: 'sd16',
    thai: 'ฉันลืมแล้ว',
    meaning: '我忘了',
    category: 'daily',
  },

  // 餐飲點餐
  {
    id: 'sf1',
    thai: 'ขอเมนูหน่อย',
    meaning: '請給我菜單',
    category: 'food',
  },
  {
    id: 'sf2',
    thai: 'ฉันอยากสั่งอาหาร',
    meaning: '我想點餐',
    category: 'food',
  },
  {
    id: 'sf3',
    thai: 'ไม่เผ็ดได้ไหม',
    meaning: '可以不要辣嗎？',
    category: 'food',
  },
  {
    id: 'sf4',
    thai: 'อร่อยมาก',
    meaning: '很好吃',
    category: 'food',
  },
  {
    id: 'sf5',
    thai: 'ขอเช็คบิลด้วย',
    meaning: '請買單',
    category: 'food',
  },
  {
    id: 'sf6',
    thai: 'มีน้ำเปล่าไหม',
    meaning: '有白開水嗎？',
    category: 'food',
  },
  {
    id: 'sf7',
    thai: 'ฉันแพ้อาหารทะเล',
    meaning: '我對海鮮過敏',
    category: 'food',
  },
  {
    id: 'sf8',
    thai: 'เอาอันนี้หนึ่งที่',
    meaning: '我要一份這個',
    category: 'food',
  },
  {
    id: 'sf9',
    thai: 'เผ็ดน้อยได้ไหม',
    meaning: '可以少辣嗎？',
    category: 'food',
  },
  {
    id: 'sf10',
    thai: 'ไม่ใส่ผักชี',
    meaning: '不要加香菜',
    category: 'food',
  },
  {
    id: 'sf11',
    thai: 'ขอน้ำเพิ่ม',
    meaning: '請再給水',
    category: 'food',
  },
  {
    id: 'sf12',
    thai: 'อาหารมาแล้วหรือยัง',
    meaning: '餐點來了嗎？',
    category: 'food',
  },
  {
    id: 'sf13',
    thai: 'รับประทานที่นี่',
    meaning: '在這裡吃',
    category: 'food',
  },
  {
    id: 'sf14',
    thai: 'ห่อกลับบ้าน',
    meaning: '打包外帶',
    category: 'food',
  },
  {
    id: 'sf15',
    thai: 'แนะนำเมนูอะไรดี',
    meaning: '推薦什麼菜？',
    category: 'food',
  },
  {
    id: 'sf16',
    thai: 'ฉันแพ้ถั่ว',
    meaning: '我對花生過敏',
    category: 'food',
  },

  // 購物消費
  {
    id: 'ss1',
    thai: 'เท่าไหร่คะ',
    meaning: '多少錢？',
    category: 'shopping',
  },
  {
    id: 'ss2',
    thai: 'แพงไปหน่อย',
    meaning: '有點貴',
    category: 'shopping',
  },
  {
    id: 'ss3',
    thai: 'ลดราคาได้ไหม',
    meaning: '可以便宜一點嗎？',
    category: 'shopping',
  },
  {
    id: 'ss4',
    thai: 'ฉันจะซื้ออันนี้',
    meaning: '我要買這個',
    category: 'shopping',
  },
  {
    id: 'ss5',
    thai: 'รับบัตรเครดิตไหม',
    meaning: '收信用卡嗎？',
    category: 'shopping',
  },
  {
    id: 'ss6',
    thai: 'มีสีอื่นไหม',
    meaning: '有其他顏色嗎？',
    category: 'shopping',
  },
  {
    id: 'ss7',
    thai: 'ขอถุงหน่อย',
    meaning: '請給我一個袋子',
    category: 'shopping',
  },
  {
    id: 'ss8',
    thai: 'ฉันแค่ดูเฉยๆ',
    meaning: '我只是看看',
    category: 'shopping',
  },
  {
    id: 'ss9',
    thai: 'มีไซส์ใหญ่กว่านี้ไหม',
    meaning: '有更大的尺寸嗎？',
    category: 'shopping',
  },
  {
    id: 'ss10',
    thai: 'ลองได้ไหม',
    meaning: '可以試穿嗎？',
    category: 'shopping',
  },
  {
    id: 'ss11',
    thai: 'ขอใบเสร็จด้วย',
    meaning: '請給收據',
    category: 'shopping',
  },
  {
    id: 'ss12',
    thai: 'รับเงินทอนเท่าไหร่',
    meaning: '找零多少？',
    category: 'shopping',
  },
  {
    id: 'ss13',
    thai: 'มีโปรโมชั่นไหม',
    meaning: '有促銷嗎？',
    category: 'shopping',
  },
  {
    id: 'ss14',
    thai: 'เปลี่ยนสินค้าได้ไหม',
    meaning: '可以換貨嗎？',
    category: 'shopping',
  },
  {
    id: 'ss15',
    thai: 'ฉันจะคิดก่อน',
    meaning: '我再考慮一下',
    category: 'shopping',
  },
  {
    id: 'ss16',
    thai: 'ห้ามถ่ายรูป',
    meaning: '禁止拍照',
    category: 'shopping',
  },

  ...SENTENCES_EXT,
  ...SENTENCES_EXT2,
  ...SENTENCES_EXT3,
  ...SENTENCES_EXT4,
  ...SENTENCES_EXT5,
  ...SENTENCES_EXT6,
]

export const SENTENCE_COUNT = SENTENCES.length

export const SENTENCE_CATEGORIES: SentenceCategory[] = [
  'greeting',
  'travel',
  'daily',
  'food',
  'shopping',
]

export const SENTENCES_PER_ROUND = 15

export function getSentenceById(id: string): SentenceItem | undefined {
  return SENTENCES.find((s) => s.id === id)
}

export function getSentencesByCategory(category: SentenceCategory): SentenceItem[] {
  return SENTENCES.filter((s) => s.category === category)
}

export function getSentenceCategoryCount(category: SentenceCategory): number {
  return getSentencesByCategory(category).length
}

export function getSentenceTopicLabel(topic: SentencePracticeTopic): string {
  return topic === 'all' ? '句子 · 全部隨機' : `句子 · ${SENTENCE_CATEGORY_LABELS[topic]}`
}

export function getSentenceRoundSize(topic: SentencePracticeTopic): number {
  const pool = topic === 'all' ? SENTENCES : getSentencesByCategory(topic)
  return Math.min(pool.length, SENTENCES_PER_ROUND)
}
