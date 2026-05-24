/**
 * Second batch: lessons-ext2, sentences-ext2, articles-ext2, word-examples-ext2
 * Run: node scripts/expand-database-2.mjs
 */
import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = join(__dirname, '../src/data')

const NEW_LESSONS = [
  // greeting
  { id: 'g31', thai: 'ฉัน', meaning: '我（女性／通用）', category: 'greeting' },
  { id: 'g32', thai: 'เขา', meaning: '他／她', category: 'greeting' },
  { id: 'g33', thai: 'เรา', meaning: '我們', category: 'greeting' },
  { id: 'g34', thai: 'พวกเขา', meaning: '他們', category: 'greeting' },
  { id: 'g35', thai: 'ใคร', meaning: '誰', category: 'greeting' },
  { id: 'g36', thai: 'อะไร', meaning: '什麼', category: 'greeting' },
  { id: 'g37', thai: 'ทำไม', meaning: '為什麼', category: 'greeting' },
  { id: 'g38', thai: 'เมื่อไหร่', meaning: '什麼時候', category: 'greeting' },
  { id: 'g39', thai: 'ยังไง', meaning: '怎麼樣', category: 'greeting' },
  { id: 'g40', thai: 'ที่ไหน', meaning: '哪裡', category: 'greeting' },
  // travel
  { id: 't36', thai: 'รถยนต์', meaning: '汽車', category: 'travel' },
  { id: 't37', thai: 'มอเตอร์ไซค์', meaning: '機車', category: 'travel' },
  { id: 't38', thai: 'เรือ', meaning: '船', category: 'travel' },
  { id: 't39', thai: 'เครื่องบิน', meaning: '飛機', category: 'travel' },
  { id: 't40', thai: 'ท่าเรือ', meaning: '碼頭', category: 'travel' },
  { id: 't41', thai: 'ตู้เก็บของ', meaning: '置物櫃', category: 'travel' },
  { id: 't42', thai: 'วีซ่า', meaning: '簽證', category: 'travel' },
  { id: 't43', thai: 'ศุลกากร', meaning: '海關', category: 'travel' },
  { id: 't44', thai: 'กระเป๋าใบเล็ก', meaning: '小包', category: 'travel' },
  { id: 't45', thai: 'แผนที่เมือง', meaning: '城市地圖', category: 'travel' },
  // food
  { id: 'f46', thai: 'ถั่ว', meaning: '豆／堅果', category: 'food' },
  { id: 'f47', thai: 'ข้าวเหนียว', meaning: '糯米飯', category: 'food' },
  { id: 'f48', thai: 'หมูปิ้ง', meaning: '烤豬', category: 'food' },
  { id: 'f49', thai: 'ไข่ต้ม', meaning: '水煮蛋', category: 'food' },
  { id: 'f50', thai: 'ผัดไทย', meaning: '泰式炒河粉', category: 'food' },
  { id: 'f51', thai: 'แกงเขียวหวาน', meaning: '綠咖哩', category: 'food' },
  { id: 'f52', thai: 'น้ำพริก', meaning: '辣醬', category: 'food' },
  { id: 'f53', thai: 'ข้าวเปล่า', meaning: '白飯', category: 'food' },
  { id: 'f54', thai: 'อาหารทะเล', meaning: '海鮮', category: 'food' },
  { id: 'f55', thai: 'เครื่องดื่ม', meaning: '飲料', category: 'food' },
  // color
  { id: 'c31', thai: 'สีโทนอุ่น', meaning: '暖色調', category: 'color' },
  { id: 'c32', thai: 'สีโทนเย็น', meaning: '冷色調', category: 'color' },
  { id: 'c33', thai: 'สีโปร่งใส', meaning: '透明色', category: 'color' },
  { id: 'c34', thai: 'สีเมทัลลิก', meaning: '金屬色', category: 'color' },
  { id: 'c35', thai: 'สีเนื้อ', meaning: '膚色', category: 'color' },
  // object
  { id: 'o46', thai: 'ลืม', meaning: '忘記', category: 'object' },
  { id: 'o47', thai: 'จำ', meaning: '記得', category: 'object' },
  { id: 'o48', thai: 'พูด', meaning: '說', category: 'object' },
  { id: 'o49', thai: 'ฟัง', meaning: '聽', category: 'object' },
  { id: 'o50', thai: 'อ่าน', meaning: '讀', category: 'object' },
  { id: 'o51', thai: 'เขียน', meaning: '寫', category: 'object' },
  { id: 'o52', thai: 'คิด', meaning: '想', category: 'object' },
  { id: 'o53', thai: 'รู้', meaning: '知道', category: 'object' },
  { id: 'o54', thai: 'เข้าใจ', meaning: '理解', category: 'object' },
  { id: 'o55', thai: 'ช่วย', meaning: '幫助', category: 'object' },
  // furniture
  { id: 'h41', thai: 'กุญแจบ้าน', meaning: '家門鑰匙', category: 'furniture' },
  { id: 'h42', thai: 'กล้องวงจรปิด', meaning: '監視器', category: 'furniture' },
  { id: 'h43', thai: 'เครื่องดูดฝุ่น', meaning: '吸塵器', category: 'furniture' },
  { id: 'h44', thai: 'เตารีด', meaning: '熨斗', category: 'furniture' },
  { id: 'h45', thai: 'ราวตากผ้า', meaning: '曬衣桿', category: 'furniture' },
  { id: 'h46', thai: 'ถังซักผ้า', meaning: '洗衣盆', category: 'furniture' },
  { id: 'h47', thai: 'ที่รองนั่ง', meaning: '坐墊', category: 'furniture' },
  { id: 'h48', thai: 'หมอนรองนั่ง', meaning: '靠墊', category: 'furniture' },
  { id: 'h49', thai: 'โคมไฟตั้งพื้น', meaning: '落地燈', category: 'furniture' },
  { id: 'h50', thai: 'กระจกเงา', meaning: '穿衣鏡', category: 'furniture' },
  // body
  { id: 'b46', thai: 'ล้างมือ', meaning: '洗手', category: 'body' },
  { id: 'b47', thai: 'แปรงฟัน', meaning: '刷牙', category: 'body' },
  { id: 'b48', thai: 'อาบน้ำ', meaning: '洗澡', category: 'body' },
  { id: 'b49', thai: 'นอนหลับ', meaning: '睡覺', category: 'body' },
  { id: 'b50', thai: 'เหนื่อย', meaning: '累', category: 'body' },
  { id: 'b51', thai: 'ง่วง', meaning: '想睡', category: 'body' },
  { id: 'b52', thai: 'หิวน้ำ', meaning: '口渴', category: 'body' },
  { id: 'b53', thai: 'เวียนหัว', meaning: '頭暈', category: 'body' },
  { id: 'b54', thai: 'คันตา', meaning: '眼睛癢', category: 'body' },
  { id: 'b55', thai: 'เจ็บคอ', meaning: '喉嚨痛', category: 'body' },
  // animal
  { id: 'a46', thai: 'แมลง', meaning: '昆蟲', category: 'animal' },
  { id: 'a47', thai: 'จิ้งหรีด', meaning: '蟋蟀', category: 'animal' },
  { id: 'a48', thai: 'หอยทาก', meaning: '蝸牛', category: 'animal' },
  { id: 'a49', thai: 'ปลาดุก', meaning: '鯰魚', category: 'animal' },
  { id: 'a50', thai: 'นกยูง', meaning: '孔雀', category: 'animal' },
  { id: 'a51', thai: 'แพนด้า', meaning: '熊貓', category: 'animal' },
  { id: 'a52', thai: 'จิงโจ้', meaning: '袋鼠', category: 'animal' },
  { id: 'a53', thai: 'แรด', meaning: '犀牛', category: 'animal' },
  { id: 'a54', thai: 'ลิงลิงตัง', meaning: '長臂猿', category: 'animal' },
  { id: 'a55', thai: 'ปลาดาว', meaning: '海星', category: 'animal' },
]

const NEW_SENTENCES = [
  { id: 'sg27', thai: 'เขาเป็นคนไทย', meaning: '他是泰國人', category: 'greeting' },
  { id: 'sg28', thai: 'เราไปเที่ยวด้วยกัน', meaning: '我們一起去玩', category: 'greeting' },
  { id: 'sg29', thai: 'คุณมาจากที่ไหน', meaning: '你來自哪裡？', category: 'greeting' },
  { id: 'sg30', thai: 'ผมไม่เข้าใจ', meaning: '我不明白', category: 'greeting' },
  { id: 'sg31', thai: 'ช่วยพูดช้าๆ หน่อย', meaning: '請說慢一點', category: 'greeting' },
  { id: 'sg32', thai: 'ขอถามอีกครั้งได้ไหม', meaning: '可以再問一次嗎？', category: 'greeting' },
  { id: 'sg33', thai: 'ฉันจำไม่ได้', meaning: '我記不起來', category: 'greeting' },
  { id: 'sg34', thai: 'ไม่เป็นไร ค่อยๆ เรียน', meaning: '沒關係，慢慢學', category: 'greeting' },
  { id: 'sg35', thai: 'ยินดีที่ได้คุยด้วย', meaning: '很高興和你聊天', category: 'greeting' },
  { id: 'st25', thai: 'ขับรถยนต์ไปสนามบิน', meaning: '開車去機場', category: 'travel' },
  { id: 'st26', thai: 'ต้องทำวีซ่าก่อน', meaning: '要先辦簽證', category: 'travel' },
  { id: 'st27', thai: 'ผ่านศุลกากรแล้ว', meaning: '已過海關', category: 'travel' },
  { id: 'st28', thai: 'เก็บของในกระเป๋าใบเล็ก', meaning: '把小東西放進小包', category: 'travel' },
  { id: 'st29', thai: 'ดูแผนที่เมืองก่อน', meaning: '先看城市地圖', category: 'travel' },
  { id: 'st30', thai: 'ขี่มอเตอร์ไซค์ระวังด้วย', meaning: '騎機車要小心', category: 'travel' },
  { id: 'st31', thai: 'เรือออกกี่โมง', meaning: '船幾點出發？', category: 'travel' },
  { id: 'st32', thai: 'เครื่องบินดีเลย', meaning: '飛機誤點了', category: 'travel' },
  { id: 'sd25', thai: 'ฉันลืมแล้ว', meaning: '我忘了', category: 'daily' },
  { id: 'sd26', thai: 'จำไว้ในใจนะ', meaning: '記在心裡喔', category: 'daily' },
  { id: 'sd27', thai: 'วันนี้เหนื่อยมาก', meaning: '今天很累', category: 'daily' },
  { id: 'sd28', thai: 'อยากนอนหลับแล้ว', meaning: '想睡了', category: 'daily' },
  { id: 'sd29', thai: 'ล้างมือก่อนกินข้าว', meaning: '吃飯前先洗手', category: 'daily' },
  { id: 'sd30', thai: 'แปรงฟันทุกวัน', meaning: '每天刷牙', category: 'daily' },
  { id: 'sd31', thai: 'อ่านหนังสือก่อนนอน', meaning: '睡前看書', category: 'daily' },
  { id: 'sd32', thai: 'ฟังเพลงขณะทำงาน', meaning: '工作時聽音樂', category: 'daily' },
  { id: 'sf25', thai: 'ขอข้าวเปล่าหนึ่งที่', meaning: '請給一份白飯', category: 'food' },
  { id: 'sf26', thai: 'ผัดไทยไม่เผ็ด', meaning: '泰式炒河粉不要辣', category: 'food' },
  { id: 'sf27', thai: 'แกงเขียวหวานอร่อยมาก', meaning: '綠咖哩很好吃', category: 'food' },
  { id: 'sf28', thai: 'ไม่กินอาหารทะเล', meaning: '不吃海鮮', category: 'food' },
  { id: 'sf29', thai: 'ขอเครื่องดื่มเย็นๆ', meaning: '要冰的飲料', category: 'food' },
  { id: 'sf30', thai: 'ถั่วนี้แพ้ไหม', meaning: '這種豆會過敏嗎？', category: 'food' },
  { id: 'ss23', thai: 'สีโทนอุ่นสวยดี', meaning: '暖色調很好看', category: 'shopping' },
  { id: 'ss24', thai: 'ขอสีโทนเย็น', meaning: '要冷色調的', category: 'shopping' },
  { id: 'ss25', thai: 'ราคานี้ลดได้ไหม', meaning: '這個價可以打折嗎？', category: 'shopping' },
  { id: 'ss26', thai: 'ซื้อสองชิ้นลดไหม', meaning: '買兩件有折扣嗎？', category: 'shopping' },
  { id: 'ss27', thai: 'ขอใบกำกับภาษี', meaning: '請開發票', category: 'shopping' },
  { id: 'ss28', thai: 'ห้ามคืนสินค้า', meaning: '不可退貨', category: 'shopping' },
]

const NEW_ARTICLES = [
  {
    id: 'ar11',
    category: 'daily',
    titleZh: '學泰文的一天',
    contentTh: `ตอนเช้าฉันฟังเพลงไทยและอ่านคำศัพท์ใหม่ บางคำจำไม่ได้ก็ขอความช่วยเหลือจากเพื่อน

ตอนกลางวันฉันพูดกับเพื่อนไทยช้าๆ เขาเข้าใจและยิ้มให้ ฉันรู้สึกมีกำลังใจ

ตอนเย็นฉันดูหนังไทยโดยไม่เปิดซับไตเติ้ล ยังไม่เข้าใจทุกประโยคแต่สนุกมาก`,
    translationZh: `早上我聽泰文歌並讀新單字，有些記不住就向朋友求助。

中午我和泰國朋友慢慢說話，他聽懂了並對我微笑，我覺得很有動力。

晚上我看泰文電影不開字幕，還不是每句都懂，但很有趣。`,
    questions: [
      { id: 'ar11-q1', thai: 'ฟังเพลงไทย', meaning: '聽泰文歌' },
      { id: 'ar11-q2', thai: 'อ่านคำศัพท์ใหม่', meaning: '讀新單字' },
      { id: 'ar11-q3', thai: 'จำไม่ได้', meaning: '記不住' },
      { id: 'ar11-q4', thai: 'พูดช้าๆ', meaning: '慢慢說' },
      { id: 'ar11-q5', thai: 'มีกำลังใจ', meaning: '有動力' },
      { id: 'ar11-q6', thai: 'ไม่เปิดซับไตเติ้ล', meaning: '不開字幕' },
      { id: 'ar11-q7', thai: 'ยังไม่เข้าใจ', meaning: '還不懂' },
      { id: 'ar11-q8', thai: 'สนุกมาก', meaning: '很有趣' },
    ],
  },
  {
    id: 'ar12',
    category: 'food',
    titleZh: '在夜市吃小吃',
    contentTh: `คืนนี้เราไปตลาดนัดกลางคืน มีผัดไทย ข้าวเหนียวหมูปิ้ง และของหวานมากมาย

ฉันสั่งผัดไทยไม่เผ็ดและน้ำเปล่า เพื่อนสั่งแกงเขียวหวาน

เรานั่งกินข้าวเปล่าร่วมกัน อาหารอร่อยและราคาไม่แพง`,
    translationZh: `今晚我們去夜市，有泰式炒河粉、糯米飯烤豬和各種甜點。

我點了不辣的炒河粉和白開水，朋友點綠咖哩。

我們坐著一起吃白飯，食物好吃又不貴。`,
    questions: [
      { id: 'ar12-q1', thai: 'ตลาดนัดกลางคืน', meaning: '夜市' },
      { id: 'ar12-q2', thai: 'ข้าวเหนียวหมูปิ้ง', meaning: '糯米飯烤豬' },
      { id: 'ar12-q3', thai: 'ผัดไทยไม่เผ็ด', meaning: '不辣的炒河粉' },
      { id: 'ar12-q4', thai: 'แกงเขียวหวาน', meaning: '綠咖哩' },
      { id: 'ar12-q5', thai: 'กินข้าวเปล่าร่วมกัน', meaning: '一起吃白飯' },
      { id: 'ar12-q6', thai: 'ราคาไม่แพง', meaning: '價格不貴' },
      { id: 'ar12-q7', thai: 'ของหวานมากมาย', meaning: '很多甜點' },
      { id: 'ar12-q8', thai: 'น้ำเปล่า', meaning: '白開水' },
    ],
  },
  {
    id: 'ar13',
    category: 'travel',
    titleZh: '搭船去島嶼',
    contentTh: `เช้านี้เรานั่งเรือจากท่าเรือไปเกาะเล็กๆ ลมแรงแต่ทะเลสวยมาก

บนเกาะมีอาหารทะเลสดและน้ำพริกรสจัด ฉันไม่กินเพราะแพ้

ตอนเย็นเรากลับโดยเครื่องบินขนาดเล็ก วิวจากบนน่าประทับใจ`,
    translationZh: `早上我們從碼頭搭船去小島，風很大但海很美。

島上有新鮮海鮮和辣醬，我因為過敏沒吃。

傍晚我們搭小飛機回去，從空中看的景色令人印象深刻。`,
    questions: [
      { id: 'ar13-q1', thai: 'นั่งเรือจากท่าเรือ', meaning: '從碼頭搭船' },
      { id: 'ar13-q2', thai: 'อาหารทะเลสด', meaning: '新鮮海鮮' },
      { id: 'ar13-q3', thai: 'ไม่กินเพราะแพ้', meaning: '因過敏不吃' },
      { id: 'ar13-q4', thai: 'เครื่องบินขนาดเล็ก', meaning: '小飛機' },
      { id: 'ar13-q5', thai: 'วิวน่าประทับใจ', meaning: '景色令人印象深刻' },
      { id: 'ar13-q6', thai: 'ทะเลสวยมาก', meaning: '海很美' },
      { id: 'ar13-q7', thai: 'น้ำพริกรสจัด', meaning: '辣醬味重' },
      { id: 'ar13-q8', thai: 'เกาะเล็กๆ', meaning: '小島' },
    ],
  },
  {
    id: 'ar14',
    category: 'culture',
    titleZh: '泰國的節日',
    contentTh: `ประเทศไทยมีเทศกาลมากมาย เช่น สงกรานต์ที่คนราดน้ำกันและสนุกสนาน

ในวันเทศกาลครอบครัวมักรวมตัวกัน กินอาหารร่วมกันและพูดคุยกันอย่างอบอุ่น

ชาวต่างชาติที่มาเรียนรู้วัฒนธรรมจะรู้สึกต้อนรับและเข้าใจผู้คนมากขึ้น`,
    translationZh: `泰國有很多節日，例如潑水節時人們互相潑水，非常熱鬧。

節日時家人常聚在一起，一起吃飯、溫暖地聊天。

來學習文化的外國人會感到受歡迎，也更理解當地人。`,
    questions: [
      { id: 'ar14-q1', thai: 'เทศกาลมากมาย', meaning: '很多節日' },
      { id: 'ar14-q2', thai: 'สงกรานต์', meaning: '潑水節' },
      { id: 'ar14-q3', thai: 'ราดน้ำกัน', meaning: '互相潑水' },
      { id: 'ar14-q4', thai: 'ครอบครัวรวมตัวกัน', meaning: '家人聚在一起' },
      { id: 'ar14-q5', thai: 'พูดคุยอย่างอบอุ่น', meaning: '溫暖地聊天' },
      { id: 'ar14-q6', thai: 'เรียนรู้วัฒนธรรม', meaning: '學習文化' },
      { id: 'ar14-q7', thai: 'รู้สึกต้อนรับ', meaning: '感到受歡迎' },
      { id: 'ar14-q8', thai: 'สนุกสนาน', meaning: '熱鬧歡樂' },
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
      exampleTh: `วันนี้ฉันใช้คำว่า「${thai}」`,
      exampleZh: `今天我用了「${meaning}」這個詞。`,
    },
    {
      exampleTh: `「${thai}」 เป็นคำที่สำคัญ`,
      exampleZh: `「${meaning}」是很重要的詞。`,
    },
  ]
}

writeFileSync(
  join(dataDir, 'lessons-ext2.ts'),
  `import type { LessonItem } from '../types'

/** 擴充詞庫第二輪（+${NEW_LESSONS.length} 詞） */
export const LESSONS_EXT2: LessonItem[] = [
${NEW_LESSONS.map(formatLessonLine).join('\n')}
]
`,
)

writeFileSync(
  join(dataDir, 'sentences-ext2.ts'),
  `import type { SentenceItem } from '../types'

/** 擴充句子第二輪（+${NEW_SENTENCES.length} 句） */
export const SENTENCES_EXT2: SentenceItem[] = [
${NEW_SENTENCES.map(formatSentence).join('\n')}
]
`,
)

writeFileSync(
  join(dataDir, 'articles-ext2.ts'),
  `import type { ArticleCategory, StudyItem } from '../types'

export interface ArticleExt2 {
  id: string
  category: ArticleCategory
  titleZh: string
  contentTh: string
  translationZh: string
  questions: StudyItem[]
}

/** 擴充短文第二輪（+${NEW_ARTICLES.length} 篇） */
export const ARTICLES_EXT2: ArticleExt2[] = [
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
  join(dataDir, 'word-examples-ext2.ts'),
  `import type { WordExample } from '../types'

/** 擴充例句第二輪（${NEW_LESSONS.length} 詞 × 2） */
export const WORD_EXAMPLES_EXT2: Record<string, WordExample[]> = {
${exampleLines.join('\n')}
}
`,
)

console.log(
  `Batch 2: ${NEW_LESSONS.length} lessons, ${NEW_SENTENCES.length} sentences, ${NEW_ARTICLES.length} articles`,
)
