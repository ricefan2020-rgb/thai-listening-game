import { SENTENCES, getSentenceById } from '../data/sentences'
import { SENTENCE_ANALYSIS_OVERRIDES } from '../data/sentence-analysis'
import { PART_MEANINGS } from '../data/part-meanings'
import { LESSONS } from '../data/lessons'
import { lookupPartMeaning, decomposeThaiCompound } from './compoundWord'
import { tokenizeThaiForLookup } from './thaiLookup'
import type {
  SegmentRole,
  SentenceAnalysis,
  SentenceItem,
  SentenceSegmentAnalysis,
} from '../types'

export type { SegmentRole, SentenceAnalysis, SentenceSegmentAnalysis }

export const SEGMENT_ROLE_LABELS: Record<SegmentRole, string> = {
  subject: '主語',
  verb: '動詞',
  object: '賓語',
  modifier: '修飾',
  particle: '語尾',
  question: '疑問',
  connector: '連接',
  phrase: '詞組',
}

export const SEGMENT_ROLE_STYLES: Record<SegmentRole, string> = {
  subject: 'bg-blue-100 text-blue-800 ring-blue-200',
  verb: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  object: 'bg-orange-100 text-orange-800 ring-orange-200',
  modifier: 'bg-slate-100 text-slate-700 ring-slate-200',
  particle: 'bg-pink-100 text-pink-800 ring-pink-200',
  question: 'bg-violet-100 text-violet-800 ring-violet-200',
  connector: 'bg-gray-100 text-gray-600 ring-gray-200',
  phrase: 'bg-amber-100 text-amber-900 ring-amber-200',
}

const SUBJECT_WORDS = new Set(['ผม', 'ฉัน', 'ดิฉัน', 'คุณ', 'เขา', 'เธอ', 'เรา', 'พวกเขา', 'ใคร'])
const VERB_HINTS = new Set([
  'ไป',
  'มา',
  'กิน',
  'ดื่ม',
  'ซื้อ',
  'ขาย',
  'พูด',
  'ฟัง',
  'อ่าน',
  'เขียน',
  'ทำ',
  'ช่วย',
  'ชอบ',
  'รัก',
  'มี',
  'เป็น',
  'อยู่',
  'ได้',
  'ให้',
  'หา',
  'เปิด',
  'ปิด',
  'นอน',
  'ตื่น',
  'ทำงาน',
  'เรียน',
  'รอ',
  'ใช้',
  'ขอ',
  'ลอง',
  'ชำระ',
  'จ่าย',
])
const PARTICLE_WORDS = new Set([
  'ครับ',
  'ค่ะ',
  'นะ',
  'จ้ะ',
  'จ๊ะ',
  'หน่อย',
  'ด้วย',
  'กัน',
  'ด้วยกัน',
  'เลย',
  'คะ',
])
const QUESTION_WORDS = new Set(['ไหม', 'มั้ย', 'หรือ', 'ไหน', 'อะไร', 'ทำไม', 'เมื่อไหร่', 'ยังไง', 'เท่าไหร่'])
const MODIFIER_WORDS = new Set(['ไม่', 'ไม่ได้', 'อย่า', 'แล้ว', 'กำลัง', 'ยัง', 'มาก', 'น้อย', 'จะ'])
const CONNECTOR_WORDS = new Set(['และ', 'กับ', 'ที่', 'ใน', 'ของ', 'เพื่อ', 'ว่า', 'แต่', 'หรือ'])

export function inferRole(thai: string): { role: SegmentRole; roleZh: string } {
  const t = thai.trim()
  if (!t) return { role: 'connector', roleZh: '連接' }
  if (QUESTION_WORDS.has(t) || t.endsWith('ไหม') || t.endsWith('มั้ย')) {
    return { role: 'question', roleZh: '疑問' }
  }
  if (PARTICLE_WORDS.has(t)) return { role: 'particle', roleZh: '語尾' }
  if (SUBJECT_WORDS.has(t)) return { role: 'subject', roleZh: '主語' }
  if (MODIFIER_WORDS.has(t)) return { role: 'modifier', roleZh: '修飾' }
  if (CONNECTOR_WORDS.has(t)) return { role: 'connector', roleZh: '連接' }
  if (VERB_HINTS.has(t)) return { role: 'verb', roleZh: '動詞' }
  return { role: 'phrase', roleZh: '詞組' }
}

const EXTRA_MEANINGS: Record<string, string> = {
  ผม: '我（男性）',
  ฉัน: '我（女性／通用）',
  ครับ: '禮貌語尾（男）',
  ค่ะ: '禮貌語尾（女）',
  คุณ: '你',
  ไหม: '嗎',
  ได้: '可以',
  ที่: '的／在',
  และ: '和',
  กับ: '與',
  ใน: '在……裡',
  ของ: '的',
  มี: '有',
  เป็น: '是',
  อยู่: '在',
  ไป: '去',
  มา: '來',
  กิน: '吃',
  ข้าว: '飯／用餐',
  ด้วย: '與／一起（前接）',
  กัน: '互相／一起（助詞）',
  ด้วยกัน: '一起',
  จอง: '預訂',
  สั่ง: '點餐',
  เช็คบิล: '買單',
  ยา: '藥',
  แพทย์: '醫生',
  พยาบาล: '護士',
  สถานี: '車站',
  ป้าย: '標示',
  บัตรเครดิต: '信用卡',
  ถั่ว: '豆／堅果',
  ลืม: '忘記',
  แพ้: '過敏',
  เขา: '他／她',
  เรา: '我們',
  พูด: '說',
  ฟัง: '聽',
  อ่าน: '讀',
  เข้าใจ: '理解',
  คำศัพท์: '詞彙／單字',
  ใหม่: '新的',
  ฝึก: '練習',
  ภาษา: '語言',
  ไทย: '泰',
  แนะนำ: '推薦',
  เมนู: '菜單',
  อะไร: '什麼',
  ในการ: '在……時（做某事）',
  สอบ: '考試',
  ขอโชคดี: '祝你幸運',
  อยาก: '想／想要',
  ลด: '降低／減',
  ราคา: '價格',
  ลดราคา: '打折／降價',
  แต่: '但是',
  สนุก: '開心／有趣',
  หนึ่ง: '一（數詞）',
  ครึ่งหนึ่ง: '一半',
  เหลือ: '剩下',
  ช่วยเหลือ: '幫助',
  ความช่วยเหลือ: '協助／幫忙',
  อธิบาย: '解釋',
  คำศัพท์ใหม่: '新單字／新詞彙',
  เส้นทาง: '路線／路程',
  เส้น: '線',
  รู้สึก: '感覺',
  สงบ: '平靜',
  ผ่อนคลาย: '放鬆',
  บ้าน: '家／房子',
  พูดคุย: '聊天／交談',
  อย่าง: '……地（方式）',
  อบอุ่น: '溫暖',
  โทน: '色調',
  กลาง: '中間／中性',
  สีโทนกลาง: '中性色調',
}

function meaningForThai(thai: string): string {
  const t = thai.trim()
  if (PART_MEANINGS[t]) return PART_MEANINGS[t]
  if (EXTRA_MEANINGS[t]) return EXTRA_MEANINGS[t]
  const lesson = LESSONS.find((l) => l.thai === t)
  if (lesson) return lesson.meaning
  const dup = LESSONS.filter((l) => l.thai === t)
  if (dup.length > 1) return dup.map((l) => l.meaning).join('／')
  const part = lookupPartMeaning(t)
  if (part !== '（未收錄）') return part
  return '（依上下文理解）'
}

function attachCompound(seg: SentenceSegmentAnalysis): SentenceSegmentAnalysis {
  const compound = decomposeThaiCompound(seg.thai)
  if (!compound) return seg
  return { ...seg, compound }
}

function autoSegments(thai: string): SentenceSegmentAnalysis[] {
  const raw = tokenizeThaiForLookup(thai)
  const merged: { thai: string }[] = []

  for (const seg of raw) {
    if (seg.type === 'lexeme') {
      merged.push({ thai: seg.text })
    } else if (seg.text.trim()) {
      const last = merged[merged.length - 1]
      if (last && seg.text.trim().length <= 2) {
        last.thai += seg.text.trim()
      } else {
        merged.push({ thai: seg.text.trim() })
      }
    }
  }

  return merged
    .filter((m) => m.thai.length > 0)
    .map((m) => {
      const { role, roleZh } = inferRole(m.thai)
      return attachCompound({
        thai: m.thai,
        meaning: meaningForThai(m.thai),
        role,
        roleZh,
      })
    })
}

function autoGrammarNote(segments: SentenceSegmentAnalysis[], translation: string): string {
  const parts = segments.map((s) => {
    if (s.compound) return `「${s.thai}」${s.compound.inferredZh}`
    return `「${s.thai}」→ ${s.meaning}`
  })
  const hasQuestion = segments.some((s) => s.role === 'question')
  const hasPolite = segments.some((s) => s.role === 'particle')

  let tip = `整句：${translation}。`
  if (hasQuestion) tip += ' 含疑問詞，多用於提問。'
  if (hasPolite) tip += ' 含禮貌語尾。'
  tip += ` 拆解：${parts.join(' · ')}`
  return tip
}

function autoStructure(segments: SentenceSegmentAnalysis[]): string {
  return segments.map((s) => s.roleZh).join(' → ')
}

export function buildSentenceAnalysis(sentence: SentenceItem): SentenceAnalysis {
  const override = SENTENCE_ANALYSIS_OVERRIDES[sentence.id]
  const auto = autoSegments(sentence.thai)

  const segments: SentenceSegmentAnalysis[] =
    override?.segments?.map((s) => {
      const role = s.role ?? inferRole(s.thai).role
      return attachCompound({
        thai: s.thai,
        meaning: s.meaning,
        role,
        roleZh: s.roleZh ?? SEGMENT_ROLE_LABELS[role],
      })
    }) ?? auto

  return {
    sentenceId: sentence.id,
    fullThai: sentence.thai,
    translationZh: sentence.meaning,
    segments,
    structureZh: override?.structureZh ?? autoStructure(segments),
    grammarNoteZh:
      override?.grammarNoteZh ?? autoGrammarNote(segments, sentence.meaning),
  }
}

export function getSentenceAnalysisById(sentenceId: string): SentenceAnalysis | null {
  const sentence = getSentenceById(sentenceId)
  if (!sentence) return null
  return buildSentenceAnalysis(sentence)
}

export function getSentenceAnalysisForThai(thai: string): SentenceAnalysis | null {
  const sentence = SENTENCES.find((s) => s.thai === thai.trim())
  if (!sentence) return null
  return buildSentenceAnalysis(sentence)
}
