import type { WordExample } from '../types'

export const WORD_EXAMPLES_TONE_PAIRS: Record<string, WordExample[]> = {
  tp1: [
    { exampleTh: 'เขามาแล้ว', exampleZh: '他來了。（มา 平調）' },
    { exampleTh: 'อย่าสับสนกับ「ม้า」ม้า', exampleZh: '別和「ม้า」馬（高調）搞混。' },
  ],
  tp2: [
    { exampleTh: 'คุณสบายดีไหม', exampleZh: '你好嗎？（ไหม 升調）' },
    { exampleTh: 'หนังสือเล่มใหม่', exampleZh: '新書。（ใหม่ 低調，勿聽成 ไหม）' },
  ],
  tp3: [
    { exampleTh: 'สี่คน', exampleZh: '四個人。（สี่ 升調）' },
    { exampleTh: 'สีสวย', exampleZh: '顏色漂亮。（สี 平調）' },
  ],
  tp4: [
    { exampleTh: 'พูดช้าๆ หน่อย', exampleZh: '請說慢一點。（ช้า 高調）' },
    { exampleTh: 'ดื่มชาร้อน', exampleZh: '喝熱茶。（ชา 平調）' },
  ],
  tp5: [
    { exampleTh: 'ใช้โทรศัพท์', exampleZh: '使用電話。（ใช้ 高調）' },
    { exampleTh: 'ใช่ครับ', exampleZh: '是的。（ใช่ 降調）' },
  ],
  tp6: [
    { exampleTh: 'น้าอยู่เชียงใหม่', exampleZh: '阿姨住在清邁。（น้า 高調）' },
    { exampleTh: 'ทุ่งนาสวย', exampleZh: '稻田很美。（นา 平調）' },
  ],
  tp7: [
    { exampleTh: 'ทุ่งนาเขียว', exampleZh: '綠油油的稻田。（นา 平調）' },
    { exampleTh: 'น้ามาเยี่ยม', exampleZh: '阿姨來訪。（น้า 高調）' },
  ],
}
