import type { SentenceItem } from '../types'

/** 句子擴充第六輪（+48 句） */
export const SENTENCES_EXT6: SentenceItem[] = [
  { id: 'sg51', thai: 'ขออนุญาตถามหน่อยครับ', meaning: '打擾一下，請問', category: 'greeting' },
  { id: 'sg52', thai: 'เชิญนั่งครับ', meaning: '請坐', category: 'greeting' },
  { id: 'sg53', thai: 'ด้วยความยินดีครับ', meaning: '很樂意（男性禮貌）', category: 'greeting' },
  { id: 'sg54', thai: 'ตามสบายเลยนะ', meaning: '隨意就好', category: 'greeting' },
  { id: 'sg55', thai: 'สู้ๆ นะครับ', meaning: '加油喔', category: 'greeting' },
  { id: 'sg56', thai: 'ขอบใจมากเลย', meaning: '非常謝謝（口語）', category: 'greeting' },
  { id: 'sg57', thai: 'เกรงใจมากเลย', meaning: '真不好意思', category: 'greeting' },
  { id: 'sg58', thai: 'ยินดีพบคุณอีกครั้ง', meaning: '很高興再次見到你', category: 'greeting' },

  { id: 'st51', thai: 'ขับรถไปเชียงใหม่', meaning: '開車去清邁', category: 'travel' },
  { id: 'st52', thai: 'จอดรถตรงนี้ได้ไหม', meaning: '可以在這裡停車嗎？', category: 'travel' },
  { id: 'st53', thai: 'มีใบขับขี่ไหม', meaning: '有駕照嗎？', category: 'travel' },
  { id: 'st54', thai: 'เติมน้ำมันที่ปั๊มนี้', meaning: '在這家加油站加油', category: 'travel' },
  { id: 'st55', thai: 'ทางด่วนค่าผ่านทางเท่าไหร่', meaning: '高速公路過路費多少？', category: 'travel' },
  { id: 'st56', thai: 'ทิศทางไปสนามบินถูกไหม', meaning: '去機場的方向對嗎？', category: 'travel' },
  { id: 'st57', thai: 'นั่งรถตู้ไปพัทยา', meaning: '搭小巴去芭達雅', category: 'travel' },
  { id: 'st58', thai: 'ขี่มอเตอร์ไซค์ระวังหน่อย', meaning: '騎機車小心一點', category: 'travel' },

  { id: 'sd51', thai: 'หิวมากขอสั่งอาหาร', meaning: '很餓，要點餐', category: 'daily' },
  { id: 'sd52', thai: 'อิ่มแล้วขอบคุณ', meaning: '吃飽了，謝謝', category: 'daily' },
  { id: 'sd53', thai: 'รสชาติเค็มไปหน่อย', meaning: '味道有點太鹹', category: 'daily' },
  { id: 'sd54', thai: 'เปรี้ยวอร่อยดี', meaning: '酸酸的很好吃', category: 'daily' },
  { id: 'sd55', thai: 'ปวดท้องขอไปห้องน้ำ', meaning: '肚子痛，想去洗手間', category: 'daily' },
  { id: 'sd56', thai: 'ไอและเจ็บคอ', meaning: '咳嗽又喉嚨痛', category: 'daily' },
  { id: 'sd57', thai: 'เหงื่อออกมากเพราะร้อน', meaning: '太熱流很多汗', category: 'daily' },
  { id: 'sd58', thai: 'เมื่อยมากขอพักก่อน', meaning: '很累，先休息一下', category: 'daily' },
  { id: 'sd59', thai: 'โล่งใจแล้วที่ปลอดภัย', meaning: '安全了就放心了', category: 'daily' },
  { id: 'sd60', thai: 'ประหม่าตอนพูดไทย', meaning: '說泰文時很緊張', category: 'daily' },

  { id: 'sf25', thai: 'ขอต้มไก่หนึ่งถ้วย', meaning: '請給一碗燉雞', category: 'food' },
  { id: 'sf26', thai: 'ทอดไก่กรอบๆ', meaning: '炸雞要酥脆', category: 'food' },
  { id: 'sf27', thai: 'ย่างหมูหอมมาก', meaning: '烤豬很香', category: 'food' },
  { id: 'sf28', thai: 'รสเด็ดแต่ไม่เผ็ด', meaning: '味夠勁但不辣', category: 'food' },
  { id: 'sf29', thai: 'จืดไปใส่เกลือหน่อย', meaning: '太淡了，加點鹽', category: 'food' },
  { id: 'sf30', thai: 'ขมนิดหน่อยแต่อร่อย', meaning: '有一點苦但好吃', category: 'food' },

  { id: 'ss23', thai: 'สีเข้มกว่าตัวนี้มีไหม', meaning: '有比這件更深的顏色嗎？', category: 'shopping' },
  { id: 'ss24', thai: 'ขอสีอ่อนกว่านี้', meaning: '要更淺的顏色', category: 'shopping' },
  { id: 'ss25', thai: 'เปิดเครื่องปรับอากาศหน่อย', meaning: '開一下冷氣', category: 'shopping' },
  { id: 'ss26', thai: 'พัดลมเสียแล้ว', meaning: '電風扇壞了', category: 'shopping' },
  { id: 'ss27', thai: 'แบตเตอรี่หมดแล้ว', meaning: '電池沒電了', category: 'shopping' },
  { id: 'ss28', thai: 'ลืมร่มที่บ้าน', meaning: '雨傘忘在家裡', category: 'shopping' },

  { id: 'sh1', thai: 'ลิงในสวนสัตว์น่ารัก', meaning: '動物園的猴子很可愛', category: 'shopping' },
  { id: 'sh2', thai: 'เห็นผีเสื้อสีสวย', meaning: '看到漂亮的蝴蝶', category: 'shopping' },
  { id: 'sh3', thai: 'ปลาฉลามใหญ่มาก', meaning: '鯊魚非常大', category: 'shopping' },
  { id: 'sh4', thai: 'กินลำใยสดๆ', meaning: '吃新鮮龍眼', category: 'shopping' },
  { id: 'sh5', thai: 'ฝรั่งหวานกรอบ', meaning: '芭樂又甜又脆', category: 'shopping' },
]
