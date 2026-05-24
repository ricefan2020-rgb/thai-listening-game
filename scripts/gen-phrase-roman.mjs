/**
 * Regenerate src/data/phrase-roman-toned.ts from article quiz phrases.
 * Run: node scripts/gen-phrase-roman.mjs
 */
import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import romanizeLib from '@dehoist/romanize-thai'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

/** 音節級羅馬字（避開錯誤的自動轉寫） */
const SYLLABLE_ROMAN = {
  อาหาร: 'ahan',
  พื้น: 'phuen',
  เมือง: 'mueang',
  ทะเล: 'thale',
  น้ำ: 'nam',
  กิน: 'kin',
  ไป: 'pai',
  มา: 'ma',
  ดี: 'di',
  มาก: 'mak',
  ครับ: 'khrap',
  ค่ะ: 'kha',
  ผม: 'phom',
  ฉัน: 'chan',
  ที่: 'thi',
  และ: 'lae',
  กับ: 'kap',
  ใน: 'nai',
  ของ: 'khong',
  มี: 'mii',
  เป็น: 'pen',
  อยู่: 'yu',
  ได้: 'dai',
  ไหม: 'mai',
  คุณ: 'khun',
  เขา: 'khao',
  เรา: 'rao',
  วัน: 'wan',
  คำ: 'kham',
  ศัพท์: 'sap',
  ใหม่: 'mai',
  เก่า: 'kao',
  สด: 'sot',
  ร้อน: 'ron',
  เย็น: 'yen',
  อากาศ: 'akat',
  ตลาด: 'talat',
  วัด: 'wat',
  กรุงเทพ: 'krungthep',
  เชียงใหม่: 'chiangmai',
  ภูเก็ต: 'phuket',
  สวัสดี: 'sawatdi',
  ขอบคุณ: 'khopkhun',
  อร่อย: 'aroi',
  ผลไม้: 'phonlamai',
  ทะเล: 'thale',
  รสชาติ: 'rotchat',
  บรรยากาศ: 'banyakat',
  สนุก: 'sanuk',
  งาน: 'ngan',
  เพื่อน: 'phuean',
  หนังสือ: 'nangsu',
  กาแฟ: 'kafae',
  ขนมปัง: 'khanomphang',
  ออกกำลังกาย: 'okamlangngai',
  สวนสาธารณะ: 'suansatharana',
  ตื่น: 'tuen',
  เช้า: 'chao',
  ถาม: 'tham',
  อาการ: 'akkan',
  ถุง: 'thung',
  พลาสติก: 'phlastik',
  ถุงพลาสติก: 'thungphlastik',
  สุขสันต์: 'sukhsan',
  วันเกิด: 'wankoet',
  โทร: 'thro',
  ดู: 'du',
  หนัง: 'nang',
  ฝึก: 'fuek',
  ภาษา: 'phasa',
  ไทย: 'thai',
  เรียน: 'rian',
  สอบ: 'sop',
  ผ่าน: 'phan',
  ซ้อน: 'son',
  แปล: 'plae',
  อธิบาย: 'athibai',
  คิด: 'khit',
  รู้: 'ru',
  เข้าใจ: 'khaochai',
  ช่วย: 'chuai',
  ลืม: 'luem',
  จำ: 'jam',
  แพ้: 'phae',
  ถั่ว: 'thua',
  ยา: 'ya',
  แพทย์: 'mo',
  พยาบาล: 'phayaban',
  โรงพยาบาล: 'rongphayaban',
  โรงแรม: 'rongraem',
  ห้องน้ำ: 'hongnam',
  สถานี: 'sathani',
  ตั๋ว: 'tua',
  จอง: 'chong',
  แผนที่: 'phaenthi',
  ซ้าย: 'sai',
  ขวา: 'khwa',
  ใกล้: 'klai',
  ไกล: 'klai',
  เท่าไหร่: 'thaorai',
  ช่วยด้วย: 'chuaiduai',
  ขอโทษ: 'khothot',
  ไม่เป็นไร: 'maipenrai',
  ลาก่อน: 'lakorn',
  สบายดี: 'sabaidi',
  ยินดี: 'yindi',
  ตกลง: 'toklong',
  วันนี้: 'wannii',
  พรุ่งนี้: 'phrungnii',
  เมื่อวาน: 'mueawan',
  ตอนนี้: 'tonnii',
  ทุกวัน: 'thukwan',
  บางครั้ง: 'bangkhrang',
  รถไฟฟ้า: 'rotfaifa',
  เกาะ: 'ko',
  ภูเขา: 'phukhao',
  น้ำตก: 'namtok',
  ทัวร์: 'thua',
  ไกด์: 'khai',
  คำศัพท์: 'khamsap',
  ของหวาน: 'khongwan',
  ข้าว: 'khâo',
  ข้าวเปล่า: 'khaopao',
  ผัดไทย: 'phatthai',
  แกง: 'kaeng',
  เขียว: 'khiao',
  หวาน: 'wan',
  เผ็ด: 'phet',
  ปลา: 'pla',
  ไก่: 'kai',
  หมู: 'mu',
  ผัก: 'phak',
  ชา: 'cha',
  เบียร์: 'bia',
  ร้าน: 'ran',
  ขาย: 'khai',
  ซื้อ: 'sue',
  ลด: 'lot',
  ราคา: 'rakha',
  ถูก: 'thuk',
  แพง: 'phaeng',
  สี: 'si',
  แดง: 'daeng',
  เขียว: 'khiao',
  ฟ้า: 'fa',
  ดำ: 'dam',
  ขาว: 'khao',
  เหลือง: 'luang',
  ส้ม: 'som',
  ชมพู: 'chomphu',
  ม่วง: 'muang',
  กรุง: 'krung',
  เทพ: 'thep',
  ครั้ง: 'khrang',
  แรก: 'raek',
  มา: 'ma',
  ถึง: 'thueng',
  เดิน: 'doen',
  ขี่: 'khi',
  จักรยาน: 'chakkrayan',
  รอบ: 'rop',
  เมืองเก่า: 'mueangkao',
  ของฝาง: 'khongfang',
  ทำด้วยมือ: 'thamduaimue',
  ตลาดถนนคนเดิน: 'talatthonnkhondoen',
  ดนตรี: 'dontri',
  อบอุ่น: 'opun',
  สนุกสนาน: 'sanuksanan',
  ทำงาน: 'thamngan',
  หก: 'hok',
  เดือน: 'duean',
  แล้ว: 'laew',
  เพื่อนร่วมงาน: 'phueanruamngan',
  ช่วยเหลือ: 'chuailuea',
  ปัญหา: 'panha',
  ทักทาย: 'thakthai',
  รอยยิ้ม: 'roiyim',
  สื่อสาร: 'suesan',
  ราบรื่น: 'rapruen',
  ศุกร์: 'suk',
  เลิกงาน: 'loekngan',
  โอกาส: 'okat',
  สร้าง: 'sang',
  ความสัมพันธ์: 'khwamsamphan',
  ไหว้: 'wai',
  ความเคารพ: 'khwamkhaorop',
  ความสุภาพ: 'khwamsuphap',
  ความขอบคุณ: 'khwamkhopkhun',
  โรงเรียน: 'rongrian',
  ท้องถิ่น: 'thongthin',
  วัฒนธรรม: 'watthanatham',
  เรียนรู้: 'rianru',
  ดินแดน: 'dindaen',
  รอยยิ้ม: 'roiyim',
  ยิ้ม: 'yim',
  ทักทาย: 'thakthai',
  ประเทศ: 'prathet',
  น่าสนใจ: 'nasanchai',
  อยาก: 'yak',
  ต่อไป: 'topai',
  สถาปัตยกรรม: 'sathapatyakam',
  สวยงาม: 'suayngam',
  นักท่องเที่ยว: 'nakthongthiao',
  ประเทศ: 'prathet',
  มาเยี่ยมชม: 'mayiamchom',
  ตอนเย็น: 'tonyen',
  ตอนกลางคืน: 'tonklangkhuen',
  กลางคืน: 'klangkhuen',
  นัด: 'nat',
  ผลไม้สด: 'phonlamaisot',
  อาหารทะเล: 'aharathale',
  มะม่วง: 'mamuang',
  เป็นพิเศษ: 'penphiset',
  ก่อนนอน: 'konnon',
  นอน: 'non',
  คิดว่า: 'khidwa',
  น่า: 'na',
  สนใจ: 'sanchai',
  หลากหลาย: 'lakhlai',
  ข้าวต้ม: 'khaotom',
  หมู: 'mu',
  ก๋วยเตี๋ยว: 'kuaytiao',
  ข้าวเหนียว: 'khaoniao',
  หมูปิ้ง: 'muping',
  ไข่ต้ม: 'khaitom',
  ผักสด: 'phaksot',
  อิ่ม: 'im',
  นาน: 'nan',
  เครื่องดื่ม: 'khrueangduem',
  ยอดนิยม: 'yotniyom',
  ชาเย็น: 'chayen',
  กาแฟโบราณ: 'kafeboran',
  หวาน: 'wan',
  เย็นชื่นใจ: 'yenchueanchai',
  โดยเฉพาะ: 'doichapho',
  วันที่: 'wanthi',
  มีชื่อเสียง: 'michuesiang',
  ดินแดนแห่งรอยยิ้ม: 'dindaenhaengroiyim',
  มัก: 'mak',
  เมื่อ: 'muea',
  เจอ: 'choe',
  ผู้ใหญ่: 'phuyai',
  ควร: 'khuan',
  แสดงถึง: 'sadaengthueng',
  โรงเรียน: 'rongrian',
  ที่ทำงาน: 'thithamngan',
  สำคัญ: 'samkhan',
  ช่วยให้: 'chuaifai',
  มากขึ้น: 'makkhuen',
  สัปดาห์: 'sapdah',
  ที่แล้ว: 'thilaew',
  เย็นกว่า: 'yenkwa',
  ชอบ: 'chop',
  ร้านกาแฟ: 'rankafae',
  ร้านของฝาง: 'rankhongfang',
  มากมาย: 'makmai',
  สวยงาม: 'suayngam',
  ไปเดิน: 'paidoen',
  มี: 'mii',
  บริษัท: 'borisat',
  ไทย: 'thai',
  หกเดือน: 'hokduean',
  ทุกเช้า: 'thukchao',
  ด้วย: 'duai',
  กัน: 'kan',
  ทำให้: 'thamhai',
  บริษัทไทย: 'borisatthai',
  เมื่อมี: 'mueamii',
  ดี: 'di',
  หลัง: 'lang',
  เป็นโอกาสดี: 'penokatdi',
  ในการ: 'naikan',
  และ: 'lae',
  สร้างความสัมพันธ์: 'sangkhwamsamphan',
  เครื่องบิน: 'khrueangbin',
  ขนาด: 'khanat',
  เล็ก: 'lek',
  วิว: 'wiw',
  ประทับใจ: 'prathapchai',
  ท่าเรือ: 'tharuea',
  นั่งเรือ: 'nangruea',
  ลมแรง: 'lomraeng',
  ทะเลสวย: 'thalesuay',
  น้ำพริก: 'namphrik',
  ไม่กิน: 'maikin',
  น้ำตก: 'namtok',
  ถ่ายรูป: 'thairup',
  ผู้คน: 'phukhkhon',
  เป็นมิตร: 'penmit',
  คนเยอะ: 'khonyoe',
  ประสบการณ์: 'prasopkan',
  จดจำ: 'chotjam',
  สวยงาม: 'suayngam',
  คึกคัก: 'khuekkhak',
  วิถีชีวิต: 'withichivit',
  ชื่นใจ: 'chueanchai',
  สัมพันธ์: 'samphan',
  ผ่อนคลาย: 'phonklai',
  สงบ: 'ngop',
  กลางคืน: 'klangkhuen',
  บนเรือ: 'bonruea',
}

/** 手動覆寫（自動切分易錯的短語） */
const PHRASE_MANUAL = {
  'อาหารพื้นเมือง': 'a-hǎn-phûen-mueang',
  'เครื่องบินขนาดเล็ก': 'khrueang-bin-khánat-lék',
  'วิวน่าประทับใจ': 'wiw-na-prathapchai',
  'นั่งเรือเล็กๆ': 'nang-ruea-lék',
  'ควรไหว้ด้วยความเคารพ': 'khuen-wâi-duai-khwam-khao-rop',
  'แสดงถึงความสุภาพ': 'sǎedong-thǔeng-khwam-sùphaph',
  'สถาปัตยกรรมสวยงามมาก': 'sà-thà-pàt-yá-kam-sǔay-ngam-mák',
  'นั่งเรือจากท่าเรือ': 'nâng-ruea-chàk-thâ-ruea',
  'เกาะเล็กๆ': 'ko-lék',
  'ตลาดน้ำ': 'tàlàt-nám',
  'ประสบการณ์น่าจดจำ': 'prà-sòp-kan-nâ-chòt-jam',
  'บรรยากาศอบอุ่น': 'banyakat-òb-un',
  'บรรยากาศคึกคัก': 'banyakat-khúek-khák',
  'รสชาติอร่อยมาก': 'rotchat-aròi-mák',
  'สถานีคนเยอะมาก': 'sathani-khonyoe-mák',
  'สถาปัตยกรรมสวยงามมาก': 'sathapattayakam-suayngam-mák',
  'ผู้คนเป็นมิตรมาก': 'phukkhon-penmit-mák',
  'ตลาดถนนคนเดิน': 'talat-thonnkhondoen',
  'ตลาดนัดกลางคืน': 'talatnat-klangkhuen',
  'หวานและเย็นชื่นใจ': 'wan-lae-yenchueanchai',
  'สร้างความสัมพันธ์': 'sang-khwamsamphan',
  'ดูวิถีชีวิต': 'du-withichivit',
  'ขายบนเรือ': 'khai-bon-ruea',
  'วิถีชีวิต': 'withichivit',
  'ประสบการณ์': 'prasopkan',
  'เป็นมิตร': 'penmit',
  'ควรไหว้ด้วยความเคารพ': 'khuen-wâi-duai-khwam-khao-rop',
}

const MID = new Set(['ก', 'จ', 'ด', 'ต', 'บ', 'ป', 'อ'])
const HIGH = new Set(['ข', 'ฃ', 'ฉ', 'ฐ', 'ถ', 'ผ', 'ฝ', 'ศ', 'ษ', 'ส', 'ห'])
const LIVE_CODA = new Set(['ง', 'ญ', 'ณ', 'น', 'ม', 'ว', 'ย', 'ร', 'ล'])
const DEAD_CODA = new Set(['ก', 'จ', 'ด', 'ต', 'บ', 'ป'])

const TONE_BY = {
  mid: { live: 'mid', dead: 'low', ek: 'low', tho: 'falling', tri: 'high', chattawa: 'rising' },
  high: { live: 'rising', dead: 'low', ek: 'low', tho: 'falling', tri: 'high', chattawa: 'rising' },
  low: { live: 'mid', dead: 'high', ek: 'falling', tho: 'high', tri: 'high', chattawa: 'rising' },
}

const ACCENT = {
  mid: { a: 'a', e: 'e', i: 'i', o: 'o', u: 'u' },
  low: { a: 'à', e: 'è', i: 'ì', o: 'ò', u: 'ù' },
  falling: { a: 'â', e: 'ê', i: 'î', o: 'ô', u: 'û' },
  high: { a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú' },
  rising: { a: 'ǎ', e: 'ě', i: 'ǐ', o: 'ǒ', u: 'ǔ' },
}

function cls(c) {
  if (MID.has(c)) return 'mid'
  if (HIGH.has(c)) return 'high'
  return 'low'
}

function leadCon(syl) {
  const ch = [...syl]
  if ('เแโใไ'.includes(ch[0])) {
    for (const c of ch.slice(1)) if (c >= '\u0E01' && c <= '\u0E2E') return c
  }
  for (const c of ch) if (c >= '\u0E01' && c <= '\u0E2E') return c
  return 'อ'
}

function toneMark(syl) {
  if (syl.includes('่')) return 'ek'
  if (syl.includes('้')) return 'tho'
  if (syl.includes('๊')) return 'tri'
  if (syl.includes('๋')) return 'chattawa'
  return null
}

function isDead(syl) {
  const last = [...syl].pop()
  if (last >= '\u0E01' && last <= '\u0E2E') {
    if (LIVE_CODA.has(last)) return false
    return true
  }
  if (syl.includes('ะ') && !syl.includes('าะ')) return true
  if (syl.endsWith('ำ') || syl.endsWith('า')) return false
  return false
}

function detectTone(syl) {
  const c = cls(leadCon(syl))
  const m = toneMark(syl)
  if (m) return TONE_BY[c][m]
  return TONE_BY[c][isDead(syl) ? 'dead' : 'live']
}

function applyTone(roman, tone) {
  if (tone === 'mid') return roman
  const lower = roman.toLowerCase()
  for (let i = 0; i < lower.length; i++) {
    if ('aeiou'.includes(lower[i])) {
      const a = ACCENT[tone][lower[i]]
      if (!a) return roman
      return roman.slice(0, i) + a + roman.slice(i + 1)
    }
  }
  return roman
}

function splitUnits(text) {
  const units = []
  let buf = ''
  const flush = () => {
    if (buf) {
      units.push(buf)
      buf = ''
    }
  }
  for (const ch of text) {
    if (ch === ' ' || ch === '\n') {
      flush()
      continue
    }
    if (!buf) {
      buf = ch
      continue
    }
    const role = ch >= '\u0E01' && ch <= '\u0E2E' ? 'c' : 'v'
    const last = buf[buf.length - 1]
    const lastRole = last >= '\u0E01' && last <= '\u0E2E' ? 'c' : 'v'
    const newSyl = role === 'c' && lastRole !== 'v' && !'เแโใไ'.includes(ch)
    if (newSyl) {
      flush()
      buf = ch
    } else buf += ch
  }
  flush()
  return units
}

const TONE_DIACRITIC_RE = /[àâèêìîòôùûáéíóúǎěǐǒǔ]/

function hasToneDiacritic(roman) {
  return TONE_DIACRITIC_RE.test(roman)
}

function romanSyl(syl) {
  if (SYLLABLE_ROMAN[syl]) return SYLLABLE_ROMAN[syl]
  const lib = romanizeLib(syl)
  return lib.length >= 2 ? lib : lib
}

function loadLessonThai() {
  const files = [
    'lessons.ts',
    'lessons-ext.ts',
    'lessons-ext2.ts',
    'lessons-ext3.ts',
    'lessons-vocab-patch.ts',
  ]
  const thai = new Set()
  for (const f of files) {
    const src = readFileSync(join(root, 'src/data', f), 'utf8')
    for (const m of src.matchAll(/thai: '([^']+)'/g)) thai.add(m[1])
  }
  return thai
}

const LESSON_THAI = loadLessonThai()

function phraseLexiconKeys() {
  return [...new Set([...Object.keys(SYLLABLE_ROMAN), ...LESSON_THAI])].sort(
    (a, b) => b.length - a.length,
  )
}

function splitYindiThidaiPhrase(text) {
  const prefix = 'ยินดีที่ได้'
  if (!text.startsWith(prefix)) return null
  const tail = text.slice(prefix.length)
  if (!tail) return ['ยินดี', 'ที่ได้']
  return ['ยินดี', 'ที่ได้', tail]
}

function splitKlongPrefix(text) {
  const prefix = 'กล้อง'
  if (!text.startsWith(prefix) || text.length <= prefix.length) return null
  return [prefix, text.slice(prefix.length)]
}

function splitMiiMaiQuestion(text) {
  const start = 'มี'
  const end = 'ไหม'
  if (!text.startsWith(start) || !text.endsWith(end) || text.length <= start.length + end.length) {
    return null
  }
  const mid = text.slice(start.length, -end.length)
  if (!mid) return [start, end]
  return [start, mid, end]
}

function tokenizePhrase(text) {
  const trimmed = text.trim()
  const yindiParts = splitYindiThidaiPhrase(trimmed)
  if (yindiParts) return yindiParts

  const klongParts = splitKlongPrefix(trimmed)
  if (klongParts) return klongParts

  const miiMaiParts = splitMiiMaiQuestion(trimmed)
  if (miiMaiParts) return miiMaiParts

  const keys = phraseLexiconKeys()
  const units = []
  let rest = trimmed
  while (rest.length > 0) {
    const hit = keys.find((k) => rest.startsWith(k))
    if (hit) {
      units.push(hit)
      rest = rest.slice(hit.length)
      continue
    }
    const karaoke = splitUnits(rest)
    if (karaoke[0]) {
      units.push(karaoke[0])
      rest = rest.slice(karaoke[0].length)
    } else break
  }
  return units.length > 0 ? units : splitUnits(text)
}

function karaokeUnits(text) {
  return splitUnits(text)
}

function toneLexeme(unit) {
  const subs = karaokeUnits(unit)
  if (subs.length <= 1) {
    const base = romanSyl(unit)
    if (hasToneDiacritic(base)) return base
    return applyTone(base, detectTone(unit))
  }
  return subs
    .map((s) => {
      const base = romanSyl(s)
      if (hasToneDiacritic(base)) return base
      return applyTone(base, detectTone(s))
    })
    .join('-')
}

// sync with thai-roman.ts for gen script article phrases
const THAI_ROMAN_OVERRIDES = {
  'ยินดีที่ได้ช่วย': 'yín-dì-thî-dâi-chuai',
  'ยินดีที่ได้รู้จัก': 'yín-dì-thî-dâi-rú-chák',
  'ยินดีที่ได้พบ': 'yín-dì-thî-dâi-phóp',
  'กล้องวงจรปิด': 'klòng-wong-chon-phít',
  'กล้องถ่ายรูป': 'klòng-thai-rup',
  'ตื่นเช้า': 'tùen-cháo',
  'ถามอาการ': 'thǎm-akan',
  'มีถุงพลาสติกไหม': 'mǐi-thǔng-phlás-tik-mǎi',
  'ถุงพลาสติก': 'thǔng-phlás-tik',
  'สุขสันต์วันเกิด': 'sùk-sǎn-wan-kòet',
  'น้ำพริกรสจัด': 'nǎm-phrík-rót-chàt',
  'ขี่จักรยานรอบเมืองเก่า': 'khì-chák-kra-yan-róp-mueang-kâo',
  'แนะนำเมนูอะไรดี': 'nǎe-nam-me-nú-a-rai-dī',
  'ขอโชคดีในการสอบ': 'khǒ-chòk-dī-nai-kan-sòp',
  'ฉันอยาก': 'chǎn-yàak',
  'ฉันอยากสั่งอาหาร': 'chǎn-yàak-sàng-a-hǎn',
  'ลดราคาได้ไหม': 'lót-rá-kha-dâi-mǎi',
  'แต่สนุก': 'tɛ̀-sà-nùk',
  'วันนี้เหนื่อยแต่สนุก': 'wan-níi-nùeay-tɛ̀-sà-nùk',
  'หนึ่ง': 'nǔeng',
  'ครึ่งหนึ่ง': 'khrûeng-nùeng',
  'ลดราคาครึ่งหนึ่ง': 'lót-rá-kha-khrûeng-nùeng',
  'เหลือ': 'hùea',
  'ช่วยเหลือ': 'chûai-lʉ̂a',
  'เพื่อนร่วมงานช่วยเหลือ': 'phûe-n-rûam-ngan-chûai-lʉ̂a',
  'ลืม': 'lʉ̂m',
  'อธิบาย': 'à-thí-baai',
  'คำศัพท์ใหม่': 'kham-sàp-mài',
  'อธิบายคำศัพท์ใหม่': 'à-thí-baai-kham-sàp-mài',
  'อ่านคำศัพท์ใหม่': 'àn-kham-sàp-mài',
  'เส้นทาง': 'sên-thang',
  'เปลี่ยนเส้นทาง': 'plìan-sên-thang',
  'รู้สึก': 'rú-sùek',
  'สงบ': 'sà-ngop',
  'ผ่อนคลาย': 'phòn-khlaai',
  'รู้สึกสงบและผ่อนคลาย': 'rú-sùek-sà-ngop-lâe-phòn-khlaai',
  'พูดคุย': 'phût-khui',
  'อย่าง': 'yàang',
  'อบอุ่น': 'òp-ùn',
  'พูดคุยอย่างอบอุ่น': 'phût-khui-yàang-òp-ùn',
  'บรรยากาศอบอุ่น': 'ban-yá-gaat-òp-ùn',
  'สีโทนกลาง': 'sǐ-thon-klang',
  'สีโทนอุ่น': 'sǐ-thon-ùn',
  'สีโทนเย็น': 'sǐ-thon-yen',
  'ข้าว': 'khâo',
  'ข้าวเหนียวกับหมูปิ้ง': 'khâo-hen-iy-w-kàp-mú-ping',
  'ไปกินข้าวด้วยกัน': 'pai-kin-khâo-duâi-kan',
  'กินข้าวต้ม': 'kin-khâo-tom',
  'กินข้าวเปล่าร่วมกัน': 'kin-khâo-plào-rûam-kan',
  'ข้าวเหนียวหมูปิ้ง': 'khâo-hen-iy-w-mú-ping',
  'กินข้าวร่วมกัน': 'kin-khâo-rûam-kan',
}

function tonePhrase(text) {
  const t = text.trim()
  if (PHRASE_MANUAL[t]) return PHRASE_MANUAL[t]
  if (THAI_ROMAN_OVERRIDES[t]) return THAI_ROMAN_OVERRIDES[t]
  const units = tokenizePhrase(t)
  if (units.length <= 1) return toneLexeme(t)
  return units.map((u) => toneLexeme(u)).join('-')
}

// Collect article phrases from source (hardcoded import path read)
import { readFileSync } from 'fs'
const articlesSrc = readFileSync(join(root, 'src/data/articles.ts'), 'utf8')
const ext1 = readFileSync(join(root, 'src/data/articles-ext.ts'), 'utf8')
const ext2 = readFileSync(join(root, 'src/data/articles-ext2.ts'), 'utf8')
const ext3 = readFileSync(join(root, 'src/data/articles-ext3.ts'), 'utf8')
const all = articlesSrc + ext1 + ext2 + ext3

const phrases = new Set()
const re = /thai: '([^']+)'/g
let m
while ((m = re.exec(all))) {
  const th = m[1]
  if (th.length >= 2 && /[\u0E00-\u0E7F]/.test(th)) phrases.add(th)
}

const map = { ...PHRASE_MANUAL }
for (const p of [...phrases].sort((a, b) => b.length - a.length)) {
  map[p] = tonePhrase(p)
}

const lines = Object.entries(map)
  .map(([k, v]) => `  '${k.replace(/'/g, "\\'")}': '${v}',`)
  .join('\n')

writeFileSync(
  join(root, 'src/data/phrase-roman-toned.ts'),
  `/** 短文／短語帶調拼音（自動生成，node scripts/gen-phrase-roman.mjs） */
export const PHRASE_TONE_ROMAN: Record<string, string> = {
${lines}
}
`,
)

console.log(`Generated ${Object.keys(map).length} phrase roman entries`)
