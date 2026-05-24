export type PronunciationTipCategory =
  | 'basics'
  | 'consonant'
  | 'vowel'
  | 'tone'
  | 'rhythm'
  | 'mistakes'

export const TIP_CATEGORY_LABELS: Record<PronunciationTipCategory, string> = {
  basics: '入門要訣',
  consonant: '輔音技巧',
  vowel: '元音技巧',
  tone: '聲調技巧',
  rhythm: '節奏與連讀',
  mistakes: '華語者常見錯誤',
}

export interface PronunciationTip {
  id: string
  category: PronunciationTipCategory
  titleZh: string
  bodyZh: string
  exampleThai?: string
  exampleZh?: string
  speakText?: string
}

export const PRONUNCIATION_TIPS: PronunciationTip[] = [
  {
    id: 'p1',
    category: 'basics',
    titleZh: '先聽清，再模仿',
    bodyZh:
      '泰文許多音在中文裡沒有對應。不要急著看字唸，先多聽幾遍，抓母音長短與聲調走向，再開口模仿。',
    exampleThai: 'สวัสดี',
    exampleZh: '你好',
    speakText: 'สวัสดี',
  },
  {
    id: 'p2',
    category: 'basics',
    titleZh: '母音長短會改變意思',
    bodyZh:
      '同一組輔音配上短母音或長母音，可能是不同詞。練習時把長音拉夠、短音收短，不要一律唸成一樣長。',
    exampleThai: 'กะ · กา',
    exampleZh: '短 a vs 長 a',
    speakText: 'กะ',
  },
  {
    id: 'p3',
    category: 'basics',
    titleZh: '用「音高」記聲調，不是用力',
    bodyZh:
      '聲調靠音高變化，不是喊越大聲。升調像語尾上揚、降調像語尾落下；喉嚨放鬆，避免用中文四聲硬套。',
  },
  {
    id: 'p4',
    category: 'consonant',
    titleZh: '送氣／不送氣要分開',
    bodyZh:
      '泰文有成對輔音：不送氣（如 ก）與送氣（如 ข）。送氣音唸時有一小股氣噴出，類似中文「ㄎ」與「ㄎㄨ」的差別，但需單獨練習。',
    exampleThai: 'กา · ขา',
    exampleZh: '不送氣 ก vs 送氣 ข',
    speakText: 'กา',
  },
  {
    id: 'p5',
    category: 'consonant',
    titleZh: 'ร 是顫音，不是「日」',
    bodyZh:
      'ร (ร) 是舌尖顫音或彈音，接近西班牙語的 r，不是中文「日」。可先練輕彈舌再帶入音節。',
    exampleThai: 'รถ',
    exampleZh: '車',
    speakText: 'รถ',
  },
  {
    id: 'p6',
    category: 'consonant',
    titleZh: 'ห 與 อ 幫助發音',
    bodyZh:
      'ห 常與低輔音連用，讓音節變低聲；อ 在字首常作為發音 placeholder（如 อาหาร）。先記常見組合，不必一次背完所有拼寫規則。',
    exampleThai: 'อาหาร',
    exampleZh: '食物',
    speakText: 'อาหาร',
  },
  {
    id: 'p7',
    category: 'vowel',
    titleZh: '雙元音要一次滑過',
    bodyZh:
      '如 ใ (ai)、แ (ae) 等，嘴巴從一個母音滑到另一個，不要拆成兩個中文音硬接。聽範例時注意嘴型連續變化。',
    exampleThai: 'ใก',
    exampleZh: '短 ai 節例',
    speakText: 'ใก',
  },
  {
    id: 'p8',
    category: 'vowel',
    titleZh: 'ำ 是鼻化元音',
    bodyZh:
      'ำ (am/an) 結尾音入鼻腔，類似法語鼻音的感覺。練 กำ、ทำ 時，尾音不要唸成清楚的「m」爆破，而是鼻音共鳴。',
    exampleThai: 'ทำ',
    exampleZh: '做',
    speakText: 'ทำ',
  },
  {
    id: 'p9',
    category: 'vowel',
    titleZh: 'ึ / ื 嘴型要圓',
    bodyZh:
      'ue 系列母音嘴唇略圓、舌位靠前。若唸成「衣」或「烏」都不對，可對照 กึ 與 กื 反覆聽辨。',
    exampleThai: 'กึ · กื',
    exampleZh: '短 ue · 長 ue',
    speakText: 'กึ',
  },
  {
    id: 'p10',
    category: 'tone',
    titleZh: '先練五聲「音高曲線」',
    bodyZh:
      '用 กา、ก่า、ก้า、ก๊า、ก๋า 五個音當模板：平、低、降、高、升。每天唸一輪，用手勢比劃高低，比背規則更快建立聽感。',
    exampleThai: 'กา ก่า ก้า ก๊า ก๋า',
    exampleZh: '五聲範例',
    speakText: 'กา',
  },
  {
    id: 'p11',
    category: 'tone',
    titleZh: '升調尾音真的往上',
    bodyZh:
      '升調（ไม้จัตวา）若沒拉上去，聽起來会像別的詞。練 ก๋า、ไหม 時，結尾音高要明顯高於開頭。',
    exampleThai: 'ไหม',
    exampleZh: '嗎（疑問）',
    speakText: 'ไหม',
  },
  {
    id: 'p12',
    category: 'tone',
    titleZh: '降調要有「落下感」',
    bodyZh:
      '降調（ไม้โท）從相對高處落到低處，常見錯誤是只唸得重、沒有落下。想象說「嗯？」的相反——語尾往下。',
    exampleThai: 'ก้า',
    exampleZh: '降聲範例',
    speakText: 'ก้า',
  },
  {
    id: 'p13',
    category: 'rhythm',
    titleZh: '音節大致等時',
    bodyZh:
      '泰文每個音節時長相近，不像中文可把重音拉很長。練句子時用手指打拍，一節一拍，避免把某個字唸得特別拖長。',
    exampleThai: 'ผมสบายดี',
    exampleZh: '我很好',
    speakText: 'ผมสบายดี',
  },
  {
    id: 'p14',
    category: 'rhythm',
    titleZh: '輕聲節不要偷懶吞掉',
    bodyZh:
      '有些音節在語流中較輕，但仍需保留母音與聲調輪廓。練聽力時注意「輕」≠「省略」。',
    exampleThai: 'ไม่เป็นไร',
    exampleZh: '沒關係',
    speakText: 'ไม่เป็นไร',
  },
  {
    id: 'p15',
    category: 'mistakes',
    titleZh: '避免用中文聲調硬套',
    bodyZh:
      '泰文五聲與中文四聲系統不同。例如泰文升調不是中文二聲，降調也不等於四聲。請以泰文範例為準重新建立肌肉記憶。',
  },
  {
    id: 'p16',
    category: 'mistakes',
    titleZh: '尾音不要加「呃、啊」',
    bodyZh:
      '華語者常在不自覺加尾音。泰文音節結尾要乾淨，尤其入聲感的短音，唸完就停，不要拖腔。',
    exampleThai: 'ขอบคุณ',
    exampleZh: '謝謝',
    speakText: 'ขอบคุณ',
  },
  {
    id: 'p17',
    category: 'mistakes',
    titleZh: 'ร / ล 不要都唸成「日」',
    bodyZh:
      'ล 是邊音（類似「ㄌ」），ร 是顫音。兩者差異聽力題常考。對照 รถ（車）與 ลิง（猴子）反覆練。',
    exampleThai: 'รถ · ลิง',
    exampleZh: '車 · 猴子',
    speakText: 'รถ',
  },
  {
    id: 'p18',
    category: 'mistakes',
    titleZh: '練小聲，再放大',
    bodyZh:
      '一開始不必大喊。小聲、清楚地做出聲調曲線，比大聲但音高模糊更有效。確認自己聽得到高低變化後，再提高音量。',
  },
]

export const TIP_COUNT = PRONUNCIATION_TIPS.length

export const TIP_CATEGORIES: PronunciationTipCategory[] = [
  'basics',
  'consonant',
  'vowel',
  'tone',
  'rhythm',
  'mistakes',
]

export function getTipsByCategory(
  category: PronunciationTipCategory,
): PronunciationTip[] {
  return PRONUNCIATION_TIPS.filter((t) => t.category === category)
}
