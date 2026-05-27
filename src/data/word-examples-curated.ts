import type { WordExample } from '../types'

/**
 * 覆寫 ext2/ext3 等自動產生的空泛例句，提供自然用法。
 * 合併順序須在 word-examples.ts 最末。
 */
export const WORD_EXAMPLES_CURATED: Record<string, WordExample[]> = {
  // 時間
  g41: [
    { exampleTh: 'วันนี้อากาศร้อนมาก', exampleZh: '今天天氣很熱。' },
    { exampleTh: 'วันนี้ผมเรียนภาษาไทย', exampleZh: '今天我學泰文。' },
    { exampleTh: 'วันนี้ไปไหนครับ', exampleZh: '今天要去哪裡？' },
    { exampleTh: 'วันนี้ไม่ว่าง', exampleZh: '今天沒空。' },
  ],
  g42: [
    { exampleTh: 'พรุ่งนี้ไปเชียงใหม่', exampleZh: '明天去清邁。' },
    { exampleTh: 'พรุ่งนี้ตื่นเช้า', exampleZh: '明天要早起。' },
    { exampleTh: 'พรุ่งนี้มีนัดหมอ', exampleZh: '明天有醫生預約。' },
    { exampleTh: 'พรุ่งนี้หยุดไหม', exampleZh: '明天放假嗎？' },
  ],
  g43: [
    { exampleTh: 'เมื่อวานฝนตกหนัก', exampleZh: '昨天下大雨。' },
    { exampleTh: 'เมื่อวานไปตลาด', exampleZh: '昨天去市場。' },
    { exampleTh: 'เมื่อวานพลาดรถ', exampleZh: '昨天錯過車了。' },
    { exampleTh: 'เมื่อวานเหนื่อยมาก', exampleZh: '昨天很累。' },
  ],
  g44: [
    { exampleTh: 'ตอนนี้กำลังทำอาหาร', exampleZh: '現在正在做飯。' },
    { exampleTh: 'ตอนนี้ว่างไหม', exampleZh: '現在有空嗎？' },
    { exampleTh: 'ตอนนี้รถติดมาก', exampleZh: '現在很塞車。' },
    { exampleTh: 'ตอนนี้ปิดแล้ว', exampleZh: '現在打烊了。' },
  ],
  g45: [
    { exampleTh: 'รออีกชั่วโมงนึง', exampleZh: '再等一個小時。' },
    { exampleTh: 'ใช้เวลาสองชั่วโมง', exampleZh: '花了兩個小時。' },
    { exampleTh: 'ชั่วโมงละห้าสิบบาท', exampleZh: '每小時五十銖。' },
  ],
  g46: [
    { exampleTh: 'รออีกสิบนาที', exampleZh: '再等十分鐘。' },
    { exampleTh: 'มาสายสิบนาที', exampleZh: '遲到十分鐘。' },
    { exampleTh: 'ต้มน้ำประมาณห้านาที', exampleZh: '煮水大約五分鐘。' },
  ],
  g47: [
    { exampleTh: 'กินไปครึ่งหนึ่งก็อิ่ม', exampleZh: '吃了一半就飽了。' },
    { exampleTh: 'ลดราคาครึ่งหนึ่ง', exampleZh: '打五折。' },
    { exampleTh: 'เวลาผ่านไปครึ่งชั่วโมง', exampleZh: '過了半小時。' },
  ],
  f55: [
    { exampleTh: 'ขอเครื่องดื่มเย็นๆ', exampleZh: '要冰的飲料。' },
    { exampleTh: 'เครื่องดื่มยอดนิยมคือชาเย็น', exampleZh: '最受歡迎的飲料是冰茶。' },
    { exampleTh: 'อยากดื่มเครื่องดื่มร้อน', exampleZh: '想喝熱飲。' },
  ],
  'ar30-q8': [
    {
      exampleTh: 'วันนี้ผมหิวมากจึงทำอาหารเอง ต้มซุปไก่และทอดไข่',
      exampleZh: '今天很餓，所以自己煮：煮雞湯、煎蛋。',
    },
    { exampleTh: 'ทำอาหารเอง', exampleZh: '自己煮。' },
    { exampleTh: 'ชอบทำอาหารที่บ้าน', exampleZh: '喜歡在家做菜。' },
  ],
  vp66: [
    { exampleTh: 'ทำอาหารเอง', exampleZh: '自己煮。' },
    { exampleTh: 'ตอนนี้กำลังทำอาหาร', exampleZh: '現在正在做飯。' },
    { exampleTh: 'ทำอาหารที่บ้าน', exampleZh: '在家做菜。' },
  ],
  vp67: [
    { exampleTh: 'ทำอาหารเอง', exampleZh: '自己煮。' },
    { exampleTh: 'ดูแลตัวเอง', exampleZh: '保重／照顧自己。' },
    { exampleTh: 'อย่าเกลียดตัวเอง', exampleZh: '別討厭自己。' },
  ],
  vp69: [
    { exampleTh: 'รู้สึกต้อนรับ', exampleZh: '感到受歡迎。' },
    { exampleTh: 'ยินดีต้อนรับครับ', exampleZh: '「歡迎」。' },
    {
      exampleTh: 'ชาวต่างชาติที่มาเรียนรู้วัฒนธรรมจะรู้สึกต้อนรับ',
      exampleZh: '來學文化的外國人會感到受歡迎。',
    },
  ],
  'ar19-q5': [
    {
      exampleTh: 'เจ้าหน้าที่รายงานว่าผู้ใช้งานเพิ่มขึ้นกว่าเดิมสามเท่า',
      exampleZh: '官員報告使用者比原先增加三倍。',
    },
    { exampleTh: 'ผู้ใช้งานเพิ่มขึ้น', exampleZh: '使用者增加。' },
  ],
  vp73: [
    { exampleTh: 'ผู้ใช้งานเพิ่มขึ้น', exampleZh: '使用者增加。' },
    { exampleTh: 'ผู้ใช้งานระบบ', exampleZh: '系統使用者。' },
  ],
  'ar25-q2': [
    {
      exampleTh: 'กระทรวงสาธารณสุขประกาศให้ผู้สูงอายุฉีดวัคซีนฟรีตั้งแต่เดือนหน้า',
      exampleZh: '衛生部宣布長者自下月起可免費接種疫苗。',
    },
    { exampleTh: 'ฉีดวัคซีนฟรี', exampleZh: '免費接種疫苗。' },
  ],
  vp70: [
    { exampleTh: 'ฉีดวัคซีนฟรี', exampleZh: '免費接種疫苗。' },
    { exampleTh: 'ฉีดวัคซีนป้องกันไข้หวัด', exampleZh: '接種流感疫苗。' },
  ],
  vp71: [
    { exampleTh: 'ฉีดวัคซีนฟรี', exampleZh: '免費接種疫苗。' },
    { exampleTh: 'เข้าชมฟรี', exampleZh: '免費參觀。' },
  ],
  'ar14-q7': [
    {
      exampleTh: 'ชาวต่างชาติที่มาเรียนรู้วัฒนธรรมจะรู้สึกต้อนรับและเข้าใจผู้คนมากขึ้น',
      exampleZh: '來學文化的外國人會感到受歡迎，也更理解當地人。',
    },
    { exampleTh: 'รู้สึกต้อนรับ', exampleZh: '感到受歡迎。' },
  ],
  'ar8-q6': [
    {
      exampleTh: 'ผมต้องกินยาก่อนอาหารและพักผ่อนให้เพียงพอ',
      exampleZh: '要吃藥、飯前吃，並充分休息。',
    },
    { exampleTh: 'พักผ่อนให้เพียงพอ', exampleZh: '充分休息。' },
    { exampleTh: 'วันนี้รู้สึกดีขึ้นมาก', exampleZh: '今天感覺好多了。' },
  ],
  vp64: [
    { exampleTh: 'สุดสัปดาห์พักผ่อน', exampleZh: '週末休息。' },
    { exampleTh: 'พักผ่อนให้เพียงพอ', exampleZh: '充分休息。' },
    { exampleTh: 'รู้สึกสบายหลังพักผ่อน', exampleZh: '休息後覺得舒服。' },
  ],
  vp65: [
    { exampleTh: 'พักผ่อนให้เพียงพอ', exampleZh: '充分休息。' },
    { exampleTh: 'เวลาพอไหม', exampleZh: '時間夠嗎？' },
    { exampleTh: 'เงินพอใช้', exampleZh: '錢夠用。' },
  ],
  st35: [
    { exampleTh: 'ทะเลใสมาก เห็นปลาว่ายใต้น้ำ', exampleZh: '海很清澈，看得見魚在水裡游。' },
    { exampleTh: 'ช่วงปลายปีทะเลใสน่าเล่นน้ำ', exampleZh: '年尾海水清澈，很適合玩水。' },
    { exampleTh: 'ทะเลใสและท้องฟ้าสีฟ้า', exampleZh: '海水清澈、天空很藍。' },
  ],
  ss31: [
    { exampleTh: 'ลดราคาครึ่งหนึ่ง', exampleZh: '打五折／降價一半。' },
    { exampleTh: 'ลดราคาได้ไหม', exampleZh: '可以打折嗎？' },
    { exampleTh: 'ร้านนี้ลดราคาครึ่งหนึ่ง', exampleZh: '這家店打五折。' },
  ],
  g48: [
    { exampleTh: 'ไปตลาดบ่อย', exampleZh: '常去市場。' },
    { exampleTh: 'เขาพูดคำนี้บ่อย', exampleZh: '他常說這個詞。' },
    { exampleTh: 'ฝนตกบ่อยช่วงนี้', exampleZh: '最近常下雨。' },
  ],
  g49: [
    { exampleTh: 'บางครั้งก็ลืม', exampleZh: '有時候會忘。' },
    { exampleTh: 'บางครั้งไปเดินเล่น', exampleZh: '有時候去散步。' },
    { exampleTh: 'บางครั้งกินที่ร้าน', exampleZh: '有時候在餐廳吃。' },
  ],
  g50: [
    { exampleTh: 'ทุกวันตื่นเช้า', exampleZh: '每天早起。' },
    { exampleTh: 'ออกกำลังกายทุกวัน', exampleZh: '每天運動。' },
    { exampleTh: 'ทุกวันเรียนภาษาไทย', exampleZh: '每天學泰文。' },
  ],
  // 旅遊（lessons-ext3）
  t46: [
    { exampleTh: 'นั่งรถไฟฟ้าไปสยาม', exampleZh: '搭空鐵去暹羅。' },
    { exampleTh: 'รถไฟฟ้าอยู่ที่ไหน', exampleZh: '空鐵在哪裡？' },
    { exampleTh: 'สถานีรถไฟฟ้าใกล้โรงแรม', exampleZh: '空鐵站離飯店很近。' },
    { exampleTh: 'นั่งรถไฟฟ้า BTS สะดวก', exampleZh: '搭 BTS 很方便。' },
    { exampleTh: 'รถไฟฟ้าเร็วมาก', exampleZh: '空鐵很快。' },
  ],
  t47: [
    { exampleTh: 'สายรถไฟนี้ไปเชียงใหม่', exampleZh: '這條鐵路去清邁。' },
    { exampleTh: 'สายรถไฟสีแดง', exampleZh: '紅色鐵路線。' },
    { exampleTh: 'ดูแผนที่สายรถไฟ', exampleZh: '看鐵路線地圖。' },
  ],
  t48: [
    { exampleTh: 'ซื้อตั๋วเครื่องบินออนไลน์', exampleZh: '線上買機票。' },
    { exampleTh: 'ตั๋วเครื่องบินแพงไหม', exampleZh: '機票貴嗎？' },
    { exampleTh: 'จองตั๋วเครื่องบินแล้ว', exampleZh: '機票已訂好。' },
  ],
  t49: [
    { exampleTh: 'ไปเที่ยวเกาะสมุย', exampleZh: '去蘇梅島玩。' },
    { exampleTh: 'เกาะนี้สวยมาก', exampleZh: '這座島很美。' },
    { exampleTh: 'นั่งเรือไปเกาะ', exampleZh: '坐船去島上。' },
  ],
  t50: [
    { exampleTh: 'ไปเล่นน้ำทะเล', exampleZh: '去海裡玩水。' },
    { exampleTh: 'ทะเลใสมาก', exampleZh: '海很清澈。' },
    { exampleTh: 'อาหารทะเลอร่อย', exampleZh: '海鮮很好吃。' },
  ],
  t51: [
    { exampleTh: 'ขึ้นภูเขาตอนเช้า', exampleZh: '早上爬山。' },
    { exampleTh: 'ภูเขาสูงมาก', exampleZh: '山很高。' },
    { exampleTh: 'มองภูเขาจากโรงแรม', exampleZh: '從飯店看山。' },
  ],
  t52: [
    { exampleTh: 'น้ำตกสวยมาก', exampleZh: '瀑布很美。' },
    { exampleTh: 'ไปน้ำตกวันหยุด', exampleZh: '假日去瀑布。' },
    { exampleTh: 'ถ่ายรูปที่น้ำตก', exampleZh: '在瀑布拍照。' },
  ],
  t53: [
    { exampleTh: 'จองทัวร์หนึ่งวัน', exampleZh: '訂一日遊。' },
    { exampleTh: 'ทัวร์ราคาไม่แพง', exampleZh: '旅遊團價格不貴。' },
    { exampleTh: 'ไปทัวร์กับครอบครัว', exampleZh: '跟家人參加旅遊團。' },
  ],
  t54: [
    { exampleTh: 'ไกด์พูดภาษาอังกฤษได้', exampleZh: '導遊會說英文。' },
    { exampleTh: 'ไกด์แนะนำสถานที่', exampleZh: '導遊介紹景點。' },
  ],
  t55: [
    { exampleTh: 'ถ่ายรูปด้วยกล้องถ่ายรูป', exampleZh: '用相機拍照。' },
    { exampleTh: 'กล้องถ่ายรูปหนักไหม', exampleZh: '相機重嗎？' },
  ],
  // 飲食／烹調
  f59: [
    { exampleTh: 'ผลไม้สดมาก', exampleZh: '水果很新鮮。' },
    { exampleTh: 'ซื้อผักสดจากตลาด', exampleZh: '從市場買新鮮蔬菜。' },
    { exampleTh: 'อาหารทะเลสด', exampleZh: '海鮮很新鮮。' },
  ],
  f60: [
    { exampleTh: 'ผลไม้เน่าแล้วทิ้ง', exampleZh: '水果爛了就丟掉。' },
    { exampleTh: 'อย่ากินของเน่า', exampleZh: '別吃壞掉的食物。' },
  ],
  f61: [
    { exampleTh: 'ปรุงรสชาติให้พอดี', exampleZh: '把味道調到剛好。' },
    { exampleTh: 'ปรุงอาหารด้วยตัวเอง', exampleZh: '自己煮菜。' },
    { exampleTh: 'ปรุงช้าๆ ไฟอ่อน', exampleZh: '小火慢煮。' },
  ],
  f62: [
    { exampleTh: 'ไก่ทอดกรอบ', exampleZh: '炸雞很酥脆。' },
    { exampleTh: 'ทอดไข่ดาว', exampleZh: '煎荷包蛋。' },
    { exampleTh: 'อย่าทอดนานเกินไป', exampleZh: '別炸太久。' },
  ],
  f63: [
    { exampleTh: 'ต้มน้ำให้เดือด', exampleZh: '把水煮沸。' },
    { exampleTh: 'ต้มก๋วยเตี๋ยว', exampleZh: '煮米粉。' },
    { exampleTh: 'ต้มซุปผัก', exampleZh: '煮蔬菜湯。' },
  ],
  // 短文 ar17-q2
  'ar17-q2': [
    { exampleTh: 'วันนี้ผมต้มซุปและทอดไก่', exampleZh: '今天我煮湯又炸雞。' },
    { exampleTh: 'ต้มซุปร้อนๆ อร่อยมาก', exampleZh: '熱湯很好喝。' },
    { exampleTh: 'ต้มซุปผักเย็นๆ', exampleZh: '煮了一鍋蔬菜湯。' },
    { exampleTh: 'ชอบต้มซุปมากกว่าทอด', exampleZh: '比起炸的，更喜歡煮湯。' },
  ],
  f64: [
    { exampleTh: 'ย่างปลาโล่ง', exampleZh: '烤魚。' },
    { exampleTh: 'ย่างหมูที่ตลาด', exampleZh: '在市場烤豬肉。' },
    { exampleTh: 'กลิ่นย่างหอมมาก', exampleZh: '烤肉香味很香。' },
  ],
  f65: [
    { exampleTh: 'ห่อกลับบ้านได้ไหม', exampleZh: '可以打包帶走嗎？' },
    { exampleTh: 'ห่อที่เหลือกลับบ้าน', exampleZh: '把剩下的打包回家。' },
    { exampleTh: 'ขอห่ออาหารหนึ่งที่', exampleZh: '請打包一份食物。' },
    { exampleTh: 'เรากินข้าวและห่อที่เหลือ', exampleZh: '我們吃飯並打包剩下的。' },
    { exampleTh: 'ห่อกลับบ้านกินต่อ', exampleZh: '打包回家繼續吃。' },
  ],
  // 句子 sd36（累但好玩；สนุก≠感動）
  sd36: [
    { exampleTh: 'วันนี้เหนื่อยแต่สนุก', exampleZh: '今天很累但很好玩。' },
    { exampleTh: 'วันนี้เหนื่อยมาก', exampleZh: '今天很累。' },
    { exampleTh: 'เหนื่อยแต่สนุกมาก', exampleZh: '累但很有趣。' },
  ],
  // 句子 sd41（聽歌後感動；≠ sd36）
  sd41: [
    { exampleTh: 'ฟังเพลงแล้วตื้นตัน', exampleZh: '聽完歌很受感動。' },
    { exampleTh: 'ฟังเพลงไทยทุกวัน', exampleZh: '每天聽泰文歌。' },
    { exampleTh: 'หนังเรื่องนี้ทำให้ตื้นตัน', exampleZh: '這部電影令人深受感動。' },
  ],
  em23: [
    { exampleTh: 'ฟังเพลงแล้วตื้นตัน', exampleZh: '聽完歌很受感動。' },
    { exampleTh: 'หนังเรื่องนี้ทำให้ตื้นตัน', exampleZh: '這部電影令人深受感動。' },
    { exampleTh: 'เรื่องนี้ทำให้ตื้นตันมาก', exampleZh: '這件事讓人非常感動。' },
  ],
  // 句子 sf43
  sf43: [
    { exampleTh: 'ผลไม้สดหลากหลาย', exampleZh: '新鮮水果很多樣。' },
    { exampleTh: 'ตลาดมีผลไม้สดหลากหลาย', exampleZh: '市場有新鮮多樣的水果。' },
    { exampleTh: 'ผลไม้สดหลากหลายและราคาไม่แพง', exampleZh: '水果新鮮多樣，價格不貴。' },
  ],
  // vp27 เหลือ＝剩下（勿與 ช่วยเหลือ 混淆）
  vp27: [
    { exampleTh: 'ห่อที่เหลือกลับบ้าน', exampleZh: '把剩下的打包回家。' },
    { exampleTh: 'อาหารเหลือเยอะมาก', exampleZh: '剩了很多食物。' },
    {
      exampleTh: 'เรากินข้าวร่วมกันและห่อที่เหลือไว้กินพรุ่งนี้',
      exampleZh: '我們一起吃飯，打包剩下的明天再吃。（摘自〈假日煮飯〉）',
    },
    { exampleTh: 'เหลือเงินไม่พอ', exampleZh: '剩下的錢不夠。' },
    { exampleTh: 'ยังเหลือเวลาอีกนิด', exampleZh: '還剩一點時間。' },
    { exampleTh: 'เรากินข้าวและห่อที่เหลือ', exampleZh: '我們吃飯並打包剩下的。' },
  ],
  vp28: [
    { exampleTh: 'ขอบคุณที่ช่วยเหลือ', exampleZh: '謝謝你的幫忙。' },
    { exampleTh: 'เพื่อนร่วมงานช่วยเหลือผมมาก', exampleZh: '同事幫了我很多。' },
    { exampleTh: 'ยินดีช่วยเหลือ', exampleZh: '樂意幫忙。' },
  ],
  vp29: [
    { exampleTh: 'ฉันต้องการความช่วยเหลือ', exampleZh: '我需要協助。' },
    {
      exampleTh: 'บางคำจำไม่ได้ก็ขอความช่วยเหลือจากเพื่อน',
      exampleZh: '有的字記不住就向朋友求助。',
    },
    { exampleTh: 'เปิดศูนย์ช่วยเหลือ', exampleZh: '開設救援中心。' },
  ],
  // 學習動詞（lessons-ext3 o56–o65）
  o56: [
    { exampleTh: 'ฉันฝึกภาษาไทยทุกวัน', exampleZh: '我每天練泰文。' },
    { exampleTh: 'ฝึกพูดทุกวัน', exampleZh: '每天練說話。' },
    { exampleTh: 'ฝึกฟังเพลงไทย', exampleZh: '練聽泰文歌。' },
    { exampleTh: 'ฝึกฟังทุกวัน', exampleZh: '每天練聽力。' },
    { exampleTh: 'เป็นโอกาสดีในการฝึกภาษาไทย', exampleZh: '是練泰文的好機會。' },
  ],
  o57: [
    { exampleTh: 'เรียนภาษาไทย', exampleZh: '學泰文。' },
    { exampleTh: 'เรียนอยู่ที่ไหน', exampleZh: '在哪裡讀書？' },
    { exampleTh: 'เรียนทุกวันหลังเลิกงาน', exampleZh: '每天下班後學習。' },
    { exampleTh: 'อยากเรียนต่อ', exampleZh: '想繼續讀書／學。' },
  ],
  o58: [
    { exampleTh: 'ครูสอนช้าๆ', exampleZh: '老師教得慢。' },
    { exampleTh: 'สอนภาษาไทยให้ชาวต่างชาติ', exampleZh: '教外國人泰文。' },
    { exampleTh: 'สอนภาษาไทย', exampleZh: '教泰文。' },
  ],
  o59: [
    { exampleTh: 'ทดสอบภาษาไทย', exampleZh: '測驗泰文。' },
    { exampleTh: 'มีการทดสอบพรุ่งนี้', exampleZh: '明天有測驗。' },
  ],
  o60: [
    { exampleTh: 'สอบภาษาไทยพรุ่งนี้', exampleZh: '明天考泰文。' },
    { exampleTh: 'สอบผ่านแล้ว', exampleZh: '考試通過了。' },
    { exampleTh: 'ขอโชคดีสอบ', exampleZh: '祝你考試順利。' },
  ],
  o61: [
    { exampleTh: 'ผ่านการสอบแล้ว', exampleZh: '通過考試了。' },
    { exampleTh: 'ผ่านแล้วขอบคุณ', exampleZh: '通過了，謝謝。' },
  ],
  o62: [
    { exampleTh: 'สอบตกแล้วต้องซ้อน', exampleZh: '不及格要複習。' },
    { exampleTh: 'ไม่อยากสอบตก', exampleZh: '不想不及格。' },
  ],
  o63: [
    { exampleTh: 'ซ้อนบทเรียนทุกวัน', exampleZh: '每天複習課程。' },
    { exampleTh: 'ซ้อนทุกวันหลังเรียน', exampleZh: '每天上完課複習。' },
  ],
  o64: [
    { exampleTh: 'แปลเป็นภาษาไทย', exampleZh: '翻譯成泰文。' },
    { exampleTh: 'ช่วยแปลให้หน่อย', exampleZh: '幫我翻譯一下。' },
  ],
  o65: [
    { exampleTh: 'อธิบายคำศัพท์ใหม่', exampleZh: '解釋新單字。' },
    { exampleTh: 'ครูอธิบายช้าๆ', exampleZh: '老師慢慢解釋。' },
  ],
  f56: [
    { exampleTh: 'อ่านคำศัพท์ใหม่', exampleZh: '讀新單字。' },
    { exampleTh: 'คำศัพท์ใหม่ยาก', exampleZh: '新單字很難。' },
  ],
  f57: [
    { exampleTh: 'เรียนคำใหม่ทุกวัน', exampleZh: '每天學新詞。' },
    { exampleTh: 'คำใหม่เยอะมาก', exampleZh: '新詞很多。' },
  ],
  f58: [
    { exampleTh: 'ของเก่าแต่ยังใช้ได้', exampleZh: '舊的但還能用。' },
    { exampleTh: 'หนังสือเล่มเก่า', exampleZh: '舊書。' },
  ],
  c41: [
    { exampleTh: 'ชอบสีสว่าง', exampleZh: '喜歡亮色。' },
    { exampleTh: 'สีสว่างดูสดใส', exampleZh: '亮色看起來鮮明。' },
  ],
  c42: [
    { exampleTh: 'ชอบสีมืด', exampleZh: '喜歡暗色。' },
    { exampleTh: 'สีมืดดูสงบ', exampleZh: '暗色看起來沉穩。' },
  ],
  c43: [
    { exampleTh: 'สีธรรมชาติดูสบายตา', exampleZh: '自然色看起來舒服。' },
  ],
  c44: [
    { exampleTh: 'สีพาสเทลอ่อนสวย', exampleZh: '淺粉彩色很美。' },
  ],
  c45: [
    { exampleTh: 'สีโทนกลางดูเรียบ', exampleZh: '中性色調看起來素雅。' },
  ],
  // 詞庫補充 vp59
  vp59: [
    { exampleTh: 'ขึ้นรถไฟตอนเช้า', exampleZh: '早上搭電車。' },
    { exampleTh: 'ลุกขึ้นแล้วเวียนหัว', exampleZh: '站起來會頭暈。' },
    { exampleTh: 'ราคาเพิ่มขึ้น', exampleZh: '價格上漲。' },
    { exampleTh: 'ขึ้นบันไดชั้นสอง', exampleZh: '上二樓樓梯。' },
    { exampleTh: 'รู้สึกดีขึ้นมาก', exampleZh: '感覺好多了。' },
    { exampleTh: 'ขึ้นภูเขาตอนเช้า', exampleZh: '早上爬山。' },
  ],
  // 記憶／溝通動詞（ext2，覆寫模板例句）
  o46: [
    { exampleTh: 'ลืมกุญแจที่บ้าน', exampleZh: '把鑰匙忘在家裡。' },
    { exampleTh: 'อย่าลืมนัดหมอ', exampleZh: '別忘了醫生預約。' },
    { exampleTh: 'ลืมชื่อเขาแล้ว', exampleZh: '忘記他的名字了。' },
    { exampleTh: 'ลืมไม่ลงเลย', exampleZh: '怎麼也忘不了。' },
  ],
  o47: [
    { exampleTh: 'จำชื่อเขาไม่ได้', exampleZh: '記不起他的名字。' },
    { exampleTh: 'จำไว้ในใจนะ', exampleZh: '記在心裡喔。' },
    { exampleTh: 'จำได้แล้วขอบคุณ', exampleZh: '想起來了，謝謝。' },
    { exampleTh: 'บางคำจำไม่ได้ก็ถามเพื่อน', exampleZh: '有些詞記不住就問朋友。' },
    { exampleTh: 'จำไม่ได้ก็เขียนไว้', exampleZh: '記不住就寫下來。' },
    { exampleTh: 'ประสบการณ์น่าจดจำ', exampleZh: '難忘的經歷。' },
  ],
  o48: [
    { exampleTh: 'พูดช้าๆ หน่อย', exampleZh: '請說慢一點。' },
    { exampleTh: 'พูดภาษาไทยได้ไหม', exampleZh: '會說泰文嗎？' },
    { exampleTh: 'พูดคุยกับเพื่อน', exampleZh: '跟朋友聊天。' },
    { exampleTh: 'พูดเบาๆ หน่อย', exampleZh: '小聲一點說。' },
  ],
  o49: [
    { exampleTh: 'ฟังเพลงไทยทุกวัน', exampleZh: '每天聽泰文歌。' },
    { exampleTh: 'ฟังไม่เข้าใจ', exampleZh: '聽不懂。' },
    { exampleTh: 'ฟังครูอธิบาย', exampleZh: '聽老師解釋。' },
    { exampleTh: 'ฟังแล้วจำได้เร็ว', exampleZh: '聽了記得快。' },
  ],
  o50: [
    { exampleTh: 'อ่านหนังสือทุกคืน', exampleZh: '每晚看書。' },
    { exampleTh: 'อ่านคำศัพท์ใหม่', exampleZh: '讀新單字。' },
    { exampleTh: 'อ่านช้าๆ หน่อย', exampleZh: '請讀慢一點。' },
    { exampleTh: 'อ่านป้ายถนน', exampleZh: '看路標。' },
  ],
  o51: [
    { exampleTh: 'เขียนชื่อภาษาไทย', exampleZh: '寫泰文名字。' },
    { exampleTh: 'เขียนการบ้าน', exampleZh: '寫作業。' },
    { exampleTh: 'เขียนช้าๆ ให้อ่านได้', exampleZh: '寫慢一點讓人看得懂。' },
  ],
  o52: [
    { exampleTh: 'คิดว่าพรุ่งนี้ฝนตก', exampleZh: '覺得明天會下雨。' },
    { exampleTh: 'คิดมากไป', exampleZh: '想太多了。' },
    { exampleTh: 'คิดถึงบ้าน', exampleZh: '想家。' },
  ],
  o53: [
    { exampleTh: 'รู้แล้วขอบคุณ', exampleZh: '知道了，謝謝。' },
    { exampleTh: 'รู้ทางไปสถานี', exampleZh: '知道去車站的路。' },
    { exampleTh: 'ไม่รู้จะทำยังไง', exampleZh: '不知道該怎麼辦。' },
  ],
  o54: [
    { exampleTh: 'เข้าใจแล้วครับ', exampleZh: '我懂了。' },
    { exampleTh: 'เข้าใจผิด', exampleZh: '誤會了。' },
    { exampleTh: 'เข้าใจภาษาไทยมากขึ้น', exampleZh: '更懂泰文了。' },
    { exampleTh: 'เข้าใจผู้คนมากขึ้น', exampleZh: '更理解人們了。' },
  ],
  o55: [
    { exampleTh: 'ช่วยหน่อยได้ไหม', exampleZh: '可以幫一下嗎？' },
    { exampleTh: 'ช่วยเหลือกัน', exampleZh: '互相幫忙。' },
    { exampleTh: 'ขอความช่วยเหลือ', exampleZh: '請求協助。' },
    { exampleTh: 'ช่วยแปลให้หน่อย', exampleZh: '幫我翻譯一下。' },
  ],
  // ext4 電器類（新 id）
  o76: [
    { exampleTh: 'แบตเตอรี่หมดแล้ว', exampleZh: '電池沒電了。' },
    { exampleTh: 'ซื้อแบตเตอรี่ใหม่', exampleZh: '買新電池。' },
  ],
  o77: [
    { exampleTh: 'ปลั๊กไฟอยู่ตรงไหน', exampleZh: '插座在哪裡？' },
    { exampleTh: 'เสียบปลั๊กไฟก่อน', exampleZh: '先插上插座。' },
  ],
  o78: [
    { exampleTh: 'ถ่ายรูปด้วยกล้อง', exampleZh: '用相機拍照。' },
    { exampleTh: 'กล้องมือถือชัดมาก', exampleZh: '手機相機很清晰。' },
  ],
  // lessons-ext（word-examples-ext 模板句覆寫）
  g21: [
    { exampleTh: 'ยินดีด้วยที่ได้งานใหม่', exampleZh: '恭喜找到新工作。' },
    { exampleTh: 'ยินดีด้วยครับ', exampleZh: '恭喜啊。' },
    { exampleTh: 'ยินดีด้วยที่สอบผ่าน', exampleZh: '恭喜考試通過。' },
  ],
  g22: [
    { exampleTh: 'ขอให้โชคดี', exampleZh: '祝你好運。' },
    { exampleTh: 'โชคดีนะ', exampleZh: '祝好運喔。' },
    { exampleTh: 'วันนี้โชคดีมาก', exampleZh: '今天很幸運。' },
  ],
  g23: [
    { exampleTh: 'ขอให้หายเร็วๆ นะ', exampleZh: '祝你早日康復。' },
    { exampleTh: 'หายป่วยเร็วๆ', exampleZh: '快點好起來。' },
  ],
  g24: [
    { exampleTh: 'สุขสันต์วันเกิด', exampleZh: '生日快樂。' },
    { exampleTh: 'ขอให้มีความสุขมากๆ', exampleZh: '祝你幸福快樂。' },
  ],
  g25: [
    { exampleTh: 'ยินดีครับ', exampleZh: '樂意／好的。' },
    { exampleTh: 'ยินดีช่วย', exampleZh: '很樂意幫忙。' },
  ],
  g26: [
    { exampleTh: 'รอสักครู่นะครับ', exampleZh: '請稍等一下。' },
    { exampleTh: 'รอแป๊บนึง', exampleZh: '等一下下。' },
  ],
  g28: [
    { exampleTh: 'ไม่เป็นไรนะ ไม่ต้องกังวล', exampleZh: '沒關係，別擔心。' },
    { exampleTh: 'ไม่เป็นไรครับ', exampleZh: '沒關係。' },
  ],
  g29: [
    { exampleTh: 'ขอโชคดีในการสอบ', exampleZh: '祝你考試順利。' },
    { exampleTh: 'ขอโชคดีนะ', exampleZh: '祝你好運喔。' },
  ],
  g30: [
    { exampleTh: 'ยินดีที่ได้ช่วยครับ', exampleZh: '很高興能幫忙。' },
    { exampleTh: 'ยินดีเสมอ', exampleZh: '隨時樂意幫忙。' },
  ],
  t26: [
    { exampleTh: 'สถานีอยู่ตรงไหน', exampleZh: '車站在哪裡？' },
    { exampleTh: 'ลงที่สถานีนี้', exampleZh: '在這站下車。' },
    { exampleTh: 'สถานีรถไฟฟ้าใกล้โรงแรม', exampleZh: '空鐵站離飯店很近。' },
  ],
  t27: [
    { exampleTh: 'อ่านป้ายทางไปสนามบิน', exampleZh: '看指標去機場。' },
    { exampleTh: 'ป้ายบอกทางชัดเจน', exampleZh: '路標很清楚。' },
  ],
  t28: [
    { exampleTh: 'จองห้องพักแล้วครับ', exampleZh: '已訂好房間。' },
    { exampleTh: 'จองทัวร์หนึ่งวัน', exampleZh: '訂一日遊。' },
    { exampleTh: 'ฉันมีการจองห้อง', exampleZh: '我有訂房。' },
    { exampleTh: 'จองโต๊ะก่อนได้ไหม', exampleZh: '可以先訂位嗎？' },
    { exampleTh: 'จองตั๋วเครื่องบินแล้ว', exampleZh: '機票已訂好。' },
    { exampleTh: 'จองล่วงหน้าสองวัน', exampleZh: '提前兩天預訂。' },
  ],
  t29: [
    { exampleTh: 'รถบัสหยุดตรงนี้', exampleZh: '公車在這裡停。' },
    { exampleTh: 'หยุดพักสักครู่', exampleZh: '停一下休息。' },
    { exampleTh: 'หยุดตรงป้าย', exampleZh: '在站牌停下。' },
  ],
  t30: [
    { exampleTh: 'เปลี่ยนเส้นทางไปตลาด', exampleZh: '改道去市場。' },
    { exampleTh: 'เปลี่ยนใจแล้ว', exampleZh: '改變主意了。' },
    { exampleTh: 'เปลี่ยนเงินที่ธนาคาร', exampleZh: '在銀行換錢。' },
  ],
  t31: [
    { exampleTh: 'เดินทางตรงไปสถานี', exampleZh: '直走到車站。' },
    { exampleTh: 'ทางตรงไปถนนใหญ่', exampleZh: '直走到大馬路。' },
  ],
  t32: [
    { exampleTh: 'ถนนคนเยอะมาก', exampleZh: '街上人很多。' },
    { exampleTh: 'ข้ามถนนระวังรถ', exampleZh: '過馬路小心車子。' },
  ],
  t33: [
    { exampleTh: 'ไปรัฐสถานทูตยื่นวีซ่า', exampleZh: '去大使館辦簽證。' },
    { exampleTh: 'รัฐสถานทูตปิดวันอาทิตย์', exampleZh: '大使館週日休息。' },
  ],
  t34: [
    { exampleTh: 'กรณีฉุกเฉินโทรหนึ่งเก้า', exampleZh: '緊急情況打 191。' },
    { exampleTh: 'ห้องฉุกเฉินอยู่ชั้นหนึ่ง', exampleZh: '急診室在一樓。' },
  ],
  t35: [
    { exampleTh: 'ซื้อประกันภัยการเดินทาง', exampleZh: '買旅遊保險。' },
    { exampleTh: 'ประกันภัยครอบคลุมอุบัติเหตุ', exampleZh: '保險含意外險。' },
  ],
  f36: [
    { exampleTh: 'ขอสั่งอาหารหนึ่งจาน', exampleZh: '我要點一道菜。' },
    { exampleTh: 'สั่งข้าวผัด', exampleZh: '點炒飯。' },
    { exampleTh: 'ฉันอยากสั่งอาหาร', exampleZh: '我想點餐。' },
  ],
  f37: [
    { exampleTh: 'เช็คบิลหน่อยครับ', exampleZh: '買單。' },
    { exampleTh: 'ขอเช็คบิลได้ไหม', exampleZh: '可以結帳嗎？' },
  ],
  f38: [
    { exampleTh: 'ให้ทิปพนักงาน', exampleZh: '給服務生小費。' },
    { exampleTh: 'ทิปเท่าไหร่ดี', exampleZh: '小費給多少好？' },
  ],
  f39: [
    { exampleTh: 'รอเสิร์ฟอาหาร', exampleZh: '等上菜。' },
    { exampleTh: 'เสิร์ฟช้านิดหน่อย', exampleZh: '上菜有點慢。' },
  ],
  f40: [
    { exampleTh: 'ปรุงรสให้เผ็ดน้อย', exampleZh: '調味少辣一點。' },
    { exampleTh: 'ปรุงรสชาติพอดี', exampleZh: '味道調得剛好。' },
  ],
  f41: [
    { exampleTh: 'กินบุฟเฟ่ต์ได้ไม่จำกัด', exampleZh: '自助餐吃到飽。' },
    { exampleTh: 'บุฟเฟ่ต์มีผลไม้ด้วย', exampleZh: '自助餐也有水果。' },
  ],
  f42: [
    { exampleTh: 'อาหารจานหลักมาแล้ว', exampleZh: '主菜來了。' },
    { exampleTh: 'ขออาหารจานหลักกุ้ง', exampleZh: '主菜要蝦的。' },
  ],
  f43: [
    { exampleTh: 'ของหวานหลังอาหาร', exampleZh: '飯後甜點。' },
    { exampleTh: 'ขอของหวานหนึ่งที่', exampleZh: '甜點要一份。' },
  ],
  f44: [
    { exampleTh: 'ขอน้ำเปล่าหนึ่งขวด', exampleZh: '請給一瓶白開水。' },
    { exampleTh: 'ดื่มน้ำเปล่าเยอะๆ', exampleZh: '多喝白開水。' },
  ],
  f45: [
    { exampleTh: 'กินข้าวร้อนๆ อร่อยกว่า', exampleZh: '熱飯比較好吃。' },
    { exampleTh: 'เสิร์ฟอาหารร้อนๆ', exampleZh: '熱菜上桌。' },
  ],
  h18: [
    { exampleTh: 'ในห้องน้ำมีอ่างล้างหน้า', exampleZh: '浴室裡有洗手台。' },
    { exampleTh: 'ล้างจานที่อ่างล้างหน้า', exampleZh: '在洗手台洗碗。' },
    { exampleTh: 'อ่างล้างหน้ารั่วต้องซ่อม', exampleZh: '洗手台漏水要修理。' },
    { exampleTh: 'ช่วยย้ายอ่างล้างหน้าหน่อย', exampleZh: '請幫忙移一下洗手台。' },
  ],
  // lessons-ext2 家具（覆寫 ext2 模板例句）
  h41: [
    { exampleTh: 'อย่าลืมเอากุญแจบ้าน', exampleZh: '別忘了帶家門鑰匙。' },
    { exampleTh: 'กุญแจบ้านหาย', exampleZh: '家門鑰匙不見了。' },
  ],
  h42: [
    { exampleTh: 'ติดตั้งกล้องวงจรปิด', exampleZh: '安裝監視器。' },
    { exampleTh: 'กล้องวงจรปิดช่วยดูบ้าน', exampleZh: '監視器幫忙看家。' },
  ],
  h43: [
    { exampleTh: 'ใช้เครื่องดูดฝุ่นทำความสะอาด', exampleZh: '用吸塵器打掃。' },
    { exampleTh: 'เครื่องดูดฝุ่นเสียงดัง', exampleZh: '吸塵器很吵。' },
  ],
  h44: [
    { exampleTh: 'รีดเสื้อด้วยเตารีด', exampleZh: '用熨斗燙衣服。' },
    { exampleTh: 'เตารีดร้อนระวังมือ', exampleZh: '熨斗很燙，小心手。' },
  ],
  h46: [
    { exampleTh: 'ซักผ้าในถังซักผ้า', exampleZh: '在洗衣盆裡洗衣服。' },
    { exampleTh: 'ใส่น้ำยาซักผ้าในถัง', exampleZh: '在盆裡加洗衣精。' },
    { exampleTh: 'ถังซักผ้าอยู่ห้องน้ำ', exampleZh: '洗衣盆在浴室。' },
    { exampleTh: 'แช่ผ้าในถังซักผ้า', exampleZh: '把衣服泡在洗衣盆裡。' },
    { exampleTh: 'ถังซักผ้าใหญ่มาก', exampleZh: '洗衣盆很大。' },
  ],
  h47: [
    { exampleTh: 'นั่งบนที่รองนั่ง', exampleZh: '坐在坐墊上。' },
    { exampleTh: 'ที่รองนั่งนุ่มมาก', exampleZh: '坐墊很軟。' },
  ],
  h48: [
    { exampleTh: 'พิงหมอนรองนั่ง', exampleZh: '靠著靠墊。' },
    { exampleTh: 'หมอนรองนั่งอยู่โซฟา', exampleZh: '靠墊在沙發上。' },
  ],
  h49: [
    { exampleTh: 'เปิดโคมไฟตั้งพื้น', exampleZh: '打開落地燈。' },
    { exampleTh: 'โคมไฟตั้งพื้นสว่างดี', exampleZh: '落地燈很亮。' },
  ],
  h50: [
    { exampleTh: 'ดูตัวเองในกระจกเงา', exampleZh: '在穿衣鏡前看自己。' },
    { exampleTh: 'กระจกเงาอยู่ห้องนอน', exampleZh: '穿衣鏡在臥室。' },
  ],
  // lessons-ext3 海鮮／動物（覆寫 ext3 模板例句）
  a56: [
    { exampleTh: 'ปลาหมึกยักษ์ตัวใหญ่มาก', exampleZh: '大章魚非常大隻。' },
    { exampleTh: 'เห็นปลาหมึกยักษ์ในพิพิธภัณฑ์', exampleZh: '在博物館看到大章魚。' },
    { exampleTh: 'ปลาหมึกยักษ์อยู่ทะเลลึก', exampleZh: '大章魚住在深海。' },
  ],
  a57: [
    { exampleTh: 'ปลาไหลย่างซีอิ๊วอร่อย', exampleZh: '烤鰻魚淋醬油很好吃。' },
    { exampleTh: 'สั่งปลาไหลต้มยำ', exampleZh: '點了冬陰鰻魚。' },
    { exampleTh: 'ปลาไหลขายที่ตลาด', exampleZh: '市場有賣鰻魚。' },
  ],
  a58: [
    { exampleTh: 'สั่งปูม้าต้มน้ำปลา', exampleZh: '點了花蟹魚露煮。' },
    { exampleTh: 'ปูม้าสดมาก', exampleZh: '花蟹很新鮮。' },
    { exampleTh: 'ปูม้าใหญ่สองตัว', exampleZh: '兩隻大花蟹。' },
  ],
  a59: [
    { exampleTh: 'กุ้งมังกรย่างเนย', exampleZh: '奶油烤龍蝦。' },
    { exampleTh: 'กุ้งมังกรแพงมาก', exampleZh: '龍蝦很貴。' },
    { exampleTh: 'สั่งกุ้งมังกรหนึ่งตัว', exampleZh: '點了一隻龍蝦。' },
  ],
  a60: [
    { exampleTh: 'กินหอยนางรมสดๆ ที่ร้านอาหารทะเล', exampleZh: '在海鮮餐廳吃生蠔。' },
    { exampleTh: 'หอยนางรมตัวใหญ่มาก', exampleZh: '牡蠣很大顆。' },
    { exampleTh: 'สั่งหอยนางรมนึ่งหนึ่งโหล', exampleZh: '點了一打蒸牡蠣。' },
    { exampleTh: 'ชอบกินหอยนางรมบริสุทธิ์', exampleZh: '喜歡吃原味牡蠣。' },
    { exampleTh: 'หอยนางรมสดวันนี้', exampleZh: '今天的牡蠣很新鮮。' },
  ],
  a61: [
    { exampleTh: 'นกฟีนิกซ์เป็นสัตว์ในตำนาน', exampleZh: '鳳凰是傳說中的動物。' },
    { exampleTh: 'เรื่องราวของนกฟีนิกซ์', exampleZh: '關於鳳凰的故事。' },
  ],
  a63: [
    { exampleTh: 'สิงโตทะเลว่ายน้ำเก่ง', exampleZh: '海獅很會游泳。' },
    { exampleTh: 'ดูสิงโตทะเลที่สวนสัตว์', exampleZh: '在動物園看海獅。' },
  ],
  a64: [
    { exampleTh: 'วาฬว่ายผ่านทะเล', exampleZh: '鯨魚游過大海。' },
    { exampleTh: 'เห็นวาฬจากเรือ', exampleZh: '從船上看到鯨魚。' },
  ],
  a65: [
    { exampleTh: 'ปลากัดสีสวยมาก', exampleZh: '鬥魚顏色很漂亮。' },
    { exampleTh: 'เลี้ยงปลากัดในตู้ปลา', exampleZh: '在魚缸養鬥魚。' },
    { exampleTh: 'ปลากัดชอบอยู่ลำพัง', exampleZh: '鬥魚喜歡獨處。' },
  ],
  // 短文 ar5-q3
  'ar5-q3': [
    {
      exampleTh: 'ของฝางทำด้วยมือสวยงาม',
      exampleZh: '手工紀念品很漂亮。（摘自〈清邁之旅〉）',
    },
    {
      exampleTh: 'มีร้านของฝางทำด้วยมือมากมาย',
      exampleZh: '有很多賣手工紀念品的店。',
    },
    { exampleTh: 'ชอบของทำด้วยมือ', exampleZh: '喜歡手工製品。' },
  ],
  // 短文 ar7-q5
  'ar7-q5': [
    {
      exampleTh: 'ผมดูป้ายและเดินทางตรงไปทางออกที่ต้องการ ถ้าไม่แน่ใจก็ถามเจ้าหน้าที่ได้',
      exampleZh: '我看標示並直走到要的出口，不確定時可以問工作人員。（摘自〈搭 BTS 逛曼谷〉）',
    },
    { exampleTh: 'ถามเจ้าหน้าที่ทางออก', exampleZh: '問工作人員出口在哪。' },
    { exampleTh: 'ไม่แน่ใจถามเจ้าหน้าที่', exampleZh: '不確定就問工作人員。' },
  ],
  // 短文 ar15-q3
  'ar15-q3': [
    {
      exampleTh: 'ตอนเช้าเรานั่งเรือไปเกาะเล็กๆ ถ่ายรูปน้ำตกและกินอาหารทะเลสด',
      exampleZh: '早上我們搭船去小島，拍瀑布照片並吃新鮮海鮮。（摘自〈普吉島的海灘〉）',
    },
    { exampleTh: 'นั่งเรือไปเกาะ', exampleZh: '坐船去島上。' },
  ],
  // 短文 ar13-q1
  'ar13-q1': [
    {
      exampleTh: 'เช้านี้เรานั่งเรือจากท่าเรือไปเกาะเล็กๆ ลมแรงแต่ทะเลสวยมาก',
      exampleZh: '早上我們從碼頭搭船去小島，風很大但海很美。（摘自〈搭船去島嶼〉）',
    },
    { exampleTh: 'นั่งเรือจากท่าเรือ', exampleZh: '從碼頭搭船。' },
  ],
  // 短文 ar18-q3
  'ar18-q3': [
    {
      exampleTh: 'นักท่องเที่ยวนั่งเรือเล็กๆ ดูวิถีชีวิตและซื้อของฝาก',
      exampleZh: '遊客坐小船看當地生活並買伴手禮。（摘自〈水上市場〉）',
    },
    { exampleTh: 'นั่งเรือเล็กๆ ชมวิว', exampleZh: '坐小船看風景。' },
  ],
  // 短文 ar7-q6
  'ar7-q6': [
    {
      exampleTh: 'ตอนเย็นผมเปลี่ยนเส้นทางไปตลาด กินอาหารร้อนๆ และซื้อของฝากกลับบ้าน',
      exampleZh: '傍晚我改路線去市場，吃了熱騰騰的食物並買伴手禮回家。（摘自〈搭 BTS 逛曼谷〉）',
    },
    { exampleTh: 'เปลี่ยนเส้นทางไปตลาด', exampleZh: '改道去市場。' },
    { exampleTh: 'รถติดเลยเปลี่ยนเส้นทาง', exampleZh: '塞車所以改走別條路。' },
  ],
  // 短文 ar19-q1
  'ar19-q1': [
    {
      exampleTh: 'ข่าวล่าสุด — รัฐบาลเปิดเว็บไซต์ใหม่สำหรับบริการประชาชนออนไลน์',
      exampleZh: '最新消息——政府推出新的線上便民網站。',
    },
    { exampleTh: 'ข่าวล่าสุดพูดถึงอะไร', exampleZh: '最新消息在說什麼？' },
    { exampleTh: 'ดูข่าวล่าสุดในแอป', exampleZh: '在 app 看最新消息。' },
  ],
  // 短文 ar29-q8
  'ar29-q8': [
    {
      exampleTh: 'สุดสัปดาห์นี้เราขับรถไปเชียงใหม่',
      exampleZh: '這週末我們開車去清邁。',
    },
    { exampleTh: 'สุดสัปดาห์พักผ่อน', exampleZh: '週末休息。' },
    { exampleTh: 'สุดสัปดาห์ไปตลาด', exampleZh: '週末去市場。' },
  ],
  // 短文 ar15-q2
  'ar15-q2': [
    {
      exampleTh: 'ครอบครัวของเราไปเที่ยวภูเก็ต ทะเลใสและท้องฟ้าสีฟ้าสวยมาก',
      exampleZh: '我們全家去普吉島，海水清澈、藍天很美。',
    },
    { exampleTh: 'ทะเลใสมาก เห็นปลาว่ายใต้น้ำ', exampleZh: '海很清澈，看得見魚在水裡游。' },
    { exampleTh: 'ช่วงปลายปีทะเลใสน่าเล่นน้ำ', exampleZh: '年尾海水清澈，很適合玩水。' },
  ],
  // 短文 ar32-q3
  'ar32-q3': [
    {
      exampleTh: 'ผู้สูงอายุและเด็กเล็กระวังเป็นลมแดด มีอาการเวียนหัวและเหงื่อออกมาก',
      exampleZh: '長者與幼童要防中暑，可能頭暈、流很多汗。',
    },
    {
      exampleTh: 'อากาศร้อนจัด ระวังเป็นลมแดด',
      exampleZh: '天氣酷熱，小心中暑。',
    },
    {
      exampleTh: 'อย่าออกแดดนาน ระวังเป็นลมแดด',
      exampleZh: '別曬太久，小心中暑。',
    },
  ],
}
