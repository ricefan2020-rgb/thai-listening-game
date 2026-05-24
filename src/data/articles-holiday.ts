import type { ArticleCategory, StudyItem } from '../types'

export interface ArticleHoliday {
  id: string
  category: ArticleCategory
  titleZh: string
  contentTh: string
  translationZh: string
  questions: StudyItem[]
}

/** 節日文化短文 */
export const ARTICLES_HOLIDAY: ArticleHoliday[] = [
  {
    id: 'ar27',
    category: 'culture',
    titleZh: '泰國的重要節日',
    contentTh: `ประเทศไทยมีเทศกาลมากมายตลอดปี เช่น สงกรานต์ในเดือนเมษายน คนไทยรดน้ำดำหัวผู้ใหญ่และสนุกสนาน

เดือนพฤศจิกายนมีลอยกระทง ผู้คนปล่อยกระทงลงแม่น้ำเพื่อขอขอบคุณ

ช่วงปีใหม่และวันหยุดยาว ครอบครัวมักรวมญาติ ฉลองและกินอาหารร่วมกัน`,
    translationZh: `泰國全年節日很多，例如四月潑水節，泰國人向長輩潑水祝福，氣氛歡樂。

十一月有水燈節，人們把燈放上河感謝。

新年與連假期間，家人常團聚、慶祝並一起吃飯。`,
    questions: [
      { id: 'ar27-q1', thai: 'เทศกาลมากมาย', meaning: '很多節日' },
      { id: 'ar27-q2', thai: 'สงกรานต์', meaning: '潑水節' },
      { id: 'ar27-q3', thai: 'รดน้ำดำหัวผู้ใหญ่', meaning: '向長輩潑水祝福' },
      { id: 'ar27-q4', thai: 'ลอยกระทง', meaning: '水燈節' },
      { id: 'ar27-q5', thai: 'ปล่อยกระทงลงแม่น้ำ', meaning: '把燈放進河里' },
      { id: 'ar27-q6', thai: 'วันหยุดยาว', meaning: '連假' },
      { id: 'ar27-q7', thai: 'รวมญาติ', meaning: '親友團聚' },
      { id: 'ar27-q8', thai: 'ฉลองและกินอาหาร', meaning: '慶祝並吃飯' },
    ],
  },
]
