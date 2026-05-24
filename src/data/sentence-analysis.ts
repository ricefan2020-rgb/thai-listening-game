import type { SegmentRole } from '../types'

export interface SentenceAnalysisOverride {
  structureZh?: string
  grammarNoteZh?: string
  segments?: {
    thai: string
    meaning: string
    role?: SegmentRole
    roleZh?: string
  }[]
}

/** 句子分析人工校訂（其餘句子自動拆解） */
export const SENTENCE_ANALYSIS_OVERRIDES: Record<string, SentenceAnalysisOverride> = {
  'sg1': {
    structureZh: '問候語 + 男性語尾',
    grammarNoteZh: '「สวัสดี」= 你好；「ครับ」= 男性禮貌語尾。整句：你好（男性說）。',
    segments: [
      { thai: 'สวัสดี', meaning: '你好', role: 'phrase', roleZh: '問候' },
      { thai: 'ครับ', meaning: 'ครับ（男性禮貌）', role: 'particle', roleZh: '語尾' },
    ],
  },
  'sg2': {
    structureZh: '問候語 + 女性語尾',
    grammarNoteZh: '「สวัสดี」= 你好；「ค่ะ」= 女性禮貌語尾。',
    segments: [
      { thai: 'สวัสดี', meaning: '你好', role: 'phrase', roleZh: '問候' },
      { thai: 'ค่ะ', meaning: 'ค่ะ（女性禮貌）', role: 'particle', roleZh: '語尾' },
    ],
  },
  'sg4': {
    structureZh: '主語 + 述語 + 疑問',
    grammarNoteZh: '「คุณ」你 +「สบายดี」安好嗎 +「ไหม」嗎 → 你好嗎？',
    segments: [
      { thai: 'คุณ', meaning: '你', role: 'subject', roleZh: '主語' },
      { thai: 'สบายดี', meaning: '安好／很好', role: 'phrase', roleZh: '述語' },
      { thai: 'ไหม', meaning: '嗎', role: 'question', roleZh: '疑問' },
    ],
  },
  'sg5': {
    structureZh: '主語 + 狀態 + 致謝',
    grammarNoteZh: '「ผม」我（男）+「สบายดี」很好 +「ขอบคุณ」謝謝。',
    segments: [
      { thai: 'ผม', meaning: '我（男性）', role: 'subject', roleZh: '主語' },
      { thai: 'สบายดี', meaning: '很好', role: 'phrase', roleZh: '狀態' },
      { thai: 'ขอบคุณ', meaning: '謝謝', role: 'phrase', roleZh: '致謝' },
    ],
  },
  ss31: {
    structureZh: '動作詞組 + 程度',
    grammarNoteZh:
      '「ลดราคา」= 打折／降價；「ครึ่งหนึ่ง」= 一半（口語即五折）。整句：可以打五折嗎／降價一半。',
    segments: [
      { thai: 'ลดราคา', meaning: '打折／降價', role: 'verb', roleZh: '動作' },
      { thai: 'ครึ่งหนึ่ง', meaning: '一半（五折）', role: 'modifier', roleZh: '程度' },
    ],
  },
}
