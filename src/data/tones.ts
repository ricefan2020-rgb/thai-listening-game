import type { PhoneticsItem } from '../types'

/** 以「กา」為例示的中輔音五聲（含調號） */
export const TONES: PhoneticsItem[] = [
  {
    id: 't1',
    type: 'tone',
    display: 'กา',
    speakText: 'กา',
    nameZh: '平聲（中調）',
    symbol: '無調號',
    hintZh: '音高平穩，不升不降。中輔音類無調號時多為平聲',
    roman: 'mid',
  },
  {
    id: 't2',
    type: 'tone',
    display: 'ก่า',
    speakText: 'ก่า',
    nameZh: '低聲',
    symbol: '่ ไม้เอก',
    hintZh: '音高較低、略短。符號：่（mai ek）',
    roman: 'low',
  },
  {
    id: 't3',
    type: 'tone',
    display: 'ก้า',
    speakText: 'ก้า',
    nameZh: '降聲',
    symbol: '้ ไม้โท',
    hintZh: '由高往低落下。符號：้（mai tho）',
    roman: 'falling',
  },
  {
    id: 't4',
    type: 'tone',
    display: 'ก๊า',
    speakText: 'ก๊า',
    nameZh: '高聲',
    symbol: '๊ ไม้ตรี',
    hintZh: '音高較高、較短。符號：๊（mai tri）',
    roman: 'high',
  },
  {
    id: 't5',
    type: 'tone',
    display: 'ก๋า',
    speakText: 'ก๋า',
    nameZh: '升聲',
    symbol: '๋ ไม้จัตวา',
    hintZh: '由低往高上升。符號：๋（mai chattawa）',
    roman: 'rising',
  },
]

export const TONE_COUNT = TONES.length

/** 聲調規則補充（教學用） */
export const TONE_RULES = [
  '泰語有 5 個聲調：平、低、降、高、升。',
  '同一個音節，聲調不同，意思可能完全不同。',
  '調號（ไม้）標在母音上方或前方，與輔音類別會影響實際音高。',
  '初學建議：先聽熟五個調的「音高走向」，再練單字與句子。',
]
