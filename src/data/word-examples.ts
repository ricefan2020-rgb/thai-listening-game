import type { WordExample } from '../types'
import { WORD_EXAMPLES_EXT } from './word-examples-ext'
import { WORD_EXAMPLES_EXT2 } from './word-examples-ext2'
import { WORD_EXAMPLES_EXT3 } from './word-examples-ext3'
import { WORD_EXAMPLES_VOCAB_PATCH } from './word-examples-vocab-patch'
import { WORD_EXAMPLES_TONE_PAIRS } from './word-examples-tone-pairs'
import { WORD_EXAMPLES_THEMES } from './word-examples-themes'
import { WORD_EXAMPLES_THEMES_EXT } from './word-examples-themes-ext'
import { WORD_EXAMPLES_TIME_HOLIDAY } from './word-examples-time-holiday'

/** 每詞 2 則例句 */
export const WORD_EXAMPLES: Record<string, WordExample[]> = {
  'g1': [
    { exampleTh: 'สวัสดีครับ ยินดีที่ได้รู้จัก', exampleZh: '你好，很高興認識你。' },
    { exampleTh: 'สวัสดีตอนเช้าทุกคน', exampleZh: '大家早安。' },
  ],
  'g2': [
    { exampleTh: 'ขอบคุณมากครับ', exampleZh: '非常謝謝你。' },
    { exampleTh: 'ขอบคุณที่ช่วยเหลือ', exampleZh: '謝謝你的幫忙。' },
  ],
  'g3': [
    { exampleTh: 'ขอโทษครับ มาสาย', exampleZh: '對不起，我遲到了。' },
    { exampleTh: 'ขอโทษที่รบกวน', exampleZh: '打擾了，不好意思。' },
  ],
  'g4': [
    { exampleTh: 'ตอนเจอเพื่อนผมพูดว่าไม่เป็นไร', exampleZh: '跟朋友見面時我說「沒關係」。' },
    { exampleTh: 'ไม่เป็นไรครับ ยินดีที่ได้พบ', exampleZh: '「沒關係」，很高興見到你。' },
  ],
  'g5': [
    { exampleTh: 'ตอนเจอเพื่อนผมพูดว่าลาก่อน', exampleZh: '跟朋友見面時我說「再見」。' },
    { exampleTh: 'ลาก่อนครับ ยินดีที่ได้พบ', exampleZh: '「再見」，很高興見到你。' },
  ],
  'g6': [
    { exampleTh: 'ตอนเจอเพื่อนผมพูดว่าใช่', exampleZh: '跟朋友見面時我說「是」。' },
    { exampleTh: 'ใช่ครับ ยินดีที่ได้พบ', exampleZh: '「是」，很高興見到你。' },
  ],
  'g7': [
    { exampleTh: 'ตอนเจอเพื่อนผมพูดว่าไม่', exampleZh: '跟朋友見面時我說「不是」。' },
    { exampleTh: 'ไม่ครับ ยินดีที่ได้พบ', exampleZh: '「不是」，很高興見到你。' },
  ],
  'g8': [
    { exampleTh: 'สบายดีไหมครับ', exampleZh: '你好嗎？' },
    { exampleTh: 'วันนี้สบายดีไหม', exampleZh: '今天還好嗎？' },
  ],
  'g9': [
    { exampleTh: 'ผมสบายดี ขอบคุณ', exampleZh: '我很好，謝謝。' },
    { exampleTh: 'สบายดีมากครับ', exampleZh: '我非常好。' },
  ],
  'g10': [
    { exampleTh: 'ตอนเจอเพื่อนผมพูดว่ายินดีที่ได้รู้จัก', exampleZh: '跟朋友見面時我說「很高興認識你」。' },
    { exampleTh: 'ยินดีที่ได้รู้จักครับ ยินดีที่ได้พบ', exampleZh: '「很高興認識你」，很高興見到你。' },
  ],
  'g11': [
    { exampleTh: 'ตอนเจอเพื่อนผมพูดว่าสวัสดีตอนเช้า', exampleZh: '跟朋友見面時我說「早安」。' },
    { exampleTh: 'สวัสดีตอนเช้าครับ ยินดีที่ได้พบ', exampleZh: '「早安」，很高興見到你。' },
  ],
  'g12': [
    { exampleTh: 'ตอนเจอเพื่อนผมพูดว่าราตรีสวัสดิ์', exampleZh: '跟朋友見面時我說「晚安」。' },
    { exampleTh: 'ราตรีสวัสดิ์ครับ ยินดีที่ได้พบ', exampleZh: '「晚安」，很高興見到你。' },
  ],
  'g13': [
    { exampleTh: 'ตอนเจอเพื่อนผมพูดว่ายินดีต้อนรับ', exampleZh: '跟朋友見面時我說「歡迎」。' },
    { exampleTh: 'ยินดีต้อนรับครับ ยินดีที่ได้พบ', exampleZh: '「歡迎」，很高興見到你。' },
  ],
  'g14': [
    { exampleTh: 'ตอนเจอเพื่อนผมพูดว่าไม่ต้องห่วง', exampleZh: '跟朋友見面時我說「別擔心」。' },
    { exampleTh: 'ไม่ต้องห่วงครับ ยินดีที่ได้พบ', exampleZh: '「別擔心」，很高興見到你。' },
  ],
  'g15': [
    { exampleTh: 'ตอนเจอเพื่อนผมพูดว่าได้เลย', exampleZh: '跟朋友見面時我說「可以／沒問題」。' },
    { exampleTh: 'ได้เลยครับ ยินดีที่ได้พบ', exampleZh: '「可以／沒問題」，很高興見到你。' },
  ],
  'g16': [
    { exampleTh: 'ตอนเจอเพื่อนผมพูดว่าโปรด', exampleZh: '跟朋友見面時我說「請（客氣）」。' },
    { exampleTh: 'โปรดครับ ยินดีที่ได้พบ', exampleZh: '「請（客氣）」，很高興見到你。' },
  ],
  'g17': [
    { exampleTh: 'ตอนเจอเพื่อนผมพูดว่าขอแนะนำตัว', exampleZh: '跟朋友見面時我說「讓我自我介紹」。' },
    { exampleTh: 'ขอแนะนำตัวครับ ยินดีที่ได้พบ', exampleZh: '「讓我自我介紹」，很高興見到你。' },
  ],
  'g18': [
    { exampleTh: 'ตอนเจอเพื่อนผมพูดว่าเชิญ', exampleZh: '跟朋友見面時我說「請／別客氣」。' },
    { exampleTh: 'เชิญครับ ยินดีที่ได้พบ', exampleZh: '「請／別客氣」，很高興見到你。' },
  ],
  'g19': [
    { exampleTh: 'ตอนเจอเพื่อนผมพูดว่าดูแลตัวเอง', exampleZh: '跟朋友見面時我說「保重」。' },
    { exampleTh: 'ดูแลตัวเองครับ ยินดีที่ได้พบ', exampleZh: '「保重」，很高興見到你。' },
  ],
  'g20': [
    { exampleTh: 'ตอนเจอเพื่อนผมพูดว่าไม่เห็นกันนาน', exampleZh: '跟朋友見面時我說「好久不見」。' },
    { exampleTh: 'ไม่เห็นกันนานครับ ยินดีที่ได้พบ', exampleZh: '「好久不見」，很高興見到你。' },
  ],
  't1': [
    { exampleTh: 'ขอถามหน่อยครับ อาหารอยู่ที่ไหน', exampleZh: '請問「食物」在哪裡？' },
    { exampleTh: 'ตอนเที่ยวเมืองไทยใช้คำว่าอาหารบ่อย', exampleZh: '在泰國旅遊時常常用到「食物」。' },
  ],
  't2': [
    { exampleTh: 'ขอถามหน่อยครับ น้ำอยู่ที่ไหน', exampleZh: '請問「水」在哪裡？' },
    { exampleTh: 'ตอนเที่ยวเมืองไทยใช้คำว่าน้ำบ่อย', exampleZh: '在泰國旅遊時常常用到「水」。' },
  ],
  't3': [
    { exampleTh: 'ขอถามหน่อยครับ ห้องน้ำอยู่ที่ไหน', exampleZh: '請問「洗手間」在哪裡？' },
    { exampleTh: 'ตอนเที่ยวเมืองไทยใช้คำว่าห้องน้ำบ่อย', exampleZh: '在泰國旅遊時常常用到「洗手間」。' },
  ],
  't4': [
    { exampleTh: 'อันนี้เท่าไหร่ครับ', exampleZh: '這個多少錢？' },
    { exampleTh: 'ราคาเท่าไหร่', exampleZh: '價格多少？' },
  ],
  't5': [
    { exampleTh: 'ขอถามหน่อยครับ ช่วยด้วยอยู่ที่ไหน', exampleZh: '請問「救命／幫忙」在哪裡？' },
    { exampleTh: 'ตอนเที่ยวเมืองไทยใช้คำว่าช่วยด้วยบ่อย', exampleZh: '在泰國旅遊時常常用到「救命／幫忙」。' },
  ],
  't6': [
    { exampleTh: 'ขอถามหน่อยครับ แผนที่อยู่ที่ไหน', exampleZh: '請問「地圖」在哪裡？' },
    { exampleTh: 'ตอนเที่ยวเมืองไทยใช้คำว่าแผนที่บ่อย', exampleZh: '在泰國旅遊時常常用到「地圖」。' },
  ],
  't7': [
    { exampleTh: 'ขอถามหน่อยครับ โรงแรมอยู่ที่ไหน', exampleZh: '請問「飯店」在哪裡？' },
    { exampleTh: 'ตอนเที่ยวเมืองไทยใช้คำว่าโรงแรมบ่อย', exampleZh: '在泰國旅遊時常常用到「飯店」。' },
  ],
  't8': [
    { exampleTh: 'ขอถามหน่อยครับ สนามบินอยู่ที่ไหน', exampleZh: '請問「機場」在哪裡？' },
    { exampleTh: 'ตอนเที่ยวเมืองไทยใช้คำว่าสนามบินบ่อย', exampleZh: '在泰國旅遊時常常用到「機場」。' },
  ],
  't9': [
    { exampleTh: 'ขอถามหน่อยครับ ตั๋วอยู่ที่ไหน', exampleZh: '請問「票」在哪裡？' },
    { exampleTh: 'ตอนเที่ยวเมืองไทยใช้คำว่าตั๋วบ่อย', exampleZh: '在泰國旅遊時常常用到「票」。' },
  ],
  't10': [
    { exampleTh: 'ขอถามหน่อยครับ อร่อยอยู่ที่ไหน', exampleZh: '請問「好吃」在哪裡？' },
    { exampleTh: 'ตอนเที่ยวเมืองไทยใช้คำว่าอร่อยบ่อย', exampleZh: '在泰國旅遊時常常用到「好吃」。' },
  ],
  't11': [
    { exampleTh: 'ขอถามหน่อยครับ แท็กซี่อยู่ที่ไหน', exampleZh: '請問「計程車」在哪裡？' },
    { exampleTh: 'ตอนเที่ยวเมืองไทยใช้คำว่าแท็กซี่บ่อย', exampleZh: '在泰國旅遊時常常用到「計程車」。' },
  ],
  't12': [
    { exampleTh: 'ขอถามหน่อยครับ รถเมล์อยู่ที่ไหน', exampleZh: '請問「公車」在哪裡？' },
    { exampleTh: 'ตอนเที่ยวเมืองไทยใช้คำว่ารถเมล์บ่อย', exampleZh: '在泰國旅遊時常常用到「公車」。' },
  ],
  't13': [
    { exampleTh: 'ขอถามหน่อยครับ รถไฟอยู่ที่ไหน', exampleZh: '請問「火車」在哪裡？' },
    { exampleTh: 'ตอนเที่ยวเมืองไทยใช้คำว่ารถไฟบ่อย', exampleZh: '在泰國旅遊時常常用到「火車」。' },
  ],
  't14': [
    { exampleTh: 'ขอถามหน่อยครับ หนังสือเดินทางอยู่ที่ไหน', exampleZh: '請問「護照」在哪裡？' },
    { exampleTh: 'ตอนเที่ยวเมืองไทยใช้คำว่าหนังสือเดินทางบ่อย', exampleZh: '在泰國旅遊時常常用到「護照」。' },
  ],
  't15': [
    { exampleTh: 'ขอถามหน่อยครับ กระเป๋าเดินทางอยู่ที่ไหน', exampleZh: '請問「行李箱」在哪裡？' },
    { exampleTh: 'ตอนเที่ยวเมืองไทยใช้คำว่ากระเป๋าเดินทางบ่อย', exampleZh: '在泰國旅遊時常常用到「行李箱」。' },
  ],
  't16': [
    { exampleTh: 'ขอถามหน่อยครับ ซ้ายอยู่ที่ไหน', exampleZh: '請問「左邊」在哪裡？' },
    { exampleTh: 'ตอนเที่ยวเมืองไทยใช้คำว่าซ้ายบ่อย', exampleZh: '在泰國旅遊時常常用到「左邊」。' },
  ],
  't17': [
    { exampleTh: 'ขอถามหน่อยครับ ขวาอยู่ที่ไหน', exampleZh: '請問「右邊」在哪裡？' },
    { exampleTh: 'ตอนเที่ยวเมืองไทยใช้คำว่าขวาบ่อย', exampleZh: '在泰國旅遊時常常用到「右邊」。' },
  ],
  't18': [
    { exampleTh: 'ร้านอยู่ใกล้โรงแรม', exampleZh: '店在飯店附近。' },
    { exampleTh: 'บ้านใกล้ชายหาด', exampleZh: '家靠近海灘。' },
  ],
  't19': [
    { exampleTh: 'บ้านอยู่ไกลจากสนามบิน', exampleZh: '家離機場很遠。' },
    { exampleTh: 'ที่นี่ไกลเมือง', exampleZh: '這裡離市區很遠。' },
  ],
  't20': [
    { exampleTh: 'ขอถามหน่อยครับ ร้านขายยาอยู่ที่ไหน', exampleZh: '請問「藥局」在哪裡？' },
    { exampleTh: 'ตอนเที่ยวเมืองไทยใช้คำว่าร้านขายยาบ่อย', exampleZh: '在泰國旅遊時常常用到「藥局」。' },
  ],
  't21': [
    { exampleTh: 'ขอถามหน่อยครับ โรงพยาบาลอยู่ที่ไหน', exampleZh: '請問「醫院」在哪裡？' },
    { exampleTh: 'ตอนเที่ยวเมืองไทยใช้คำว่าโรงพยาบาลบ่อย', exampleZh: '在泰國旅遊時常常用到「醫院」。' },
  ],
  't22': [
    { exampleTh: 'ขอถามหน่อยครับ ชายหาดอยู่ที่ไหน', exampleZh: '請問「海灘」在哪裡？' },
    { exampleTh: 'ตอนเที่ยวเมืองไทยใช้คำว่าชายหาดบ่อย', exampleZh: '在泰國旅遊時常常用到「海灘」。' },
  ],
  't23': [
    { exampleTh: 'ขอถามหน่อยครับ วัดอยู่ที่ไหน', exampleZh: '請問「寺廟」在哪裡？' },
    { exampleTh: 'ตอนเที่ยวเมืองไทยใช้คำว่าวัดบ่อย', exampleZh: '在泰國旅遊時常常用到「寺廟」。' },
  ],
  't24': [
    { exampleTh: 'ขอถามหน่อยครับ ทางเข้าอยู่ที่ไหน', exampleZh: '請問「入口」在哪裡？' },
    { exampleTh: 'ตอนเที่ยวเมืองไทยใช้คำว่าทางเข้าบ่อย', exampleZh: '在泰國旅遊時常常用到「入口」。' },
  ],
  't25': [
    { exampleTh: 'ขอถามหน่อยครับ ทางออกอยู่ที่ไหน', exampleZh: '請問「出口」在哪裡？' },
    { exampleTh: 'ตอนเที่ยวเมืองไทยใช้คำว่าทางออกบ่อย', exampleZh: '在泰國旅遊時常常用到「出口」。' },
  ],
  'f1': [
    { exampleTh: 'ขอข้าวหนึ่งที่ครับ', exampleZh: '請給我一份「飯」。' },
    { exampleTh: 'วันนี้อยากกินข้าว', exampleZh: '今天想吃「飯」。' },
  ],
  'f2': [
    { exampleTh: 'ขอขนมหนึ่งที่ครับ', exampleZh: '請給我一份「點心」。' },
    { exampleTh: 'วันนี้อยากกินขนม', exampleZh: '今天想吃「點心」。' },
  ],
  'f3': [
    { exampleTh: 'ขอผลไม้หนึ่งที่ครับ', exampleZh: '請給我一份「水果」。' },
    { exampleTh: 'วันนี้อยากกินผลไม้', exampleZh: '今天想吃「水果」。' },
  ],
  'f4': [
    { exampleTh: 'ขอผักหนึ่งที่ครับ', exampleZh: '請給我一份「蔬菜」。' },
    { exampleTh: 'วันนี้อยากกินผัก', exampleZh: '今天想吃「蔬菜」。' },
  ],
  'f5': [
    { exampleTh: 'ขอเนื้อหนึ่งที่ครับ', exampleZh: '請給我一份「肉」。' },
    { exampleTh: 'วันนี้อยากกินเนื้อ', exampleZh: '今天想吃「肉」。' },
  ],
  'f6': [
    { exampleTh: 'ขอข้าวผัดไก่หนึ่งจาน', exampleZh: '請給我一盤雞肉炒飯。' },
    { exampleTh: 'ไก่ย่างอร่อยมาก', exampleZh: '烤雞非常好吃。' },
  ],
  'f7': [
    { exampleTh: 'ขอปลาหนึ่งที่ครับ', exampleZh: '請給我一份「魚」。' },
    { exampleTh: 'วันนี้อยากกินปลา', exampleZh: '今天想吃「魚」。' },
  ],
  'f8': [
    { exampleTh: 'ขอไข่หนึ่งที่ครับ', exampleZh: '請給我一份「蛋」。' },
    { exampleTh: 'วันนี้อยากกินไข่', exampleZh: '今天想吃「蛋」。' },
  ],
  'f9': [
    { exampleTh: 'ขอนมหนึ่งที่ครับ', exampleZh: '請給我一份「牛奶」。' },
    { exampleTh: 'วันนี้อยากกินนม', exampleZh: '今天想吃「牛奶」。' },
  ],
  'f10': [
    { exampleTh: 'ขอกาแฟหนึ่งที่ครับ', exampleZh: '請給我一份「咖啡」。' },
    { exampleTh: 'วันนี้อยากกินกาแฟ', exampleZh: '今天想吃「咖啡」。' },
  ],
  'f11': [
    { exampleTh: 'ขอชาหนึ่งที่ครับ', exampleZh: '請給我一份「茶」。' },
    { exampleTh: 'วันนี้อยากกินชา', exampleZh: '今天想吃「茶」。' },
  ],
  'f12': [
    { exampleTh: 'ขอน้ำแข็งหนึ่งที่ครับ', exampleZh: '請給我一份「冰」。' },
    { exampleTh: 'วันนี้อยากกินน้ำแข็ง', exampleZh: '今天想吃「冰」。' },
  ],
  'f13': [
    { exampleTh: 'ขอเผ็ดหนึ่งที่ครับ', exampleZh: '請給我一份「辣」。' },
    { exampleTh: 'วันนี้อยากกินเผ็ด', exampleZh: '今天想吃「辣」。' },
  ],
  'f14': [
    { exampleTh: 'ขอหวานหนึ่งที่ครับ', exampleZh: '請給我一份「甜」。' },
    { exampleTh: 'วันนี้อยากกินหวาน', exampleZh: '今天想吃「甜」。' },
  ],
  'f15': [
    { exampleTh: 'ขอเปรี้ยวหนึ่งที่ครับ', exampleZh: '請給我一份「酸」。' },
    { exampleTh: 'วันนี้อยากกินเปรี้ยว', exampleZh: '今天想吃「酸」。' },
  ],
  'f16': [
    { exampleTh: 'ขอเค็มหนึ่งที่ครับ', exampleZh: '請給我一份「鹹」。' },
    { exampleTh: 'วันนี้อยากกินเค็ม', exampleZh: '今天想吃「鹹」。' },
  ],
  'f17': [
    { exampleTh: 'ขอข้าวผัดหนึ่งที่ครับ', exampleZh: '請給我一份「炒飯」。' },
    { exampleTh: 'วันนี้อยากกินข้าวผัด', exampleZh: '今天想吃「炒飯」。' },
  ],
  'f18': [
    { exampleTh: 'ขอต้มยำหนึ่งชาม', exampleZh: '請給我一碗冬陰功。' },
    { exampleTh: 'ต้มยำเผ็ดมาก', exampleZh: '冬陰功很辣。' },
  ],
  'f19': [
    { exampleTh: 'ขอส้มตำหนึ่งที่ครับ', exampleZh: '請給我一份「青木瓜沙拉」。' },
    { exampleTh: 'วันนี้อยากกินส้มตำ', exampleZh: '今天想吃「青木瓜沙拉」。' },
  ],
  'f20': [
    { exampleTh: 'ขอก๋วยเตี๋ยวหนึ่งที่ครับ', exampleZh: '請給我一份「河粉／麵」。' },
    { exampleTh: 'วันนี้อยากกินก๋วยเตี๋ยว', exampleZh: '今天想吃「河粉／麵」。' },
  ],
  'f21': [
    { exampleTh: 'ขอน้ำซุปหนึ่งที่ครับ', exampleZh: '請給我一份「湯」。' },
    { exampleTh: 'วันนี้อยากกินน้ำซุป', exampleZh: '今天想吃「湯」。' },
  ],
  'f22': [
    { exampleTh: 'ขอน้ำตาลหนึ่งที่ครับ', exampleZh: '請給我一份「糖」。' },
    { exampleTh: 'วันนี้อยากกินน้ำตาล', exampleZh: '今天想吃「糖」。' },
  ],
  'f23': [
    { exampleTh: 'ขอเกลือหนึ่งที่ครับ', exampleZh: '請給我一份「鹽」。' },
    { exampleTh: 'วันนี้อยากกินเกลือ', exampleZh: '今天想吃「鹽」。' },
  ],
  'f24': [
    { exampleTh: 'ขอพริกหนึ่งที่ครับ', exampleZh: '請給我一份「辣椒」。' },
    { exampleTh: 'วันนี้อยากกินพริก', exampleZh: '今天想吃「辣椒」。' },
  ],
  'f25': [
    { exampleTh: 'ขอเบียร์หนึ่งที่ครับ', exampleZh: '請給我一份「啤酒」。' },
    { exampleTh: 'วันนี้อยากกินเบียร์', exampleZh: '今天想吃「啤酒」。' },
  ],
  'f26': [
    { exampleTh: 'ขอไวน์หนึ่งที่ครับ', exampleZh: '請給我一份「葡萄酒」。' },
    { exampleTh: 'วันนี้อยากกินไวน์', exampleZh: '今天想吃「葡萄酒」。' },
  ],
  'f27': [
    { exampleTh: 'ขอมะม่วงหนึ่งที่ครับ', exampleZh: '請給我一份「芒果」。' },
    { exampleTh: 'วันนี้อยากกินมะม่วง', exampleZh: '今天想吃「芒果」。' },
  ],
  'f28': [
    { exampleTh: 'ขอมะพร้าวหนึ่งที่ครับ', exampleZh: '請給我一份「椰子」。' },
    { exampleTh: 'วันนี้อยากกินมะพร้าว', exampleZh: '今天想吃「椰子」。' },
  ],
  'f29': [
    { exampleTh: 'ขอกุ้งหนึ่งที่ครับ', exampleZh: '請給我一份「蝦」。' },
    { exampleTh: 'วันนี้อยากกินกุ้ง', exampleZh: '今天想吃「蝦」。' },
  ],
  'f30': [
    { exampleTh: 'ขอหมูหนึ่งที่ครับ', exampleZh: '請給我一份「豬肉」。' },
    { exampleTh: 'วันนี้อยากกินหมู', exampleZh: '今天想吃「豬肉」。' },
  ],
  'f31': [
    { exampleTh: 'ขอมังสวิรัติหนึ่งที่ครับ', exampleZh: '請給我一份「素食」。' },
    { exampleTh: 'วันนี้อยากกินมังสวิรัติ', exampleZh: '今天想吃「素食」。' },
  ],
  'f32': [
    { exampleTh: 'ตอนนี้หิวมาก', exampleZh: '現在很餓。' },
    { exampleTh: 'หิวแล้ว ไปกินข้าวกัน', exampleZh: '餓了，去吃飯吧。' },
  ],
  'f33': [
    { exampleTh: 'กินอิ่มแล้ว ขอบคุณ', exampleZh: '吃飽了，謝謝。' },
    { exampleTh: 'อิ่มมาก ไม่ต้องกินแล้ว', exampleZh: '很飽了，不用再吃。' },
  ],
  'f34': [
    { exampleTh: 'ขอช้อนหนึ่งที่ครับ', exampleZh: '請給我一份「湯匙」。' },
    { exampleTh: 'วันนี้อยากกินช้อน', exampleZh: '今天想吃「湯匙」。' },
  ],
  'f35': [
    { exampleTh: 'ขอส้อมหนึ่งที่ครับ', exampleZh: '請給我一份「叉子」。' },
    { exampleTh: 'วันนี้อยากกินส้อม', exampleZh: '今天想吃「叉子」。' },
  ],
  'c1': [
    { exampleTh: 'ฉันชอบสีแดงมาก', exampleZh: '我很喜歡「紅色」。' },
    { exampleTh: 'เสื้อตัวนี้เป็นสีแดง', exampleZh: '這件衣服是「紅色」。' },
  ],
  'c2': [
    { exampleTh: 'ฉันชอบสีน้ำเงินมาก', exampleZh: '我很喜歡「藍色」。' },
    { exampleTh: 'เสื้อตัวนี้เป็นสีน้ำเงิน', exampleZh: '這件衣服是「藍色」。' },
  ],
  'c3': [
    { exampleTh: 'ฉันชอบสีเขียวมาก', exampleZh: '我很喜歡「綠色」。' },
    { exampleTh: 'เสื้อตัวนี้เป็นสีเขียว', exampleZh: '這件衣服是「綠色」。' },
  ],
  'c4': [
    { exampleTh: 'ฉันชอบสีเหลืองมาก', exampleZh: '我很喜歡「黃色」。' },
    { exampleTh: 'เสื้อตัวนี้เป็นสีเหลือง', exampleZh: '這件衣服是「黃色」。' },
  ],
  'c5': [
    { exampleTh: 'ฉันชอบสีขาวมาก', exampleZh: '我很喜歡「白色」。' },
    { exampleTh: 'เสื้อตัวนี้เป็นสีขาว', exampleZh: '這件衣服是「白色」。' },
  ],
  'c6': [
    { exampleTh: 'ฉันชอบสีดำมาก', exampleZh: '我很喜歡「黑色」。' },
    { exampleTh: 'เสื้อตัวนี้เป็นสีดำ', exampleZh: '這件衣服是「黑色」。' },
  ],
  'c7': [
    { exampleTh: 'ฉันชอบสีส้มมาก', exampleZh: '我很喜歡「橙色」。' },
    { exampleTh: 'เสื้อตัวนี้เป็นสีส้ม', exampleZh: '這件衣服是「橙色」。' },
  ],
  'c8': [
    { exampleTh: 'ฉันชอบสีชมพูมาก', exampleZh: '我很喜歡「粉色」。' },
    { exampleTh: 'เสื้อตัวนี้เป็นสีชมพู', exampleZh: '這件衣服是「粉色」。' },
  ],
  'c9': [
    { exampleTh: 'ฉันชอบสีม่วงมาก', exampleZh: '我很喜歡「紫色」。' },
    { exampleTh: 'เสื้อตัวนี้เป็นสีม่วง', exampleZh: '這件衣服是「紫色」。' },
  ],
  'c10': [
    { exampleTh: 'ฉันชอบสีน้ำตาลมาก', exampleZh: '我很喜歡「棕色」。' },
    { exampleTh: 'เสื้อตัวนี้เป็นสีน้ำตาล', exampleZh: '這件衣服是「棕色」。' },
  ],
  'c11': [
    { exampleTh: 'ฉันชอบสีเทามาก', exampleZh: '我很喜歡「灰色」。' },
    { exampleTh: 'เสื้อตัวนี้เป็นสีเทา', exampleZh: '這件衣服是「灰色」。' },
  ],
  'c12': [
    { exampleTh: 'ฉันชอบสีทองมาก', exampleZh: '我很喜歡「金色」。' },
    { exampleTh: 'เสื้อตัวนี้เป็นสีทอง', exampleZh: '這件衣服是「金色」。' },
  ],
  'c13': [
    { exampleTh: 'ฉันชอบสีเงินมาก', exampleZh: '我很喜歡「銀色」。' },
    { exampleTh: 'เสื้อตัวนี้เป็นสีเงิน', exampleZh: '這件衣服是「銀色」。' },
  ],
  'c14': [
    { exampleTh: 'ฉันชอบสีฟ้ามาก', exampleZh: '我很喜歡「天藍色」。' },
    { exampleTh: 'เสื้อตัวนี้เป็นสีฟ้า', exampleZh: '這件衣服是「天藍色」。' },
  ],
  'c15': [
    { exampleTh: 'ฉันชอบสีมาก', exampleZh: '我很喜歡「顏色」。' },
    { exampleTh: 'เสื้อตัวนี้เป็นสี', exampleZh: '這件衣服是「顏色」。' },
  ],
  'c16': [
    { exampleTh: 'ฉันชอบสีเข้มมาก', exampleZh: '我很喜歡「深色」。' },
    { exampleTh: 'เสื้อตัวนี้เป็นสีเข้ม', exampleZh: '這件衣服是「深色」。' },
  ],
  'c17': [
    { exampleTh: 'ฉันชอบสีอ่อนมาก', exampleZh: '我很喜歡「淺色」。' },
    { exampleTh: 'เสื้อตัวนี้เป็นสีอ่อน', exampleZh: '這件衣服是「淺色」。' },
  ],
  'c18': [
    { exampleTh: 'ฉันชอบสีใสมาก', exampleZh: '我很喜歡「透明」。' },
    { exampleTh: 'เสื้อตัวนี้เป็นสีใส', exampleZh: '這件衣服是「透明」。' },
  ],
  'c19': [
    { exampleTh: 'ฉันชอบสีแดงเข้มมาก', exampleZh: '我很喜歡「深紅色」。' },
    { exampleTh: 'เสื้อตัวนี้เป็นสีแดงเข้ม', exampleZh: '這件衣服是「深紅色」。' },
  ],
  'c20': [
    { exampleTh: 'ฉันชอบสีเขียวอ่อนมาก', exampleZh: '我很喜歡「淺綠色」。' },
    { exampleTh: 'เสื้อตัวนี้เป็นสีเขียวอ่อน', exampleZh: '這件衣服是「淺綠色」。' },
  ],
  'c21': [
    { exampleTh: 'ฉันชอบสีครามมาก', exampleZh: '我很喜歡「靛藍色」。' },
    { exampleTh: 'เสื้อตัวนี้เป็นสีคราม', exampleZh: '這件衣服是「靛藍色」。' },
  ],
  'c22': [
    { exampleTh: 'ฉันชอบสีเหลืองทองมาก', exampleZh: '我很喜歡「金黃色」。' },
    { exampleTh: 'เสื้อตัวนี้เป็นสีเหลืองทอง', exampleZh: '這件衣服是「金黃色」。' },
  ],
  'c23': [
    { exampleTh: 'ฉันชอบสีชามาก', exampleZh: '我很喜歡「茶色」。' },
    { exampleTh: 'เสื้อตัวนี้เป็นสีชา', exampleZh: '這件衣服是「茶色」。' },
  ],
  'c24': [
    { exampleTh: 'ฉันชอบสีขาวนวลมาก', exampleZh: '我很喜歡「乳白色」。' },
    { exampleTh: 'เสื้อตัวนี้เป็นสีขาวนวล', exampleZh: '這件衣服是「乳白色」。' },
  ],
  'c25': [
    { exampleTh: 'ฉันชอบหลากสีมาก', exampleZh: '我很喜歡「彩色」。' },
    { exampleTh: 'เสื้อตัวนี้เป็นหลากสี', exampleZh: '這件衣服是「彩色」。' },
  ],
  'o1': [
    { exampleTh: 'อย่าลืมเอาโทรศัพท์มาด้วย', exampleZh: '別忘了帶「手機」。' },
    { exampleTh: 'โทรศัพท์อยู่บนโต๊ะ', exampleZh: '「手機」在桌子上。' },
  ],
  'o2': [
    { exampleTh: 'อย่าลืมเอากุญแจมาด้วย', exampleZh: '別忘了帶「鑰匙」。' },
    { exampleTh: 'กุญแจอยู่บนโต๊ะ', exampleZh: '「鑰匙」在桌子上。' },
  ],
  'o3': [
    { exampleTh: 'อย่าลืมเอากระเป๋ามาด้วย', exampleZh: '別忘了帶「包包」。' },
    { exampleTh: 'กระเป๋าอยู่บนโต๊ะ', exampleZh: '「包包」在桌子上。' },
  ],
  'o4': [
    { exampleTh: 'อย่าลืมเอาแว่นตามาด้วย', exampleZh: '別忘了帶「眼鏡」。' },
    { exampleTh: 'แว่นตาอยู่บนโต๊ะ', exampleZh: '「眼鏡」在桌子上。' },
  ],
  'o5': [
    { exampleTh: 'อย่าลืมเอานาฬิกามาด้วย', exampleZh: '別忘了帶「手錶」。' },
    { exampleTh: 'นาฬิกาอยู่บนโต๊ะ', exampleZh: '「手錶」在桌子上。' },
  ],
  'o6': [
    { exampleTh: 'อย่าลืมเอาร่มมาด้วย', exampleZh: '別忘了帶「雨傘」。' },
    { exampleTh: 'ร่มอยู่บนโต๊ะ', exampleZh: '「雨傘」在桌子上。' },
  ],
  'o7': [
    { exampleTh: 'อย่าลืมเอาหนังสือมาด้วย', exampleZh: '別忘了帶「書」。' },
    { exampleTh: 'หนังสืออยู่บนโต๊ะ', exampleZh: '「書」在桌子上。' },
  ],
  'o8': [
    { exampleTh: 'อย่าลืมเอาปากกามาด้วย', exampleZh: '別忘了帶「筆」。' },
    { exampleTh: 'ปากกาอยู่บนโต๊ะ', exampleZh: '「筆」在桌子上。' },
  ],
  'o9': [
    { exampleTh: 'อย่าลืมเอากระดาษมาด้วย', exampleZh: '別忘了帶「紙」。' },
    { exampleTh: 'กระดาษอยู่บนโต๊ะ', exampleZh: '「紙」在桌子上。' },
  ],
  'o10': [
    { exampleTh: 'อย่าลืมเอากล้องมาด้วย', exampleZh: '別忘了帶「相機」。' },
    { exampleTh: 'กล้องอยู่บนโต๊ะ', exampleZh: '「相機」在桌子上。' },
  ],
  'o11': [
    { exampleTh: 'อย่าลืมเอาหูฟังมาด้วย', exampleZh: '別忘了帶「耳機」。' },
    { exampleTh: 'หูฟังอยู่บนโต๊ะ', exampleZh: '「耳機」在桌子上。' },
  ],
  'o12': [
    { exampleTh: 'อย่าลืมเอาแบตเตอรี่มาด้วย', exampleZh: '別忘了帶「電池」。' },
    { exampleTh: 'แบตเตอรี่อยู่บนโต๊ะ', exampleZh: '「電池」在桌子上。' },
  ],
  'o13': [
    { exampleTh: 'อย่าลืมเอาเงินมาด้วย', exampleZh: '別忘了帶「錢」。' },
    { exampleTh: 'เงินอยู่บนโต๊ะ', exampleZh: '「錢」在桌子上。' },
  ],
  'o14': [
    { exampleTh: 'อย่าลืมเอาบัตรมาด้วย', exampleZh: '別忘了帶「卡片」。' },
    { exampleTh: 'บัตรอยู่บนโต๊ะ', exampleZh: '「卡片」在桌子上。' },
  ],
  'o15': [
    { exampleTh: 'อย่าลืมเอาถุงมาด้วย', exampleZh: '別忘了帶「袋子」。' },
    { exampleTh: 'ถุงอยู่บนโต๊ะ', exampleZh: '「袋子」在桌子上。' },
  ],
  'o16': [
    { exampleTh: 'อย่าลืมเอากระจกมาด้วย', exampleZh: '別忘了帶「鏡子」。' },
    { exampleTh: 'กระจกอยู่บนโต๊ะ', exampleZh: '「鏡子」在桌子上。' },
  ],
  'o17': [
    { exampleTh: 'อย่าลืมเอากล่องมาด้วย', exampleZh: '別忘了帶「盒子」。' },
    { exampleTh: 'กล่องอยู่บนโต๊ะ', exampleZh: '「盒子」在桌子上。' },
  ],
  'o18': [
    { exampleTh: 'อย่าลืมเอาถังขยะมาด้วย', exampleZh: '別忘了帶「垃圾桶」。' },
    { exampleTh: 'ถังขยะอยู่บนโต๊ะ', exampleZh: '「垃圾桶」在桌子上。' },
  ],
  'o19': [
    { exampleTh: 'อย่าลืมเอาไฟฉายมาด้วย', exampleZh: '別忘了帶「手電筒」。' },
    { exampleTh: 'ไฟฉายอยู่บนโต๊ะ', exampleZh: '「手電筒」在桌子上。' },
  ],
  'o20': [
    { exampleTh: 'อย่าลืมเอารองเท้ามาด้วย', exampleZh: '別忘了帶「鞋子」。' },
    { exampleTh: 'รองเท้าอยู่บนโต๊ะ', exampleZh: '「鞋子」在桌子上。' },
  ],
  'o21': [
    { exampleTh: 'อย่าลืมเอาคอมพิวเตอร์มาด้วย', exampleZh: '別忘了帶「電腦」。' },
    { exampleTh: 'คอมพิวเตอร์อยู่บนโต๊ะ', exampleZh: '「電腦」在桌子上。' },
  ],
  'o22': [
    { exampleTh: 'อย่าลืมเอาที่ชาร์จมาด้วย', exampleZh: '別忘了帶「充電器」。' },
    { exampleTh: 'ที่ชาร์จอยู่บนโต๊ะ', exampleZh: '「充電器」在桌子上。' },
  ],
  'o23': [
    { exampleTh: 'อย่าลืมเอากระเป๋าสตางค์มาด้วย', exampleZh: '別忘了帶「錢包」。' },
    { exampleTh: 'กระเป๋าสตางค์อยู่บนโต๊ะ', exampleZh: '「錢包」在桌子上。' },
  ],
  'o24': [
    { exampleTh: 'อย่าลืมเอาเสื้อมาด้วย', exampleZh: '別忘了帶「上衣」。' },
    { exampleTh: 'เสื้ออยู่บนโต๊ะ', exampleZh: '「上衣」在桌子上。' },
  ],
  'o25': [
    { exampleTh: 'อย่าลืมเอากางเกงมาด้วย', exampleZh: '別忘了帶「褲子」。' },
    { exampleTh: 'กางเกงอยู่บนโต๊ะ', exampleZh: '「褲子」在桌子上。' },
  ],
  'o26': [
    { exampleTh: 'อย่าลืมเอาหมวกมาด้วย', exampleZh: '別忘了帶「帽子」。' },
    { exampleTh: 'หมวกอยู่บนโต๊ะ', exampleZh: '「帽子」在桌子上。' },
  ],
  'o27': [
    { exampleTh: 'อย่าลืมเอาถุงเท้ามาด้วย', exampleZh: '別忘了帶「襪子」。' },
    { exampleTh: 'ถุงเท้าอยู่บนโต๊ะ', exampleZh: '「襪子」在桌子上。' },
  ],
  'o28': [
    { exampleTh: 'อย่าลืมเอาขวดมาด้วย', exampleZh: '別忘了帶「瓶子」。' },
    { exampleTh: 'ขวดอยู่บนโต๊ะ', exampleZh: '「瓶子」在桌子上。' },
  ],
  'o29': [
    { exampleTh: 'อย่าลืมเอาแก้วมาด้วย', exampleZh: '別忘了帶「杯子」。' },
    { exampleTh: 'แก้วอยู่บนโต๊ะ', exampleZh: '「杯子」在桌子上。' },
  ],
  'o30': [
    { exampleTh: 'อย่าลืมเอาจานมาด้วย', exampleZh: '別忘了帶「盤子」。' },
    { exampleTh: 'จานอยู่บนโต๊ะ', exampleZh: '「盤子」在桌子上。' },
  ],
  'o31': [
    { exampleTh: 'อย่าลืมเอามีดมาด้วย', exampleZh: '別忘了帶「刀」。' },
    { exampleTh: 'มีดอยู่บนโต๊ะ', exampleZh: '「刀」在桌子上。' },
  ],
  'o32': [
    { exampleTh: 'อย่าลืมเอากรรไกรมาด้วย', exampleZh: '別忘了帶「剪刀」。' },
    { exampleTh: 'กรรไกรอยู่บนโต๊ะ', exampleZh: '「剪刀」在桌子上。' },
  ],
  'o33': [
    { exampleTh: 'อย่าลืมเอาดินสอมาด้วย', exampleZh: '別忘了帶「鉛筆」。' },
    { exampleTh: 'ดินสออยู่บนโต๊ะ', exampleZh: '「鉛筆」在桌子上。' },
  ],
  'o34': [
    { exampleTh: 'อย่าลืมเอายางลบมาด้วย', exampleZh: '別忘了帶「橡皮擦」。' },
    { exampleTh: 'ยางลบอยู่บนโต๊ะ', exampleZh: '「橡皮擦」在桌子上。' },
  ],
  'o35': [
    { exampleTh: 'อย่าลืมเอาพัดมาด้วย', exampleZh: '別忘了帶「扇子」。' },
    { exampleTh: 'พัดอยู่บนโต๊ะ', exampleZh: '「扇子」在桌子上。' },
  ],
  'h1': [
    { exampleTh: 'ในห้องมีโต๊ะ', exampleZh: '房間裡有「桌子」。' },
    { exampleTh: 'ช่วยย้ายโต๊ะหน่อย', exampleZh: '請幫忙移一下「桌子」。' },
  ],
  'h2': [
    { exampleTh: 'ในห้องมีเก้าอี้', exampleZh: '房間裡有「椅子」。' },
    { exampleTh: 'ช่วยย้ายเก้าอี้หน่อย', exampleZh: '請幫忙移一下「椅子」。' },
  ],
  'h3': [
    { exampleTh: 'ในห้องมีเตียง', exampleZh: '房間裡有「床」。' },
    { exampleTh: 'ช่วยย้ายเตียงหน่อย', exampleZh: '請幫忙移一下「床」。' },
  ],
  'h4': [
    { exampleTh: 'ในห้องมีตู้', exampleZh: '房間裡有「櫃子」。' },
    { exampleTh: 'ช่วยย้ายตู้หน่อย', exampleZh: '請幫忙移一下「櫃子」。' },
  ],
  'h5': [
    { exampleTh: 'ในห้องมีโซฟา', exampleZh: '房間裡有「沙發」。' },
    { exampleTh: 'ช่วยย้ายโซฟาหน่อย', exampleZh: '請幫忙移一下「沙發」。' },
  ],
  'h6': [
    { exampleTh: 'ในห้องมีตู้เย็น', exampleZh: '房間裡有「冰箱」。' },
    { exampleTh: 'ช่วยย้ายตู้เย็นหน่อย', exampleZh: '請幫忙移一下「冰箱」。' },
  ],
  'h7': [
    { exampleTh: 'ในห้องมีโทรทัศน์', exampleZh: '房間裡有「電視」。' },
    { exampleTh: 'ช่วยย้ายโทรทัศน์หน่อย', exampleZh: '請幫忙移一下「電視」。' },
  ],
  'h8': [
    { exampleTh: 'ในห้องมีโคมไฟ', exampleZh: '房間裡有「燈」。' },
    { exampleTh: 'ช่วยย้ายโคมไฟหน่อย', exampleZh: '請幫忙移一下「燈」。' },
  ],
  'h9': [
    { exampleTh: 'ในห้องมีหมอน', exampleZh: '房間裡有「枕頭」。' },
    { exampleTh: 'ช่วยย้ายหมอนหน่อย', exampleZh: '請幫忙移一下「枕頭」。' },
  ],
  'h10': [
    { exampleTh: 'ในห้องมีผ้าห่ม', exampleZh: '房間裡有「被子」。' },
    { exampleTh: 'ช่วยย้ายผ้าห่มหน่อย', exampleZh: '請幫忙移一下「被子」。' },
  ],
  'h11': [
    { exampleTh: 'ในห้องมีลิ้นชัก', exampleZh: '房間裡有「抽屜」。' },
    { exampleTh: 'ช่วยย้ายลิ้นชักหน่อย', exampleZh: '請幫忙移一下「抽屜」。' },
  ],
  'h12': [
    { exampleTh: 'ในห้องมีชั้นหนังสือ', exampleZh: '房間裡有「書架」。' },
    { exampleTh: 'ช่วยย้ายชั้นหนังสือหน่อย', exampleZh: '請幫忙移一下「書架」。' },
  ],
  'h13': [
    { exampleTh: 'ในห้องมีประตู', exampleZh: '房間裡有「門」。' },
    { exampleTh: 'ช่วยย้ายประตูหน่อย', exampleZh: '請幫忙移一下「門」。' },
  ],
  'h14': [
    { exampleTh: 'ในห้องมีหน้าต่าง', exampleZh: '房間裡有「窗戶」。' },
    { exampleTh: 'ช่วยย้ายหน้าต่างหน่อย', exampleZh: '請幫忙移一下「窗戶」。' },
  ],
  'h15': [
    { exampleTh: 'ในห้องมีพรม', exampleZh: '房間裡有「地毯」。' },
    { exampleTh: 'ช่วยย้ายพรมหน่อย', exampleZh: '請幫忙移一下「地毯」。' },
  ],
  'h16': [
    { exampleTh: 'ในห้องมีผ้าม่าน', exampleZh: '房間裡有「窗簾」。' },
    { exampleTh: 'ช่วยย้ายผ้าม่านหน่อย', exampleZh: '請幫忙移一下「窗簾」。' },
  ],
  'h17': [
    { exampleTh: 'ในห้องมีก๊อกน้ำ', exampleZh: '房間裡有「水龍頭」。' },
    { exampleTh: 'ช่วยย้ายก๊อกน้ำหน่อย', exampleZh: '請幫忙移一下「水龍頭」。' },
  ],
  'h18': [
    { exampleTh: 'ในห้องมีอ่างล้างหน้า', exampleZh: '房間裡有「洗手台」。' },
    { exampleTh: 'ช่วยย้ายอ่างล้างหน้าหน่อย', exampleZh: '請幫忙移一下「洗手台」。' },
  ],
  'h19': [
    { exampleTh: 'ในห้องมีเตา', exampleZh: '房間裡有「爐子」。' },
    { exampleTh: 'ช่วยย้ายเตาหน่อย', exampleZh: '請幫忙移一下「爐子」。' },
  ],
  'h20': [
    { exampleTh: 'ในห้องมีตู้เสื้อผ้า', exampleZh: '房間裡有「衣櫃」。' },
    { exampleTh: 'ช่วยย้ายตู้เสื้อผ้าหน่อย', exampleZh: '請幫忙移一下「衣櫃」。' },
  ],
  'h21': [
    { exampleTh: 'ในห้องมีแอร์', exampleZh: '房間裡有「冷氣」。' },
    { exampleTh: 'ช่วยย้ายแอร์หน่อย', exampleZh: '請幫忙移一下「冷氣」。' },
  ],
  'h22': [
    { exampleTh: 'ในห้องมีพัดลม', exampleZh: '房間裡有「電風扇」。' },
    { exampleTh: 'ช่วยย้ายพัดลมหน่อย', exampleZh: '請幫忙移一下「電風扇」。' },
  ],
  'h23': [
    { exampleTh: 'ในห้องมีไมโครเวฟ', exampleZh: '房間裡有「微波爐」。' },
    { exampleTh: 'ช่วยย้ายไมโครเวฟหน่อย', exampleZh: '請幫忙移一下「微波爐」。' },
  ],
  'h24': [
    { exampleTh: 'ในห้องมีเครื่องซักผ้า', exampleZh: '房間裡有「洗衣機」。' },
    { exampleTh: 'ช่วยย้ายเครื่องซักผ้าหน่อย', exampleZh: '請幫忙移一下「洗衣機」。' },
  ],
  'h25': [
    { exampleTh: 'ในห้องมีบันได', exampleZh: '房間裡有「樓梯」。' },
    { exampleTh: 'ช่วยย้ายบันไดหน่อย', exampleZh: '請幫忙移一下「樓梯」。' },
  ],
  'h26': [
    { exampleTh: 'ในห้องมีกำแพง', exampleZh: '房間裡有「牆」。' },
    { exampleTh: 'ช่วยย้ายกำแพงหน่อย', exampleZh: '請幫忙移一下「牆」。' },
  ],
  'h27': [
    { exampleTh: 'ในห้องมีพื้น', exampleZh: '房間裡有「地板」。' },
    { exampleTh: 'ช่วยย้ายพื้นหน่อย', exampleZh: '請幫忙移一下「地板」。' },
  ],
  'h28': [
    { exampleTh: 'ในห้องมีเพดาน', exampleZh: '房間裡有「天花板」。' },
    { exampleTh: 'ช่วยย้ายเพดานหน่อย', exampleZh: '請幫忙移一下「天花板」。' },
  ],
  'h29': [
    { exampleTh: 'ในห้องมีหิงพลุ', exampleZh: '房間裡有「衣架」。' },
    { exampleTh: 'ช่วยย้ายหิงพลุหน่อย', exampleZh: '請幫忙移一下「衣架」。' },
  ],
  'h30': [
    { exampleTh: 'ในห้องมีโต๊ะกาแฟ', exampleZh: '房間裡有「茶几」。' },
    { exampleTh: 'ช่วยย้ายโต๊ะกาแฟหน่อย', exampleZh: '請幫忙移一下「茶几」。' },
  ],
  'b1': [
    { exampleTh: 'หัวของฉันเจ็บเล็กน้อย', exampleZh: '我的「頭」有點痛。' },
    { exampleTh: 'ร่างกายเรามีหัว', exampleZh: '我們的身體有「頭」。' },
  ],
  'b2': [
    { exampleTh: 'ผมของฉันเจ็บเล็กน้อย', exampleZh: '我的「頭髮」有點痛。' },
    { exampleTh: 'ร่างกายเรามีผม', exampleZh: '我們的身體有「頭髮」。' },
  ],
  'b3': [
    { exampleTh: 'หน้าของฉันเจ็บเล็กน้อย', exampleZh: '我的「臉」有點痛。' },
    { exampleTh: 'ร่างกายเรามีหน้า', exampleZh: '我們的身體有「臉」。' },
  ],
  'b4': [
    { exampleTh: 'ตาของฉันเจ็บเล็กน้อย', exampleZh: '我的「眼睛」有點痛。' },
    { exampleTh: 'ร่างกายเรามีตา', exampleZh: '我們的身體有「眼睛」。' },
  ],
  'b5': [
    { exampleTh: 'หูของฉันเจ็บเล็กน้อย', exampleZh: '我的「耳朵」有點痛。' },
    { exampleTh: 'ร่างกายเรามีหู', exampleZh: '我們的身體有「耳朵」。' },
  ],
  'b6': [
    { exampleTh: 'จมูกของฉันเจ็บเล็กน้อย', exampleZh: '我的「鼻子」有點痛。' },
    { exampleTh: 'ร่างกายเรามีจมูก', exampleZh: '我們的身體有「鼻子」。' },
  ],
  'b7': [
    { exampleTh: 'ปากของฉันเจ็บเล็กน้อย', exampleZh: '我的「嘴巴」有點痛。' },
    { exampleTh: 'ร่างกายเรามีปาก', exampleZh: '我們的身體有「嘴巴」。' },
  ],
  'b8': [
    { exampleTh: 'ฟันของฉันเจ็บเล็กน้อย', exampleZh: '我的「牙齒」有點痛。' },
    { exampleTh: 'ร่างกายเรามีฟัน', exampleZh: '我們的身體有「牙齒」。' },
  ],
  'b9': [
    { exampleTh: 'คอของฉันเจ็บเล็กน้อย', exampleZh: '我的「脖子」有點痛。' },
    { exampleTh: 'ร่างกายเรามีคอ', exampleZh: '我們的身體有「脖子」。' },
  ],
  'b10': [
    { exampleTh: 'ไหล่ของฉันเจ็บเล็กน้อย', exampleZh: '我的「肩膀」有點痛。' },
    { exampleTh: 'ร่างกายเรามีไหล่', exampleZh: '我們的身體有「肩膀」。' },
  ],
  'b11': [
    { exampleTh: 'แขนของฉันเจ็บเล็กน้อย', exampleZh: '我的「手臂」有點痛。' },
    { exampleTh: 'ร่างกายเรามีแขน', exampleZh: '我們的身體有「手臂」。' },
  ],
  'b12': [
    { exampleTh: 'มือของฉันเจ็บเล็กน้อย', exampleZh: '我的「手」有點痛。' },
    { exampleTh: 'ร่างกายเรามีมือ', exampleZh: '我們的身體有「手」。' },
  ],
  'b13': [
    { exampleTh: 'นิ้วของฉันเจ็บเล็กน้อย', exampleZh: '我的「手指」有點痛。' },
    { exampleTh: 'ร่างกายเรามีนิ้ว', exampleZh: '我們的身體有「手指」。' },
  ],
  'b14': [
    { exampleTh: 'หลังของฉันเจ็บเล็กน้อย', exampleZh: '我的「背」有點痛。' },
    { exampleTh: 'ร่างกายเรามีหลัง', exampleZh: '我們的身體有「背」。' },
  ],
  'b15': [
    { exampleTh: 'ท้องของฉันเจ็บเล็กน้อย', exampleZh: '我的「肚子」有點痛。' },
    { exampleTh: 'ร่างกายเรามีท้อง', exampleZh: '我們的身體有「肚子」。' },
  ],
  'b16': [
    { exampleTh: 'ขาของฉันเจ็บเล็กน้อย', exampleZh: '我的「腿」有點痛。' },
    { exampleTh: 'ร่างกายเรามีขา', exampleZh: '我們的身體有「腿」。' },
  ],
  'b17': [
    { exampleTh: 'เข่าของฉันเจ็บเล็กน้อย', exampleZh: '我的「膝蓋」有點痛。' },
    { exampleTh: 'ร่างกายเรามีเข่า', exampleZh: '我們的身體有「膝蓋」。' },
  ],
  'b18': [
    { exampleTh: 'เท้าของฉันเจ็บเล็กน้อย', exampleZh: '我的「腳」有點痛。' },
    { exampleTh: 'ร่างกายเรามีเท้า', exampleZh: '我們的身體有「腳」。' },
  ],
  'b19': [
    { exampleTh: 'หัวใจของฉันเจ็บเล็กน้อย', exampleZh: '我的「心臟」有點痛。' },
    { exampleTh: 'ร่างกายเรามีหัวใจ', exampleZh: '我們的身體有「心臟」。' },
  ],
  'b20': [
    { exampleTh: 'เล็บของฉันเจ็บเล็กน้อย', exampleZh: '我的「指甲」有點痛。' },
    { exampleTh: 'ร่างกายเรามีเล็บ', exampleZh: '我們的身體有「指甲」。' },
  ],
  'b21': [
    { exampleTh: 'เลือดของฉันเจ็บเล็กน้อย', exampleZh: '我的「血」有點痛。' },
    { exampleTh: 'ร่างกายเรามีเลือด', exampleZh: '我們的身體有「血」。' },
  ],
  'b22': [
    { exampleTh: 'กระดูกของฉันเจ็บเล็กน้อย', exampleZh: '我的「骨頭」有點痛。' },
    { exampleTh: 'ร่างกายเรามีกระดูก', exampleZh: '我們的身體有「骨頭」。' },
  ],
  'b23': [
    { exampleTh: 'ผิวหนังของฉันเจ็บเล็กน้อย', exampleZh: '我的「皮膚」有點痛。' },
    { exampleTh: 'ร่างกายเรามีผิวหนัง', exampleZh: '我們的身體有「皮膚」。' },
  ],
  'b24': [
    { exampleTh: 'ข้อเท้าของฉันเจ็บเล็กน้อย', exampleZh: '我的「腳踝」有點痛。' },
    { exampleTh: 'ร่างกายเรามีข้อเท้า', exampleZh: '我們的身體有「腳踝」。' },
  ],
  'b25': [
    { exampleTh: 'ข้อมือของฉันเจ็บเล็กน้อย', exampleZh: '我的「手腕」有點痛。' },
    { exampleTh: 'ร่างกายเรามีข้อมือ', exampleZh: '我們的身體有「手腕」。' },
  ],
  'b26': [
    { exampleTh: 'ข้อศอกของฉันเจ็บเล็กน้อย', exampleZh: '我的「手肘」有點痛。' },
    { exampleTh: 'ร่างกายเรามีข้อศอก', exampleZh: '我們的身體有「手肘」。' },
  ],
  'b27': [
    { exampleTh: 'หน้าอกของฉันเจ็บเล็กน้อย', exampleZh: '我的「胸部」有點痛。' },
    { exampleTh: 'ร่างกายเรามีหน้าอก', exampleZh: '我們的身體有「胸部」。' },
  ],
  'b28': [
    { exampleTh: 'คอหอยของฉันเจ็บเล็กน้อย', exampleZh: '我的「喉嚨」有點痛。' },
    { exampleTh: 'ร่างกายเรามีคอหอย', exampleZh: '我們的身體有「喉嚨」。' },
  ],
  'b29': [
    { exampleTh: 'ลิ้นของฉันเจ็บเล็กน้อย', exampleZh: '我的「舌頭」有點痛。' },
    { exampleTh: 'ร่างกายเรามีลิ้น', exampleZh: '我們的身體有「舌頭」。' },
  ],
  'b30': [
    { exampleTh: 'สมองของฉันเจ็บเล็กน้อย', exampleZh: '我的「大腦」有點痛。' },
    { exampleTh: 'ร่างกายเรามีสมอง', exampleZh: '我們的身體有「大腦」。' },
  ],
  'b31': [
    { exampleTh: 'ปอดของฉันเจ็บเล็กน้อย', exampleZh: '我的「肺」有點痛。' },
    { exampleTh: 'ร่างกายเรามีปอด', exampleZh: '我們的身體有「肺」。' },
  ],
  'b32': [
    { exampleTh: 'ตับของฉันเจ็บเล็กน้อย', exampleZh: '我的「肝」有點痛。' },
    { exampleTh: 'ร่างกายเรามีตับ', exampleZh: '我們的身體有「肝」。' },
  ],
  'b33': [
    { exampleTh: 'เอวของฉันเจ็บเล็กน้อย', exampleZh: '我的「腰」有點痛。' },
    { exampleTh: 'ร่างกายเรามีเอว', exampleZh: '我們的身體有「腰」。' },
  ],
  'b34': [
    { exampleTh: 'สะโพกของฉันเจ็บเล็กน้อย', exampleZh: '我的「臀部」有點痛。' },
    { exampleTh: 'ร่างกายเรามีสะโพก', exampleZh: '我們的身體有「臀部」。' },
  ],
  'b35': [
    { exampleTh: 'คิ้วของฉันเจ็บเล็กน้อย', exampleZh: '我的「眉毛」有點痛。' },
    { exampleTh: 'ร่างกายเรามีคิ้ว', exampleZh: '我們的身體有「眉毛」。' },
  ],
  'a1': [
    { exampleTh: 'ที่สวนสัตว์มีสัตว์', exampleZh: '動物園裡有「動物」。' },
    { exampleTh: 'เด็กๆ ชอบสัตว์มาก', exampleZh: '孩子們很喜歡「動物」。' },
  ],
  'a2': [
    { exampleTh: 'ที่สวนสัตว์มีหมา', exampleZh: '動物園裡有「狗」。' },
    { exampleTh: 'เด็กๆ ชอบหมามาก', exampleZh: '孩子們很喜歡「狗」。' },
  ],
  'a3': [
    { exampleTh: 'ที่สวนสัตว์มีแมว', exampleZh: '動物園裡有「貓」。' },
    { exampleTh: 'เด็กๆ ชอบแมวมาก', exampleZh: '孩子們很喜歡「貓」。' },
  ],
  'a4': [
    { exampleTh: 'ที่สวนสัตว์มีช้าง', exampleZh: '動物園裡有「大象」。' },
    { exampleTh: 'เด็กๆ ชอบช้างมาก', exampleZh: '孩子們很喜歡「大象」。' },
  ],
  'a5': [
    { exampleTh: 'ที่สวนสัตว์มีเสือ', exampleZh: '動物園裡有「老虎」。' },
    { exampleTh: 'เด็กๆ ชอบเสือมาก', exampleZh: '孩子們很喜歡「老虎」。' },
  ],
  'a6': [
    { exampleTh: 'ที่สวนสัตว์มีสิงโต', exampleZh: '動物園裡有「獅子」。' },
    { exampleTh: 'เด็กๆ ชอบสิงโตมาก', exampleZh: '孩子們很喜歡「獅子」。' },
  ],
  'a7': [
    { exampleTh: 'ที่สวนสัตว์มีหมี', exampleZh: '動物園裡有「熊」。' },
    { exampleTh: 'เด็กๆ ชอบหมีมาก', exampleZh: '孩子們很喜歡「熊」。' },
  ],
  'a8': [
    { exampleTh: 'ที่สวนสัตว์มีลิง', exampleZh: '動物園裡有「猴子」。' },
    { exampleTh: 'เด็กๆ ชอบลิงมาก', exampleZh: '孩子們很喜歡「猴子」。' },
  ],
  'a9': [
    { exampleTh: 'ที่สวนสัตว์มีนก', exampleZh: '動物園裡有「鳥」。' },
    { exampleTh: 'เด็กๆ ชอบนกมาก', exampleZh: '孩子們很喜歡「鳥」。' },
  ],
  'a10': [
    { exampleTh: 'ที่สวนสัตว์มีปลา', exampleZh: '動物園裡有「魚」。' },
    { exampleTh: 'เด็กๆ ชอบปลามาก', exampleZh: '孩子們很喜歡「魚」。' },
  ],
  'a11': [
    { exampleTh: 'ที่สวนสัตว์มีงู', exampleZh: '動物園裡有「蛇」。' },
    { exampleTh: 'เด็กๆ ชอบงูมาก', exampleZh: '孩子們很喜歡「蛇」。' },
  ],
  'a12': [
    { exampleTh: 'ที่สวนสัตว์มีม้า', exampleZh: '動物園裡有「馬」。' },
    { exampleTh: 'เด็กๆ ชอบม้ามาก', exampleZh: '孩子們很喜歡「馬」。' },
  ],
  'a13': [
    { exampleTh: 'ที่สวนสัตว์มีวัว', exampleZh: '動物園裡有「牛」。' },
    { exampleTh: 'เด็กๆ ชอบวัวมาก', exampleZh: '孩子們很喜歡「牛」。' },
  ],
  'a14': [
    { exampleTh: 'ที่สวนสัตว์มีหมู', exampleZh: '動物園裡有「豬」。' },
    { exampleTh: 'เด็กๆ ชอบหมูมาก', exampleZh: '孩子們很喜歡「豬」。' },
  ],
  'a15': [
    { exampleTh: 'ที่สวนสัตว์มีไก่', exampleZh: '動物園裡有「雞」。' },
    { exampleTh: 'เด็กๆ ชอบไก่มาก', exampleZh: '孩子們很喜歡「雞」。' },
  ],
  'a16': [
    { exampleTh: 'ที่สวนสัตว์มีเป็ด', exampleZh: '動物園裡有「鴨」。' },
    { exampleTh: 'เด็กๆ ชอบเป็ดมาก', exampleZh: '孩子們很喜歡「鴨」。' },
  ],
  'a17': [
    { exampleTh: 'ที่สวนสัตว์มีกบ', exampleZh: '動物園裡有「青蛙」。' },
    { exampleTh: 'เด็กๆ ชอบกบมาก', exampleZh: '孩子們很喜歡「青蛙」。' },
  ],
  'a18': [
    { exampleTh: 'ที่สวนสัตว์มีผึ้ง', exampleZh: '動物園裡有「蜜蜂」。' },
    { exampleTh: 'เด็กๆ ชอบผึ้งมาก', exampleZh: '孩子們很喜歡「蜜蜂」。' },
  ],
  'a19': [
    { exampleTh: 'ที่สวนสัตว์มีแมงมุม', exampleZh: '動物園裡有「蜘蛛」。' },
    { exampleTh: 'เด็กๆ ชอบแมงมุมมาก', exampleZh: '孩子們很喜歡「蜘蛛」。' },
  ],
  'a20': [
    { exampleTh: 'ที่สวนสัตว์มีจระเข้', exampleZh: '動物園裡有「鱷魚」。' },
    { exampleTh: 'เด็กๆ ชอบจระเข้มาก', exampleZh: '孩子們很喜歡「鱷魚」。' },
  ],
  'a21': [
    { exampleTh: 'ที่สวนสัตว์มีผีเสื้อ', exampleZh: '動物園裡有「蝴蝶」。' },
    { exampleTh: 'เด็กๆ ชอบผีเสื้อมาก', exampleZh: '孩子們很喜歡「蝴蝶」。' },
  ],
  'a22': [
    { exampleTh: 'ที่สวนสัตว์มีมด', exampleZh: '動物園裡有「螞蟻」。' },
    { exampleTh: 'เด็กๆ ชอบมดมาก', exampleZh: '孩子們很喜歡「螞蟻」。' },
  ],
  'a23': [
    { exampleTh: 'ที่สวนสัตว์มียุง', exampleZh: '動物園裡有「蚊子」。' },
    { exampleTh: 'เด็กๆ ชอบยุงมาก', exampleZh: '孩子們很喜歡「蚊子」。' },
  ],
  'a24': [
    { exampleTh: 'ที่สวนสัตว์มีควาย', exampleZh: '動物園裡有「水牛」。' },
    { exampleTh: 'เด็กๆ ชอบควายมาก', exampleZh: '孩子們很喜歡「水牛」。' },
  ],
  'a25': [
    { exampleTh: 'ที่สวนสัตว์มีนกฮูก', exampleZh: '動物園裡有「貓頭鷹」。' },
    { exampleTh: 'เด็กๆ ชอบนกฮูกมาก', exampleZh: '孩子們很喜歡「貓頭鷹」。' },
  ],
  'a26': [
    { exampleTh: 'ที่สวนสัตว์มีนกอินทรี', exampleZh: '動物園裡有「老鷹」。' },
    { exampleTh: 'เด็กๆ ชอบนกอินทรีมาก', exampleZh: '孩子們很喜歡「老鷹」。' },
  ],
  'a27': [
    { exampleTh: 'ที่สวนสัตว์มีกระต่าย', exampleZh: '動物園裡有「兔子」。' },
    { exampleTh: 'เด็กๆ ชอบกระต่ายมาก', exampleZh: '孩子們很喜歡「兔子」。' },
  ],
  'a28': [
    { exampleTh: 'ที่สวนสัตว์มีเต่า', exampleZh: '動物園裡有「烏龜」。' },
    { exampleTh: 'เด็กๆ ชอบเต่ามาก', exampleZh: '孩子們很喜歡「烏龜」。' },
  ],
  'a29': [
    { exampleTh: 'ที่สวนสัตว์มีปลาวาฬ', exampleZh: '動物園裡有「鯨魚」。' },
    { exampleTh: 'เด็กๆ ชอบปลาวาฬมาก', exampleZh: '孩子們很喜歡「鯨魚」。' },
  ],
  'a30': [
    { exampleTh: 'ที่สวนสัตว์มีฉลาม', exampleZh: '動物園裡有「鯊魚」。' },
    { exampleTh: 'เด็กๆ ชอบฉลามมาก', exampleZh: '孩子們很喜歡「鯊魚」。' },
  ],
  'a31': [
    { exampleTh: 'ที่สวนสัตว์มีปู', exampleZh: '動物園裡有「螃蟹」。' },
    { exampleTh: 'เด็กๆ ชอบปูมาก', exampleZh: '孩子們很喜歡「螃蟹」。' },
  ],
  'a32': [
    { exampleTh: 'ที่สวนสัตว์มีหอย', exampleZh: '動物園裡有「貝殼」。' },
    { exampleTh: 'เด็กๆ ชอบหอยมาก', exampleZh: '孩子們很喜歡「貝殼」。' },
  ],
  'a33': [
    { exampleTh: 'ที่สวนสัตว์มีจิ้งจก', exampleZh: '動物園裡有「蜥蜴」。' },
    { exampleTh: 'เด็กๆ ชอบจิ้งจกมาก', exampleZh: '孩子們很喜歡「蜥蜴」。' },
  ],
  'a34': [
    { exampleTh: 'ที่สวนสัตว์มีม้าลาย', exampleZh: '動物園裡有「斑馬」。' },
    { exampleTh: 'เด็กๆ ชอบม้าลายมาก', exampleZh: '孩子們很喜歡「斑馬」。' },
  ],
  'a35': [
    { exampleTh: 'ที่สวนสัตว์มีแพะ', exampleZh: '動物園裡有「山羊」。' },
    { exampleTh: 'เด็กๆ ชอบแพะมาก', exampleZh: '孩子們很喜歡「山羊」。' },
  ],

  ...WORD_EXAMPLES_EXT,
  ...WORD_EXAMPLES_EXT2,
  ...WORD_EXAMPLES_EXT3,
  ...WORD_EXAMPLES_VOCAB_PATCH,
  ...WORD_EXAMPLES_TONE_PAIRS,
  ...WORD_EXAMPLES_THEMES,
  ...WORD_EXAMPLES_THEMES_EXT,
  ...WORD_EXAMPLES_TIME_HOLIDAY,
}
