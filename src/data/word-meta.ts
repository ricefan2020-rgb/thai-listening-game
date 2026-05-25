import type { LessonItem, WordExample, WordPitfall } from '../types'

export const WORD_PITFALL_KIND_LABELS = {
  homophone: '同音字',
  polyseme: '同字不同義',
  confusable: '易混淆',
  tonePair: '同字異聲調',
} as const

import { resolveWordExamples } from '../utils/wordExampleResolver'

/** 易混詞對照與同音提示 */
export const WORD_PITFALLS: Record<string, WordPitfall[]> = {
  vp28: [
    {
      kind: 'confusable',
      thai: 'ความช่วยเหลือ',
      meaning: '協助／幫忙（名詞）',
      noteZh: '動詞用「ช่วยเหลือ」；名詞常加「ความ」',
      lessonId: 'vp29',
    },
  ],
  tp1: [
    {
      kind: 'tonePair',
      thai: 'ม้า',
      meaning: '馬',
      noteZh: '「มา」平調＝來；「ม้า」高調＝馬，只差 ้ 調號',
      lessonId: 'a12',
    },
  ],
  a12: [
    {
      kind: 'tonePair',
      thai: 'มา',
      meaning: '來',
      noteZh: '「ม้า」高調＝馬；「มา」平調＝來',
      lessonId: 'tp1',
    },
  ],
  tp2: [
    {
      kind: 'tonePair',
      thai: 'ใหม่',
      meaning: '新的',
      noteZh: '「ไหม」升調＝嗎；「ใหม่」低調＝新的，聽力常混淆',
      lessonId: 'f57',
    },
  ],
  f57: [
    {
      kind: 'tonePair',
      thai: 'ไหม',
      meaning: '嗎（疑問）',
      noteZh: '「ใหม่」低調＝新的；「ไหม」升調＝疑問語氣',
      lessonId: 'tp2',
    },
  ],
  tp3: [
    {
      kind: 'tonePair',
      thai: 'สี',
      meaning: '顏色',
      noteZh: '「สี่」升調＝四；「สี」平調＝顏色',
      lessonId: 'c15',
    },
  ],
  c15: [
    {
      kind: 'tonePair',
      thai: 'สี่',
      meaning: '四',
      noteZh: '「สี」平調＝顏色；「สี่」升調＝四，注意 ี่ 調號',
      lessonId: 'tp3',
    },
    {
      kind: 'confusable',
      thai: 'ชา',
      meaning: '茶',
      noteZh: '「สี」顏色與「ชา」茶字形不同，聽力要注意',
      lessonId: 'f11',
    },
  ],
  tp4: [
    {
      kind: 'tonePair',
      thai: 'ชา',
      meaning: '茶',
      noteZh: '「ช้า」高調＝慢；「ชา」平調＝茶',
      lessonId: 'f11',
    },
  ],
  f11: [
    {
      kind: 'tonePair',
      thai: 'ช้า',
      meaning: '慢',
      noteZh: '「ชา」平調＝茶；「ช้า」高調＝慢，注意 ้ 調號',
      lessonId: 'tp4',
    },
    {
      kind: 'homophone',
      thai: 'ช้า',
      meaning: '慢',
      noteZh: '「ชา」茶與「ช้า」慢發音接近，書寫不同',
      lessonId: 'tp4',
    },
  ],
  tp5: [
    {
      kind: 'tonePair',
      thai: 'ใช่',
      meaning: '是',
      noteZh: '「ใช่」降調＝是；「ใช้」高調＝使用，注意尾音 ่/้',
      lessonId: 'g6',
    },
  ],
  g6: [
    {
      kind: 'tonePair',
      thai: 'ใช้',
      meaning: '使用',
      noteZh: '「ใช่」降調＝是；「ใช้」高調＝使用，注意 ่/้ 與尾音',
      lessonId: 'tp5',
    },
    {
      kind: 'confusable',
      thai: 'ไม่',
      meaning: '不是',
      noteZh: '肯定、否定常一起練，聽力要分清楚',
      lessonId: 'g7',
    },
  ],
  tp6: [
    {
      kind: 'tonePair',
      thai: 'นา',
      meaning: '稻田／田',
      noteZh: '「น้า」高調＝阿姨；「นา」平調＝田',
      lessonId: 'tp7',
    },
  ],
  tp7: [
    {
      kind: 'tonePair',
      thai: 'น้า',
      meaning: '阿姨／舅媽',
      noteZh: '「นา」平調＝田；「น้า」高調＝阿姨，注意 ้ 調號',
      lessonId: 'tp6',
    },
  ],
  g7: [
    {
      kind: 'confusable',
      thai: 'ใช่',
      meaning: '是',
      noteZh: '與「ไม่」只差一字，句意完全相反',
      lessonId: 'g6',
    },
  ],
  g16: [
    {
      kind: 'confusable',
      thai: 'เชิญ',
      meaning: '請／別客氣',
      noteZh: '兩個都表示「請」，用法略有不同',
      lessonId: 'g18',
    },
  ],
  g18: [
    {
      kind: 'confusable',
      thai: 'โปรด',
      meaning: '請（客氣）',
      noteZh: '「โปรด」較正式；「เชิญ」常見於請人入座、用餐',
      lessonId: 'g16',
    },
  ],
  t2: [
    {
      kind: 'confusable',
      thai: 'ห้องน้ำ',
      meaning: '洗手間',
      noteZh: '「น้ำ」單獨是水；「ห้องน้ำ」才是廁所',
      lessonId: 't3',
    },
  ],
  t18: [
    {
      kind: 'homophone',
      thai: 'ไกล',
      meaning: '遠',
      noteZh: '聽起來很像，但一個是「近」、一個是「遠」',
      lessonId: 't19',
    },
  ],
  t19: [
    {
      kind: 'homophone',
      thai: 'ใกล้',
      meaning: '近',
      noteZh: '與「ไกล」只差一個字母，意思卻相反',
      lessonId: 't18',
    },
  ],
  t16: [
    {
      kind: 'confusable',
      thai: 'ขวา',
      meaning: '右邊',
      noteZh: '左右方向詞，建議成對記憶',
      lessonId: 't17',
    },
  ],
  t17: [
    {
      kind: 'confusable',
      thai: 'ซ้าย',
      meaning: '左邊',
      noteZh: '左右方向詞，建議成對記憶',
      lessonId: 't16',
    },
  ],
  f6: [
    {
      kind: 'polyseme',
      thai: 'ไก่',
      meaning: '雞（動物）',
      noteZh: '同一個字：在菜單多指雞肉，在動物類指雞',
      lessonId: 'a15',
    },
    {
      kind: 'confusable',
      thai: 'ไก่',
      meaning: '雞',
      noteZh: '與動物類「ไก่」同字，中文一個寫「雞肉」一個寫「雞」',
      lessonId: 'a15',
    },
  ],
  f7: [
    {
      kind: 'polyseme',
      thai: 'ปลา',
      meaning: '魚（動物）',
      noteZh: '「ปลา」在食物、動物主題都會出現，語境不同',
      lessonId: 'a10',
    },
  ],
  f30: [
    {
      kind: 'polyseme',
      thai: 'หมู',
      meaning: '豬',
      noteZh: '菜單上的「หมู」= 豬肉；動物類的「หมู」= 豬',
      lessonId: 'a14',
    },
  ],
  f32: [
    {
      kind: 'confusable',
      thai: 'อิ่ม',
      meaning: '飽了',
      noteZh: '「餓」與「飽」常成對出現，別搞反',
      lessonId: 'f33',
    },
  ],
  f33: [
    {
      kind: 'confusable',
      thai: 'หิว',
      meaning: '餓',
      noteZh: '「餓」與「飽」常成對出現，別搞反',
      lessonId: 'f32',
    },
  ],
  a10: [
    {
      kind: 'polyseme',
      thai: 'ปลา',
      meaning: '魚（食物）',
      noteZh: '與食物類同字，記得看主題與句子語境',
      lessonId: 'f7',
    },
  ],
  a14: [
    {
      kind: 'polyseme',
      thai: 'หมู',
      meaning: '豬肉',
      noteZh: '點餐時的「หมู」通常指豬肉',
      lessonId: 'f30',
    },
  ],
  a15: [
    {
      kind: 'polyseme',
      thai: 'ไก่',
      meaning: '雞肉',
      noteZh: '餐廳說「ไก่」多半指雞肉料理',
      lessonId: 'f6',
    },
  ],
  b4: [
    {
      kind: 'polyseme',
      thai: 'ตา',
      meaning: '爺爺／長輩（口語）',
      noteZh: '「ตา」也可指眼睛；本詞庫此條為「眼睛」',
    },
  ],
  b18: [
    {
      kind: 'polyseme',
      thai: 'เท้า',
      meaning: '腳',
      noteZh: '「เท้า」= 腳；「รองเท้า」= 鞋子，別只記一半',
    },
  ],
  o20: [
    {
      kind: 'confusable',
      thai: 'เท้า',
      meaning: '腳',
      noteZh: '鞋子是「รองเท้า」，多了「รอง」',
      lessonId: 'b18',
    },
  ],
  t28: [
    {
      kind: 'confusable',
      thai: 'ตั๋ว',
      meaning: '票',
      noteZh: '「จอง」= 預訂；「ตั๋ว」= 票，旅遊常用一組',
      lessonId: 't9',
    },
  ],
  f36: [
    {
      kind: 'confusable',
      thai: 'เช็คบิล',
      meaning: '買單',
      noteZh: '點餐「สั่ง」後才「เช็คบิล」結帳',
      lessonId: 'f37',
    },
  ],
  f37: [
    {
      kind: 'confusable',
      thai: 'สั่ง',
      meaning: '點餐',
      noteZh: '先「สั่ง」點菜，吃完再「เช็คบิล」',
      lessonId: 'f36',
    },
  ],
  g25: [
    {
      kind: 'confusable',
      thai: 'ยินดีที่ได้รู้จัก',
      meaning: '很高興認識你',
      noteZh: '「ยินดี」可單獨用；完整問候較長',
      lessonId: 'g10',
    },
  ],
  b38: [
    {
      kind: 'confusable',
      thai: 'ร้านขายยา',
      meaning: '藥局',
      noteZh: '「ยา」= 藥；「ร้านขายยา」= 藥局（旅行詞庫）',
      lessonId: 't20',
    },
  ],
  vp29: [
    {
      kind: 'confusable',
      thai: 'ช่วยเหลือ',
      meaning: '幫助（動詞）',
      noteZh: '「ความช่วยเหลือ」是名詞（協助）；「ช่วยเหลือ」是動詞（幫忙）',
      lessonId: 'vp28',
    },
  ],
  f19: [
    {
      kind: 'confusable',
      thai: 'ทำ',
      meaning: '做／製作',
      noteZh: '「ตำ」tam 與「ทำ」tham 只差送氣，聽力要分清楚',
    },
  ],
  f58: [
    {
      kind: 'confusable',
      thai: 'ข้าว',
      meaning: '飯',
      noteZh: '「เก่า」kào（舊）與「ข้าว」khâo（飯）音近，聽力要分清楚',
      lessonId: 'f1',
    },
  ],
  fr2: [
    {
      kind: 'confusable',
      thai: 'สีส้ม',
      meaning: '橙色',
      noteZh: '「ส้ม」＝柳橙；「สีส้ม」＝橙色，別把顏色詞聽成果名',
      lessonId: 'c7',
    },
  ],
  c7: [
    {
      kind: 'confusable',
      thai: 'ส้ม',
      meaning: '柳橙',
      noteZh: '「ส้ม」＝水果；「สีส้ม」＝橙色',
      lessonId: 'fr2',
    },
  ],
  em2: [
    {
      kind: 'confusable',
      thai: 'เสียใจ',
      meaning: '後悔／難過',
      noteZh: '「เศร้า」偏難過；「เสียใจ」常帶後悔，語境不同',
      lessonId: 'em11',
    },
  ],
  em11: [
    {
      kind: 'confusable',
      thai: 'เศร้า',
      meaning: '難過',
      noteZh: '「เสียใจ」常指後悔；「เศร้า」指傷心難過',
      lessonId: 'em2',
    },
  ],
  em3: [
    {
      kind: 'confusable',
      thai: 'โมโห',
      meaning: '生氣（口語）',
      noteZh: '「โกรธ」較正式；「โมโห」口語，語氣更強',
      lessonId: 'em25',
    },
  ],
  em25: [
    {
      kind: 'confusable',
      thai: 'โกรธ',
      meaning: '生氣',
      noteZh: '「โมโห」口語；「โกรธ」書面／一般說法',
      lessonId: 'em3',
    },
  ],
  tm11: [
    {
      kind: 'confusable',
      thai: 'สายรถไฟ',
      meaning: '鐵路線',
      noteZh: '「สาย」此處＝遲到；「สายรถไฟ」的 สาย＝線路',
      lessonId: 't47',
    },
  ],
  t47: [
    {
      kind: 'confusable',
      thai: 'สาย',
      meaning: '遲到',
      noteZh: '「มาสาย」＝遲到；「สายรถไฟ」＝鐵路線',
      lessonId: 'tm11',
    },
  ],
  tm14: [
    {
      kind: 'confusable',
      thai: 'หลัง',
      meaning: '背',
      noteZh: '「หลังเลิกงาน」＝下班後；「หลัง」單獨常指背部',
      lessonId: 'b14',
    },
  ],
}

export function getWordExamples(lesson: LessonItem): WordExample[] {
  return resolveWordExamples(lesson)
}

/** @deprecated 使用 getWordExamples */
export function getWordExample(lesson: LessonItem): WordExample {
  const list = getWordExamples(lesson)
  return list[0] ?? { exampleTh: lesson.thai, exampleZh: lesson.meaning }
}

export function getWordPitfalls(lessonId: string): WordPitfall[] {
  return WORD_PITFALLS[lessonId] ?? []
}

/** 有易混標記的單字 id（用於專項練習） */
export function getPitfallLessonIds(): string[] {
  return Object.keys(WORD_PITFALLS)
}

/** 有「同字異聲調」標記的單字 id */
export function getTonePairLessonIds(): string[] {
  return Object.entries(WORD_PITFALLS)
    .filter(([, list]) => list.some((p) => p.kind === 'tonePair'))
    .map(([id]) => id)
}
