import {
  LESSONS,
  QUESTIONS_PER_ROUND,
  getLessonsByCategory,
} from '../data/lessons'
import { getPitfallLessons, getTonePairLessons } from '../data/lessons'
import { getWordExamples, getWordPitfalls } from '../data/word-meta'
import type { LessonItem, WordQuizExtras } from '../types'
import {
  ARTICLES_PER_ROUND,
  getAllArticleQuestions,
  getArticleById,
  getArticlesByCategory,
} from '../data/articles'
import {
  SENTENCES,
  SENTENCES_PER_ROUND,
  getSentencesByCategory,
} from '../data/sentences'
import { buildSentenceAnalysis } from './sentenceAnalysis'
import { buildPhraseAnalysis } from './phraseAnalysis'
import { TONES } from '../data/tones'
import { VOWELS, VOWEL_QUIZ_COUNT } from '../data/vowels'
import type {
  PhoneticsItem,
  PhoneticsType,
  PracticeTopic,
  QuizQuestion,
  SentencePracticeTopic,
  ArticlePracticeTopic,
  SentenceItem,
  SentenceQuizExtras,
  ArticleQuizExtras,
  StudyItem,
} from '../types'

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function buildQuestion(item: StudyItem, pool: StudyItem[]): QuizQuestion {
  const meanings = pool
    .filter((p) => p.id !== item.id && p.meaning !== item.meaning)
    .map((p) => p.meaning)
  const uniqueMeanings = [...new Set(meanings)]
  const distractors = shuffle(uniqueMeanings).slice(0, 3)

  const options = shuffle([item.meaning, ...distractors])
  const correctIndex = options.indexOf(item.meaning)

  return { item, options, correctIndex }
}

function collectPitfallMeanings(lessonId: string): string[] {
  const pitfalls = getWordPitfalls(lessonId)
  const fromLinks = pitfalls
    .map((p) => p.lessonId)
    .filter((id): id is string => Boolean(id))
    .map((id) => LESSONS.find((l) => l.id === id)?.meaning)
    .filter((m): m is string => Boolean(m))
  return [...pitfalls.map((p) => p.meaning), ...fromLinks]
}

export function buildWordQuestion(lesson: LessonItem, pool: LessonItem[]): QuizQuestion {
  const item: StudyItem = {
    id: lesson.id,
    thai: lesson.thai,
    meaning: lesson.meaning,
  }
  const pitfallMeanings = collectPitfallMeanings(lesson.id).filter((m) => m !== lesson.meaning)
  const uniquePitfall = [...new Set(pitfallMeanings)]

  const poolMeanings = pool
    .filter((p) => p.id !== lesson.id && p.meaning !== lesson.meaning)
    .map((p) => p.meaning)
  const uniquePool = [...new Set(poolMeanings)]

  const distractors: string[] = []
  for (const m of shuffle(uniquePitfall)) {
    if (distractors.length >= 3) break
    if (!distractors.includes(m)) distractors.push(m)
  }
  for (const m of shuffle(uniquePool)) {
    if (distractors.length >= 3) break
    if (!distractors.includes(m)) distractors.push(m)
  }

  const options = shuffle([lesson.meaning, ...distractors.slice(0, 3)])
  const wordExtras: WordQuizExtras = {
    examples: getWordExamples(lesson),
    pitfalls: getWordPitfalls(lesson.id),
  }

  return {
    item,
    options,
    correctIndex: options.indexOf(lesson.meaning),
    wordExtras,
  }
}

export function buildWordRound(lessons: LessonItem[]): QuizQuestion[] {
  return shuffle(lessons).map((lesson) => buildWordQuestion(lesson, lessons))
}

export function buildRound(items: StudyItem[]): QuizQuestion[] {
  const shuffled = shuffle(items)
  return shuffled.map((item) => buildQuestion(item, items))
}

export function buildPracticeRound(topic: PracticeTopic): QuizQuestion[] {
  if (topic === 'confusable') {
    const pool = getPitfallLessons()
    const count = Math.min(pool.length, QUESTIONS_PER_ROUND)
    return buildWordRound(pool).slice(0, count)
  }
  if (topic === 'tonePair') {
    const pool = getTonePairLessons()
    const count = Math.min(pool.length, QUESTIONS_PER_ROUND)
    return buildWordRound(pool).slice(0, count)
  }
  const pool = topic === 'all' ? LESSONS : getLessonsByCategory(topic)
  const count = Math.min(pool.length, QUESTIONS_PER_ROUND)
  return buildWordRound(pool).slice(0, count)
}

export function buildSentenceQuestion(
  sentence: SentenceItem,
  pool: SentenceItem[],
): QuizQuestion {
  const item: StudyItem = {
    id: sentence.id,
    thai: sentence.thai,
    meaning: sentence.meaning,
  }
  const meanings = pool
    .filter((p) => p.id !== sentence.id && p.meaning !== sentence.meaning)
    .map((p) => p.meaning)
  const distractors = shuffle([...new Set(meanings)]).slice(0, 3)
  const options = shuffle([sentence.meaning, ...distractors])
  const sentenceExtras: SentenceQuizExtras = {
    analysis: buildSentenceAnalysis(sentence),
  }
  return {
    item,
    options,
    correctIndex: options.indexOf(sentence.meaning),
    sentenceExtras,
  }
}

export function buildSentenceRound(topic: SentencePracticeTopic): QuizQuestion[] {
  const pool = topic === 'all' ? SENTENCES : getSentencesByCategory(topic)
  const count = Math.min(pool.length, SENTENCES_PER_ROUND)
  return shuffle(pool)
    .map((s) => buildSentenceQuestion(s, pool))
    .slice(0, count)
}

function phoneticsToStudyItem(item: PhoneticsItem): StudyItem {
  return { id: item.id, thai: item.display, meaning: item.nameZh }
}

export function buildArticleQuestion(
  question: StudyItem,
  pool: StudyItem[],
): QuizQuestion {
  const meanings = pool
    .filter((p) => p.id !== question.id && p.meaning !== question.meaning)
    .map((p) => p.meaning)
  const distractors = shuffle([...new Set(meanings)]).slice(0, 3)
  const options = shuffle([question.meaning, ...distractors])
  const articleExtras: ArticleQuizExtras = {
    phraseAnalysis: buildPhraseAnalysis(question.id, question.thai, question.meaning),
  }
  return {
    item: question,
    options,
    correctIndex: options.indexOf(question.meaning),
    articleExtras,
  }
}

export function buildArticleRound(topic: ArticlePracticeTopic): QuizQuestion[] {
  const pool =
    topic === 'all'
      ? getAllArticleQuestions()
      : getArticlesByCategory(topic).flatMap((a) => a.questions)
  const studyPool = pool.map((q) => ({ id: q.id, thai: q.thai, meaning: q.meaning }))
  const count = Math.min(studyPool.length, ARTICLES_PER_ROUND)
  return shuffle(studyPool)
    .map((q) => buildArticleQuestion(q, studyPool))
    .slice(0, count)
}

export function buildArticleQuizForArticle(articleId: string): QuizQuestion[] {
  const article = getArticleById(articleId)
  if (!article) return []
  const studyPool = article.questions.map((q) => ({
    id: q.id,
    thai: q.thai,
    meaning: q.meaning,
  }))
  return studyPool.map((q) => buildArticleQuestion(q, studyPool))
}

export function buildPhoneticsRound(type: PhoneticsType): QuizQuestion[] {
  const pool = type === 'vowel' ? VOWELS : TONES
  const studyPool = pool.map(phoneticsToStudyItem)
  const count =
    type === 'vowel'
      ? Math.min(pool.length, VOWEL_QUIZ_COUNT)
      : pool.length
  return buildRound(studyPool).slice(0, count)
}
