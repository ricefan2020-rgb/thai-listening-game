export type LessonCategory =
  | 'greeting'
  | 'travel'
  | 'food'
  | 'fruit'
  | 'feeling'
  | 'emotion'
  | 'time'
  | 'holiday'
  | 'color'
  | 'object'
  | 'furniture'
  | 'body'
  | 'animal'

/** 單字學習提示：同音字、同字不同義、易混淆、同字異聲調 */
export type WordPitfallKind = 'homophone' | 'polyseme' | 'confusable' | 'tonePair'

export interface WordPitfall {
  kind: WordPitfallKind
  thai: string
  meaning: string
  noteZh: string
  /** 詞庫中對應的單字 id，可一鍵對照 */
  lessonId?: string
}

export interface WordExample {
  exampleTh: string
  exampleZh: string
}

export interface LessonItem {
  id: string
  thai: string
  meaning: string
  category: LessonCategory
}

export interface WordQuizExtras {
  examples: WordExample[]
  pitfalls: WordPitfall[]
  /** 可拆詞時顯示分詞分析（如 ช่วงเช้า） */
  phraseAnalysis?: PhraseAnalysis
}

export type SegmentRole =
  | 'subject'
  | 'verb'
  | 'object'
  | 'modifier'
  | 'particle'
  | 'question'
  | 'connector'
  | 'phrase'

export interface CompoundPart {
  thai: string
  meaning: string
}

/** 組合字：由子詞推估整詞義 */
export interface CompoundAnalysis {
  parts: CompoundPart[]
  /** 各單字義組合推估，如「โรง（館）+ พยาบาล（醫護）→ 醫院」 */
  inferredZh: string
  patternZh?: string
}

export interface SentenceSegmentAnalysis {
  thai: string
  meaning: string
  role: SegmentRole
  roleZh: string
  /** 可拆解的組合字分析 */
  compound?: CompoundAnalysis
}

export interface SentenceAnalysis {
  sentenceId: string
  fullThai: string
  translationZh: string
  segments: SentenceSegmentAnalysis[]
  grammarNoteZh: string
  structureZh?: string
}

export interface SentenceQuizExtras {
  analysis: SentenceAnalysis
}

export interface PhraseSegment {
  thai: string
  meaning: string
  roleZh?: string
}

/** 同句型的相似組合字對照 */
export interface SimilarCompoundExample {
  thai: string
  meaningZh: string
  segments: PhraseSegment[]
}

export interface PhraseAnalysis {
  phraseId: string
  fullThai: string
  translationZh: string
  segments: PhraseSegment[]
  structureZh?: string
  noteZh: string
  examples: WordExample[]
  /** 結構相近的組合字，便於類推句型 */
  similarCompounds?: SimilarCompoundExample[]
  similarPatternZh?: string
}

export interface ArticleQuizExtras {
  phraseAnalysis: PhraseAnalysis
}

export type StudyLevel = 'word' | 'sentence' | 'article'

export type PhoneticsType = 'vowel' | 'tone'

export interface PhoneticsItem {
  id: string
  type: PhoneticsType
  display: string
  speakText: string
  nameZh: string
  symbol: string
  hintZh: string
  roman: string
}

export type WrongLevel = StudyLevel | PhoneticsType

export type ArticleCategory = 'travel' | 'daily' | 'food' | 'culture' | 'news'

export type HomeTab = StudyLevel | 'foundation'

export type ArticlePracticeTopic = ArticleCategory | 'all'

export type SentenceCategory =
  | 'greeting'
  | 'travel'
  | 'daily'
  | 'food'
  | 'shopping'

export interface SentenceItem {
  id: string
  thai: string
  meaning: string
  category: SentenceCategory
}

export interface StudyItem {
  id: string
  thai: string
  meaning: string
}

export interface WrongItem {
  id: string
  thai: string
  meaning: string
  wrongAt: number
  level: WrongLevel
}

export interface ProgressData {
  score: number
  bestScore: number
  streak: number
  wrongItems: WrongItem[]
}

export interface QuizQuestion {
  item: StudyItem
  options: string[]
  correctIndex: number
  /** 單字練習專用：例句與易混提示 */
  wordExtras?: WordQuizExtras
  /** 句子練習專用：句子分析 */
  sentenceExtras?: SentenceQuizExtras
  /** 短文測驗專用：分詞解釋 */
  articleExtras?: ArticleQuizExtras
}

export type Screen =
  | 'home'
  | 'quiz'
  | 'result'
  | 'phonetics-learn'
  | 'pronunciation-tips'
  | 'article-read'

export type GameMode = 'practice' | 'review'

export type PracticeTopic = LessonCategory | 'all' | 'confusable' | 'tonePair'

export type SentencePracticeTopic = SentenceCategory | 'all'

export interface RoundResult {
  correct: number
  total: number
  roundScore: number
  newWrongCount: number
  topicLabel?: string
}
