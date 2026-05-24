import { LESSONS } from '../data/lessons'
import { PART_MEANINGS } from '../data/part-meanings'
import { splitThaiKaraokeUnits } from './thaiKaraoke'
import { tokenizeThaiPhraseUnits } from './thaiToneRoman'
import { loadUserVocab, UNKNOWN_MEANING } from './userVocab'
import type { CompoundAnalysis, CompoundPart } from '../types'

export { UNKNOWN_MEANING }

/** 詞庫未收錄的常見組合字素 */
const MORPHEME_LEXICON: { thai: string; meaning: string }[] = [
  { thai: 'โรง', meaning: '樓／館（場所）' },
  { thai: 'ห้อง', meaning: '房間' },
  { thai: 'ร้าน', meaning: '店鋪' },
  { thai: 'ความ', meaning: '……性／度（抽象）' },
  { thai: 'การ', meaning: '……之行／事' },
  { thai: 'สี', meaning: '顏色' },
  { thai: 'น้ำ', meaning: '水' },
  { thai: 'คุณ', meaning: '您／你（敬語）' },
  { thai: 'รอง', meaning: '襯／托' },
  { thai: 'ตู้', meaning: '櫃' },
  { thai: 'โต๊ะ', meaning: '桌' },
  { thai: 'กระ', meaning: '小／容器' },
  { thai: 'ช่อง', meaning: '孔／道' },
  { thai: 'สนาม', meaning: '場地' },
  { thai: 'ทาง', meaning: '路／向' },
  { thai: 'ขา', meaning: '腿' },
  { thai: 'ใบ', meaning: '張／片' },
  { thai: 'ขาย', meaning: '賣' },
  { thai: 'เครื่อง', meaning: '器具' },
  { thai: 'นัก', meaning: '者／家' },
  { thai: 'ชีวิต', meaning: '生命' },
  { thai: 'สบาย', meaning: '舒適' },
  { thai: 'ดี', meaning: '好' },
  { thai: 'ขอบ', meaning: '邊緣／受' },
  { thai: 'สวัส', meaning: '吉祥' },
  { thai: 'สุข', meaning: '幸福' },
  { thai: 'สันต์', meaning: '安樂' },
  { thai: 'วัน', meaning: '日' },
  { thai: 'เกิด', meaning: '出生' },
  { thai: 'ขอ', meaning: '請／求' },
  { thai: 'โทษ', meaning: '罪／過' },
  { thai: 'เป็น', meaning: '是／成' },
  { thai: 'ไร', meaning: '事' },
  { thai: 'ลา', meaning: '離' },
  { thai: 'ก่อน', meaning: '先／前' },
  { thai: 'แดง', meaning: '紅' },
  { thai: 'เขียว', meaning: '綠' },
  { thai: 'เหลือง', meaning: '黃' },
  { thai: 'ขาว', meaning: '白' },
  { thai: 'ดำ', meaning: '黑' },
  { thai: 'ส้ม', meaning: '橙' },
  { thai: 'ตำ', meaning: '舂／搗碎' },
  { thai: 'ชมพู', meaning: '粉' },
  { thai: 'ม่วง', meaning: '紫' },
  { thai: 'น้ำเงิน', meaning: '藍' },
  { thai: 'น้ำตาล', meaning: '棕' },
  { thai: 'เทา', meaning: '灰' },
  { thai: 'ทอง', meaning: '金' },
  { thai: 'เงิน', meaning: '銀' },
  { thai: 'ฟ้า', meaning: '天藍' },
  { thai: 'เข้ม', meaning: '深' },
  { thai: 'อ่อน', meaning: '淺' },
  { thai: 'พยาบาล', meaning: '醫護' },
  { thai: 'แรม', meaning: '住宿' },
  { thai: 'เรียน', meaning: '學習' },
  { thai: 'ทำงาน', meaning: '工作' },
  { thai: 'เดินทาง', meaning: '旅行' },
  { thai: 'สัมพันธ์', meaning: '關係' },
  { thai: 'ถั่ว', meaning: '豆／堅果' },
  { thai: 'แพ้', meaning: '過敏' },
  { thai: 'ลืม', meaning: '忘記' },
  { thai: 'ฉัน', meaning: '我' },
  { thai: 'คำ', meaning: '詞' },
  { thai: 'ศัพท์', meaning: '彙／詞' },
  { thai: 'ใหม่', meaning: '新' },
  { thai: 'ฝึก', meaning: '練習' },
  { thai: 'ภาษา', meaning: '語言' },
  { thai: 'รส', meaning: '味道' },
  { thai: 'จัด', meaning: '重／濃' },
  { thai: 'พริก', meaning: '辣椒' },
  { thai: 'แนะนำ', meaning: '推薦' },
  { thai: 'เมนู', meaning: '菜單' },
  { thai: 'อะไร', meaning: '什麼' },
  { thai: 'ในการ', meaning: '在……時（做某事）' },
  { thai: 'สอบ', meaning: '考試' },
  { thai: 'ขอโชคดี', meaning: '祝你幸運' },
  { thai: 'อยาก', meaning: '想／想要' },
  { thai: 'ลด', meaning: '降低／減' },
  { thai: 'ราคา', meaning: '價格' },
  { thai: 'ลดราคา', meaning: '打折／降價' },
  { thai: 'แต่', meaning: '但是' },
  { thai: 'สนุก', meaning: '開心／有趣' },
  { thai: 'หนึ่ง', meaning: '一（數詞）' },
  { thai: 'ครึ่งหนึ่ง', meaning: '一半' },
  { thai: 'เหลือ', meaning: '剩下' },
  { thai: 'ช่วยเหลือ', meaning: '幫助' },
  { thai: 'เส้นทาง', meaning: '路線／路程' },
  { thai: 'เส้น', meaning: '線' },
  { thai: 'อธิบาย', meaning: '解釋' },
  { thai: 'คำศัพท์ใหม่', meaning: '新單字／新詞彙' },
  { thai: 'รู้สึก', meaning: '感覺' },
  { thai: 'สงบ', meaning: '平靜' },
  { thai: 'ผ่อนคลาย', meaning: '放鬆' },
  { thai: 'บ้าน', meaning: '家／房子' },
  { thai: 'พูดคุย', meaning: '聊天／交談' },
  { thai: 'อย่าง', meaning: '……地（方式）' },
  { thai: 'อบอุ่น', meaning: '溫暖' },
  { thai: 'โทน', meaning: '色調' },
  { thai: 'กลาง', meaning: '中間／中性' },
]

/** 在特定複合詞中，子詞義依上下文覆寫 */
const PART_MEANING_IN_PHRASE: Record<string, Record<string, string>> = {
  พื้นเมือง: { พื้น: '當地／本土（合成）', เมือง: '地方' },
  อาหารพื้นเมือง: { พื้น: '當地', เมือง: '地方' },
  อาหารทะเล: { ทะเล: '海' },
  เรียนภาษาไทย: { ภาษา: '語言', ไทย: '泰' },
  คำศัพท์ใหม่: { คำ: '詞', ศัพท์: '彙', ใหม่: '新' },
  อ่านคำศัพท์ใหม่: { อ่าน: '讀', คำ: '詞', ศัพท์: '彙', ใหม่: '新' },
  อธิบายคำศัพท์ใหม่: {
    อธิบาย: '解釋',
    คำศัพท์ใหม่: '新單字／新詞彙',
  },
  น้ำพริกรสจัด: { น้ำพริก: '辣醬', รสจัด: '味重／辣' },
  ขี่จักรยานรอบเมืองเก่า: {
    ขี่: '騎',
    จักรยาน: '腳踏車',
    รอบ: '繞／周圍',
    เมืองเก่า: '古城',
  },
  ส้มตำ: { ส้ม: '酸（此處非「橙」）', ตำ: '舂／搗碎' },
  ควรไหว้ด้วยความเคารพ: {
    ควร: '應該',
    ไหว้: '合十禮',
    ด้วย: '以……方式',
    ความ: '……性（抽象）',
    เคารพ: '尊敬',
  },
  นั่งเรือจากท่าเรือ: {
    นั่งเรือ: '搭船／坐船',
    จาก: '從',
    ท่าเรือ: '碼頭',
  },
  แสดงถึงความสุภาพ: {
    แสดง: '展現／表示',
    ถึง: '到／向',
    ความ: '……性',
    สุภาพ: '禮貌',
  },
  สถาปัตยกรรมสวยงามมาก: {
    สถาปัตยกรรม: '建築',
    สวยงาม: '美麗',
    มาก: '非常／很',
  },
  สำหรับชาวต่างชาติ: {
    สำหรับ: '給／為',
    ชาว: '……人',
    ต่าง: '異／外',
    ชาติ: '國',
  },
  ใบประกาศนียบัตร: {
    ใบ: '張／份（量詞）',
    ประกาศ: '證明／公告',
    นียบัตร: '學位證書',
  },
  เปิดรับสมัคร: {
    เปิด: '開放',
    รับ: '接受',
    สมัคร: '報名',
  },
  ฉันต้องการความช่วยเหลือ: {
    ฉัน: '我',
    ต้องการ: '需要',
    ความช่วยเหลือ: '協助／幫助',
  },
  มาถึงกรุงเทพเป็นครั้งแรก: {
    มา: '来',
    ถึง: '到',
    กรุงเทพ: '曼谷',
    เป็น: '是',
    ครั้งแรก: '第一次',
  },
  รองรับผู้โดยสาร: {
    รองรับ: '容納／因應',
    ผู้โดยสาร: '乘客',
  },
  เติมก่อนวันที่มีผล: {
    เติม: '加（油）',
    ก่อน: '之前',
    วันที่: '……之日',
    มีผล: '生效',
  },
  อัตราเข้าพักสูง: {
    อัตรา: '比率／率',
    เข้าพัก: '入住',
    สูง: '高',
  },
  ช่วงวันหยุดยาว: {
    ช่วง: '時段',
    วันหยุด: '假日',
    ยาว: '長',
  },
  นักท่องเที่ยวเพิ่มขึ้น: {
    นักท่องเที่ยว: '遊客',
    เพิ่มขึ้น: '增加',
  },
  นักท่องเที่ยวต่างชาติ: {
    นักท่องเที่ยว: '遊客',
    ต่างชาติ: '外國',
  },
  เรียนรู้วัฒนธรรมท้องถิ่น: {
    เรียนรู้: '學習／了解',
    วัฒนธรรม: '文化',
    ท้องถิ่น: '當地',
  },
  เรียนรู้วัฒนธรรม: {
    เรียนรู้: '學習／了解',
    วัฒนธรรม: '文化',
  },
  แนะนำเมนูอะไรดี: {
    แนะนำ: '推薦',
    เมนู: '菜單',
    อะไร: '什麼',
    ดี: '好／嗎（語氣）',
  },
  ขอโชคดีในการสอบ: {
    ขอโชคดี: '祝你幸運',
    ในการ: '在……時',
    สอบ: '考試',
  },
  ฉันอยากสั่งอาหาร: {
    ฉัน: '我',
    อยาก: '想／想要',
    สั่ง: '點（餐）',
    อาหาร: '食物／菜',
  },
  ลดราคาได้ไหม: {
    ลดราคา: '打折／降價',
    ได้: '可以',
    ไหม: '嗎',
  },
  แต่สนุก: {
    แต่: '但是',
    สนุก: '開心／有趣',
  },
  วันนี้เหนื่อยแต่สนุก: {
    วันนี้: '今天',
    เหนื่อย: '累',
    แต่: '但是',
    สนุก: '開心／有趣',
  },
  ลดราคาครึ่งหนึ่ง: {
    ลดราคา: '打折／降價',
    ครึ่งหนึ่ง: '一半（五折）',
  },
  เปลี่ยนเส้นทาง: {
    เปลี่ยน: '改／換',
    เส้นทาง: '路線',
  },
  รู้สึกสงบและผ่อนคลาย: {
    รู้สึก: '感覺',
    สงบ: '平靜',
    และ: '和',
    ผ่อนคลาย: '放鬆',
  },
  พูดคุยอย่างอบอุ่น: {
    พูดคุย: '聊天',
    อย่าง: '……地',
    อบอุ่น: '溫暖',
  },
  สีโทนกลาง: {
    สี: '顏色',
    โทน: '色調',
    กลาง: '中性／中間',
  },
  สีโทนอุ่น: { สี: '顏色', โทน: '色調', อุ่น: '暖' },
  สีโทนเย็น: { สี: '顏色', โทน: '色調', เย็น: '冷' },
}

const PATTERN_BY_PREFIX: Record<string, string> = {
  โรง: 'โรง + 名詞 → 某類樓館／場所',
  ห้อง: 'ห้อง + 名詞 → 某用途的房間',
  ร้าน: 'ร้าน + 名詞／動作 → 某類商店',
  ความ: 'ความ + 詞 → 抽象名詞（……性／度）',
  การ: 'การ + 動詞 → 行為／過程',
  สี: 'สี + 色名 → ……色',
  น้ำ: 'น้ำ + 名詞 → 液體或水相關事物',
  คุณ: 'คุณ + 稱謂 → 敬語稱呼',
  รอง: 'รอง + 名詞 → 襯墊／配套物',
  ตู้: 'ตู้ + 名詞 → 某種櫃子',
  โต๊ะ: 'โต๊ะ + 名詞 → 某種桌子',
  เครื่อง: 'เครื่อง + 名詞 → 機器／設備',
  ทาง: 'ทาง + 名詞 → 通道／方向',
  สนาม: 'สนาม + 名詞 → 場地',
  กระ: 'กระ + 名詞 → 小型容器／用品',
}

let meaningMap: Map<string, string> | null = null

export function invalidateCompoundMeaningCache(): void {
  meaningMap = null
}

function buildMeaningMap(): Map<string, string> {
  const map = new Map<string, string>()
  for (const l of LESSONS) {
    if (!map.has(l.thai)) map.set(l.thai, l.meaning)
  }
  for (const u of loadUserVocab()) {
    map.set(u.thai, u.meaning)
  }
  for (const m of MORPHEME_LEXICON) {
    if (!map.has(m.thai)) map.set(m.thai, m.meaning)
  }
  for (const [thai, meaning] of Object.entries(PART_MEANINGS)) {
    if (!map.has(thai)) map.set(thai, meaning)
  }
  map.set('ผม', '我（男性）')
  map.set('ฉัน', '我')
  map.set('ครับ', '禮貌語尾（男）')
  map.set('ค่ะ', '禮貌語尾（女）')
  map.set('ไหม', '嗎')
  map.set('ได้', '可以')
  map.set('ที่', '的／在')
  map.set('และ', '和')
  map.set('กับ', '與')
  map.set('ใน', '在……裡')
  map.set('ของ', '的')
  map.set('ไป', '去')
  map.set('มา', '來')
  return map
}

function getMeaningMap(): Map<string, string> {
  if (!meaningMap) meaningMap = buildMeaningMap()
  return meaningMap
}

function getDecomposeKeys(excludeWhole?: string): string[] {
  const map = getMeaningMap()
  const keys = [...map.keys()].filter((k) => k !== excludeWhole)
  keys.sort((a, b) => b.length - a.length)
  return keys
}

export function lookupPartMeaning(thai: string): string {
  const key = thai.trim()
  const m = getMeaningMap().get(key)
  if (m) return m
  return UNKNOWN_MEANING
}

export function getPartMeaningInPhrase(whole: string, part: string): string {
  const ctx = PART_MEANING_IN_PHRASE[whole.trim()]
  if (ctx?.[part]) return ctx[part]
  return lookupPartMeaning(part)
}

function findWordMatch(
  keys: string[],
  units: string[],
  start: number,
): { thai: string; unitLen: number } | null {
  for (let len = units.length - start; len >= 1; len--) {
    const candidate = units.slice(start, start + len).join('')
    if (keys.includes(candidate)) return { thai: candidate, unitLen: len }
  }
  return null
}

function hasKeyPrefix(keys: string[], prefix: string): boolean {
  return keys.some((k) => k.startsWith(prefix) && k.length > prefix.length)
}

function tryPhraseUnitDecompose(whole: string): CompoundAnalysis | null {
  const units = tokenizeThaiPhraseUnits(whole)
  if (units.length < 2) return null

  const covered = units.reduce((n, u) => n + u.length, 0)
  if (covered / whole.length < 0.85) return null

  const ctx = PART_MEANING_IN_PHRASE[whole]
  const parts: CompoundPart[] = units.map((thai) => ({
    thai,
    meaning: ctx?.[thai] ?? lookupPartMeaning(thai),
  }))

  if (parts.filter((p) => p.meaning === UNKNOWN_MEANING).length > 1) return null

  const wholeMeaning = getMeaningMap().get(whole)
  return {
    parts,
    inferredZh: buildInferredZh(parts, wholeMeaning),
    patternZh: PATTERN_BY_PREFIX[parts[0]?.thai ?? ''],
  }
}

/** 最長匹配拆解（排除整詞本身，以拆出子詞） */
export function decomposeThaiCompound(thai: string): CompoundAnalysis | null {
  const whole = thai.trim()
  if (whole.length < 2) return null

  const fromPhraseUnits = tryPhraseUnitDecompose(whole)
  if (fromPhraseUnits) return fromPhraseUnits

  const keys = getDecomposeKeys(whole)
  const units = splitThaiKaraokeUnits(whole)
  const parts: CompoundPart[] = []
  let i = 0

  while (i < units.length) {
    const u = units[i]
    if (u === ' ' || u === '\n') {
      i += 1
      continue
    }

    const matched = findWordMatch(keys, units, i)
    if (matched) {
      const ctx = PART_MEANING_IN_PHRASE[whole]
      parts.push({
        thai: matched.thai,
        meaning: ctx?.[matched.thai] ?? lookupPartMeaning(matched.thai),
      })
      i += matched.unitLen
      continue
    }

    let j = i + 1
    while (j < units.length && units[j] !== ' ' && units[j] !== '\n') {
      const buffered = units.slice(i, j).join('')
      if (findWordMatch(keys, units, i)?.unitLen === j - i) break
      if (!hasKeyPrefix(keys, buffered)) break
      j += 1
    }

    const buffered = units.slice(i, j).join('')
    const bufferMatch = findWordMatch(keys, units, i)
    if (bufferMatch && bufferMatch.unitLen === j - i) {
      const ctx = PART_MEANING_IN_PHRASE[whole]
      parts.push({
        thai: bufferMatch.thai,
        meaning: ctx?.[bufferMatch.thai] ?? lookupPartMeaning(bufferMatch.thai),
      })
      i += bufferMatch.unitLen
      continue
    }

    if (buffered.length > 0) {
      parts.push({ thai: buffered, meaning: UNKNOWN_MEANING })
      i = j
    } else {
      parts.push({ thai: units[i], meaning: UNKNOWN_MEANING })
      i += 1
    }
  }

  if (parts.length < 2) return null

  const covered = parts.reduce((n, p) => n + p.thai.length, 0)
  if (covered / whole.length < 0.85) return null

  const unknown = parts.filter((p) => p.meaning === UNKNOWN_MEANING).length
  if (unknown > 1) return null

  const wholeMeaning = getMeaningMap().get(whole)
  const inferredZh = buildInferredZh(parts, wholeMeaning)
  const patternZh = PATTERN_BY_PREFIX[parts[0].thai]

  return { parts, inferredZh, patternZh }
}

function buildInferredZh(parts: CompoundPart[], wholeMeaning?: string): string {
  const chain = parts.map((p) => `${p.thai}（${p.meaning}）`).join(' + ')
  if (wholeMeaning) {
    return `${chain} → ${wholeMeaning}`
  }
  const guess = guessMeaningFromParts(parts)
  return guess ? `${chain} → 推估：${guess}` : chain
}

function guessMeaningFromParts(parts: CompoundPart[]): string | null {
  const head = parts[0]?.thai
  const tail = parts.slice(1).map((p) => p.meaning).filter((m) => m !== UNKNOWN_MEANING)

  if (!head || tail.length === 0) return null

  if (head === 'สี' && tail[0]) return `${tail[0]}色`
  if (head === 'โรง' && tail[0]) return `${tail[0]}館／場所`
  if (head === 'ห้อง' && tail[0]) return `${tail[0]}房間`
  if (head === 'ร้าน' && tail.length >= 2) return `賣${tail.join('')}的店`
  if (head === 'ร้าน' && tail[0]) return `${tail[0]}店`
  if (head === 'ความ' && tail[0]) return `${tail[0]}（抽象）`
  if (head === 'การ' && tail[0]) return `${tail[0]}之行／事`
  if (head === 'น้ำ' && tail[0]) return `與${tail[0]}相關的液體／事物`
  if (head === 'รอง' && tail[0]) return `襯${tail[0]}的用品`
  if (head === 'ตู้' && tail[0]) return `${tail[0]}櫃`
  if (head === 'เครื่อง' && tail[0]) return `${tail[0]}機／器`

  return tail.join('+')
}
