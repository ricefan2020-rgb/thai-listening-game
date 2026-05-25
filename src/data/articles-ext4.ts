import type { ArticleCategory, StudyItem } from '../types'

export interface ArticleExt4 {
  id: string
  category: ArticleCategory
  titleZh: string
  contentTh: string
  translationZh: string
  questions: StudyItem[]
}

/** 擴充短文第四輪（+5 篇） */
export const ARTICLES_EXT4: ArticleExt4[] = [
  {
    id: 'ar28',
    category: 'daily',
    titleZh: '租屋與居家',
    contentTh: `ผมเพิ่งย้ายเข้าห้องใหม่ มีตู้เย็นและเครื่องซักผ้า

ห้องครัวเล็กแต่ใช้งานได้ ระเบียงมองเห็นต้นไม้

ตอนกลางคืนเปิดเครื่องปรับอากาศแล้วนอนสบาย แต่บางทีลืมร่มตอนฝนตก`,
    translationZh: `我剛搬進新租屋，有冰箱和洗衣機。

廚房小但够用，陽台看得到樹。

晚上開冷氣睡得很舒服，但有時下雨會忘帶傘。`,
    questions: [
      { id: 'ar28-q1', thai: 'ย้ายเข้าห้องใหม่', meaning: '搬進新房' },
      { id: 'ar28-q2', thai: 'ตู้เย็น', meaning: '冰箱' },
      { id: 'ar28-q3', thai: 'เครื่องซักผ้า', meaning: '洗衣機' },
      { id: 'ar28-q4', thai: 'ห้องครัว', meaning: '廚房' },
      { id: 'ar28-q5', thai: 'ระเบียง', meaning: '陽台' },
      { id: 'ar28-q6', thai: 'เครื่องปรับอากาศ', meaning: '冷氣' },
      { id: 'ar28-q7', thai: 'ลืมร่ม', meaning: '忘帶傘' },
      { id: 'ar28-q8', thai: 'นอนสบาย', meaning: '睡得舒服' },
    ],
  },
  {
    id: 'ar29',
    category: 'travel',
    titleZh: '自駕去清邁',
    contentTh: `สุดสัปดาห์นี้เราขับรถไปเชียงใหม่ ใช้ทางด่วนบางช่วง

ก่อนออกเดินทางเติมน้ำมันที่ปั๊มและตรวจใบขับขี่

ถึงที่พักแล้วจอดรถในที่จอดรถของโรงแรม ดูแผนที่ออนไลน์หาคาเฟ่`,
    translationZh: `這個週末我們開車去清邁，部分路段走高速公路。

出發前在加油站加油並檢查駕照。

到住宿後把車停在飯店停車場，用線上地圖找咖啡廳。`,
    questions: [
      { id: 'ar29-q1', thai: 'ขับรถไปเชียงใหม่', meaning: '開車去清邁' },
      { id: 'ar29-q2', thai: 'ใช้ทางด่วน', meaning: '走高速公路' },
      { id: 'ar29-q3', thai: 'เติมน้ำมัน', meaning: '加油' },
      { id: 'ar29-q4', thai: 'ตรวจใบขับขี่', meaning: '檢查駕照' },
      { id: 'ar29-q5', thai: 'จอดรถ', meaning: '停車' },
      { id: 'ar29-q6', thai: 'ที่จอดรถ', meaning: '停車場' },
      { id: 'ar29-q7', thai: 'แผนที่ออนไลน์', meaning: '線上地圖' },
      { id: 'ar29-q8', thai: 'สุดสัปดาห์', meaning: '週末' },
    ],
  },
  {
    id: 'ar30',
    category: 'food',
    titleZh: '在家下廚',
    contentTh: `วันนี้ผมหิวมากจึงทำอาหารเอง ต้มซุปไก่และทอดไข่

รสชาติจืดไปเลยใส่เกลือนิดหน่อย ย่างปลาที่ระเบียงหอมมาก

กินจนอิ่มแล้วล้างจานที่อ่างล้างหน้า`,
    translationZh: `今天很餓就自己煮，燉雞湯又煎蛋。

味道太淡就加了一點鹽，在陽台烤魚很香。

吃到飽後在水槽洗碗。`,
    questions: [
      { id: 'ar30-q1', thai: 'หิวมาก', meaning: '很餓' },
      { id: 'ar30-q2', thai: 'ต้มซุปไก่', meaning: '燉雞湯' },
      { id: 'ar30-q3', thai: 'ทอดไข่', meaning: '煎蛋' },
      { id: 'ar30-q4', thai: 'จืดไป', meaning: '太淡' },
      { id: 'ar30-q5', thai: 'ย่างปลา', meaning: '烤魚' },
      { id: 'ar30-q6', thai: 'กินจนอิ่ม', meaning: '吃到飽' },
      { id: 'ar30-q7', thai: 'อ่างล้างหน้า', meaning: '洗手台／水槽' },
      { id: 'ar30-q8', thai: 'ทำอาหารเอง', meaning: '自己煮' },
    ],
  },
  {
    id: 'ar31',
    category: 'culture',
    titleZh: '泰國水果季',
    contentTh: `หน้าร้อนมีผลไม้หลายชนิด เช่น ลำใย ลิ้นจี่ และฝรั่ง

ผมซื้อมะพร้าวอ่อนดื่มน้ำเย็นๆ รสหวานและเปรี้ยวเล็กน้อย

เพื่อนบอกว่าชมพู่กรอบอร่อย แต่ทุเรียนแพงมาก`,
    translationZh: `熱季有很多水果，例如龍眼、荔枝和芭樂。

我買嫩椰子喝冰涼的汁，又甜又有一點酸。

朋友說蓮霧很脆好吃，但榴槤很貴。`,
    questions: [
      { id: 'ar31-q1', thai: 'ลำใย', meaning: '龍眼' },
      { id: 'ar31-q2', thai: 'ลิ้นจี่', meaning: '荔枝' },
      { id: 'ar31-q3', thai: 'ฝรั่ง', meaning: '芭樂' },
      { id: 'ar31-q4', thai: 'มะพร้าวอ่อน', meaning: '嫩椰子' },
      { id: 'ar31-q5', thai: 'หวานและเปรี้ยว', meaning: '又甜又酸' },
      { id: 'ar31-q6', thai: 'ชมพู่', meaning: '蓮霧' },
      { id: 'ar31-q7', thai: 'ทุเรียนแพง', meaning: '榴槤很貴' },
      { id: 'ar31-q8', thai: 'หน้าร้อน', meaning: '熱季／夏天' },
    ],
  },
  {
    id: 'ar32',
    category: 'news',
    titleZh: '酷熱與健康提醒',
    contentTh: `กรมอุตุนิยมวิทยาแจ้งว่าอากาศร้อนจัดหลายภาค ประชาชนควรดื่มน้ำมากๆ

ผู้สูงอายุและเด็กเล็กระวังเป็นลมแดด มีอาการเวียนหัวและเหงื่อออกมาก

เจ้าหน้าที่แนะนำพักในที่ร่มและเปิดพัดลมหรือเครื่องปรับอากาศ`,
    translationZh: `氣象局表示多區高溫，民眾應多喝水。

長者與幼童要防中暑，可能頭暈、流很多汗。

官員建議在陰涼處休息，開電風扇或冷氣。`,
    questions: [
      { id: 'ar32-q1', thai: 'อากาศร้อนจัด', meaning: '天氣酷熱' },
      { id: 'ar32-q2', thai: 'ดื่มน้ำมากๆ', meaning: '多喝水' },
      { id: 'ar32-q3', thai: 'ระวังเป็นลมแดด', meaning: '防中暑' },
      { id: 'ar32-q4', thai: 'เวียนหัว', meaning: '頭暈' },
      { id: 'ar32-q5', thai: 'เหงื่อออกมาก', meaning: '流很多汗' },
      { id: 'ar32-q6', thai: 'พักในที่ร่ม', meaning: '在陰涼處休息' },
      { id: 'ar32-q7', thai: 'พัดลม', meaning: '電風扇' },
      { id: 'ar32-q8', thai: 'กรมอุตุนิยมวิทยา', meaning: '氣象局' },
    ],
  },
]
