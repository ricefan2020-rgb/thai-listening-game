import type { LessonItem } from '../types'

/** 擴充詞庫第四輪（+90 詞） */
export const LESSONS_EXT4: LessonItem[] = [
  // 問候／禮貌
  { id: 'g51', thai: 'ขออนุญาต', meaning: '請允許／打擾一下', category: 'greeting' },
  { id: 'g52', thai: 'เชิญครับ', meaning: '請／別客氣', category: 'greeting' },
  { id: 'g53', thai: 'ด้วยความยินดี', meaning: '很樂意', category: 'greeting' },
  { id: 'g54', thai: 'ตามสบาย', meaning: '隨意／不用客氣', category: 'greeting' },
  { id: 'g55', thai: 'ไม่รังเกียจ', meaning: '不介意', category: 'greeting' },
  { id: 'g56', thai: 'ช่วยด้วย', meaning: '幫幫忙', category: 'greeting' },
  { id: 'g57', thai: 'ขอบใจ', meaning: '謝謝（口語）', category: 'greeting' },
  { id: 'g58', thai: 'เกรงใจ', meaning: '不好意思／過意不去', category: 'greeting' },
  { id: 'g59', thai: 'ยินดีพบ', meaning: '很高興見到你', category: 'greeting' },
  { id: 'g60', thai: 'สู้ๆ', meaning: '加油', category: 'greeting' },

  // 旅遊／交通
  { id: 't56', thai: 'รถตู้', meaning: '小巴／廂型車', category: 'travel' },
  { id: 't57', thai: 'มอเตอร์ไซค์', meaning: '機車', category: 'travel' },
  { id: 't58', thai: 'ขับรถ', meaning: '開車', category: 'travel' },
  { id: 't59', thai: 'จอดรถ', meaning: '停車', category: 'travel' },
  { id: 't60', thai: 'ใบขับขี่', meaning: '駕照', category: 'travel' },
  { id: 't61', thai: 'ปั๊มน้ำมัน', meaning: '加油站', category: 'travel' },
  { id: 't62', thai: 'ทางด่วน', meaning: '高速公路', category: 'travel' },
  { id: 't63', thai: 'ที่จอดรถ', meaning: '停車場', category: 'travel' },
  { id: 't64', thai: 'ทิศทาง', meaning: '方向', category: 'travel' },
  { id: 't65', thai: 'แผนที่ออนไลน์', meaning: '線上地圖', category: 'travel' },

  // 食物／味道
  { id: 'f62', thai: 'หิว', meaning: '餓', category: 'food' },
  { id: 'f63', thai: 'อิ่ม', meaning: '飽', category: 'food' },
  { id: 'f64', thai: 'เค็ม', meaning: '鹹', category: 'food' },
  { id: 'f65', thai: 'เปรี้ยว', meaning: '酸', category: 'food' },
  { id: 'f66', thai: 'ขม', meaning: '苦', category: 'food' },
  { id: 'f67', thai: 'จืด', meaning: '淡', category: 'food' },
  { id: 'f68', thai: 'รสเด็ด', meaning: '味道夠勁', category: 'food' },
  { id: 'f69', thai: 'ต้ม', meaning: '煮／燉', category: 'food' },
  { id: 'f70', thai: 'ทอด', meaning: '炸', category: 'food' },
  { id: 'f71', thai: 'ย่าง', meaning: '烤', category: 'food' },

  // 顏色
  { id: 'c31', thai: 'สีเข้ม', meaning: '深色', category: 'color' },
  { id: 'c32', thai: 'สีอ่อน', meaning: '淺色', category: 'color' },
  { id: 'c33', thai: 'สีโทนอุ่น', meaning: '暖色調', category: 'color' },
  { id: 'c34', thai: 'สีเย็น', meaning: '冷色調', category: 'color' },
  { id: 'c35', thai: 'สีกลมกลืน', meaning: '協調色', category: 'color' },

  // 物品
  { id: 'o76', thai: 'แบตเตอรี่', meaning: '電池', category: 'object' },
  { id: 'o77', thai: 'ปลั๊กไฟ', meaning: '插座', category: 'object' },
  { id: 'o78', thai: 'กล้อง', meaning: '相機', category: 'object' },
  { id: 'o79', thai: 'ลำโพง', meaning: '喇叭／音箱', category: 'object' },
  { id: 'o80', thai: 'แว่นตา', meaning: '眼鏡', category: 'object' },
  { id: 'o81', thai: 'นาฬิกา', meaning: '手錶／鐘', category: 'object' },
  { id: 'o82', thai: 'กระเป๋า', meaning: '包包', category: 'object' },
  { id: 'o83', thai: 'ร่ม', meaning: '雨傘', category: 'object' },
  { id: 'o84', thai: 'พัดลม', meaning: '電風扇', category: 'object' },
  { id: 'o85', thai: 'เครื่องปรับอากาศ', meaning: '冷氣', category: 'object' },

  // 家具／居家
  { id: 'h71', thai: 'ผ้าม่าน', meaning: '窗簾', category: 'furniture' },
  { id: 'h72', thai: 'ตู้เย็น', meaning: '冰箱', category: 'furniture' },
  { id: 'h73', thai: 'ไมโครเวฟ', meaning: '微波爐', category: 'furniture' },
  { id: 'h74', thai: 'เครื่องซักผ้า', meaning: '洗衣機', category: 'furniture' },
  { id: 'h75', thai: 'เครื่องดูดฝุ่น', meaning: '吸塵器', category: 'furniture' },
  { id: 'h76', thai: 'ก๊อกน้ำ', meaning: '水龍頭', category: 'furniture' },
  { id: 'h78', thai: 'ห้องครัว', meaning: '廚房', category: 'furniture' },
  { id: 'h79', thai: 'ระเบียง', meaning: '陽台', category: 'furniture' },
  { id: 'h80', thai: 'บันได', meaning: '樓梯', category: 'furniture' },

  // 身體／健康
  { id: 'b66', thai: 'ปวดท้อง', meaning: '肚子痛', category: 'body' },
  { id: 'b67', thai: 'ปวดหลัง', meaning: '背痛', category: 'body' },
  { id: 'b68', thai: 'ไอ', meaning: '咳嗽', category: 'body' },
  { id: 'b69', thai: 'จาม', meaning: '打噴嚏', category: 'body' },
  { id: 'b70', thai: 'เจ็บคอ', meaning: '喉嚨痛', category: 'body' },
  { id: 'b71', thai: 'บวม', meaning: '腫', category: 'body' },
  { id: 'b72', thai: 'คัน', meaning: '癢', category: 'body' },
  { id: 'b73', thai: 'ชา', meaning: '麻（發麻）', category: 'body' },
  { id: 'b74', thai: 'หนาว', meaning: '冷（覺得冷）', category: 'body' },
  { id: 'b75', thai: 'เหงื่อ', meaning: '汗', category: 'body' },

  // 動物
  { id: 'a66', thai: 'นกฮูก', meaning: '貓頭鷹', category: 'animal' },
  { id: 'a67', thai: 'ลิง', meaning: '猴子', category: 'animal' },
  { id: 'a68', thai: 'จระเข้', meaning: '鱷魚', category: 'animal' },
  { id: 'a69', thai: 'เต่า', meaning: '烏龜', category: 'animal' },
  { id: 'a70', thai: 'กบ', meaning: '青蛙', category: 'animal' },
  { id: 'a71', thai: 'ผีเสื้อ', meaning: '蝴蝶', category: 'animal' },
  { id: 'a72', thai: 'ปูนา', meaning: '寄居蟹', category: 'animal' },
  { id: 'a73', thai: 'ปลาฉลาม', meaning: '鯊魚', category: 'animal' },
  { id: 'a74', thai: 'ปลาดาว', meaning: '海星', category: 'animal' },
  { id: 'a75', thai: 'ปลาดุก', meaning: '鯰魚', category: 'animal' },

  // 水果（延伸）
  { id: 'fr26', thai: 'ลำใย', meaning: '龍眼', category: 'fruit' },
  { id: 'fr27', thai: 'ลิ้นจี่', meaning: '荔枝', category: 'fruit' },
  { id: 'fr28', thai: 'ชมพู่', meaning: '蓮霧', category: 'fruit' },
  { id: 'fr29', thai: 'มะพร้าวอ่อน', meaning: '嫩椰子', category: 'fruit' },
  { id: 'fr30', thai: 'ส้มโอ', meaning: '柚子', category: 'fruit' },

  // 感覺
  { id: 'fl26', thai: 'เมื่อย', meaning: '痠／累', category: 'feeling' },
  { id: 'fl27', thai: 'มึน', meaning: '暈', category: 'feeling' },
  { id: 'fl28', thai: 'ชุ่ม', meaning: '濕潤', category: 'feeling' },
  { id: 'fl29', thai: 'แห้ง', meaning: '乾', category: 'feeling' },
  { id: 'fl30', thai: 'เปียก', meaning: '濕', category: 'feeling' },

  // 情緒
  { id: 'em26', thai: 'ภูมิใจ', meaning: '驕傲／自豪', category: 'emotion' },
  { id: 'em27', thai: 'เขิน', meaning: '害羞', category: 'emotion' },
  { id: 'em28', thai: 'ประหม่า', meaning: '緊張', category: 'emotion' },
  { id: 'em29', thai: 'สับสน', meaning: '困惑', category: 'emotion' },
  { id: 'em30', thai: 'โล่งใจ', meaning: '鬆一口氣', category: 'emotion' },
]
