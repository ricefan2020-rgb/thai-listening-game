import type { ArticleCategory, StudyItem } from '../types'

export interface ArticleExt3 {
  id: string
  category: ArticleCategory
  titleZh: string
  contentTh: string
  translationZh: string
  questions: StudyItem[]
}

/** 擴充短文第三輪（+4 篇） */
export const ARTICLES_EXT3: ArticleExt3[] = [
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
