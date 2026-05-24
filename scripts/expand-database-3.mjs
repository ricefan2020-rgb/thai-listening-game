/**
 * Third batch: *-ext3.ts
 * Run: node scripts/expand-database-3.mjs
 */
import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = join(__dirname, '../src/data')

const NEW_LESSONS = [
  { id: 'g41', thai: 'วันนี้', meaning: '今天', category: 'greeting' },
  { id: 'g42', thai: 'พรุ่งนี้', meaning: '明天', category: 'greeting' },
  { id: 'g43', thai: 'เมื่อวาน', meaning: '昨天', category: 'greeting' },
  { id: 'g44', thai: 'ตอนนี้', meaning: '現在', category: 'greeting' },
  { id: 'g45', thai: 'ชั่วโมง', meaning: '小時', category: 'greeting' },
  { id: 'g46', thai: 'นาที', meaning: '分鐘', category: 'greeting' },
  { id: 'g47', thai: 'ครึ่ง', meaning: '一半', category: 'greeting' },
  { id: 'g48', thai: 'บ่อย', meaning: '經常', category: 'greeting' },
  { id: 'g49', thai: 'บางครั้ง', meaning: '有時候', category: 'greeting' },
  { id: 'g50', thai: 'ทุกวัน', meaning: '每天', category: 'greeting' },
  { id: 't46', thai: 'รถไฟฟ้า', meaning: '空鐵／地鐵', category: 'travel' },
  { id: 't47', thai: 'สายรถไฟ', meaning: '鐵路線', category: 'travel' },
  { id: 't48', thai: 'ตั๋วเครื่องบิน', meaning: '機票', category: 'travel' },
  { id: 't49', thai: 'เกาะ', meaning: '島嶼', category: 'travel' },
  { id: 't50', thai: 'ทะเล', meaning: '海', category: 'travel' },
  { id: 't51', thai: 'ภูเขา', meaning: '山', category: 'travel' },
  { id: 't52', thai: 'น้ำตก', meaning: '瀑布', category: 'travel' },
  { id: 't53', thai: 'ทัวร์', meaning: '旅遊團', category: 'travel' },
  { id: 't54', thai: 'ไกด์', meaning: '導遊', category: 'travel' },
  { id: 't55', thai: 'กล้องถ่ายรูป', meaning: '照相機', category: 'travel' },
  { id: 'f56', thai: 'คำศัพท์', meaning: '詞彙／單字', category: 'food' },
  { id: 'f57', thai: 'ใหม่', meaning: '新的', category: 'food' },
  { id: 'f58', thai: 'เก่า', meaning: '舊的', category: 'object' },
  { id: 'f59', thai: 'สด', meaning: '新鮮', category: 'food' },
  { id: 'f60', thai: 'เน่า', meaning: '壞掉／腐爛', category: 'food' },
  { id: 'f61', thai: 'ปรุง', meaning: '烹調', category: 'food' },
  { id: 'f62', thai: 'ทอด', meaning: '炸', category: 'food' },
  { id: 'f63', thai: 'ต้ม', meaning: '煮', category: 'food' },
  { id: 'f64', thai: 'ย่าง', meaning: '烤', category: 'food' },
  { id: 'f65', thai: 'ห่อ', meaning: '包／打包', category: 'food' },
  { id: 'c41', thai: 'สีสว่าง', meaning: '亮色', category: 'color' },
  { id: 'c42', thai: 'สีมืด', meaning: '暗色', category: 'color' },
  { id: 'c43', thai: 'สีธรรมชาติ', meaning: '自然色', category: 'color' },
  { id: 'c44', thai: 'สีพาสเทลอ่อน', meaning: '淺粉彩色', category: 'color' },
  { id: 'c45', thai: 'สีโทนกลาง', meaning: '中性色調', category: 'color' },
  { id: 'o56', thai: 'ฝึก', meaning: '練習', category: 'object' },
  { id: 'o57', thai: 'เรียน', meaning: '學習', category: 'object' },
  { id: 'o58', thai: 'สอน', meaning: '教', category: 'object' },
  { id: 'o59', thai: 'ทดสอบ', meaning: '測驗', category: 'object' },
  { id: 'o60', thai: 'สอบ', meaning: '考試', category: 'object' },
  { id: 'o61', thai: 'ผ่าน', meaning: '通過', category: 'object' },
  { id: 'o62', thai: 'สอบตก', meaning: '不及格', category: 'object' },
  { id: 'o63', thai: 'ซ้อน', meaning: '複習', category: 'object' },
  { id: 'o64', thai: 'แปล', meaning: '翻譯', category: 'object' },
  { id: 'o65', thai: 'อธิบาย', meaning: '解釋', category: 'object' },
  { id: 'h61', thai: 'หมอนรองคอ', meaning: '頸枕', category: 'furniture' },
  { id: 'h62', thai: 'ผ้าม่านทึบ', meaning: '遮光窗簾', category: 'furniture' },
  { id: 'h63', thai: 'ถังขยะรีไซเคิล', meaning: '回收桶', category: 'furniture' },
  { id: 'h64', thai: 'ที่เปิดกระป๋อง', meaning: '開罐器', category: 'furniture' },
  { id: 'h65', thai: 'ตะหลิว', meaning: '鍋鏟', category: 'furniture' },
  { id: 'h66', thai: 'เขียง', meaning: '砧板', category: 'furniture' },
  { id: 'h67', thai: 'มีดทำครัว', meaning: '廚刀', category: 'furniture' },
  { id: 'h68', thai: 'กระทะ', meaning: '平底鍋', category: 'furniture' },
  { id: 'h69', thai: 'หม้อหุงข้าว', meaning: '電鍋', category: 'furniture' },
  { id: 'h70', thai: 'กาต้มน้ำ', meaning: '熱水壺', category: 'furniture' },
  { id: 'b56', thai: 'หายใจ', meaning: '呼吸', category: 'body' },
  { id: 'b57', thai: 'ชีพจร', meaning: '脈搏', category: 'body' },
  { id: 'b58', thai: 'วัดความดัน', meaning: '量血壓', category: 'body' },
  { id: 'b59', thai: 'ฉีดยา', meaning: '打針', category: 'body' },
  { id: 'b60', thai: 'ผ่าตัด', meaning: '開刀', category: 'body' },
  { id: 'b61', thai: 'พักฟื้น', meaning: '休養恢復', category: 'body' },
  { id: 'b62', thai: 'แข็งแรง', meaning: '強壯', category: 'body' },
  { id: 'b63', thai: 'อ่อนแอ', meaning: '虛弱', category: 'body' },
  { id: 'b64', thai: 'ลดน้ำหนัก', meaning: '減重', category: 'body' },
  { id: 'b65', thai: 'เพิ่มน้ำหนัก', meaning: '增重', category: 'body' },
  { id: 'a56', thai: 'ปลาหมึกยักษ์', meaning: '大章魚', category: 'animal' },
  { id: 'a57', thai: 'ปลาไหล', meaning: '鰻魚', category: 'animal' },
  { id: 'a58', thai: 'ปูม้า', meaning: '花蟹', category: 'animal' },
  { id: 'a59', thai: 'กุ้งมังกร', meaning: '龍蝦', category: 'animal' },
  { id: 'a60', thai: 'หอยนางรม', meaning: '牡蠣', category: 'animal' },
  { id: 'a61', thai: 'นกฟีนิกซ์', meaning: '鳳凰（神話）', category: 'animal' },
  { id: 'a62', thai: 'มังกร', meaning: '龍', category: 'animal' },
  { id: 'a63', thai: 'สิงโตทะเล', meaning: '海獅', category: 'animal' },
  { id: 'a64', thai: 'วาฬ', meaning: '鯨魚', category: 'animal' },
  { id: 'a65', thai: 'ปลากัด', meaning: '鬥魚', category: 'animal' },
]

const NEW_SENTENCES = [
  { id: 'sg36', thai: 'วันนี้อากาศดีมาก', meaning: '今天天氣很好', category: 'greeting' },
  { id: 'sg37', thai: 'พรุ่งนี้เจอกันตอนเก้าโมง', meaning: '明天九點見', category: 'greeting' },
  { id: 'sg38', thai: 'เมื่อวานฝนตกหนัก', meaning: '昨天下大雨', category: 'greeting' },
  { id: 'sg39', thai: 'ตอนนี้กี่โมงแล้ว', meaning: '現在幾點了？', category: 'greeting' },
  { id: 'sg40', thai: 'ฉันฝึกภาษาไทยทุกวัน', meaning: '我每天練泰文', category: 'greeting' },
  { id: 'sg41', thai: 'ช่วยแปลประโยคนี้', meaning: '請翻譯這句話', category: 'greeting' },
  { id: 'sg42', thai: 'อธิบายให้ฟังหน่อย', meaning: '請解釋給我聽', category: 'greeting' },
  { id: 'sg43', thai: 'ฉันสอบผ่านแล้ว', meaning: '我考試通過了', category: 'greeting' },
  { id: 'sg44', thai: 'ต้องซ้อนบทเรียน', meaning: '要複習課程', category: 'greeting' },
  { id: 'sg45', thai: 'บางครั้งฉันสับสน', meaning: '有時候我會搞混', category: 'greeting' },
  { id: 'st33', thai: 'ซื้อตั๋วเครื่องบินออนไลน์', meaning: '線上買機票', category: 'travel' },
  { id: 'st34', thai: 'ไปเกาะโดยเรือ', meaning: '搭船去島上', category: 'travel' },
  { id: 'st35', thai: 'ทะเลใสมาก', meaning: '海非常清澈', category: 'travel' },
  { id: 'st36', thai: 'ขึ้นภูเขาตอนเช้า', meaning: '早上爬山', category: 'travel' },
  { id: 'st37', thai: 'ถ่ายรูปน้ำตก', meaning: '拍瀑布照片', category: 'travel' },
  { id: 'st38', thai: 'จองทัวร์หนึ่งวัน', meaning: '訂一日遊', category: 'travel' },
  { id: 'st39', thai: 'ไกด์พูดภาษาอังกฤษ', meaning: '導遊說英文', category: 'travel' },
  { id: 'st40', thai: 'นั่งรถไฟฟ้าไปสยาม', meaning: '搭空鐵去暹羅', category: 'travel' },
  { id: 'sd33', thai: 'อ่านคำศัพท์ใหม่ทุกเช้า', meaning: '每天早上讀新單字', category: 'daily' },
  { id: 'sd34', thai: 'ฝึกฟังทุกวัน', meaning: '每天練聽力', category: 'daily' },
  { id: 'sd35', thai: 'เรียนภาษาไทยมาสามเดือน', meaning: '學泰文三個月了', category: 'daily' },
  { id: 'sd36', thai: 'วันนี้เหนื่อยแต่สนุก', meaning: '今天累但開心', category: 'daily' },
  { id: 'sd37', thai: 'พักฟื้นที่บ้าน', meaning: '在家休養', category: 'daily' },
  { id: 'sd38', thai: 'วัดความดันทุกสัปดาห์', meaning: '每週量血壓', category: 'daily' },
  { id: 'sd39', thai: 'อยากแข็งแรงขึ้น', meaning: '想變更強壯', category: 'daily' },
  { id: 'sd40', thai: 'หายใจลึกๆ สบายขึ้น', meaning: '深呼吸會舒服些', category: 'daily' },
  { id: 'sf31', thai: 'อาหารสดอร่อยมาก', meaning: '新鮮的食物很好吃', category: 'food' },
  { id: 'sf32', thai: 'อย่าเอาที่เน่า', meaning: '不要拿壞掉的', category: 'food' },
  { id: 'sf33', thai: 'ทอดไก่กรอบๆ', meaning: '炸雞要酥脆', category: 'food' },
  { id: 'sf34', thai: 'ต้มซุปร้อนๆ', meaning: '煮熱湯', category: 'food' },
  { id: 'sf35', thai: 'ย่างปลาใส่น้ำพริก', meaning: '烤魚配辣醬', category: 'food' },
  { id: 'sf36', thai: 'ห่อกลับบ้านได้ไหม', meaning: '可以打包帶走嗎？', category: 'food' },
  { id: 'ss29', thai: 'สีสว่างดูสดใส', meaning: '亮色看起來有活力', category: 'shopping' },
  { id: 'ss30', thai: 'ขอสีมืดกว่านี้', meaning: '要更深色的', category: 'shopping' },
  { id: 'ss31', thai: 'ลดราคาครึ่งหนึ่ง', meaning: '打五折', category: 'shopping' },
  { id: 'ss32', thai: 'ซื้อสามชิ้นแถมหนึ่ง', meaning: '買三送一', category: 'shopping' },
  { id: 'ss33', thai: 'รับประกันหนึ่งปี', meaning: '保固一年', category: 'shopping' },
  { id: 'ss34', thai: 'เปลี่ยนสินค้าภายในเจ็ดวัน', meaning: '七天內可換貨', category: 'shopping' },
]

const NEW_ARTICLES = [
  {
    id: 'ar15',
    category: 'travel',
    titleZh: '普吉島的海灘',
    contentTh: `ครอบครัวของเราไปเที่ยวภูเก็ตช่วงปลายปี ทะเลใสและท้องฟ้าสีฟ้าสวยมาก

ตอนเช้าเรานั่งเรือไปเกาะเล็กๆ ถ่ายรูปน้ำตกและกินอาหารทะเลสด

ตอนเย็นเรากลับที่พัก ผมเหนื่อยแต่มีความสุขมาก`,
    translationZh: `我們一家年底去普吉島玩，海水清澈，天空藍得很美。

早上我們搭船去小島，拍瀑布照片並吃新鮮海鮮。

傍晚回到住宿，我很累但非常快樂。`,
    questions: [
      { id: 'ar15-q1', thai: 'ไปเที่ยวภูเก็ต', meaning: '去普吉島玩' },
      { id: 'ar15-q2', thai: 'ทะเลใส', meaning: '海水清澈' },
      { id: 'ar15-q3', thai: 'นั่งเรือไปเกาะ', meaning: '搭船去島' },
      { id: 'ar15-q4', thai: 'ถ่ายรูปน้ำตก', meaning: '拍瀑布照片' },
      { id: 'ar15-q5', thai: 'อาหารทะเลสด', meaning: '新鮮海鮮' },
      { id: 'ar15-q6', thai: 'เหนื่อยแต่มีความสุข', meaning: '累但很快樂' },
      { id: 'ar15-q7', thai: 'ท้องฟ้าสีฟ้า', meaning: '藍天' },
      { id: 'ar15-q8', thai: 'กลับที่พัก', meaning: '回住宿' },
    ],
  },
  {
    id: 'ar16',
    category: 'daily',
    titleZh: '我的泰文課',
    contentTh: `ทุกวันจันทร์และพุธฉันเรียนภาษาไทยออนไลน์ ครูสอนช้าๆ และอธิบายคำศัพท์ใหม่

หลังเรียนฉันฝึกฟังและอ่านคำศัพท์ใหม่ บางคำยากแต่ฉันซ้อนทุกวัน

สัปดาห์ที่แล้วฉันสอบผ่าน รู้สึกภูมิใจมาก`,
    translationZh: `每週一和週三我上泰文線上課，老師教得慢，並解釋新單字。

下課後我練聽力並讀新單字，有些詞很難，但我每天複習。

上週我考試通過了，覺得很驕傲。`,
    questions: [
      { id: 'ar16-q1', thai: 'เรียนภาษาไทยออนไลน์', meaning: '上泰文線上課' },
      { id: 'ar16-q2', thai: 'อธิบายคำศัพท์ใหม่', meaning: '解釋新單字' },
      { id: 'ar16-q3', thai: 'ฝึกฟัง', meaning: '練聽力' },
      { id: 'ar16-q4', thai: 'อ่านคำศัพท์ใหม่', meaning: '讀新單字' },
      { id: 'ar16-q5', thai: 'ซ้อนทุกวัน', meaning: '每天複習' },
      { id: 'ar16-q6', thai: 'สอบผ่าน', meaning: '考試通過' },
      { id: 'ar16-q7', thai: 'รู้สึกภูมิใจ', meaning: '感到驕傲' },
      { id: 'ar16-q8', thai: 'สอนช้าๆ', meaning: '教得慢' },
    ],
  },
  {
    id: 'ar17',
    category: 'food',
    titleZh: '在家下廚',
    contentTh: `วันหยุดผมชอบทำอาหารที่บ้าน วันนี้ผมต้มซุปและทอดไก่

ผมใช้เขียงและมีดทำครัวอย่างระมัดระวัง กลิ่นหอมมาก

เรากินข้าวร่วมกันและห่อที่เหลือไว้กินพรุ่งนี้`,
    translationZh: `假日我喜歡在家做菜，今天煮了湯並炸雞。

我小心使用砧板和廚刀，香味很足。

我們一起吃飯，並把剩下的打包明天吃。`,
    questions: [
      { id: 'ar17-q1', thai: 'ทำอาหารที่บ้าน', meaning: '在家做菜' },
      { id: 'ar17-q2', thai: 'ต้มซุป', meaning: '煮湯' },
      { id: 'ar17-q3', thai: 'ทอดไก่', meaning: '炸雞' },
      { id: 'ar17-q4', thai: 'เขียงและมีดทำครัว', meaning: '砧板和廚刀' },
      { id: 'ar17-q5', thai: 'กลิ่นหอม', meaning: '香味很足' },
      { id: 'ar17-q6', thai: 'ห่อที่เหลือ', meaning: '打包剩下的' },
      { id: 'ar17-q7', thai: 'กินข้าวร่วมกัน', meaning: '一起吃飯' },
      { id: 'ar17-q8', thai: 'วันหยุด', meaning: '假日' },
    ],
  },
  {
    id: 'ar18',
    category: 'culture',
    titleZh: '水上市場',
    contentTh: `ตลาดน้ำเป็นวัฒนธรรมไทยที่น่าสนใจ ผู้ขายขายผลไม้และอาหารบนเรือ

นักท่องเที่ยวนั่งเรือเล็กๆ ดูวิถีชีวิตและซื้อของฝาก

บรรยากาศคึกคักและเป็นมิตร เป็นประสบการณ์ที่น่าจดจำ`,
    translationZh: `水上市場是泰國有趣的文化，賣家在船上賣水果和食物。

遊客坐小船看當地生活並買伴手禮。

氣氛熱鬧又友善，是值得記住的體驗。`,
    questions: [
      { id: 'ar18-q1', thai: 'ตลาดน้ำ', meaning: '水上市場' },
      { id: 'ar18-q2', thai: 'ขายบนเรือ', meaning: '在船上賣' },
      { id: 'ar18-q3', thai: 'นั่งเรือเล็กๆ', meaning: '坐小船' },
      { id: 'ar18-q4', thai: 'ดูวิถีชีวิต', meaning: '看當地生活' },
      { id: 'ar18-q5', thai: 'ซื้อของฝาก', meaning: '買伴手禮' },
      { id: 'ar18-q6', thai: 'บรรยากาศคึกคัก', meaning: '氣氛熱鬧' },
      { id: 'ar18-q7', thai: 'เป็นมิตร', meaning: '友善' },
      { id: 'ar18-q8', thai: 'ประสบการณ์น่าจดจำ', meaning: '值得記住的體驗' },
    ],
  },
]

function formatLessonLine(l) {
  return `  { id: '${l.id}', thai: '${l.thai}', meaning: '${l.meaning}', category: '${l.category}' },`
}

function formatSentence(s) {
  return `  {
    id: '${s.id}',
    thai: '${s.thai}',
    meaning: '${s.meaning}',
    category: '${s.category}',
  },`
}

function formatArticle(a) {
  const q = a.questions
    .map((x) => `      { id: '${x.id}', thai: '${x.thai}', meaning: '${x.meaning}' },`)
    .join('\n')
  const content = a.contentTh.replace(/`/g, '\\`')
  const trans = a.translationZh.replace(/`/g, '\\`')
  return `  {
    id: '${a.id}',
    category: '${a.category}',
    titleZh: '${a.titleZh}',
    contentTh: \`${content}\`,
    translationZh: \`${trans}\`,
    questions: [
${q}
    ],
  },`
}

function genExamples(thai, meaning) {
  return [
    {
      exampleTh: `เช้านี้ฉันเรียน「${thai}」`,
      exampleZh: `今天早上我學了「${meaning}」。`,
    },
    {
      exampleTh: `คำว่า「${thai}」ใช้บ่อย`,
      exampleZh: `「${meaning}」這個詞很常用。`,
    },
  ]
}

const exportName = (base, n) => `${base}-ext${n}.ts`

writeFileSync(
  join(dataDir, exportName('lessons', 3)),
  `import type { LessonItem } from '../types'

/** 擴充詞庫第三輪（+${NEW_LESSONS.length} 詞） */
export const LESSONS_EXT3: LessonItem[] = [
${NEW_LESSONS.map(formatLessonLine).join('\n')}
]
`,
)

writeFileSync(
  join(dataDir, exportName('sentences', 3)),
  `import type { SentenceItem } from '../types'

/** 擴充句子第三輪（+${NEW_SENTENCES.length} 句） */
export const SENTENCES_EXT3: SentenceItem[] = [
${NEW_SENTENCES.map(formatSentence).join('\n')}
]
`,
)

writeFileSync(
  join(dataDir, exportName('articles', 3)),
  `import type { ArticleCategory, StudyItem } from '../types'

export interface ArticleExt3 {
  id: string
  category: ArticleCategory
  titleZh: string
  contentTh: string
  translationZh: string
  questions: StudyItem[]
}

/** 擴充短文第三輪（+${NEW_ARTICLES.length} 篇） */
export const ARTICLES_EXT3: ArticleExt3[] = [
${NEW_ARTICLES.map(formatArticle).join('\n')}
]
`,
)

const exampleLines = NEW_LESSONS.map((l) => {
  const ex = genExamples(l.thai, l.meaning)
  return `  '${l.id}': [
    { exampleTh: '${ex[0].exampleTh.replace(/'/g, "\\'")}', exampleZh: '${ex[0].exampleZh.replace(/'/g, "\\'")}' },
    { exampleTh: '${ex[1].exampleTh.replace(/'/g, "\\'")}', exampleZh: '${ex[1].exampleZh.replace(/'/g, "\\'")}' },
  ],`
})

writeFileSync(
  join(dataDir, exportName('word-examples', 3)),
  `import type { WordExample } from '../types'

/** 擴充例句第三輪（${NEW_LESSONS.length} 詞 × 2） */
export const WORD_EXAMPLES_EXT3: Record<string, WordExample[]> = {
${exampleLines.join('\n')}
}
`,
)

console.log(
  `Batch 3: ${NEW_LESSONS.length} lessons, ${NEW_SENTENCES.length} sentences, ${NEW_ARTICLES.length} articles`,
)
