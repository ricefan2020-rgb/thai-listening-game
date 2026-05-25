import romanizeLib from '@dehoist/romanize-thai'
import { LESSONS } from '../data/lessons'
import { PHRASE_SEGMENT_OVERRIDES } from '../data/phrase-segment-overrides'
import { PHRASE_TONE_ROMAN } from '../data/phrase-roman-toned'
import { THAI_ROMAN } from '../data/thai-roman'
import { classifyThaiChar } from './thaiScript'
import { splitThaiKaraokeUnits } from './thaiKaraoke'

export type ThaiToneName = 'mid' | 'low' | 'falling' | 'high' | 'rising'

export const TONE_ZH: Record<ThaiToneName, string> = {
  mid: '平',
  low: '低',
  falling: '降',
  high: '高',
  rising: '升',
}

const MID_CONSONANTS = new Set(['ก', 'จ', 'ด', 'ต', 'บ', 'ป', 'อ'])
const HIGH_CONSONANTS = new Set(['ข', 'ฃ', 'ฉ', 'ฐ', 'ถ', 'ผ', 'ฝ', 'ศ', 'ษ', 'ส', 'ห'])
const LIVE_CODA = new Set(['ง', 'ญ', 'ณ', 'น', 'ม', 'ว', 'ย', 'ร', 'ล'])
const DEAD_CODA = new Set(['ก', 'จ', 'ด', 'ต', 'บ', 'ป'])

const TONE_BY_CLASS: Record<
  'mid' | 'high' | 'low',
  Record<'live' | 'dead' | 'ek' | 'tho' | 'tri' | 'chattawa', ThaiToneName>
> = {
  mid: {
    live: 'mid',
    dead: 'low',
    ek: 'low',
    tho: 'falling',
    tri: 'high',
    chattawa: 'rising',
  },
  high: {
    live: 'rising',
    dead: 'low',
    ek: 'low',
    tho: 'falling',
    tri: 'high',
    chattawa: 'rising',
  },
  low: {
    live: 'mid',
    dead: 'high',
    ek: 'falling',
    tho: 'high',
    tri: 'high',
    chattawa: 'rising',
  },
}

/** 音節級基底羅馬字（避免自動轉寫錯誤） */
const SYLLABLE_ROMAN: Record<string, string> = {
  อาหาร: 'ahan',
  พื้น: 'phuen',
  เมือง: 'mueang',
  ทะเล: 'thale',
  น้ำ: 'nam',
  กิน: 'kin',
  เดิน: 'dern',
  ขึ้น: 'khûen',
  จำ: 'jam',
  ลืม: 'luem',
  จดจำ: 'chotjam',
  ลง: 'long',
  ห่อ: 'hò',
  ทัน: 'than',
  ทันที: 'thanthi',
  ข้าว: 'khâo',
  ไป: 'pà',
  มา: 'ma',
  ดี: 'di',
  มาก: 'mak',
  ครับ: 'khrap',
  ค่ะ: 'kha',
  ผม: 'phom',
  ฉัน: 'chǎn',
  ที่: 'thi',
  และ: 'lae',
  กับ: 'kap',
  ใน: 'nai',
  ของ: 'khong',
  มี: 'mii',
  เป็น: 'pen',
  อยู่: 'yu',
  ได้: 'dai',
  ไหม: 'mǎi',
  คุณ: 'khun',
  เขา: 'khao',
  เรา: 'rao',
  วัน: 'wan',
  คำ: 'kham',
  ศัพท์: 'sap',
  ใหม่: 'mài',
  ฝึก: 'fuek',
  ภาษา: 'phasa',
  ไทย: 'thai',
  เรียน: 'rian',
  อร่อย: 'aroi',
  รสชาติ: 'rotchat',
  บรรยากาศ: 'banyakat',
  สนุก: 'sanuk',
  สนุกสนาน: 'sanuksanan',
  อบอุ่น: 'opun',
  พูดคุย: 'phutkui',
  อย่าง: 'yang',
  ท้องถิ่น: 'thongthin',
  อาหารทะเล: 'aharathale',
  ผลไม้: 'phonlamai',
  ตลาด: 'talat',
  วัด: 'wat',
  กรุงเทพ: 'krungthêp',
  ครั้งแรก: 'khráng-rǎek',
  รองรับ: 'rông-ráp',
  ผู้โดยสาร: 'phu-doi-sǎan',
  เติม: 'têm',
  มีผล: 'mii-phon',
  วันที่: 'wan-thîi',
  อัตรา: 'àttra',
  เข้าพัก: 'khâo-phák',
  สูง: 'sǔung',
  เพิ่มขึ้น: 'phuem-khuen',
  ต่างชาติ: 'tang-chat',
  การท่องเที่ยว: 'kan-thongthiao',
  นักท่องเที่ยว: 'nak-thong-thiao',
  ท่องเที่ยว: 'thong-thiao',
  นัก: 'nak',
  เลิกงาน: 'loek-ngan',
  เลิก: 'loek',
  หลัง: 'lang',
  รดน้ำดำหัว: 'rot-nam-dam-hua',
  ผู้ใหญ่: 'phu-yai',
  ขอพร: 'khopphon',
  สวนสัตว์: 'suan-sat',
  สวน: 'suan',
  เตือน: 'tuean',
  ประชาชน: 'prachachon',
  สอน: 'son',
  ช้าๆ: 'chaa-chaa',
  ยืนยัน: 'yuenyan',
  ชำระเงิน: 'chamra-ngoen',
  การชำระเงิน: 'kan-chamra-ngoen',
  รายได้: 'raiad',
  เชียงใหม่: 'chiangmai',
  ภูเก็ต: 'phuket',
  สวัสดี: 'sawatdi',
  ขอบคุณ: 'khopkhun',
  เพื่อน: 'phuean',
  หนังสือ: 'nangsu',
  กาแฟ: 'kafae',
  ขนมปัง: 'khanomphang',
  ออกกำลังกาย: 'okamlangngai',
  สวนสาธารณะ: 'suansatharana',
  ตื่น: 'tuen',
  เช้า: 'cháo',
  โทร: 'thro',
  ดู: 'du',
  หนัง: 'nang',
  งาน: 'ngan',
  ช่วย: 'chuai',
  ยินดี: 'yindi',
  ที่ได้: 'thidai',
  ถาม: 'tham',
  อาการ: 'akkan',
  ถุง: 'thung',
  พลาสติก: 'phlastik',
  ถุงพลาสติก: 'thungphlastik',
  ถุงมือ: 'thungmue',
  สุขสันต์: 'sukhsan',
  วันเกิด: 'wankoet',
  เกิด: 'koet',
  แนะนำ: 'naenam',
  เมนู: 'menu',
  อะไร: 'arai',
  ขอโชคดี: 'khokhokdi',
  โชคดี: 'chokdi',
  ในการ: 'naikan',
  สอบ: 'sop',
  โชค: 'chok',
  การ: 'kan',
  ขอ: 'kho',
  ลด: 'lot',
  ราคา: 'rakha',
  ลดราคา: 'lotrakha',
  แต่: 'tae',
  หนึ่ง: 'nueng',
  ครึ่งหนึ่ง: 'khrueangnueng',
  เหลือ: 'luea',
  ช่วยเหลือ: 'chuailuea',
  ความช่วยเหลือ: 'khwam-chûai-luea',
  ต้องการ: 'tôngkan',
  เส้นทาง: 'senthang',
  เส้น: 'sen',
  กล้อง: 'klong',
  วงจร: 'wongchon',
  วงจรปิด: 'wongchonphit',
  ปิด: 'phit',
  ถ่ายรูป: 'thairup',
  แพ้: 'phae',
  ถั่ว: 'thua',
  ยา: 'ya',
  แพทย์: 'pháet',
  พยาบาล: 'phayaban',
  โรงพยาบาล: 'rongphayaban',
  โรงแรม: 'rongraem',
  ห้องน้ำ: 'hongnam',
  สถานี: 'sathani',
  จอง: 'chong',
  แผนที่: 'phaenthi',
  อากาศ: 'akat',
  ร้อน: 'ron',
  เย็น: 'yen',
  ขี่: 'khi',
  จักรยาน: 'chakkrayan',
  รอบ: 'rop',
  เมืองเก่า: 'mueangkao',
  ของฝาง: 'khongfang',
  ดนตรี: 'dontri',
  ตลาดถนนคนเดิน: 'talatthonnkhondoen',
  ร้านกาแฟ: 'rankafae',
  มะม่วง: 'mamuang',
  อยาก: 'yak',
  ต่อไป: 'topai',
  น่าสนใจ: 'nasanchai',
  ประเทศ: 'prathet',
  ไหว้: 'wâi',
  ควร: 'khuen',
  ด้วย: 'duâi',
  ความ: 'khwam',
  เคารพ: 'khao-rop',
  ความสุภาพ: 'khwam-sùphaph',
  แสดง: 'sǎedong',
  ถึง: 'thǔeng',
  สุภาพ: 'sùphaph',
  วัฒนธรรม: 'watthanatham',
  เรียนรู้: 'rianru',
  สงกรานต์: 'songkran',
  ตลาดน้ำ: 'talatnam',
  คำศัพท์: 'khamsap',
  อธิบาย: 'athibai',
  คำศัพท์ใหม่: 'khamsapmai',
  ข้าวเปล่า: 'khaopao',
  ผัดไทย: 'phatthai',
  แกงเขียวหวาน: 'kaengkhiaowan',
  ชาเย็น: 'chayen',
  ข้าวเหนียว: 'khaoniao',
  หมูปิ้ง: 'muping',
  ไข่ต้ม: 'khaitom',
  ส้ม: 'sôm',
  ตำ: 'tam',
  ส้มตำ: 'sôm-tam',
  นาที: 'naa-thii',
  ผักสด: 'phaksot',
  อ่าน: 'an',
  เครื่องบิน: 'khrueangbin',
  ขนาด: 'khanat',
  เล็ก: 'lek',
  วิว: 'wiw',
  ประทับใจ: 'prathapchai',
  ท่าเรือ: 'thâ-ruea',
  นั่งเรือ: 'nâng-ruea',
  เรือ: 'ruea',
  นั่ง: 'nâng',
  จาก: 'chàk',
  ท่า: 'thâ',
  ม้า: 'má',
  สี: 'sǐ',
  สี่: 'sì',
  ชา: 'chaa',
  ช้า: 'cháa',
  ใช่: 'chài',
  ใช้: 'chái',
  นา: 'naa',
  น้า: 'náa',
  ลมแรง: 'lomraeng',
  ทะเลสวย: 'thalesuay',
  น้ำพริก: 'namphrik',
  ไม่กิน: 'maikin',
  น้ำตก: 'namtok',
  ผู้คน: 'phukhkhon',
  เป็นมิตร: 'penmit',
  คนเยอะ: 'khonyoe',
  ประสบการณ์: 'prasopkan',
  สถาปัตยกรรม: 'sà-thà-pàt-yá-kam',
  สวยงาม: 'sǔay-ngam',
  คึกคัก: 'khuekkhak',
  วิถีชีวิต: 'withichivit',
  ชื่นใจ: 'chueanchai',
  สัมพันธ์: 'samphan',
  ผ่อนคลาย: 'phonklai',
  สงบ: 'ngop',
  รู้สึก: 'rusuek',
  บ้าน: 'ban',
  โทน: 'thon',
  กลาง: 'klang',
  สีโทนกลาง: 'sithonklang',
  สีโทนอุ่น: 'sithonun',
  สีโทนเย็น: 'sithonyen',
  กลางคืน: 'klangkhuen',
  บนเรือ: 'bonruea',
  กล้วย: 'kluai',
  ทุเรียน: 'thurian',
  มังคุด: 'mangkhut',
  แตงโม: 'taengmo',
  สับปะรด: 'sapparot',
  ดีใจ: 'dichai',
  เศร้า: 'sao',
  โกรธ: 'krot',
  กลัว: 'klua',
  รัก: 'rak',
  ความสุข: 'khwam-suk',
  อารมณ์: 'arom',
  สบาย: 'sabai',
  ข่าว: 'khao',
  รายงาน: 'raingan',
  ประกาศ: 'prakat',
  ฉุกเฉิน: 'chukchoen',
  ออนไลน์: 'online',
  สำหรับ: 'sàm-ràp',
  ชาว: 'chao',
  ต่าง: 'tàng',
  ชาติ: 'chàt',
  ชาวต่างชาติ: 'chao-tàng-chàt',
  เวลา: 'wela',
  สัปดาห์: 'sàp-daa',
  เทศกาล: 'thét-sà-kan',
  ลอยกระทง: 'loi-krà-thong',
  ตรงเวลา: 'trong-wela',
  ช่วง: 'chûang',
  ช่วงเช้า: 'chûang-cháo',
  ราว: 'rao',
  ตาก: 'tàak',
  ผ้า: 'phâa',
  ตากผ้า: 'tàak-phâa',
  ราวตากผ้า: 'rao-tàak-phâa',
  อ่าง: 'àang',
  ล้าง: 'láang',
  ล้างหน้า: 'láang-nâa',
  อ่างล้างหน้า: 'àang-láang-nâa',
  รถ: 'rót',
  ไฟฟ้า: 'fai-fáa',
  รถไฟฟ้า: 'rót-fai-fáa',
  ถัง: 'thǎng',
  ซัก: 'sák',
  ถังซักผ้า: 'thǎng-sák-phâa',
  หอย: 'hǒi',
  นางรม: 'nang-rom',
  หอยนางรม: 'hǒi-nang-rom',
  ปลา: 'plaa',
  หมึก: 'muek',
  ยักษ์: 'yák',
  ปลาหมึกยักษ์: 'plaa-muek-yák',
  ไหล: 'lǎi',
  ปลาไหล: 'plaa-lǎi',
  ปู: 'puu',
  ปูม้า: 'puu-máa',
  กุ้ง: 'kung',
  มังกร: 'mangkon',
  กุ้งมังกร: 'kung-mangkon',
  สิงโต: 'singto',
  สิงโตทะเล: 'singto-thale',
  กัด: 'gàt',
  ปลากัด: 'plaa-gàt',
  กัน: 'kan',
  ด้วยกัน: 'duâi-kan',
  ไปกินข้าวด้วยกัน: 'pai-kin-khâo-duâi-kan',
  ภาษาไทย: 'phasa-thai',
  อังกฤษ: 'ang-krìt',
  ภาษาไทยและอังกฤษ: 'phasa-thai-lae-ang-krìt',
  วันหยุด: 'wan-yút',
  ยาว: 'yaao',
  วันหยุดยาว: 'wan-yút-yaao',
  เปิด: 'pòet',
  รับ: 'ráp',
  สมัคร: 'samák',
  เปิดรับสมัคร: 'pòet-ráp-samák',
  ใบ: 'bài',
  นียบัตร: 'nii-yá-bàt',
}

let phraseLexiconCache: string[] | null = null

/** 有羅馬字條目，但點詞時應拆成較短詞位（如 ต้องการ + ความช่วยเหลือ） */
const LEXICON_ROMAN_SKIP = new Set([
  'ต้องการความช่วยเหลือ',
  'เรียนรู้วัฒนธรรม',
  'เรียนรู้วัฒนธรรมท้องถิ่น',
  'วันหยุดยาว',
  'ช่วงวัน',
  'นักท่องเที่ยวเพิ่มขึ้น',
])

/** 整句羅馬字條目只用於發音，不用於點詞切分 */
function isWholePhraseRomanKey(key: string): boolean {
  return Object.prototype.hasOwnProperty.call(THAI_ROMAN, key) && key.length >= 8
}

function findPhraseLexemeHit(keys: string[], rest: string, fullText: string): string | undefined {
  return keys.find((k) => {
    if (!rest.startsWith(k)) return false
    if (LEXICON_ROMAN_SKIP.has(k)) return false
    if (k.length === fullText.length && isWholePhraseRomanKey(k)) return false
    return true
  })
}

/** 詞庫 + 課程單字，最長優先匹配 */
function phraseLexiconKeys(): string[] {
  if (phraseLexiconCache) return phraseLexiconCache
  const keys = new Set<string>([
    ...Object.keys(SYLLABLE_ROMAN),
    ...Object.keys(THAI_ROMAN),
    ...LESSONS.map((l) => l.thai),
  ])
  phraseLexiconCache = [...keys].sort((a, b) => b.length - a.length)
  return phraseLexiconCache
}

const VOWEL_ACCENT: Record<ThaiToneName, Record<string, string>> = {
  mid: { a: 'a', e: 'e', i: 'i', o: 'o', u: 'u' },
  low: { a: 'à', e: 'è', i: 'ì', o: 'ò', u: 'ù' },
  falling: { a: 'â', e: 'ê', i: 'î', o: 'ô', u: 'û' },
  high: { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú' },
  rising: { a: 'ǎ', e: 'ě', i: 'ǐ', o: 'ǒ', u: 'ǔ' },
}

function consonantClass(c: string): 'mid' | 'high' | 'low' {
  if (MID_CONSONANTS.has(c)) return 'mid'
  if (HIGH_CONSONANTS.has(c)) return 'high'
  return 'low'
}

function leadingConsonant(syllable: string): string {
  const chars = [...syllable]
  if ('เแโใไ'.includes(chars[0])) {
    for (const ch of chars.slice(1)) {
      if (classifyThaiChar(ch) === 'consonant') return ch
    }
  }
  for (const ch of chars) {
    if (classifyThaiChar(ch) === 'consonant') return ch
  }
  return 'อ'
}

function toneMark(syllable: string): 'ek' | 'tho' | 'tri' | 'chattawa' | null {
  if (syllable.includes('่')) return 'ek'
  if (syllable.includes('้')) return 'tho'
  if (syllable.includes('๊')) return 'tri'
  if (syllable.includes('๋')) return 'chattawa'
  return null
}

/** การันต์（์）前的辅音才是音節尾，如 แพทย์ → แพท */
function normalizeThaiSyllableForTone(syllable: string): string {
  if (!syllable.includes('์')) return syllable
  return syllable.replace(/([ก-ฮ])ย์/g, '$1').replace(/์/g, '')
}

function isDeadSyllable(syllable: string): boolean {
  const s = normalizeThaiSyllableForTone(syllable)
  const chars = [...s]
  const last = chars[chars.length - 1]
  if (classifyThaiChar(last) === 'consonant') {
    if (LIVE_CODA.has(last)) return false
    if (DEAD_CODA.has(last)) return true
    return true
  }
  if (s.includes('ะ') && !s.includes('าะ')) return true
  if (s.endsWith('ำ') || s.endsWith('า')) return false
  if (/[ิุึ]/.test(s) && !/[ีูำา]/.test(s)) return true
  return false
}

export function detectSyllableTone(syllable: string): ThaiToneName {
  const initial = leadingConsonant(syllable)
  const cls = consonantClass(initial)
  const mark = toneMark(syllable)
  if (mark) return TONE_BY_CLASS[cls][mark]
  return TONE_BY_CLASS[cls][isDeadSyllable(syllable) ? 'dead' : 'live']
}

function applyToneToRomanSyllable(roman: string, tone: ThaiToneName): string {
  if (tone === 'mid' || !roman) return roman
  const lower = roman.toLowerCase()
  for (let i = 0; i < lower.length; i++) {
    const c = lower[i]
    if ('aeiou'.includes(c)) {
      const accented = VOWEL_ACCENT[tone][c]
      if (!accented) return roman
      const out = roman.slice(0, i) + accented + roman.slice(i + 1)
      return out
    }
  }
  return roman
}

const TONE_DIACRITIC_RE = /[àâèêìîòôùûáéíóúǎěǐǒǔ]/

function hasToneDiacritic(roman: string): boolean {
  return TONE_DIACRITIC_RE.test(roman)
}

function romanizeSyllable(syllable: string): string {
  const trimmed = syllable.trim()
  if (!trimmed) return ''
  if (SYLLABLE_ROMAN[trimmed]) return SYLLABLE_ROMAN[trimmed]
  const fromTable = THAI_ROMAN[trimmed]
  if (fromTable?.includes('-') || (fromTable && hasToneDiacritic(fromTable))) {
    return fromTable
  }
  const lib = romanizeLib(trimmed)
  return lib.length >= 2 ? lib : lib
}

/** 單音節：帶聲調符號的羅馬拼音 */
export function toneRomanSyllable(syllable: string): string {
  const thai = syllable.trim()
  if (!thai) return ''
  const base = romanizeSyllable(thai)
  if (hasToneDiacritic(base)) return base
  const tone = detectSyllableTone(thai)
  return applyToneToRomanSyllable(base, tone)
}

function karaokeUnits(text: string): string[] {
  return splitThaiKaraokeUnits(text).filter(
    (u) => u !== ' ' && u !== '\n' && u !== '·' && u !== '／' && u !== '/',
  )
}

/** 一個詞位：多音節詞再按泰文音節標調並以連字號連接 */
function toneRomanLexeme(unit: string): string {
  const fromTable = THAI_ROMAN[unit]
  if (fromTable?.includes('-')) return fromTable
  if (fromTable && karaokeUnits(unit).length <= 1 && hasToneDiacritic(fromTable)) {
    return fromTable
  }

  const fromSyllable = SYLLABLE_ROMAN[unit]
  if (fromSyllable?.includes('-') || (fromSyllable && hasToneDiacritic(fromSyllable))) {
    return fromSyllable
  }
  if (fromSyllable) return toneRomanSyllable(unit)

  const subs = karaokeUnits(unit)
  if (subs.length <= 1) return toneRomanSyllable(unit)
  return subs.map((s) => toneRomanSyllable(s)).join('-')
}

/** 「ยินดีที่ได้…」固定拆成 ยินดี + ที่ได้ + 後段，避免 ช่วย 被切成 ช่ว+ย */
function splitYindiThidaiPhrase(text: string): string[] | null {
  const prefix = 'ยินดีที่ได้'
  if (!text.startsWith(prefix)) return null
  const tail = text.slice(prefix.length)
  if (!tail) return ['ยินดี', 'ที่ได้']
  return ['ยินดี', 'ที่ได้', tail]
}

/** 「กล้อง…」複合詞：กล้อง + 後段（วงจรปิด、ถ่ายรูป 等） */
function splitKlongPrefix(text: string): string[] | null {
  const prefix = 'กล้อง'
  if (!text.startsWith(prefix) || text.length <= prefix.length) return null
  return [prefix, text.slice(prefix.length)]
}

/** 「มี…ไหม」問句：มี + 中間 + ไหม */
function splitMiiMaiQuestion(text: string): string[] | null {
  const start = 'มี'
  const end = 'ไหม'
  if (!text.startsWith(start) || !text.endsWith(end) || text.length <= start.length + end.length) {
    return null
  }
  const mid = text.slice(start.length, -end.length)
  if (!mid) return [start, end]
  return [start, mid, end]
}

/** 「…อะไรดี」問句：前段 + อะไร + ดี */
function splitAraiDiSuffix(text: string): string[] | null {
  const suffix = 'อะไรดี'
  if (!text.endsWith(suffix) || text.length <= suffix.length) return null
  const head = text.slice(0, -suffix.length)
  if (!head) return ['อะไร', 'ดี']
  const headUnits = tokenizePhraseUnitsCore(head)
  return [...headUnits, 'อะไร', 'ดี']
}

/** 「…ได้ไหม」問句：前段 + ได้ + ไหม */
function splitDaiMaiSuffix(text: string): string[] | null {
  const suffix = 'ได้ไหม'
  if (!text.endsWith(suffix) || text.length <= suffix.length) return null
  const head = text.slice(0, -suffix.length)
  if (!head) return ['ได้', 'ไหม']
  const headUnits = tokenizePhraseUnitsCore(head)
  return [...headUnits, 'ได้', 'ไหม']
}

/** 整詞／句：音節以連字號連接，每節標聲調 */
export function toneRomanWord(text: string): string {
  const trimmed = text.trim()
  if (!trimmed) return ''
  if (PHRASE_TONE_ROMAN[trimmed]) return PHRASE_TONE_ROMAN[trimmed]
  if (THAI_ROMAN[trimmed]?.includes('-')) return THAI_ROMAN[trimmed]

  const units = tokenizePhraseUnits(trimmed)
  if (units.length === 0) return romanizeSyllable(trimmed)

  if (units.length === 1) return toneRomanLexeme(units[0])

  return units.map((u) => toneRomanLexeme(u)).join('-')
}

/** K 歌切分有時把 …เหลือ／เกลือ／ช่วยเหลือ 拆成 …เห + ลือ；ผล 拆成 ผ + ล */
function mergeLueFragments(units: string[]): string[] {
  const out: string[] = []
  for (const u of units) {
    if (u === 'ล' && out.length > 0 && out[out.length - 1] === 'ผ') {
      out[out.length - 1] = 'ผล'
      continue
    }
    if (out.length > 0 && out[out.length - 1] === 'อัต' && u.startsWith('รา')) {
      out[out.length - 1] = 'อัตรา'
      const rest = u.length > 2 ? u.slice(2) : ''
      if (rest) out.push(rest)
      continue
    }
    if (u === 'ลือ' && out.length > 0) {
      const prev = out[out.length - 1]!
      if (prev === 'เห' || prev === 'เก' || prev === 'ช่วยเห' || prev.endsWith('เห')) {
        out[out.length - 1] = prev + 'ลือ'
        continue
      }
    }
    if (u === 'ว' && out.length > 0 && out[out.length - 1] === 'ยา') {
      out[out.length - 1] = 'ยาว'
      continue
    }
    if (u === 'เที่ยว' && out.length > 0 && out[out.length - 1] === 'ท่อง') {
      out[out.length - 1] = 'ท่องเที่ยว'
      continue
    }
    if (u === 'ง' && out.length > 0 && out[out.length - 1] === 'ท่อง') {
      continue
    }
    if (u === 'เพิ่ม' && out.length > 0 && out[out.length - 1] === 'เที่ยว') {
      out[out.length - 1] = 'เที่ยวเพิ่ม'
      continue
    }
    if (u === 'ขึ้น' && out.length > 0 && out[out.length - 1] === 'เที่ยวเพิ่ม') {
      out[out.length - 1] = 'เพิ่มขึ้น'
      continue
    }
    if (u === 'งาน' && out.length > 0 && out[out.length - 1] === 'เลิก') {
      out[out.length - 1] = 'เลิกงาน'
      continue
    }
    if (
      (u === 'ญ่' || u === 'ญ' || u.startsWith('ญ')) &&
      out.length > 0 &&
      out[out.length - 1] === 'ผู้ให'
    ) {
      out[out.length - 1] = 'ผู้ใหญ่'
      continue
    }
    if (u === 'สัตว์' && out.length > 0 && out[out.length - 1] === 'สวน') {
      out[out.length - 1] = 'สวนสัตว์'
      continue
    }
    if (u === 'น' && out.length > 0 && out[out.length - 1] === 'เตือ') {
      out[out.length - 1] = 'เตือน'
      continue
    }
    if (u === 'ระชาช' && out.length > 0 && out[out.length - 1] === 'ป') {
      out[out.length - 1] = 'ประชาช'
      continue
    }
    if (u === 'น' && out.length > 0 && out[out.length - 1] === 'ประชาช') {
      out[out.length - 1] = 'ประชาชน'
      continue
    }
    if (u === 'ๆ' && out.length > 0) {
      out[out.length - 1] = out[out.length - 1] + 'ๆ'
      continue
    }
    if (u === 'เงิน' && out.length > 0 && out[out.length - 1] === 'ชำระ') {
      out[out.length - 1] = 'ชำระเงิน'
      continue
    }
    if (u === 'ที' && out.length > 0 && out[out.length - 1] === 'ทัน') {
      out[out.length - 1] = 'ทันที'
      continue
    }
    if (u === 'ผ้า' && out.length > 0 && out[out.length - 1] === 'ตาก') {
      out[out.length - 1] = 'ตากผ้า'
      continue
    }
    if (u === 'ตาก' && out.length > 0 && out[out.length - 1] === 'ราว') {
      out.push('ตาก')
      continue
    }
    if (u === 'ซัก' && out.length > 0 && out[out.length - 1] === 'ถัง') {
      out.push('ซัก')
      continue
    }
    if (u === 'ผ้า' && out.length >= 2 && out[0] === 'ถัง' && out[1] === 'ซัก') {
      out.push('ผ้า')
      continue
    }
    if (u === 'หมึก' && out.length > 0 && out[out.length - 1] === 'ปลา') {
      out.push('หมึก')
      continue
    }
    if (u === 'ยักษ์' && out.length >= 2 && out[0] === 'ปลา' && out[1] === 'หมึก') {
      out.push('ยักษ์')
      continue
    }
    if (u === 'ไหล' && out.length > 0 && out[out.length - 1] === 'ปลา') {
      out.push('ไหล')
      continue
    }
    if (u === 'ม้า' && out.length > 0 && out[out.length - 1] === 'ปู') {
      out.push('ม้า')
      continue
    }
    if (u === 'มังกร' && out.length > 0 && out[out.length - 1] === 'กุ้ง') {
      out.push('มังกร')
      continue
    }
    if (u === 'นาง' && out.length > 0 && out[out.length - 1] === 'หอย') {
      out.push('นาง')
      continue
    }
    if (u === 'รม' && out.length >= 2 && out[0] === 'หอย' && out[1] === 'นาง') {
      out[out.length - 1] = 'นางรม'
      continue
    }
    if (u === 'ทะเล' && out.length > 0 && out[out.length - 1] === 'สิงโต') {
      out.push('ทะเล')
      continue
    }
    if (u === 'กัด' && out.length > 0 && out[out.length - 1] === 'ปลา') {
      out.push('กัด')
      continue
    }
    if (u === 'กัน' && out.length > 0 && out[out.length - 1] === 'ด้วย') {
      out[out.length - 1] = 'ด้วยกัน'
      continue
    }
    if (u === 'น้า' && out.length > 0 && out[out.length - 1] === 'ห') {
      out[out.length - 1] = 'หน้า'
      continue
    }
    if (u === 'ล้าง' && out.length > 0 && out[out.length - 1] === 'อ่าง') {
      out.push('ล้าง')
      continue
    }
    if (u === 'หน้า' && out.length > 0 && out[out.length - 1] === 'ล้าง') {
      out.push('หน้า')
      continue
    }
    if (u === 'ฟ้า' && out.length > 0 && out[out.length - 1] === 'รถไฟ') {
      out[out.length - 1] = 'รถไฟฟ้า'
      continue
    }
    if (u === 'ฟ้า' && out.length > 0 && out[out.length - 1] === 'ไฟ') {
      out[out.length - 1] = 'ไฟฟ้า'
      continue
    }
    out.push(u)
  }
  return out
}

const CHUANG_PREFIX = 'ช่วง'
const NAK_THONG_THIAO = 'นักท่องเที่ยว'
const HLANG_LOEK_NGAN = 'หลังเลิกงาน'
const ROD_NAM_DAM_HUA = 'รดน้ำดำหัว'
const PAI_PREFIX = 'ไป'
const TUEAN_PREFIX = 'เตือน'
const YUENYAN_PREFIX = 'ยืนยัน'

/** 「ยืนยัน…」確認 + 名詞化片語 */
function splitYuenyanPrefix(trimmed: string): string[] | null {
  if (!trimmed.startsWith(YUENYAN_PREFIX) || trimmed.length <= YUENYAN_PREFIX.length) {
    return null
  }
  const tail = trimmed.slice(YUENYAN_PREFIX.length)
  if (!tail) return [YUENYAN_PREFIX]
  const tailUnits = tokenizePhraseUnitsCoreInner(tail)
  return [YUENYAN_PREFIX, ...tailUnits]
}

/** 「เตือน…」提醒 + 對象 */
function splitTueanPrefix(trimmed: string): string[] | null {
  if (!trimmed.startsWith(TUEAN_PREFIX) || trimmed.length <= TUEAN_PREFIX.length) {
    return null
  }
  const tail = trimmed.slice(TUEAN_PREFIX.length)
  if (!tail) return [TUEAN_PREFIX]
  const tailUnits = tokenizePhraseUnitsCoreInner(tail)
  return [TUEAN_PREFIX, ...tailUnits]
}

/** 「ไป…」動詞 + 目的地（避免 สวน+สัตว์ 拆散） */
function splitPaiPrefix(trimmed: string): string[] | null {
  if (!trimmed.startsWith(PAI_PREFIX) || trimmed.length <= PAI_PREFIX.length) return null
  const tail = trimmed.slice(PAI_PREFIX.length)
  if (!tail) return [PAI_PREFIX]
  const tailUnits = tokenizePhraseUnitsCoreInner(tail)
  return [PAI_PREFIX, ...tailUnits]
}

/** 「รดน้ำดำหัว…」整段動作 + 對象 */
function splitRodNamDamHuaPrefix(trimmed: string): string[] | null {
  if (!trimmed.startsWith(ROD_NAM_DAM_HUA) || trimmed.length <= ROD_NAM_DAM_HUA.length) {
    return null
  }
  const tail = trimmed.slice(ROD_NAM_DAM_HUA.length)
  const tailUnits = tokenizePhraseUnitsCoreInner(tail)
  return [ROD_NAM_DAM_HUA, ...tailUnits]
}

/** 「หลังเลิกงาน」固定兩段，避免 หลัง／เลิก／งาน 拆散 */
function splitHlangLoekNgan(trimmed: string): string[] | null {
  if (!trimmed.startsWith(HLANG_LOEK_NGAN)) return null
  const tail = trimmed.slice(HLANG_LOEK_NGAN.length)
  if (!tail) return ['หลัง', 'เลิกงาน']
  return ['หลัง', 'เลิกงาน', ...tokenizePhraseUnitsCoreInner(tail)]
}

/** 「นักท่องเที่ยว…」整詞優先，避免 ท่อง／ง／เที่ยว 被拆散 */
function splitNakThongthiaoPrefix(trimmed: string): string[] | null {
  if (!trimmed.startsWith(NAK_THONG_THIAO) || trimmed.length <= NAK_THONG_THIAO.length) {
    return null
  }
  const tail = trimmed.slice(NAK_THONG_THIAO.length)
  const tailUnits = tokenizePhraseUnitsCoreInner(tail)
  return [NAK_THONG_THIAO, ...tailUnits]
}

/** 「ช่วง…」避免 K 歌 把 ช่วง+วัน 黏成 ช่วงวัน */
function splitChuangPrefix(trimmed: string): string[] | null {
  if (!trimmed.startsWith(CHUANG_PREFIX) || trimmed.length <= CHUANG_PREFIX.length) return null
  const tail = trimmed.slice(CHUANG_PREFIX.length)
  const tailUnits = tokenizePhraseUnitsCoreInner(tail)
  return [CHUANG_PREFIX, ...tailUnits]
}

/** 先用詞庫最長匹配，再退回 K 歌音節切分（供拼音與句中點詞共用） */
function phraseOverrideUnits(text: string): string[] | null {
  const trimmed = text.trim()
  const compact = trimmed.replace(/\s+/g, '')
  const manual = PHRASE_SEGMENT_OVERRIDES[trimmed] ?? PHRASE_SEGMENT_OVERRIDES[compact]
  if (manual && manual.length >= 2) return manual.map((s) => s.thai)
  return null
}

function tokenizePhraseUnitsCoreInner(text: string): string[] {
  const trimmed = text.trim()
  const fromOverride = phraseOverrideUnits(trimmed)
  if (fromOverride) return fromOverride

  const yindiParts = splitYindiThidaiPhrase(trimmed)
  if (yindiParts) return yindiParts

  const klongParts = splitKlongPrefix(trimmed)
  if (klongParts) return klongParts

  const miiMaiParts = splitMiiMaiQuestion(trimmed)
  if (miiMaiParts) return miiMaiParts

  const keys = phraseLexiconKeys()
  const units: string[] = []
  let rest = trimmed
  while (rest.length > 0) {
    const hit = findPhraseLexemeHit(keys, rest, trimmed)
    if (hit) {
      units.push(hit)
      rest = rest.slice(hit.length)
      continue
    }
    const karaoke = splitThaiKaraokeUnits(rest).filter(
      (u) => u !== ' ' && u !== '\n' && u !== '·' && u !== '／' && u !== '/',
    )
    if (karaoke[0]) {
      units.push(karaoke[0])
      rest = rest.slice(karaoke[0].length)
    } else break
  }
  if (units.length > 0) return mergeLueFragments(units)
  return mergeLueFragments(
    splitThaiKaraokeUnits(text).filter(
      (u) => u !== ' ' && u !== '\n' && u !== '·' && u !== '／' && u !== '/',
    ),
  )
}

function tokenizePhraseUnitsCore(text: string): string[] {
  const trimmed = text.trim()
  const yuenyan = splitYuenyanPrefix(trimmed)
  if (yuenyan) return yuenyan
  const tuean = splitTueanPrefix(trimmed)
  if (tuean) return tuean
  const pai = splitPaiPrefix(trimmed)
  if (pai) return pai
  const rodNam = splitRodNamDamHuaPrefix(trimmed)
  if (rodNam) return rodNam
  const hlang = splitHlangLoekNgan(trimmed)
  if (hlang) return hlang
  const nak = splitNakThongthiaoPrefix(trimmed)
  if (nak) return nak
  const chuang = splitChuangPrefix(trimmed)
  if (chuang) return chuang
  return tokenizePhraseUnitsCoreInner(trimmed)
}

function tokenizePhraseUnits(text: string): string[] {
  const trimmed = text.trim()
  const araiDi = splitAraiDiSuffix(trimmed)
  if (araiDi) return araiDi
  const daiMai = splitDaiMaiSuffix(trimmed)
  if (daiMai) return daiMai
  return tokenizePhraseUnitsCore(trimmed)
}

/** 句中點詞／拼音共用的詞位切分 */
export function tokenizeThaiPhraseUnits(text: string): string[] {
  return tokenizePhraseUnits(text.trim())
}

export interface ThaiRomanToneInfo {
  /** 含聲調符號的羅馬拼音（多音節以 - 連接） */
  roman: string
  /** 各音節聲調（平/低/降/高/升） */
  tonesZh: string
}

function toneUnitsForDisplay(text: string): string[] {
  return tokenizePhraseUnits(text).flatMap((u) => {
    if (SYLLABLE_ROMAN[u] || (THAI_ROMAN[u] && !THAI_ROMAN[u].includes('-'))) {
      return [u]
    }
    const subs = karaokeUnits(u)
    return subs.length > 1 ? subs : [u]
  })
}

function toneZhFromRomanSegment(segment: string): string {
  if (/[àèìòù]/.test(segment)) return '低'
  if (/[âêîôû]/.test(segment)) return '降'
  if (/[áéíóú]/.test(segment)) return '高'
  if (/[ǎěǐǒǔ]/.test(segment)) return '升'
  return '平'
}

export function getThaiRomanToneInfo(text: string): ThaiRomanToneInfo {
  const trimmed = text.trim()
  if (!trimmed) return { roman: '', tonesZh: '' }

  const phraseRoman = PHRASE_TONE_ROMAN[trimmed] ?? THAI_ROMAN[trimmed]
  if (phraseRoman?.includes('-')) {
    const toneLabels = phraseRoman.split('-').map(toneZhFromRomanSegment)
    return {
      roman: phraseRoman,
      tonesZh: [...new Set(toneLabels)].join('·'),
    }
  }

  const roman = toneRomanWord(trimmed)
  const units = toneUnitsForDisplay(trimmed)

  if (units.length === 0) {
    return { roman, tonesZh: '' }
  }

  const toneLabels = units.map((u) => TONE_ZH[detectSyllableTone(u)])

  return {
    roman,
    tonesZh: [...new Set(toneLabels)].join('·'),
  }
}

/** 顯示用：sàng 或 khòp-khun · 低 */
export function formatThaiRomanDisplay(text: string, opts?: { showToneLabel?: boolean }): string {
  const { roman, tonesZh } = getThaiRomanToneInfo(text)
  if (!roman) return ''
  if (opts?.showToneLabel === false) return roman
  if (!tonesZh || tonesZh === '平') return roman
  const unique = tonesZh.split('·')
  if (unique.length === 1 && unique[0] === '平') return roman
  return `${roman} · ${tonesZh}`
}
