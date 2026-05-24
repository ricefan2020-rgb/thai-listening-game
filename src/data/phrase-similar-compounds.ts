import { PHRASE_SEGMENT_OVERRIDES } from './phrase-segment-overrides'
import type { PhraseSegment, SimilarCompoundExample } from '../types'

/** 句型分組：同一組內為結構相近的組合字，便於對照學習 */
const COMPOUND_PATTERN_GROUPS: Record<
  string,
  { patternZh: string; phrases: { thai: string; meaningZh: string }[] }
> = {
  'learn-noun-place': {
    patternZh: '了解／學習 ＋ 名詞 ＋ 地點修飾（當地、本土）',
    phrases: [
      { thai: 'เรียนรู้วัฒนธรรมท้องถิ่น', meaningZh: '了解當地文化' },
      { thai: 'เรียนรู้วัฒนธรรม', meaningZh: '學習文化' },
      { thai: 'ดูวิถีชีวิต', meaningZh: '看當地生活' },
      { thai: 'อาหารพื้นเมือง', meaningZh: '當地食物' },
    ],
  },
  'verb-open-chain': {
    patternZh: '動詞 ＋ 動詞／名詞 ＋ 名詞（連環組合）',
    phrases: [
      { thai: 'เปิดรับสมัคร', meaningZh: '開放報名' },
      { thai: 'รองรับผู้โดยสาร', meaningZh: '容納乘客' },
      { thai: 'เพิ่มรถบีทีเอส', meaningZh: '增加 BTS 班次' },
      { thai: 'แจ้งลูกค้าล่วงหน้า', meaningZh: '事先通知顧客' },
    ],
  },
  'noun-adj-mak': {
    patternZh: '名詞／主語 ＋ 形容 ＋ มาก（很……）',
    phrases: [
      { thai: 'อากาศร้อนมาก', meaningZh: '天氣很熱' },
      { thai: 'รสชาติอร่อยมาก', meaningZh: '味道很好吃' },
      { thai: 'ผู้คนเป็นมิตรมาก', meaningZh: '人們非常友善' },
      { thai: 'สถาปัตยกรรมสวยงามมาก', meaningZh: '建築非常美麗' },
    ],
  },
  'khwam-abstract': {
    patternZh: 'ความ／การ ＋ 抽象名詞，或「動詞 ＋ ความ……」',
    phrases: [
      { thai: 'ฉันต้องการความช่วยเหลือ', meaningZh: '我需要幫助' },
      { thai: 'แสดงถึงความสุภาพ', meaningZh: '代表禮貌' },
      { thai: 'สร้างความสัมพันธ์', meaningZh: '建立關係' },
      { thai: 'การทักทายเป็นสิ่งสำคัญ', meaningZh: '問候很重要' },
    ],
  },
  'time-sequence': {
    patternZh: '時間／順序詞串接（先……再……、第一次……）',
    phrases: [
      { thai: 'มาถึงกรุงเทพเป็นครั้งแรก', meaningZh: '第一次到達曼谷' },
      { thai: 'เติมก่อนวันที่มีผล', meaningZh: '生效前先加油' },
      { thai: 'ช่วงวันหยุดยาว', meaningZh: '連假時段' },
      { thai: 'เพิ่มขึ้นอย่างต่อเนื่อง', meaningZh: '持續增加' },
    ],
  },
  'metric-rate': {
    patternZh: '指標／比率 ＋ 動作 ＋ 程度（率、價、量）',
    phrases: [
      { thai: 'อัตราเข้าพักสูง', meaningZh: '入住率高' },
      { thai: 'ราคาน้ำมันปรับขึ้น', meaningZh: '油價上調' },
      { thai: 'นักท่องเที่ยวเพิ่มขึ้น', meaningZh: '遊客增加' },
      { thai: 'หนึ่งบาทต่อลิตร', meaningZh: '每公升一泰銖' },
    ],
  },
  'respect-greeting': {
    patternZh: '禮貌動作 ＋ ด้วย ＋ ความ……（方式＋抽象）',
    phrases: [
      { thai: 'ควรไหว้ด้วยความเคารพ', meaningZh: '應恭敬地合十' },
      { thai: 'พูดคุยอย่างอบอุ่น', meaningZh: '溫暖地聊天' },
      { thai: 'ยิ้มเมื่อทักทาย', meaningZh: '問候時微笑' },
    ],
  },
  'study-language': {
    patternZh: '學習／練習 ＋ ภาษา／技能（多段動詞片語）',
    phrases: [
      { thai: 'อยากเรียนภาษาไทยต่อไป', meaningZh: '想繼續學泰文' },
      { thai: 'ฝึกภาษาไทย', meaningZh: '練泰文' },
      { thai: 'เรียนภาษาไทย', meaningZh: '學泰文' },
    ],
  },
}

/** 短文題泰文 → 句型組 id */
export const PHRASE_COMPOUND_PATTERN: Record<string, string> = {
  เรียนรู้วัฒนธรรมท้องถิ่น: 'learn-noun-place',
  เรียนรู้วัฒนธรรม: 'learn-noun-place',
  ดูวิถีชีวิต: 'learn-noun-place',
  อาหารพื้นเมือง: 'learn-noun-place',
  เปิดรับสมัคร: 'verb-open-chain',
  รองรับผู้โดยสาร: 'verb-open-chain',
  เพิ่มรถบีทีเอส: 'verb-open-chain',
  แจ้งลูกค้าล่วงหน้า: 'verb-open-chain',
  อากาศร้อนมาก: 'noun-adj-mak',
  รสชาติอร่อยมาก: 'noun-adj-mak',
  ผู้คนเป็นมิตรมาก: 'noun-adj-mak',
  สถาปัตยกรรมสวยงามมาก: 'noun-adj-mak',
  ฉันต้องการความช่วยเหลือ: 'khwam-abstract',
  ต้องการความช่วยเหลือ: 'khwam-abstract',
  แสดงถึงความสุภาพ: 'khwam-abstract',
  สร้างความสัมพันธ์: 'khwam-abstract',
  การทักทายเป็นสิ่งสำคัญ: 'khwam-abstract',
  มาถึงกรุงเทพเป็นครั้งแรก: 'time-sequence',
  เติมก่อนวันที่มีผล: 'time-sequence',
  ช่วงวันหยุดยาว: 'time-sequence',
  เพิ่มขึ้นอย่างต่อเนื่อง: 'time-sequence',
  อัตราเข้าพักสูง: 'metric-rate',
  ราคาน้ำมันปรับขึ้น: 'metric-rate',
  นักท่องเที่ยวเพิ่มขึ้น: 'metric-rate',
  หนึ่งบาทต่อลิตร: 'metric-rate',
  ควรไหว้ด้วยความเคารพ: 'respect-greeting',
  พูดคุยอย่างอบอุ่น: 'respect-greeting',
  ยิ้มเมื่อทักทาย: 'respect-greeting',
  อยากเรียนภาษาไทยต่อไป: 'study-language',
  ฝึกภาษาไทย: 'study-language',
}

/** 無 override 時的手動分詞（僅用於相似例展示） */
const EXTRA_SIMILAR_SEGMENTS: Record<string, PhraseSegment[]> = {
  ดูวิถีชีวิต: [
    { thai: 'ดู', meaning: '看' },
    { thai: 'วิถี', meaning: '方式／生活' },
    { thai: 'ชีวิต', meaning: '生命／生活' },
  ],
  อาหารพื้นเมือง: [
    { thai: 'อาหาร', meaning: '食物' },
    { thai: 'พื้น', meaning: '當地／本土' },
    { thai: 'เมือง', meaning: '地方' },
  ],
  สร้างความสัมพันธ์: [
    { thai: 'สร้าง', meaning: '建立' },
    { thai: 'ความ', meaning: '……性' },
    { thai: 'สัมพันธ์', meaning: '關係' },
  ],
  ฝึกภาษาไทย: [
    { thai: 'ฝึก', meaning: '練習' },
    { thai: 'ภาษา', meaning: '語言' },
    { thai: 'ไทย', meaning: '泰' },
  ],
  เรียนภาษาไทย: [
    { thai: 'เรียน', meaning: '學' },
    { thai: 'ภาษา', meaning: '語言' },
    { thai: 'ไทย', meaning: '泰' },
  ],
  พูดคุยอย่างอบอุ่น: [
    { thai: 'พูดคุย', meaning: '聊天' },
    { thai: 'อย่าง', meaning: '……地' },
    { thai: 'อบอุ่น', meaning: '溫暖' },
  ],
  ยิ้มเมื่อทักทาย: [
    { thai: 'ยิ้ม', meaning: '微笑' },
    { thai: 'เมื่อ', meaning: '當……時' },
    { thai: 'ทักทาย', meaning: '問候' },
  ],
}

function segmentsFor(thai: string): PhraseSegment[] {
  return PHRASE_SEGMENT_OVERRIDES[thai] ?? EXTRA_SIMILAR_SEGMENTS[thai] ?? []
}

function toExample(thai: string, meaningZh: string): SimilarCompoundExample {
  return { thai, meaningZh, segments: segmentsFor(thai) }
}

export interface SimilarCompoundGroup {
  patternZh: string
  items: SimilarCompoundExample[]
}

/** 取得與當前片語同句型的相似組合字（不含自己，最多 4 則） */
export function getSimilarCompoundExamples(thai: string): SimilarCompoundGroup | null {
  const trimmed = thai.trim()
  const patternId = PHRASE_COMPOUND_PATTERN[trimmed]
  if (!patternId) return null

  const group = COMPOUND_PATTERN_GROUPS[patternId]
  if (!group) return null

  const items = group.phrases
    .filter((p) => p.thai !== trimmed)
    .map((p) => toExample(p.thai, p.meaningZh))
    .filter((ex) => ex.segments.length >= 2)
    .slice(0, 4)

  if (items.length === 0) return null

  return { patternZh: group.patternZh, items }
}
