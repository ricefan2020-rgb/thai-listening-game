import type { ArticleCategory, StudyItem } from '../types'

export interface ArticleExt {
  id: string
  category: ArticleCategory
  titleZh: string
  contentTh: string
  translationZh: string
  questions: StudyItem[]
}

/** 擴充短文（+4 篇） */
export const ARTICLES_EXT: ArticleExt[] = [
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
