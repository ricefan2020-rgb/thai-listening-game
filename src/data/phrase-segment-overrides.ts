/** 短文／短語分詞解釋（人工校訂，優先於自動切分） */
export const PHRASE_SEGMENT_OVERRIDES: Record<
  string,
  { thai: string; meaning: string }[]
> = {
  มาถึงกรุงเทพเป็นครั้งแรก: [
    { thai: 'มา', meaning: '来' },
    { thai: 'ถึง', meaning: '到' },
    { thai: 'กรุงเทพ', meaning: '曼谷' },
    { thai: 'เป็น', meaning: '是（表狀態）' },
    { thai: 'ครั้งแรก', meaning: '第一次' },
  ],
  อากาศร้อนมาก: [
    { thai: 'อากาศ', meaning: '天氣' },
    { thai: 'ร้อน', meaning: '熱' },
    { thai: 'มาก', meaning: '很／非常' },
  ],
  ผู้คนเป็นมิตรมาก: [
    { thai: 'ผู้คน', meaning: '人們' },
    { thai: 'เป็นมิตร', meaning: '友善' },
    { thai: 'มาก', meaning: '非常' },
  ],
  สถาปัตยกรรมสวยงามมาก: [
    { thai: 'สถาปัตยกรรม', meaning: '建築' },
    { thai: 'สวยงาม', meaning: '美麗' },
    { thai: 'มาก', meaning: '非常' },
  ],
  ไปตลาดนัด: [
    { thai: 'ไป', meaning: '去' },
    { thai: 'ตลาดนัด', meaning: '夜市' },
  ],
  ไปสวนสัตว์: [
    { thai: 'ไป', meaning: '去' },
    { thai: 'สวนสัตว์', meaning: '動物園' },
  ],
  เตือนประชาชน: [
    { thai: 'เตือน', meaning: '提醒／警告' },
    { thai: 'ประชาชน', meaning: '民眾' },
  ],
  สอนช้าๆ: [
    { thai: 'สอน', meaning: '教' },
    { thai: 'ช้าๆ', meaning: '慢慢地' },
  ],
  หายใจไม่ทัน: [
    { thai: 'หายใจ', meaning: '呼吸' },
    { thai: 'ไม่', meaning: '不' },
    { thai: 'ทัน', meaning: '來得及（與ไม่連用＝來不及）' },
  ],
  ขับรถไปเชียงใหม่: [
    { thai: 'ขับรถ', meaning: '開車' },
    { thai: 'ไป', meaning: '去' },
    { thai: 'เชียงใหม่', meaning: '清邁' },
  ],
  ยืนยันการชำระเงิน: [
    { thai: 'ยืนยัน', meaning: '確認' },
    { thai: 'การ', meaning: '……之行／事（名詞化）' },
    { thai: 'ชำระเงิน', meaning: '付款' },
  ],
  ชำระเงิน: [{ thai: 'ชำระเงิน', meaning: '付款' }],
  ตรวจสอบรายการ: [
    { thai: 'ตรวจสอบ', meaning: '查核' },
    { thai: 'รายการ', meaning: '項目／明細' },
  ],
  พูดช้าๆ: [
    { thai: 'พูด', meaning: '說' },
    { thai: 'ช้าๆ', meaning: '慢慢地' },
  ],
  บริการประชาชนออนไลน์: [
    { thai: 'บริการ', meaning: '服務' },
    { thai: 'ประชาชน', meaning: '民眾' },
    { thai: 'ออนไลน์', meaning: '線上' },
  ],
  ไปโรงพยาบาล: [
    { thai: 'ไป', meaning: '去' },
    { thai: 'โรงพยาบาล', meaning: '醫院' },
  ],
  ไปดูหนัง: [
    { thai: 'ไป', meaning: '去' },
    { thai: 'ดูหนัง', meaning: '看電影' },
  ],
  รสชาติอร่อยมาก: [
    { thai: 'รสชาติ', meaning: '味道' },
    { thai: 'อร่อย', meaning: '好吃' },
    { thai: 'มาก', meaning: '非常' },
  ],
  ชอบมะม่วงเป็นพิเศษ: [
    { thai: 'ชอบ', meaning: '喜歡' },
    { thai: 'มะม่วง', meaning: '芒果' },
    { thai: 'เป็นพิเศษ', meaning: '特別' },
  ],
  อยากเรียนภาษาไทยต่อไป: [
    { thai: 'อยาก', meaning: '想' },
    { thai: 'เรียน', meaning: '學' },
    { thai: 'ภาษา', meaning: '語言' },
    { thai: 'ไทย', meaning: '泰' },
    { thai: 'ต่อไป', meaning: '繼續' },
  ],
  ออกกำลังกายที่สวนสาธารณะ: [
    { thai: 'ออกกำลังกาย', meaning: '運動' },
    { thai: 'ที่', meaning: '在' },
    { thai: 'สวนสาธารณะ', meaning: '公園' },
  ],
  รู้สึกสงบและผ่อนคลาย: [
    { thai: 'รู้สึก', meaning: '感覺' },
    { thai: 'สงบ', meaning: '平靜' },
    { thai: 'และ', meaning: '和' },
    { thai: 'ผ่อนคลาย', meaning: '放鬆' },
  ],
  กินอาหารเย็นด้วยกัน: [
    { thai: 'กิน', meaning: '吃' },
    { thai: 'อาหารเย็น', meaning: '晚餐' },
    { thai: 'ด้วยกัน', meaning: '一起' },
  ],
  ไปกินข้าวด้วยกัน: [
    { thai: 'ไป', meaning: '去' },
    { thai: 'กิน', meaning: '吃' },
    { thai: 'ข้าว', meaning: '飯／用餐' },
    { thai: 'ด้วยกัน', meaning: '一起' },
  ],
  ภาษาไทยและอังกฤษ: [
    { thai: 'ภาษาไทย', meaning: '泰文' },
    { thai: 'และ', meaning: '和' },
    { thai: 'อังกฤษ', meaning: '英文' },
  ],
  'ภาษาไทย และ อังกฤษ': [
    { thai: 'ภาษาไทย', meaning: '泰文' },
    { thai: 'และ', meaning: '和' },
    { thai: 'อังกฤษ', meaning: '英文' },
  ],
  หลังเลิกงาน: [
    { thai: 'หลัง', meaning: '在……之後' },
    { thai: 'เลิกงาน', meaning: '下班' },
  ],
  รดน้ำดำหัวผู้ใหญ่: [
    { thai: 'รดน้ำดำหัว', meaning: '潑水祝福（澆頭）' },
    { thai: 'ผู้ใหญ่', meaning: '長輩' },
  ],
  รดน้ำดำหัวขอพร: [
    { thai: 'รดน้ำดำหัว', meaning: '潑水祝福（澆頭）' },
    { thai: 'ขอพร', meaning: '祈求祝福' },
  ],
  อาหารเช้ามีหลากหลายมาก: [
    { thai: 'อาหารเช้า', meaning: '早餐' },
    { thai: 'มี', meaning: '有' },
    { thai: 'หลากหลาย', meaning: '多樣' },
    { thai: 'มาก', meaning: '非常' },
  ],
  ข้าวเหนียวกับหมูปิ้ง: [
    { thai: 'ข้าวเหนียว', meaning: '糯米飯' },
    { thai: 'กับ', meaning: '和／配' },
    { thai: 'หมูปิ้ง', meaning: '烤豬' },
  ],
  อากาศเย็นกว่ากรุงเทพ: [
    { thai: 'อากาศ', meaning: '天氣' },
    { thai: 'เย็น', meaning: '涼' },
    { thai: 'กว่า', meaning: '比……' },
    { thai: 'กรุงเทพ', meaning: '曼谷' },
  ],
  ควรไหว้ด้วยความเคารพ: [
    { thai: 'ควร', meaning: '應該' },
    { thai: 'ไหว้', meaning: '合十禮' },
    { thai: 'ด้วย', meaning: '以……方式' },
    { thai: 'ความ', meaning: '……性' },
    { thai: 'เคารพ', meaning: '尊敬' },
  ],
  แสดงถึงความสุภาพ: [
    { thai: 'แสดง', meaning: '展現／表示' },
    { thai: 'ถึง', meaning: '到／向' },
    { thai: 'ความ', meaning: '……性' },
    { thai: 'สุภาพ', meaning: '禮貌' },
  ],
  การทักทายเป็นสิ่งสำคัญ: [
    { thai: 'การทักทาย', meaning: '問候' },
    { thai: 'เป็น', meaning: '是' },
    { thai: 'สิ่งสำคัญ', meaning: '重要的事' },
  ],
  เรียนรู้วัฒนธรรมท้องถิ่น: [
    { thai: 'เรียนรู้', meaning: '學習／了解' },
    { thai: 'วัฒนธรรม', meaning: '文化' },
    { thai: 'ท้องถิ่น', meaning: '當地' },
  ],
  เรียนรู้วัฒนธรรม: [
    { thai: 'เรียนรู้', meaning: '學習／了解' },
    { thai: 'วัฒนธรรม', meaning: '文化' },
  ],
  ดูวิถีชีวิต: [
    { thai: 'ดู', meaning: '看' },
    { thai: 'วิถี', meaning: '方式／生活' },
    { thai: 'ชีวิต', meaning: '生命／生活' },
  ],
  อาหารพื้นเมือง: [
    { thai: 'อาหาร', meaning: '食物' },
    { thai: 'พื้น', meaning: '當地／本土' },
    { thai: 'เมือง', meaning: '地方' },
  ],
  สร้างความสัมพันธ์: [
    { thai: 'สร้าง', meaning: '建立' },
    { thai: 'ความ', meaning: '……性' },
    { thai: 'สัมพันธ์', meaning: '關係' },
  ],
  ฉันต้องการความช่วยเหลือ: [
    { thai: 'ฉัน', meaning: '我' },
    { thai: 'ต้องการ', meaning: '需要' },
    { thai: 'ความช่วยเหลือ', meaning: '協助／幫助' },
  ],
  ต้องการความช่วยเหลือ: [
    { thai: 'ต้องการ', meaning: '需要' },
    { thai: 'ความช่วยเหลือ', meaning: '協助' },
  ],
  เปิดรับสมัคร: [
    { thai: 'เปิด', meaning: '開放' },
    { thai: 'รับ', meaning: '接受' },
    { thai: 'สมัคร', meaning: '報名' },
  ],
  รองรับผู้โดยสาร: [
    { thai: 'รองรับ', meaning: '容納／因應' },
    { thai: 'ผู้โดยสาร', meaning: '乘客' },
  ],
  เพิ่มรถบีทีเอส: [
    { thai: 'เพิ่ม', meaning: '增加' },
    { thai: 'รถ', meaning: '車／班次' },
    { thai: 'บีทีเอส', meaning: 'BTS' },
  ],
  ช่วงเร่งด่วน: [
    { thai: 'ช่วง', meaning: '時段' },
    { thai: 'เร่งด่วน', meaning: '尖峰／緊急' },
  ],
  ผู้คนหนาแน่น: [
    { thai: 'ผู้คน', meaning: '人們' },
    { thai: 'หนาแน่น', meaning: '擁擠' },
  ],
  วางแผนเผื่อเวลา: [
    { thai: 'วางแผน', meaning: '規劃' },
    { thai: 'เผื่อ', meaning: '預留' },
    { thai: 'เวลา', meaning: '時間' },
  ],
  ใช้บัตรแรบบิท: [
    { thai: 'ใช้', meaning: '使用' },
    { thai: 'บัตร', meaning: '卡' },
    { thai: 'แรบบิท', meaning: 'Rabbit（卡名）' },
  ],
  ตรวจสอบข้อมูล: [
    { thai: 'ตรวจสอบ', meaning: '查核／查詢' },
    { thai: 'ข้อมูล', meaning: '資訊' },
  ],
  เติมก่อนวันที่มีผล: [
    { thai: 'เติม', meaning: '加（油）' },
    { thai: 'ก่อน', meaning: '之前' },
    { thai: 'วันที่', meaning: '……之日' },
    { thai: 'มีผล', meaning: '生效' },
  ],
  ราคาน้ำมันปรับขึ้น: [
    { thai: 'ราคา', meaning: '價格' },
    { thai: 'น้ำมัน', meaning: '汽油' },
    { thai: 'ปรับขึ้น', meaning: '上調' },
  ],
  แจ้งลูกค้าล่วงหน้า: [
    { thai: 'แจ้ง', meaning: '通知' },
    { thai: 'ลูกค้า', meaning: '顧客' },
    { thai: 'ล่วงหน้า', meaning: '事先' },
  ],
  กังวลค่าใช้จ่าย: [
    { thai: 'กังวล', meaning: '擔心' },
    { thai: 'ค่าใช้จ่าย', meaning: '支出' },
  ],
  หนึ่งบาทต่อลิตร: [
    { thai: 'หนึ่ง', meaning: '一' },
    { thai: 'บาท', meaning: '泰銖' },
    { thai: 'ต่อ', meaning: '每' },
    { thai: 'ลิตร', meaning: '公升' },
  ],
  อัตราเข้าพักสูง: [
    { thai: 'อัตรา', meaning: '比率／率' },
    { thai: 'เข้าพัก', meaning: '入住' },
    { thai: 'สูง', meaning: '高' },
  ],
  นักท่องเที่ยวเพิ่มขึ้น: [
    { thai: 'นักท่องเที่ยว', meaning: '遊客' },
    { thai: 'เพิ่มขึ้น', meaning: '增加' },
  ],
  เพิ่มขึ้นอย่างต่อเนื่อง: [
    { thai: 'เพิ่มขึ้น', meaning: '增加' },
    { thai: 'อย่าง', meaning: '……地' },
    { thai: 'ต่อเนื่อง', meaning: '持續' },
  ],
  ช่วงวันหยุดยาว: [
    { thai: 'ช่วง', meaning: '時段' },
    { thai: 'วันหยุด', meaning: '假日' },
    { thai: 'ยาว', meaning: '長' },
  ],
  ช่วงเช้า: [
    { thai: 'ช่วง', meaning: '時段' },
    { thai: 'เช้า', meaning: '早晨／上午' },
  ],
  ช่วงกลางคืน: [
    { thai: 'ช่วง', meaning: '時段' },
    { thai: 'กลางคืน', meaning: '夜間' },
  ],
  ตอนเช้า: [
    { thai: 'ตอน', meaning: '時候' },
    { thai: 'เช้า', meaning: '早晨' },
  ],
  ราวตากผ้า: [
    { thai: 'ราว', meaning: '桿／架' },
    { thai: 'ตาก', meaning: '曬（乾）' },
    { thai: 'ผ้า', meaning: '布／衣服' },
  ],
  อ่างล้างหน้า: [
    { thai: 'อ่าง', meaning: '盆／槽' },
    { thai: 'ล้าง', meaning: '洗' },
    { thai: 'หน้า', meaning: '臉' },
  ],
  ถังซักผ้า: [
    { thai: 'ถัง', meaning: '桶／盆' },
    { thai: 'ซัก', meaning: '洗' },
    { thai: 'ผ้า', meaning: '布／衣服' },
  ],
  ซักผ้า: [
    { thai: 'ซัก', meaning: '洗' },
    { thai: 'ผ้า', meaning: '衣服' },
  ],
  รถไฟฟ้า: [
    { thai: 'รถ', meaning: '車' },
    { thai: 'ไฟฟ้า', meaning: '電／電力' },
  ],
  ฝึกภาษาไทย: [
    { thai: 'ฝึก', meaning: '練習' },
    { thai: 'ภาษา', meaning: '語言' },
    { thai: 'ไทย', meaning: '泰' },
  ],
  ฝึกฟัง: [
    { thai: 'ฝึก', meaning: '練習' },
    { thai: 'ฟัง', meaning: '聽' },
  ],
  ฝึกพูด: [
    { thai: 'ฝึก', meaning: '練習' },
    { thai: 'พูด', meaning: '說' },
  ],
  ซ้อนบทเรียน: [
    { thai: 'ซ้อน', meaning: '複習' },
    { thai: 'บทเรียน', meaning: '課程' },
  ],
  นั่งรถไฟฟ้า: [
    { thai: 'นั่ง', meaning: '坐／搭乘' },
    { thai: 'รถไฟฟ้า', meaning: '空鐵／地鐵' },
  ],
  'นั่งรถไฟฟ้า BTS': [
    { thai: 'นั่ง', meaning: '搭乘' },
    { thai: 'รถไฟฟ้า', meaning: '空鐵' },
    { thai: 'BTS', meaning: 'BTS（空鐵）' },
  ],
  วันขึ้นปีใหม่: [
    { thai: 'วัน', meaning: '日' },
    { thai: 'ขึ้น', meaning: '跨入／開始' },
    { thai: 'ปีใหม่', meaning: '新年' },
  ],
  ตากผ้า: [
    { thai: 'ตาก', meaning: '曬（乾）' },
    { thai: 'ผ้า', meaning: '衣服' },
  ],
  เมืองท่องเที่ยวหลัก: [
    { thai: 'เมือง', meaning: '城市' },
    { thai: 'ท่องเที่ยว', meaning: '觀光' },
    { thai: 'หลัก', meaning: '主要' },
  ],
  รายได้จากการท่องเที่ยว: [
    { thai: 'รายได้', meaning: '收入' },
    { thai: 'จาก', meaning: '來自' },
    { thai: 'การท่องเที่ยว', meaning: '觀光' },
  ],
  นักท่องเที่ยวต่างชาติ: [
    { thai: 'นักท่องเที่ยว', meaning: '遊客' },
    { thai: 'ต่างชาติ', meaning: '外國' },
  ],
  กระตุ้นเศรษฐกิจ: [
    { thai: 'กระตุ้น', meaning: '帶動／刺激' },
    { thai: 'เศรษฐกิจ', meaning: '經濟' },
  ],
  // lessons-ext3 海鮮／動物複合詞
  ปลาหมึกยักษ์: [
    { thai: 'ปลา', meaning: '魚' },
    { thai: 'หมึก', meaning: '墨魚／章魚' },
    { thai: 'ยักษ์', meaning: '巨大' },
  ],
  ปลาไหล: [
    { thai: 'ปลา', meaning: '魚' },
    { thai: 'ไหล', meaning: '鰻（蛇形魚）' },
  ],
  ปูม้า: [
    { thai: 'ปู', meaning: '蟹' },
    { thai: 'ม้า', meaning: '馬（此處為花蟹俗稱用字）' },
  ],
  กุ้งมังกร: [
    { thai: 'กุ้ง', meaning: '蝦' },
    { thai: 'มังกร', meaning: '龍' },
  ],
  หอยนางรม: [
    { thai: 'หอย', meaning: '貝／螺' },
    { thai: 'นางรม', meaning: '牡蠣（字面：海女／珍珠貝）' },
  ],
  สิงโตทะเล: [
    { thai: 'สิงโต', meaning: '獅子' },
    { thai: 'ทะเล', meaning: '海' },
  ],
  ปลากัด: [
    { thai: 'ปลา', meaning: '魚' },
    { thai: 'กัด', meaning: '咬（好鬥）' },
  ],
}
