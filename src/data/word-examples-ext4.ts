import type { WordExample } from '../types'

/** 第四輪新詞：人工例句（其餘由 wordExampleResolver 從語料擷取） */
export const WORD_EXAMPLES_EXT4: Record<string, WordExample[]> = {
  g51: [
    { exampleTh: 'ขออนุญาตถามหน่อยครับ', exampleZh: '打擾一下，請問。' },
    { exampleTh: 'ขออนุญาตเข้าห้องได้ไหม', exampleZh: '可以進房間嗎？' },
  ],
  g60: [
    { exampleTh: 'สู้ๆ นะครับ ทำได้แน่นอน', exampleZh: '加油，你一定做得到。' },
    { exampleTh: 'สู้ๆ สอบให้ผ่าน', exampleZh: '加油，考試順利。' },
  ],
  t58: [
    { exampleTh: 'ขับรถไปเชียงใหม่', exampleZh: '開車去清邁。' },
    { exampleTh: 'ขับรถช้าๆ หน่อย', exampleZh: '開慢一點。' },
  ],
  f62: [
    { exampleTh: 'หิวมากขอสั่งอาหาร', exampleZh: '很餓，要點餐。' },
    { exampleTh: 'หิวแล้วกินข้าวกัน', exampleZh: '餓了，去吃飯吧。' },
  ],
  f63: [
    { exampleTh: 'กินจนอิ่มแล้ว', exampleZh: '吃到飽了。' },
    { exampleTh: 'อิ่มแล้วขอบคุณ', exampleZh: '吃飽了，謝謝。' },
  ],
  em30: [
    { exampleTh: 'โล่งใจแล้วที่ปลอดภัย', exampleZh: '安全了就放心了。' },
    { exampleTh: 'ได้ยินข่าวดีโล่งใจมาก', exampleZh: '聽到好消息鬆一口氣。' },
  ],
  em28: [
    { exampleTh: 'ประหม่าตอนพูดไทย', exampleZh: '說泰文時很緊張。' },
    { exampleTh: 'อย่าประหม่า พูดช้าๆ', exampleZh: '別緊張，慢慢說。' },
  ],
}
