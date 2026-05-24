import type { LessonCategory, LessonItem, PracticeTopic } from '../types'
import { LESSONS_EXT } from './lessons-ext'
import { LESSONS_EXT2 } from './lessons-ext2'
import { LESSONS_EXT3 } from './lessons-ext3'
import { LESSONS_VOCAB_PATCH } from './lessons-vocab-patch'
import { LESSONS_TONE_PAIRS } from './lessons-tone-pairs'
import { LESSONS_THEMES } from './lessons-themes'
import { LESSONS_THEMES_EXT } from './lessons-themes-ext'
import { LESSONS_TIME_HOLIDAY } from './lessons-time-holiday'
import { getPitfallLessonIds, getTonePairLessonIds } from './word-meta'

export const CATEGORY_LABELS: Record<LessonCategory, string> = {
  greeting: '問候',
  travel: '旅遊',
  food: '食物',
  fruit: '水果',
  feeling: '感覺',
  emotion: '情緒',
  time: '時間',
  holiday: '節日',
  color: '顏色',
  object: '物品',
  furniture: '家具',
  body: '身體部位',
  animal: '動物',
}

export const LESSONS: LessonItem[] = [
  // 問候
  { id: 'g1', thai: 'สวัสดี', meaning: '你好', category: 'greeting' },
  { id: 'g2', thai: 'ขอบคุณ', meaning: '謝謝', category: 'greeting' },
  { id: 'g3', thai: 'ขอโทษ', meaning: '對不起', category: 'greeting' },
  { id: 'g4', thai: 'ไม่เป็นไร', meaning: '沒關係', category: 'greeting' },
  { id: 'g5', thai: 'ลาก่อน', meaning: '再見', category: 'greeting' },
  { id: 'g6', thai: 'ใช่', meaning: '是', category: 'greeting' },
  { id: 'g7', thai: 'ไม่', meaning: '不是', category: 'greeting' },
  { id: 'g8', thai: 'สบายดีไหม', meaning: '你好嗎', category: 'greeting' },
  { id: 'g9', thai: 'สบายดี', meaning: '我很好', category: 'greeting' },
  { id: 'g10', thai: 'ยินดีที่ได้รู้จัก', meaning: '很高興認識你', category: 'greeting' },
  { id: 'g11', thai: 'สวัสดีตอนเช้า', meaning: '早安', category: 'greeting' },
  { id: 'g12', thai: 'ราตรีสวัสดิ์', meaning: '晚安', category: 'greeting' },
  { id: 'g13', thai: 'ยินดีต้อนรับ', meaning: '歡迎', category: 'greeting' },
  { id: 'g14', thai: 'ไม่ต้องห่วง', meaning: '別擔心', category: 'greeting' },
  { id: 'g15', thai: 'ได้เลย', meaning: '可以／沒問題', category: 'greeting' },
  { id: 'g16', thai: 'โปรด', meaning: '請（客氣）', category: 'greeting' },
  { id: 'g17', thai: 'ขอแนะนำตัว', meaning: '讓我自我介紹', category: 'greeting' },
  { id: 'g18', thai: 'เชิญ', meaning: '請／別客氣', category: 'greeting' },
  { id: 'g19', thai: 'ดูแลตัวเอง', meaning: '保重', category: 'greeting' },
  { id: 'g20', thai: 'ไม่เห็นกันนาน', meaning: '好久不見', category: 'greeting' },

  // 旅遊
  { id: 't1', thai: 'อาหาร', meaning: '食物', category: 'travel' },
  { id: 't2', thai: 'น้ำ', meaning: '水', category: 'travel' },
  { id: 't3', thai: 'ห้องน้ำ', meaning: '洗手間', category: 'travel' },
  { id: 't4', thai: 'เท่าไหร่', meaning: '多少錢', category: 'travel' },
  { id: 't5', thai: 'ช่วยด้วย', meaning: '救命／幫忙', category: 'travel' },
  { id: 't6', thai: 'แผนที่', meaning: '地圖', category: 'travel' },
  { id: 't7', thai: 'โรงแรม', meaning: '飯店', category: 'travel' },
  { id: 't8', thai: 'สนามบิน', meaning: '機場', category: 'travel' },
  { id: 't9', thai: 'ตั๋ว', meaning: '票', category: 'travel' },
  { id: 't10', thai: 'อร่อย', meaning: '好吃', category: 'travel' },
  { id: 't11', thai: 'แท็กซี่', meaning: '計程車', category: 'travel' },
  { id: 't12', thai: 'รถเมล์', meaning: '公車', category: 'travel' },
  { id: 't13', thai: 'รถไฟ', meaning: '火車', category: 'travel' },
  { id: 't14', thai: 'หนังสือเดินทาง', meaning: '護照', category: 'travel' },
  { id: 't15', thai: 'กระเป๋าเดินทาง', meaning: '行李箱', category: 'travel' },
  { id: 't16', thai: 'ซ้าย', meaning: '左邊', category: 'travel' },
  { id: 't17', thai: 'ขวา', meaning: '右邊', category: 'travel' },
  { id: 't18', thai: 'ใกล้', meaning: '近', category: 'travel' },
  { id: 't19', thai: 'ไกล', meaning: '遠', category: 'travel' },
  { id: 't20', thai: 'ร้านขายยา', meaning: '藥局', category: 'travel' },
  { id: 't21', thai: 'โรงพยาบาล', meaning: '醫院', category: 'travel' },
  { id: 't22', thai: 'ชายหาด', meaning: '海灘', category: 'travel' },
  { id: 't23', thai: 'วัด', meaning: '寺廟', category: 'travel' },
  { id: 't24', thai: 'ทางเข้า', meaning: '入口', category: 'travel' },
  { id: 't25', thai: 'ทางออก', meaning: '出口', category: 'travel' },

  // 食物
  { id: 'f1', thai: 'ข้าว', meaning: '飯', category: 'food' },
  { id: 'f2', thai: 'ขนม', meaning: '點心', category: 'food' },
  { id: 'f3', thai: 'ผลไม้', meaning: '水果', category: 'fruit' },
  { id: 'f4', thai: 'ผัก', meaning: '蔬菜', category: 'food' },
  { id: 'f5', thai: 'เนื้อ', meaning: '肉', category: 'food' },
  { id: 'f6', thai: 'ไก่', meaning: '雞肉', category: 'food' },
  { id: 'f7', thai: 'ปลา', meaning: '魚', category: 'food' },
  { id: 'f8', thai: 'ไข่', meaning: '蛋', category: 'food' },
  { id: 'f9', thai: 'นม', meaning: '牛奶', category: 'food' },
  { id: 'f10', thai: 'กาแฟ', meaning: '咖啡', category: 'food' },
  { id: 'f11', thai: 'ชา', meaning: '茶', category: 'food' },
  { id: 'f12', thai: 'น้ำแข็ง', meaning: '冰', category: 'food' },
  { id: 'f13', thai: 'เผ็ด', meaning: '辣', category: 'food' },
  { id: 'f14', thai: 'หวาน', meaning: '甜', category: 'food' },
  { id: 'f15', thai: 'เปรี้ยว', meaning: '酸', category: 'food' },
  { id: 'f16', thai: 'เค็ม', meaning: '鹹', category: 'food' },
  { id: 'f17', thai: 'ข้าวผัด', meaning: '炒飯', category: 'food' },
  { id: 'f18', thai: 'ต้มยำ', meaning: '冬陰功', category: 'food' },
  { id: 'f19', thai: 'ส้มตำ', meaning: '青木瓜沙拉', category: 'food' },
  { id: 'f20', thai: 'ก๋วยเตี๋ยว', meaning: '河粉／麵', category: 'food' },
  { id: 'f21', thai: 'น้ำซุป', meaning: '湯', category: 'food' },
  { id: 'f22', thai: 'น้ำตาล', meaning: '糖', category: 'food' },
  { id: 'f23', thai: 'เกลือ', meaning: '鹽', category: 'food' },
  { id: 'f24', thai: 'พริก', meaning: '辣椒', category: 'food' },
  { id: 'f25', thai: 'เบียร์', meaning: '啤酒', category: 'food' },
  { id: 'f26', thai: 'ไวน์', meaning: '葡萄酒', category: 'food' },
  { id: 'f27', thai: 'มะม่วง', meaning: '芒果', category: 'fruit' },
  { id: 'f28', thai: 'มะพร้าว', meaning: '椰子', category: 'fruit' },
  { id: 'f29', thai: 'กุ้ง', meaning: '蝦', category: 'food' },
  { id: 'f30', thai: 'หมู', meaning: '豬肉', category: 'food' },
  { id: 'f31', thai: 'มังสวิรัติ', meaning: '素食', category: 'food' },
  { id: 'f32', thai: 'หิว', meaning: '餓', category: 'feeling' },
  { id: 'f33', thai: 'อิ่ม', meaning: '飽了', category: 'feeling' },
  { id: 'f34', thai: 'ช้อน', meaning: '湯匙', category: 'food' },
  { id: 'f35', thai: 'ส้อม', meaning: '叉子', category: 'food' },

  // 顏色
  { id: 'c1', thai: 'สีแดง', meaning: '紅色', category: 'color' },
  { id: 'c2', thai: 'สีน้ำเงิน', meaning: '藍色', category: 'color' },
  { id: 'c3', thai: 'สีเขียว', meaning: '綠色', category: 'color' },
  { id: 'c4', thai: 'สีเหลือง', meaning: '黃色', category: 'color' },
  { id: 'c5', thai: 'สีขาว', meaning: '白色', category: 'color' },
  { id: 'c6', thai: 'สีดำ', meaning: '黑色', category: 'color' },
  { id: 'c7', thai: 'สีส้ม', meaning: '橙色', category: 'color' },
  { id: 'c8', thai: 'สีชมพู', meaning: '粉色', category: 'color' },
  { id: 'c9', thai: 'สีม่วง', meaning: '紫色', category: 'color' },
  { id: 'c10', thai: 'สีน้ำตาล', meaning: '棕色', category: 'color' },
  { id: 'c11', thai: 'สีเทา', meaning: '灰色', category: 'color' },
  { id: 'c12', thai: 'สีทอง', meaning: '金色', category: 'color' },
  { id: 'c13', thai: 'สีเงิน', meaning: '銀色', category: 'color' },
  { id: 'c14', thai: 'สีฟ้า', meaning: '天藍色', category: 'color' },
  { id: 'c15', thai: 'สี', meaning: '顏色', category: 'color' },
  { id: 'c16', thai: 'สีเข้ม', meaning: '深色', category: 'color' },
  { id: 'c17', thai: 'สีอ่อน', meaning: '淺色', category: 'color' },
  { id: 'c18', thai: 'สีใส', meaning: '透明', category: 'color' },
  { id: 'c19', thai: 'สีแดงเข้ม', meaning: '深紅色', category: 'color' },
  { id: 'c20', thai: 'สีเขียวอ่อน', meaning: '淺綠色', category: 'color' },
  { id: 'c21', thai: 'สีคราม', meaning: '靛藍色', category: 'color' },
  { id: 'c22', thai: 'สีเหลืองทอง', meaning: '金黃色', category: 'color' },
  { id: 'c23', thai: 'สีชา', meaning: '茶色', category: 'color' },
  { id: 'c24', thai: 'สีขาวนวล', meaning: '乳白色', category: 'color' },
  { id: 'c25', thai: 'หลากสี', meaning: '彩色', category: 'color' },

  // 物品
  { id: 'o1', thai: 'โทรศัพท์', meaning: '手機', category: 'object' },
  { id: 'o2', thai: 'กุญแจ', meaning: '鑰匙', category: 'object' },
  { id: 'o3', thai: 'กระเป๋า', meaning: '包包', category: 'object' },
  { id: 'o4', thai: 'แว่นตา', meaning: '眼鏡', category: 'object' },
  { id: 'o5', thai: 'นาฬิกา', meaning: '手錶', category: 'object' },
  { id: 'o6', thai: 'ร่ม', meaning: '雨傘', category: 'object' },
  { id: 'o7', thai: 'หนังสือ', meaning: '書', category: 'object' },
  { id: 'o8', thai: 'ปากกา', meaning: '筆', category: 'object' },
  { id: 'o9', thai: 'กระดาษ', meaning: '紙', category: 'object' },
  { id: 'o10', thai: 'กล้อง', meaning: '相機', category: 'object' },
  { id: 'o11', thai: 'หูฟัง', meaning: '耳機', category: 'object' },
  { id: 'o12', thai: 'แบตเตอรี่', meaning: '電池', category: 'object' },
  { id: 'o13', thai: 'เงิน', meaning: '錢', category: 'object' },
  { id: 'o14', thai: 'บัตร', meaning: '卡片', category: 'object' },
  { id: 'o15', thai: 'ถุง', meaning: '袋子', category: 'object' },
  { id: 'o16', thai: 'กระจก', meaning: '鏡子', category: 'object' },
  { id: 'o17', thai: 'กล่อง', meaning: '盒子', category: 'object' },
  { id: 'o18', thai: 'ถังขยะ', meaning: '垃圾桶', category: 'object' },
  { id: 'o19', thai: 'ไฟฉาย', meaning: '手電筒', category: 'object' },
  { id: 'o20', thai: 'รองเท้า', meaning: '鞋子', category: 'object' },
  { id: 'o21', thai: 'คอมพิวเตอร์', meaning: '電腦', category: 'object' },
  { id: 'o22', thai: 'ที่ชาร์จ', meaning: '充電器', category: 'object' },
  { id: 'o23', thai: 'กระเป๋าสตางค์', meaning: '錢包', category: 'object' },
  { id: 'o24', thai: 'เสื้อ', meaning: '上衣', category: 'object' },
  { id: 'o25', thai: 'กางเกง', meaning: '褲子', category: 'object' },
  { id: 'o26', thai: 'หมวก', meaning: '帽子', category: 'object' },
  { id: 'o27', thai: 'ถุงเท้า', meaning: '襪子', category: 'object' },
  { id: 'o28', thai: 'ขวด', meaning: '瓶子', category: 'object' },
  { id: 'o29', thai: 'แก้ว', meaning: '杯子', category: 'object' },
  { id: 'o30', thai: 'จาน', meaning: '盤子', category: 'object' },
  { id: 'o31', thai: 'มีด', meaning: '刀', category: 'object' },
  { id: 'o32', thai: 'กรรไกร', meaning: '剪刀', category: 'object' },
  { id: 'o33', thai: 'ดินสอ', meaning: '鉛筆', category: 'object' },
  { id: 'o34', thai: 'ยางลบ', meaning: '橡皮擦', category: 'object' },
  { id: 'o35', thai: 'พัด', meaning: '扇子', category: 'object' },

  // 家具
  { id: 'h1', thai: 'โต๊ะ', meaning: '桌子', category: 'furniture' },
  { id: 'h2', thai: 'เก้าอี้', meaning: '椅子', category: 'furniture' },
  { id: 'h3', thai: 'เตียง', meaning: '床', category: 'furniture' },
  { id: 'h4', thai: 'ตู้', meaning: '櫃子', category: 'furniture' },
  { id: 'h5', thai: 'โซฟา', meaning: '沙發', category: 'furniture' },
  { id: 'h6', thai: 'ตู้เย็น', meaning: '冰箱', category: 'furniture' },
  { id: 'h7', thai: 'โทรทัศน์', meaning: '電視', category: 'furniture' },
  { id: 'h8', thai: 'โคมไฟ', meaning: '燈', category: 'furniture' },
  { id: 'h9', thai: 'หมอน', meaning: '枕頭', category: 'furniture' },
  { id: 'h10', thai: 'ผ้าห่ม', meaning: '被子', category: 'furniture' },
  { id: 'h11', thai: 'ลิ้นชัก', meaning: '抽屜', category: 'furniture' },
  { id: 'h12', thai: 'ชั้นหนังสือ', meaning: '書架', category: 'furniture' },
  { id: 'h13', thai: 'ประตู', meaning: '門', category: 'furniture' },
  { id: 'h14', thai: 'หน้าต่าง', meaning: '窗戶', category: 'furniture' },
  { id: 'h15', thai: 'พรม', meaning: '地毯', category: 'furniture' },
  { id: 'h16', thai: 'ผ้าม่าน', meaning: '窗簾', category: 'furniture' },
  { id: 'h17', thai: 'ก๊อกน้ำ', meaning: '水龍頭', category: 'furniture' },
  { id: 'h18', thai: 'อ่างล้างหน้า', meaning: '洗手台', category: 'furniture' },
  { id: 'h19', thai: 'เตา', meaning: '爐子', category: 'furniture' },
  { id: 'h20', thai: 'ตู้เสื้อผ้า', meaning: '衣櫃', category: 'furniture' },
  { id: 'h21', thai: 'แอร์', meaning: '冷氣', category: 'furniture' },
  { id: 'h22', thai: 'พัดลม', meaning: '電風扇', category: 'furniture' },
  { id: 'h23', thai: 'ไมโครเวฟ', meaning: '微波爐', category: 'furniture' },
  { id: 'h24', thai: 'เครื่องซักผ้า', meaning: '洗衣機', category: 'furniture' },
  { id: 'h25', thai: 'บันได', meaning: '樓梯', category: 'furniture' },
  { id: 'h26', thai: 'กำแพง', meaning: '牆', category: 'furniture' },
  { id: 'h27', thai: 'พื้น', meaning: '地板', category: 'furniture' },
  { id: 'h28', thai: 'เพดาน', meaning: '天花板', category: 'furniture' },
  { id: 'h29', thai: 'หิงพลุ', meaning: '衣架', category: 'furniture' },
  { id: 'h30', thai: 'โต๊ะกาแฟ', meaning: '茶几', category: 'furniture' },

  // 身體部位
  { id: 'b1', thai: 'หัว', meaning: '頭', category: 'body' },
  { id: 'b2', thai: 'ผม', meaning: '頭髮', category: 'body' },
  { id: 'b3', thai: 'หน้า', meaning: '臉', category: 'body' },
  { id: 'b4', thai: 'ตา', meaning: '眼睛', category: 'body' },
  { id: 'b5', thai: 'หู', meaning: '耳朵', category: 'body' },
  { id: 'b6', thai: 'จมูก', meaning: '鼻子', category: 'body' },
  { id: 'b7', thai: 'ปาก', meaning: '嘴巴', category: 'body' },
  { id: 'b8', thai: 'ฟัน', meaning: '牙齒', category: 'body' },
  { id: 'b9', thai: 'คอ', meaning: '脖子', category: 'body' },
  { id: 'b10', thai: 'ไหล่', meaning: '肩膀', category: 'body' },
  { id: 'b11', thai: 'แขน', meaning: '手臂', category: 'body' },
  { id: 'b12', thai: 'มือ', meaning: '手', category: 'body' },
  { id: 'b13', thai: 'นิ้ว', meaning: '手指', category: 'body' },
  { id: 'b14', thai: 'หลัง', meaning: '背', category: 'body' },
  { id: 'b15', thai: 'ท้อง', meaning: '肚子', category: 'body' },
  { id: 'b16', thai: 'ขา', meaning: '腿', category: 'body' },
  { id: 'b17', thai: 'เข่า', meaning: '膝蓋', category: 'body' },
  { id: 'b18', thai: 'เท้า', meaning: '腳', category: 'body' },
  { id: 'b19', thai: 'หัวใจ', meaning: '心臟', category: 'body' },
  { id: 'b20', thai: 'เล็บ', meaning: '指甲', category: 'body' },
  { id: 'b21', thai: 'เลือด', meaning: '血', category: 'body' },
  { id: 'b22', thai: 'กระดูก', meaning: '骨頭', category: 'body' },
  { id: 'b23', thai: 'ผิวหนัง', meaning: '皮膚', category: 'body' },
  { id: 'b24', thai: 'ข้อเท้า', meaning: '腳踝', category: 'body' },
  { id: 'b25', thai: 'ข้อมือ', meaning: '手腕', category: 'body' },
  { id: 'b26', thai: 'ข้อศอก', meaning: '手肘', category: 'body' },
  { id: 'b27', thai: 'หน้าอก', meaning: '胸部', category: 'body' },
  { id: 'b28', thai: 'คอหอย', meaning: '喉嚨', category: 'body' },
  { id: 'b29', thai: 'ลิ้น', meaning: '舌頭', category: 'body' },
  { id: 'b30', thai: 'สมอง', meaning: '大腦', category: 'body' },
  { id: 'b31', thai: 'ปอด', meaning: '肺', category: 'body' },
  { id: 'b32', thai: 'ตับ', meaning: '肝', category: 'body' },
  { id: 'b33', thai: 'เอว', meaning: '腰', category: 'body' },
  { id: 'b34', thai: 'สะโพก', meaning: '臀部', category: 'body' },
  { id: 'b35', thai: 'คิ้ว', meaning: '眉毛', category: 'body' },

  // 動物
  { id: 'a1', thai: 'สัตว์', meaning: '動物', category: 'animal' },
  { id: 'a2', thai: 'หมา', meaning: '狗', category: 'animal' },
  { id: 'a3', thai: 'แมว', meaning: '貓', category: 'animal' },
  { id: 'a4', thai: 'ช้าง', meaning: '大象', category: 'animal' },
  { id: 'a5', thai: 'เสือ', meaning: '老虎', category: 'animal' },
  { id: 'a6', thai: 'สิงโต', meaning: '獅子', category: 'animal' },
  { id: 'a7', thai: 'หมี', meaning: '熊', category: 'animal' },
  { id: 'a8', thai: 'ลิง', meaning: '猴子', category: 'animal' },
  { id: 'a9', thai: 'นก', meaning: '鳥', category: 'animal' },
  { id: 'a10', thai: 'ปลา', meaning: '魚', category: 'animal' },
  { id: 'a11', thai: 'งู', meaning: '蛇', category: 'animal' },
  { id: 'a12', thai: 'ม้า', meaning: '馬', category: 'animal' },
  { id: 'a13', thai: 'วัว', meaning: '牛', category: 'animal' },
  { id: 'a14', thai: 'หมู', meaning: '豬', category: 'animal' },
  { id: 'a15', thai: 'ไก่', meaning: '雞', category: 'animal' },
  { id: 'a16', thai: 'เป็ด', meaning: '鴨', category: 'animal' },
  { id: 'a17', thai: 'กบ', meaning: '青蛙', category: 'animal' },
  { id: 'a18', thai: 'ผึ้ง', meaning: '蜜蜂', category: 'animal' },
  { id: 'a19', thai: 'แมงมุม', meaning: '蜘蛛', category: 'animal' },
  { id: 'a20', thai: 'จระเข้', meaning: '鱷魚', category: 'animal' },
  { id: 'a21', thai: 'ผีเสื้อ', meaning: '蝴蝶', category: 'animal' },
  { id: 'a22', thai: 'มด', meaning: '螞蟻', category: 'animal' },
  { id: 'a23', thai: 'ยุง', meaning: '蚊子', category: 'animal' },
  { id: 'a24', thai: 'ควาย', meaning: '水牛', category: 'animal' },
  { id: 'a25', thai: 'นกฮูก', meaning: '貓頭鷹', category: 'animal' },
  { id: 'a26', thai: 'นกอินทรี', meaning: '老鷹', category: 'animal' },
  { id: 'a27', thai: 'กระต่าย', meaning: '兔子', category: 'animal' },
  { id: 'a28', thai: 'เต่า', meaning: '烏龜', category: 'animal' },
  { id: 'a29', thai: 'ปลาวาฬ', meaning: '鯨魚', category: 'animal' },
  { id: 'a30', thai: 'ฉลาม', meaning: '鯊魚', category: 'animal' },
  { id: 'a31', thai: 'ปู', meaning: '螃蟹', category: 'animal' },
  { id: 'a32', thai: 'หอย', meaning: '貝殼', category: 'animal' },
  { id: 'a33', thai: 'จิ้งจก', meaning: '蜥蜴', category: 'animal' },
  { id: 'a34', thai: 'ม้าลาย', meaning: '斑馬', category: 'animal' },
  { id: 'a35', thai: 'แพะ', meaning: '山羊', category: 'animal' },

  ...LESSONS_EXT,
  ...LESSONS_EXT2,
  ...LESSONS_EXT3,
  ...LESSONS_VOCAB_PATCH,
  ...LESSONS_TONE_PAIRS,
  ...LESSONS_THEMES,
  ...LESSONS_THEMES_EXT,
  ...LESSONS_TIME_HOLIDAY,
]

/** 詞庫總數 */
export const LESSON_COUNT = LESSONS.length

/** 每輪練習題數上限 */
export const QUESTIONS_PER_ROUND = 30

export const LESSON_CATEGORIES: LessonCategory[] = [
  'greeting',
  'travel',
  'food',
  'fruit',
  'feeling',
  'emotion',
  'time',
  'holiday',
  'color',
  'object',
  'furniture',
  'body',
  'animal',
]

export function getLessonById(id: string): LessonItem | undefined {
  return LESSONS.find((l) => l.id === id)
}

export function getLessonsByCategory(category: LessonCategory): LessonItem[] {
  return LESSONS.filter((l) => l.category === category)
}

export function getCategoryCount(category: LessonCategory): number {
  return getLessonsByCategory(category).length
}

export function getPitfallLessons(): LessonItem[] {
  const ids = new Set(getPitfallLessonIds())
  return LESSONS.filter((l) => ids.has(l.id))
}

export function getTonePairLessons(): LessonItem[] {
  const ids = new Set(getTonePairLessonIds())
  return LESSONS.filter((l) => ids.has(l.id))
}

export const PITFALL_LESSON_COUNT = getPitfallLessons().length
export const TONE_PAIR_LESSON_COUNT = getTonePairLessons().length

export function getTopicLabel(topic: PracticeTopic): string {
  if (topic === 'all') return '全部隨機'
  if (topic === 'confusable') return '易混淆專練'
  if (topic === 'tonePair') return '同字異聲調'
  return CATEGORY_LABELS[topic]
}

export function getRoundSize(topic: PracticeTopic): number {
  if (topic === 'confusable') {
    return Math.min(PITFALL_LESSON_COUNT, QUESTIONS_PER_ROUND)
  }
  if (topic === 'tonePair') {
    return Math.min(TONE_PAIR_LESSON_COUNT, QUESTIONS_PER_ROUND)
  }
  const pool = topic === 'all' ? LESSONS : getLessonsByCategory(topic)
  return Math.min(pool.length, QUESTIONS_PER_ROUND)
}
