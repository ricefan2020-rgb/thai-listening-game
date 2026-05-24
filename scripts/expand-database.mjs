/**
 * Generates expansion data: lessons-ext, sentences-ext, articles-ext, word-examples-ext
 * Run: node scripts/expand-database.mjs
 */
import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = join(__dirname, '../src/data')

const NEW_LESSONS = [
  // greeting g21–g30
  { id: 'g21', thai: 'ยินดีด้วย', meaning: '恭喜', category: 'greeting' },
  { id: 'g22', thai: 'โชคดี', meaning: '好運', category: 'greeting' },
  { id: 'g23', thai: 'ขอให้หายเร็วๆ', meaning: '祝早日康復', category: 'greeting' },
  { id: 'g24', thai: 'สุขสันต์วันเกิด', meaning: '生日快樂', category: 'greeting' },
  { id: 'g25', thai: 'ยินดี', meaning: '高興／樂意', category: 'greeting' },
  { id: 'g26', thai: 'รอสักครู่', meaning: '請稍等', category: 'greeting' },
  { id: 'g27', thai: 'ตกลง', meaning: '好的／成交', category: 'greeting' },
  { id: 'g28', thai: 'ไม่เป็นไรนะ', meaning: '真的沒關係', category: 'greeting' },
  { id: 'g29', thai: 'ขอโชคดี', meaning: '祝你幸運', category: 'greeting' },
  { id: 'g30', thai: 'ยินดีที่ได้ช่วย', meaning: '很高興能幫忙', category: 'greeting' },
  // travel t26–t35
  { id: 't26', thai: 'สถานี', meaning: '車站', category: 'travel' },
  { id: 't27', thai: 'ป้าย', meaning: '標示／站牌', category: 'travel' },
  { id: 't28', thai: 'จอง', meaning: '預訂', category: 'travel' },
  { id: 't29', thai: 'หยุด', meaning: '停止', category: 'travel' },
  { id: 't30', thai: 'เปลี่ยน', meaning: '更換', category: 'travel' },
  { id: 't31', thai: 'ทางตรง', meaning: '直走', category: 'travel' },
  { id: 't32', thai: 'ถนน', meaning: '街道', category: 'travel' },
  { id: 't33', thai: 'รัฐสถานทูต', meaning: '大使館', category: 'travel' },
  { id: 't34', thai: 'ฉุกเฉิน', meaning: '緊急', category: 'travel' },
  { id: 't35', thai: 'ประกันภัย', meaning: '保險', category: 'travel' },
  // food f36–f45
  { id: 'f36', thai: 'สั่ง', meaning: '點餐', category: 'food' },
  { id: 'f37', thai: 'เช็คบิล', meaning: '買單', category: 'food' },
  { id: 'f38', thai: 'ทิป', meaning: '小費', category: 'food' },
  { id: 'f39', thai: 'เสิร์ฟ', meaning: '上菜', category: 'food' },
  { id: 'f40', thai: 'ปรุงรส', meaning: '調味', category: 'food' },
  { id: 'f41', thai: 'บุฟเฟ่ต์', meaning: '自助餐', category: 'food' },
  { id: 'f42', thai: 'อาหารจานหลัก', meaning: '主菜', category: 'food' },
  { id: 'f43', thai: 'ของหวาน', meaning: '甜點', category: 'food' },
  { id: 'f44', thai: 'น้ำเปล่า', meaning: '白開水', category: 'food' },
  { id: 'f45', thai: 'ร้อนๆ', meaning: '熱的（食物）', category: 'food' },
  // color c26–c30
  { id: 'c26', thai: 'สีกรม', meaning: '海軍藍', category: 'color' },
  { id: 'c27', thai: 'สีสันสดใส', meaning: '鮮豔多彩', category: 'color' },
  { id: 'c28', thai: 'สีพาสเทล', meaning: '粉彩色', category: 'color' },
  { id: 'c29', thai: 'สีหลัก', meaning: '主色', category: 'color' },
  { id: 'c30', thai: 'สีรอง', meaning: '副色', category: 'color' },
  // object o36–o45
  { id: 'o36', thai: 'แท็บเล็ต', meaning: '平板', category: 'object' },
  { id: 'o37', thai: 'รีโมท', meaning: '遙控器', category: 'object' },
  { id: 'o38', thai: 'สายชาร์จ', meaning: '充電線', category: 'object' },
  { id: 'o39', thai: 'หูฟังไร้สาย', meaning: '無線耳機', category: 'object' },
  { id: 'o40', thai: 'ตู้เซฟ', meaning: '保險箱', category: 'object' },
  { id: 'o41', thai: 'บัตรเครดิต', meaning: '信用卡', category: 'object' },
  { id: 'o42', thai: 'ถุงพลาสติก', meaning: '塑膠袋', category: 'object' },
  { id: 'o43', thai: 'กุญแจรถ', meaning: '車鑰匙', category: 'object' },
  { id: 'o44', thai: 'ถุงมือ', meaning: '手套', category: 'object' },
  { id: 'o45', thai: 'เครื่องพิมพ์', meaning: '印表機', category: 'object' },
  // furniture h31–h40
  { id: 'h31', thai: 'โต๊ะทำงาน', meaning: '書桌', category: 'furniture' },
  { id: 'h32', thai: 'เก้าอี้สำนักงาน', meaning: '辦公椅', category: 'furniture' },
  { id: 'h33', thai: 'ผ้าปูที่นอน', meaning: '床單', category: 'furniture' },
  { id: 'h34', thai: 'ผ้าเช็ดตัว', meaning: '毛巾', category: 'furniture' },
  { id: 'h35', thai: 'ฝักบัว', meaning: '蓮蓬頭', category: 'furniture' },
  { id: 'h36', thai: 'ที่วางของ', meaning: '置物架', category: 'furniture' },
  { id: 'h37', thai: 'หลอดไฟ', meaning: '燈泡', category: 'furniture' },
  { id: 'h38', thai: 'โซฟาเบด', meaning: '沙發床', category: 'furniture' },
  { id: 'h39', thai: 'ที่นอน', meaning: '床墊', category: 'furniture' },
  { id: 'h40', thai: 'ถังน้ำ', meaning: '水桶', category: 'furniture' },
  // body b36–b45
  { id: 'b36', thai: 'เจ็บ', meaning: '痛', category: 'body' },
  { id: 'b37', thai: 'ไข้', meaning: '發燒', category: 'body' },
  { id: 'b38', thai: 'ยา', meaning: '藥', category: 'body' },
  { id: 'b39', thai: 'แพ้', meaning: '過敏', category: 'body' },
  { id: 'b40', thai: 'หวัด', meaning: '感冒', category: 'body' },
  { id: 'b41', thai: 'อาการ', meaning: '症狀', category: 'body' },
  { id: 'b42', thai: 'พยาบาล', meaning: '護士', category: 'body' },
  { id: 'b43', thai: 'แพทย์', meaning: '醫生', category: 'body' },
  { id: 'b44', thai: 'ใบสั่งยา', meaning: '處方', category: 'body' },
  { id: 'b45', thai: 'ปวดหัว', meaning: '頭痛', category: 'body' },
  // animal a36–a45
  { id: 'a36', thai: 'ปลาทอง', meaning: '金魚', category: 'animal' },
  { id: 'a37', thai: 'นกแก้ว', meaning: '鸚鵡', category: 'animal' },
  { id: 'a38', thai: 'กวาง', meaning: '鹿', category: 'animal' },
  { id: 'a39', thai: 'ลูกม้า', meaning: '小馬', category: 'animal' },
  { id: 'a40', thai: 'แมวน้ำ', meaning: '海豹', category: 'animal' },
  { id: 'a41', thai: 'ค้างคาว', meaning: '蝙蝠', category: 'animal' },
  { id: 'a42', thai: 'ไก่ป่า', meaning: '野雞', category: 'animal' },
  { id: 'a43', thai: 'ปลาหมึก', meaning: '章魚', category: 'animal' },
  { id: 'a44', thai: 'ปลาการ์ตูน', meaning: '小丑魚', category: 'animal' },
  { id: 'a45', thai: 'ช้างเผือก', meaning: '白象', category: 'animal' },
]

const NEW_SENTENCES = [
  { id: 'sg16', thai: 'ยินดีด้วยครับ', meaning: '恭喜（男性禮貌）', category: 'greeting' },
  { id: 'sg17', thai: 'สุขสันต์วันเกิดค่ะ', meaning: '生日快樂', category: 'greeting' },
  { id: 'sg18', thai: 'ขอให้หายเร็วๆ นะครับ', meaning: '祝你早日康復', category: 'greeting' },
  { id: 'sg19', thai: 'รอสักครู่นะครับ', meaning: '請稍等一下', category: 'greeting' },
  { id: 'sg20', thai: 'ตกลงครับ ไม่มีปัญหา', meaning: '好的，沒問題', category: 'greeting' },
  { id: 'sg21', thai: 'ยินดีที่ได้ช่วยคุณ', meaning: '很高興能幫你', category: 'greeting' },
  { id: 'sg22', thai: 'ขอโชคดีในการสอบ', meaning: '祝你考試順利', category: 'greeting' },
  { id: 'sg23', thai: 'ไม่เป็นไรนะ ไม่ต้องกังวล', meaning: '沒關係，別擔心', category: 'greeting' },
  { id: 'sg24', thai: 'ยินดีต้อนรับสู่บ้านเรา', meaning: '歡迎來我們家', category: 'greeting' },
  { id: 'sg25', thai: 'ขอให้มีความสุขมากๆ', meaning: '祝你幸福快樂', category: 'greeting' },
  { id: 'st17', thai: 'จองห้องพักแล้วครับ', meaning: '已經訂好房了', category: 'travel' },
  { id: 'st18', thai: 'เดินทางตรงไปสถานี', meaning: '直走到車站', category: 'travel' },
  { id: 'st19', thai: 'รถเมล์หยุดที่ไหน', meaning: '公車在哪一站停？', category: 'travel' },
  { id: 'st20', thai: 'มีประกันภัยไหม', meaning: '有保險嗎？', category: 'travel' },
  { id: 'st21', thai: 'กรณีฉุกเฉินโทรเบอร์นี้', meaning: '緊急情況打這個電話', category: 'travel' },
  { id: 'st22', thai: 'รัฐสถานทูตอยู่ใกล้ไหม', meaning: '大使館在附近嗎？', category: 'travel' },
  { id: 'st23', thai: 'เปลี่ยนตั๋วได้ไหม', meaning: '可以換票嗎？', category: 'travel' },
  { id: 'st24', thai: 'ถนนนี้ไปสนามบินไหม', meaning: '這條路去機場嗎？', category: 'travel' },
  { id: 'sd17', thai: 'วันนี้ผมปวดหัว', meaning: '今天我頭痛', category: 'daily' },
  { id: 'sd18', thai: 'ต้องกินยาก่อนอาหาร', meaning: '要飯前吃藥', category: 'daily' },
  { id: 'sd19', thai: 'แพ้อาหารทะเล', meaning: '對海鮮過敏', category: 'daily' },
  { id: 'sd20', thai: 'มีอาการไข้และไอ', meaning: '有發燒和咳嗽', category: 'daily' },
  { id: 'sd21', thai: 'พยาบาลบอกให้พักผ่อน', meaning: '護士說要休息', category: 'daily' },
  { id: 'sd22', thai: 'แพทย์ให้ใบสั่งยา', meaning: '醫生開了處方', category: 'daily' },
  { id: 'sd23', thai: 'ทำงานที่โต๊ะทำงานใหม่', meaning: '在新書桌工作', category: 'daily' },
  { id: 'sd24', thai: 'ซักผ้าด้วยเครื่องซักผ้า', meaning: '用洗衣機洗衣服', category: 'daily' },
  { id: 'sf17', thai: 'ขอสั่งอาหารจานหลัก', meaning: '我要點主菜', category: 'food' },
  { id: 'sf18', thai: 'มีบุฟเฟ่ต์ไหม', meaning: '有自助餐嗎？', category: 'food' },
  { id: 'sf19', thai: 'ของหวานหวานมาก', meaning: '甜點很甜', category: 'food' },
  { id: 'sf20', thai: 'ขอน้ำเปล่าหนึ่งแก้ว', meaning: '請給一杯白開水', category: 'food' },
  { id: 'sf21', thai: 'อาหารร้อนๆ อร่อยมาก', meaning: '熱騰騰的菜很好吃', category: 'food' },
  { id: 'sf22', thai: 'ช่วยเช็คบิลด้วยครับ', meaning: '請幫我買單', category: 'food' },
  { id: 'sf23', thai: 'ให้ทิปเท่าไหร่ดี', meaning: '小費給多少好？', category: 'food' },
  { id: 'sf24', thai: 'ช่วยปรุงรสไม่เผ็ด', meaning: '請調味不要太辣', category: 'food' },
  { id: 'ss17', thai: 'จ่ายด้วยบัตรเครดิตได้ไหม', meaning: '可以用信用卡嗎？', category: 'shopping' },
  { id: 'ss18', thai: 'มีถุงพลาสติกไหม', meaning: '有塑膠袋嗎？', category: 'shopping' },
  { id: 'ss19', thai: 'สีนี้เป็นสีหลัก', meaning: '這個是主色', category: 'shopping' },
  { id: 'ss20', thai: 'ขอสีพาสเทล', meaning: '要粉彩色的', category: 'shopping' },
  { id: 'ss21', thai: 'สีสันสดใสสวยมาก', meaning: '顏色很鮮豔漂亮', category: 'shopping' },
  { id: 'ss22', thai: 'ใส่ถุงมือก่อนจับ', meaning: '先戴手套再拿', category: 'shopping' },
]

const NEW_ARTICLES = [
  {
    id: 'ar7',
    category: 'travel',
    titleZh: '搭 BTS 逛曼谷',
    contentTh: `เช้านี้ผมนั่งรถไฟฟ้า BTS ไปสยาม สถานีคนเยอะมากแต่รวดเร็ว

ผมดูป้ายและเดินทางตรงไปทางออกที่ต้องการ ถ้าไม่แน่ใจก็ถามเจ้าหน้าที่ได้

ตอนเย็นผมเปลี่ยนเส้นทางไปตลาด กินอาหารร้อนๆ และซื้อของฝากกลับบ้าน`,
    translationZh: `今天早上我搭 BTS 空鐵去暹羅，車站人很多但很快。

我看標示並直走到要的出口，不確定時可以問工作人員。

傍晚我改路線去市場，吃了熱騰騰的食物並買伴手禮回家。`,
    questions: [
      { id: 'ar7-q1', thai: 'นั่งรถไฟฟ้า BTS', meaning: '搭 BTS 空鐵' },
      { id: 'ar7-q2', thai: 'สถานีคนเยอะมาก', meaning: '車站人很多' },
      { id: 'ar7-q3', thai: 'ดูป้าย', meaning: '看標示' },
      { id: 'ar7-q4', thai: 'เดินทางตรง', meaning: '直走／直達' },
      { id: 'ar7-q5', thai: 'ถามเจ้าหน้าที่', meaning: '問工作人員' },
      { id: 'ar7-q6', thai: 'เปลี่ยนเส้นทาง', meaning: '改路線' },
      { id: 'ar7-q7', thai: 'อาหารร้อนๆ', meaning: '熱騰騰的食物' },
      { id: 'ar7-q8', thai: 'ซื้อของฝาก', meaning: '買伴手禮' },
    ],
  },
  {
    id: 'ar8',
    category: 'daily',
    titleZh: '去看醫生',
    contentTh: `เมื่อวานผมปวดหัวและมีไข้ จึงไปโรงพยาบาล

พยาบาลวัดอุณหภูมิและถามอาการ แพทย์ตรวจแล้วให้ใบสั่งยา

ผมต้องกินยาก่อนอาหารและพักผ่อนให้เพียงพอ วันนี้รู้สึกดีขึ้นมาก`,
    translationZh: `昨天我頭痛發燒，所以去醫院。

護士量體溫並問症狀，醫生檢查後開了處方。

我要飯前吃藥並充分休息，今天好多了。`,
    questions: [
      { id: 'ar8-q1', thai: 'ปวดหัวและมีไข้', meaning: '頭痛發燒' },
      { id: 'ar8-q2', thai: 'วัดอุณหภูมิ', meaning: '量體溫' },
      { id: 'ar8-q3', thai: 'ถามอาการ', meaning: '問症狀' },
      { id: 'ar8-q4', thai: 'ให้ใบสั่งยา', meaning: '開處方' },
      { id: 'ar8-q5', thai: 'กินยาก่อนอาหาร', meaning: '飯前吃藥' },
      { id: 'ar8-q6', thai: 'พักผ่อนให้เพียงพอ', meaning: '充分休息' },
      { id: 'ar8-q7', thai: 'รู้สึกดีขึ้นมาก', meaning: '好多了' },
      { id: 'ar8-q8', thai: 'ไปโรงพยาบาล', meaning: '去醫院' },
    ],
  },
  {
    id: 'ar9',
    category: 'food',
    titleZh: '在餐廳點餐',
    contentTh: `คืนนี้เราไปร้านอาหารไทย ผมสั่งอาหารจานหลักและของหวาน

พนักงานเสิร์ฟอาหารร้อนๆ อร่อยมาก เราขอให้ปรุงรสไม่เผ็ด

หลังกินเสร็จขอเช็คบิลและจ่ายด้วยบัตรเครดิต ให้ทิปเล็กน้อยด้วย`,
    translationZh: `今晚我們去泰國餐廳，我點了主菜和甜點。

服務生上了熱騰騰的菜，很好吃，我們請調味不要太辣。

吃完後買單並用信用卡付款，也給了一點小費。`,
    questions: [
      { id: 'ar9-q1', thai: 'สั่งอาหารจานหลัก', meaning: '點主菜' },
      { id: 'ar9-q2', thai: 'ของหวาน', meaning: '甜點' },
      { id: 'ar9-q3', thai: 'เสิร์ฟอาหารร้อนๆ', meaning: '上熱菜' },
      { id: 'ar9-q4', thai: 'ปรุงรสไม่เผ็ด', meaning: '調味不要太辣' },
      { id: 'ar9-q5', thai: 'ขอเช็คบิล', meaning: '買單' },
      { id: 'ar9-q6', thai: 'จ่ายด้วยบัตรเครดิต', meaning: '用信用卡付' },
      { id: 'ar9-q7', thai: 'ให้ทิป', meaning: '給小費' },
      { id: 'ar9-q8', thai: 'อร่อยมาก', meaning: '很好吃' },
    ],
  },
  {
    id: 'ar10',
    category: 'culture',
    titleZh: '泰國的動物園',
    contentTh: `วันหยุดครอบครัวไปสวนสัตว์ เด็กๆ ชอบช้างและลูกม้ามาก

เราเห็นนกแก้วและปลาทองด้วย มีป้ายอธิบายชื่อสัตว์เป็นภาษาไทยและอังกฤษ

ตอนเย็นเรากลับบ้านพร้อมรูปถ่ายมากมาย เป็นวันที่สนุกและได้เรียนรู้`,
    translationZh: `假日全家去動物園，孩子很喜歡大象和小馬。

我們也看到鸚鵡和金魚，有標示牌用泰文和英文解說動物名稱。

傍晚我們帶著很多照片回家，是開心又學到東西的一天。`,
    questions: [
      { id: 'ar10-q1', thai: 'ไปสวนสัตว์', meaning: '去動物園' },
      { id: 'ar10-q2', thai: 'ชอบช้างและลูกม้า', meaning: '喜歡大象和小馬' },
      { id: 'ar10-q3', thai: 'นกแก้ว', meaning: '鸚鵡' },
      { id: 'ar10-q4', thai: 'ป้ายอธิบาย', meaning: '說明標示' },
      { id: 'ar10-q5', thai: 'ภาษาไทยและอังกฤษ', meaning: '泰文和英文' },
      { id: 'ar10-q6', thai: 'รูปถ่ายมากมาย', meaning: '很多照片' },
      { id: 'ar10-q7', thai: 'ได้เรียนรู้', meaning: '學到東西' },
      { id: 'ar10-q8', thai: 'วันที่สนุก', meaning: '開心的一天' },
    ],
  },
]

function genExamples(thai, meaning) {
  return [
    {
      exampleTh: `วันนี้ผมใช้คำว่า「${thai}」`,
      exampleZh: `今天我用了「${meaning}」這個詞。`,
    },
    {
      exampleTh: `「${thai}」 เป็นคำที่ใช้บ่อย`,
      exampleZh: `「${meaning}」是常用詞。`,
    },
  ]
}

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
    .map(
      (x) =>
        `      { id: '${x.id}', thai: '${x.thai}', meaning: '${x.meaning}' },`,
    )
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

// lessons-ext.ts
writeFileSync(
  join(dataDir, 'lessons-ext.ts'),
  `import type { LessonItem } from '../types'

/** 擴充詞庫（+${NEW_LESSONS.length} 詞） */
export const LESSONS_EXT: LessonItem[] = [
${NEW_LESSONS.map(formatLessonLine).join('\n')}
]
`,
)

// sentences-ext.ts
writeFileSync(
  join(dataDir, 'sentences-ext.ts'),
  `import type { SentenceItem } from '../types'

/** 擴充句子（+${NEW_SENTENCES.length} 句） */
export const SENTENCES_EXT: SentenceItem[] = [
${NEW_SENTENCES.map(formatSentence).join('\n')}
]
`,
)

// articles-ext.ts
writeFileSync(
  join(dataDir, 'articles-ext.ts'),
  `import type { ArticleCategory, StudyItem } from '../types'

export interface ArticleExt {
  id: string
  category: ArticleCategory
  titleZh: string
  contentTh: string
  translationZh: string
  questions: StudyItem[]
}

/** 擴充短文（+${NEW_ARTICLES.length} 篇） */
export const ARTICLES_EXT: ArticleExt[] = [
${NEW_ARTICLES.map(formatArticle).join('\n')}
]
`,
)

// word-examples-ext.ts
const exampleLines = NEW_LESSONS.map((l) => {
  const ex = genExamples(l.thai, l.meaning)
  return `  '${l.id}': [
    { exampleTh: '${ex[0].exampleTh.replace(/'/g, "\\'")}', exampleZh: '${ex[0].exampleZh.replace(/'/g, "\\'")}' },
    { exampleTh: '${ex[1].exampleTh.replace(/'/g, "\\'")}', exampleZh: '${ex[1].exampleZh.replace(/'/g, "\\'")}' },
  ],`
})

writeFileSync(
  join(dataDir, 'word-examples-ext.ts'),
  `import type { WordExample } from '../types'

/** 擴充例句（${NEW_LESSONS.length} 詞 × 2） */
export const WORD_EXAMPLES_EXT: Record<string, WordExample[]> = {
${exampleLines.join('\n')}
}
`,
)

console.log(
  `Generated: ${NEW_LESSONS.length} lessons, ${NEW_SENTENCES.length} sentences, ${NEW_ARTICLES.length} articles, ${NEW_LESSONS.length * 2} examples`,
)
