import { getAllArticleQuestions } from '../data/articles'
import { CATEGORY_LABELS, LESSONS, getLessonById } from '../data/lessons'
import { SENTENCES } from '../data/sentences'
import { TONES } from '../data/tones'
import { VOWELS } from '../data/vowels'
import { getWordExamples, getWordPitfalls } from '../data/word-meta'
import { splitThaiKaraokeUnits } from './thaiKaraoke'
import { decomposeThaiCompound, invalidateCompoundMeaningCache } from './compoundWord'
import { tokenizeThaiPhraseUnits } from './thaiToneRoman'
import {
  getUserVocabItem,
  loadUserVocab,
  userVocabId,
} from './userVocab'
import { getSentenceAnalysisById } from './sentenceAnalysis'
import { buildPhraseAnalysis } from './phraseAnalysis'
import type {
  CompoundAnalysis,
  LessonItem,
  PhraseAnalysis,
  SentenceAnalysis,
  WordExample,
  WordPitfall,
} from '../types'

export type ThaiLookupKind = 'word' | 'sentence' | 'article' | 'phonetics'

export interface ThaiLookupEntry {
  thai: string
  meaning: string
  tag?: string
  lessonId?: string
}

export interface ThaiLookupResult {
  query: string
  kind: ThaiLookupKind
  entries: ThaiLookupEntry[]
  examples?: WordExample[]
  pitfalls: WordPitfall[]
  hintZh?: string
  /** 句子練習：整句語法拆解 */
  analysis?: SentenceAnalysis
  /** 短文／短語：分詞解釋 */
  phraseAnalysis?: PhraseAnalysis
  /** 組合字：子詞推估字義 */
  compound?: CompoundAnalysis
}

interface Lexeme {
  thai: string
  kind: ThaiLookupKind
  id: string
}

/** 句中點詞用：僅單字級，不含整句（避免整句被一口吃掉） */
const EXTRA_WORD_LEXEMES: Lexeme[] = [
  { thai: 'ผม', kind: 'word', id: '_phom' },
  { thai: 'ฉัน', kind: 'word', id: '_chan' },
  { thai: 'ครับ', kind: 'word', id: '_khrap' },
  { thai: 'ค่ะ', kind: 'word', id: '_kha' },
  { thai: 'คุณ', kind: 'word', id: '_khun' },
  { thai: 'ไหม', kind: 'word', id: '_mai' },
  { thai: 'ได้', kind: 'word', id: '_dai' },
  { thai: 'ที่', kind: 'word', id: '_thi' },
  { thai: 'และ', kind: 'word', id: '_lae' },
  { thai: 'กับ', kind: 'word', id: '_kap' },
  { thai: 'ใน', kind: 'word', id: '_nai' },
  { thai: 'ของ', kind: 'word', id: '_khong' },
  { thai: 'มี', kind: 'word', id: '_mii' },
  { thai: 'เป็น', kind: 'word', id: '_pen' },
  { thai: 'อยู่', kind: 'word', id: '_yu' },
  { thai: 'สร้าง', kind: 'word', id: '_sang' },
  { thai: 'ความสัมพันธ์', kind: 'word', id: '_khwamsamphan' },
  { thai: 'ความ', kind: 'word', id: '_khwam' },
  { thai: 'จอง', kind: 'word', id: '_jong' },
  { thai: 'สั่ง', kind: 'word', id: '_sang_order' },
  { thai: 'เช็คบิล', kind: 'word', id: '_checkbill' },
  { thai: 'ยา', kind: 'word', id: '_ya' },
  { thai: 'สถานี', kind: 'word', id: '_station' },
  { thai: 'คำศัพท์', kind: 'word', id: '_khamsap' },
  { thai: 'ใหม่', kind: 'word', id: '_mai_new' },
  { thai: 'ฝึก', kind: 'word', id: '_fuek' },
  { thai: 'อ่าน', kind: 'word', id: '_an' },
  { thai: 'แนะนำ', kind: 'word', id: '_naenam' },
  { thai: 'เมนู', kind: 'word', id: '_menu' },
  { thai: 'อะไร', kind: 'word', id: '_arai' },
  { thai: 'ตำ', kind: 'word', id: '_tam' },
]

function buildWordLexicon(): Lexeme[] {
  const byThai = new Map<string, Lexeme>()
  for (const e of [
    ...EXTRA_WORD_LEXEMES,
    ...LESSONS.map((l) => ({ thai: l.thai, kind: 'word' as const, id: l.id })),
    ...loadUserVocab().map((u) => ({
      thai: u.thai,
      kind: 'word' as const,
      id: userVocabId(u.thai),
    })),
  ]) {
    if (!byThai.has(e.thai)) byThai.set(e.thai, e)
  }
  return [...byThai.values()].sort((a, b) => b.thai.length - a.thai.length)
}

let wordLexiconCache: Lexeme[] | null = null

function getWordLexicon(): Lexeme[] {
  if (!wordLexiconCache) wordLexiconCache = buildWordLexicon()
  return wordLexiconCache
}

export function invalidateLookupCaches(): void {
  wordLexiconCache = null
  invalidateCompoundMeaningCache()
}

/** 短文測驗短語（可整段或拆詞點選） */
const ARTICLE_PHRASE_LEXICON: Lexeme[] = getAllArticleQuestions()
  .map((q) => ({ thai: q.thai, kind: 'article' as const, id: q.id }))
  .sort((a, b) => b.thai.length - a.thai.length)

function getLexiconForTokenize(opts?: { articlePhrases?: boolean }): Lexeme[] {
  if (!opts?.articlePhrases) return getWordLexicon()
  const byThai = new Map<string, Lexeme>()
  for (const e of [...ARTICLE_PHRASE_LEXICON, ...getWordLexicon()]) {
    if (!byThai.has(e.thai)) byThai.set(e.thai, e)
  }
  return [...byThai.values()].sort((a, b) => b.thai.length - a.thai.length)
}

const PHRASE_LEXICON: Lexeme[] = [
  ...SENTENCES.map((s) => ({ thai: s.thai, kind: 'sentence' as const, id: s.id })),
  ...getAllArticleQuestions().map((q) => ({
    thai: q.thai,
    kind: 'article' as const,
    id: q.id,
  })),
  ...LESSONS.map((l) => ({ thai: l.thai, kind: 'word' as const, id: l.id })),
].sort((a, b) => b.thai.length - a.thai.length)

function buildFromUserVocab(thai: string): ThaiLookupResult | null {
  const item = getUserVocabItem(thai)
  if (!item) return null
  const compound = decomposeThaiCompound(item.thai) ?? undefined
  return {
    query: item.thai,
    kind: 'word',
    entries: [{ thai: item.thai, meaning: item.meaning, tag: '我的詞庫' }],
    pitfalls: [],
    compound,
  }
}

function buildFromLesson(lesson: LessonItem): ThaiLookupResult {
  const sameThai = LESSONS.filter((l) => l.thai === lesson.thai)
  const compound = decomposeThaiCompound(lesson.thai) ?? undefined
  return {
    query: lesson.thai,
    kind: 'word',
    entries: sameThai.map((l) => ({
      thai: l.thai,
      meaning: l.meaning,
      tag: CATEGORY_LABELS[l.category],
      lessonId: l.id,
    })),
    examples: getWordExamples(lesson),
    pitfalls: getWordPitfalls(lesson.id),
    compound,
  }
}

export function lookupByStudyId(
  id: string,
  kind: ThaiLookupKind,
): ThaiLookupResult | null {
  if (kind === 'word') {
    if (id.startsWith('uv_')) {
      const thai = id.slice(3)
      return buildFromUserVocab(thai)
    }
    const lesson = getLessonById(id)
    return lesson ? buildFromLesson(lesson) : null
  }
  if (kind === 'sentence') {
    const s = SENTENCES.find((x) => x.id === id)
    if (!s) return null
    const analysis = getSentenceAnalysisById(s.id)
    return {
      query: s.thai,
      kind: 'sentence',
      entries: [{ thai: s.thai, meaning: s.meaning, tag: '句子' }],
      pitfalls: [],
      analysis: analysis ?? undefined,
    }
  }
  if (kind === 'article') {
    const q = getAllArticleQuestions().find((x) => x.id === id)
    if (!q) return null
    const phraseAnalysis = buildPhraseAnalysis(q.id, q.thai, q.meaning)
    const compound = decomposeThaiCompound(q.thai) ?? undefined
    return {
      query: q.thai,
      kind: 'article',
      entries: [{ thai: q.thai, meaning: q.meaning, tag: '短文' }],
      pitfalls: [],
      phraseAnalysis,
      examples: phraseAnalysis.examples,
      compound,
    }
  }
  if (kind === 'phonetics') {
    const v = VOWELS.find((x) => x.id === id)
    if (v) {
      return {
        query: v.display,
        kind: 'phonetics',
        entries: [{ thai: v.display, meaning: v.nameZh, tag: '元音' }],
        pitfalls: [],
        hintZh: v.hintZh,
      }
    }
    const t = TONES.find((x) => x.id === id)
    if (t) {
      return {
        query: t.display,
        kind: 'phonetics',
        entries: [{ thai: t.display, meaning: t.nameZh, tag: '聲調' }],
        pitfalls: [],
        hintZh: t.hintZh,
      }
    }
  }
  return null
}

function buildFromExtraWord(thai: string): ThaiLookupResult | null {
  const extra = EXTRA_WORD_LEXEMES.find((e) => e.thai === thai)
  if (!extra) return null
  const meanings: Record<string, string> = {
    _phom: '我（男性自稱）',
    _chan: '我（女性／通用口語）',
    _khrap: '禮貌語尾（男性常用）',
    _kha: '禮貌語尾（女性常用）',
    _khun: '你／您',
    _mai: '嗎（疑問語氣）',
    _dai: '可以／能夠',
    _thi: '……的／在（連接）',
    _lae: '和／與',
    _kap: '和／與',
    _nai: '在……裡',
    _khong: '……的（所屬）',
    _mii: '有',
    _pen: '是',
    _yu: '在／位於',
    _pai: '去（低調）',
    _ma: '來',
    _sang: '建立／製造',
    _khwamsamphan: '關係',
    _khwam: '內容／事情（常與他詞組合）',
    _jong: '預訂',
    _sang_order: '點餐',
    _checkbill: '買單',
    _ya: '藥',
    _station: '車站',
    _khamsap: '詞彙／單字',
    _mai_new: '新的',
    _fuek: '練習',
    _an: '讀',
    _naenam: '推薦',
    _menu: '菜單',
    _arai: '什麼',
    _tam: '舂／搗碎（常見於 ส้มตำ 青木瓜沙拉）',
  }
  const hints: Record<string, string> = {
    _tam: '發音 tam（ต 不送氣），勿與 ทำ tham（做）混淆',
    _pai: 'ไป＝去（低調）。常見：ไปไหน、ไปตลาด。',
  }
  return {
    query: thai,
    kind: 'word',
    entries: [{ thai, meaning: meanings[extra.id] ?? thai, tag: '常用詞' }],
    pitfalls: [],
    hintZh: hints[extra.id],
  }
}

export function shouldAutoTokenize(text: string): boolean {
  const t = text.trim()
  if (!t) return false
  if (t.includes(' ')) return true
  const units = splitThaiKaraokeUnits(t)
  if (units.length >= 5) return true
  for (const lex of getWordLexicon()) {
    if (lex.thai.length < t.length && t.includes(lex.thai)) return true
  }
  return false
}

export function lookupThaiText(text: string): ThaiLookupResult | null {
  const query = text.trim()
  if (!query) return null

  const user = buildFromUserVocab(query)
  if (user) return user

  const lessons = LESSONS.filter((l) => l.thai === query)
  if (lessons.length > 0) return buildFromLesson(lessons[0])

  const extra = buildFromExtraWord(query)
  if (extra) return extra

  const sentence = SENTENCES.find((s) => s.thai === query)
  if (sentence) {
    const analysis = getSentenceAnalysisById(sentence.id)
    return {
      query,
      kind: 'sentence',
      entries: [{ thai: sentence.thai, meaning: sentence.meaning, tag: '句子' }],
      pitfalls: [],
      analysis: analysis ?? undefined,
    }
  }

  const articleQ = getAllArticleQuestions().find((q) => q.thai === query)
  if (articleQ) {
    const phraseAnalysis = buildPhraseAnalysis(articleQ.id, articleQ.thai, articleQ.meaning)
    const compound = decomposeThaiCompound(articleQ.thai) ?? undefined
    return {
      query,
      kind: 'article',
      entries: [{ thai: articleQ.thai, meaning: articleQ.meaning, tag: '短文' }],
      pitfalls: [],
      phraseAnalysis,
      compound,
    }
  }

  return null
}

export type ThaiTextSegment =
  | { type: 'text'; text: string }
  | { type: 'lexeme'; text: string; lexeme: Lexeme }

function findLexemeMatch(
  lexicon: Lexeme[],
  units: string[],
  start: number,
): { lex: Lexeme; unitLen: number } | null {
  for (let len = units.length - start; len >= 1; len--) {
    const candidate = units.slice(start, start + len).join('')
    const lex = lexicon.find((l) => l.thai === candidate)
    if (lex) return { lex, unitLen: len }
  }
  return null
}

function hasLexiconPrefix(lexicon: Lexeme[], prefix: string): boolean {
  return lexicon.some((l) => l.thai.startsWith(prefix) && l.thai.length > prefix.length)
}

/** 依音節合併後最長匹配詞庫單字（專供句中點詞） */
export function tokenizeThaiForLookup(
  text: string,
  opts?: { articlePhrases?: boolean },
): ThaiTextSegment[] {
  const lexicon = getLexiconForTokenize(opts)
  const trimmed = text.trim()

  const phraseUnits = tokenizeThaiPhraseUnits(trimmed)
  if (phraseUnits.length >= 2) {
    const fromPhrase: ThaiTextSegment[] = []
    let hasLexeme = false
    for (const u of phraseUnits) {
      if (u === ' ' || u === '\n') {
        fromPhrase.push({ type: 'text', text: u })
        continue
      }
      const lex = lexicon.find((l) => l.thai === u)
      if (lex) {
        fromPhrase.push({ type: 'lexeme', text: u, lexeme: lex })
        hasLexeme = true
      } else {
        fromPhrase.push({ type: 'text', text: u })
      }
    }
    if (hasLexeme) return fromPhrase
  }

  const units = splitThaiKaraokeUnits(text)
  const segments: ThaiTextSegment[] = []
  let i = 0

  while (i < units.length) {
    const u = units[i]
    if (u === ' ' || u === '\n') {
      segments.push({ type: 'text', text: u })
      i += 1
      continue
    }

    const matched = findLexemeMatch(lexicon, units, i)
    if (matched) {
      segments.push({
        type: 'lexeme',
        text: matched.lex.thai,
        lexeme: matched.lex,
      })
      i += matched.unitLen
      continue
    }

    // 合併連續音節，避免拆成 สัม｜พันธ์；直到能匹配詞庫或確定無更長詞
    let j = i + 1
    while (j < units.length && units[j] !== ' ' && units[j] !== '\n') {
      const buffered = units.slice(i, j).join('')
      if (findLexemeMatch(lexicon, units, i)?.unitLen === j - i) break
      if (!hasLexiconPrefix(lexicon, buffered)) break
      j += 1
    }

    const buffered = units.slice(i, j).join('')
    const bufferMatch = findLexemeMatch(lexicon, units, i)
    if (bufferMatch && bufferMatch.unitLen === j - i) {
      segments.push({
        type: 'lexeme',
        text: bufferMatch.lex.thai,
        lexeme: bufferMatch.lex,
      })
      i += bufferMatch.unitLen
      continue
    }

    if (buffered.length > 0) {
      segments.push({ type: 'text', text: buffered })
      i = j
    } else {
      segments.push({ type: 'text', text: units[i] })
      i += 1
    }
  }

  return segments.length > 0 ? segments : [{ type: 'text', text }]
}

export function lookupLexeme(lexeme: Lexeme): ThaiLookupResult | null {
  if (lexeme.id.startsWith('_')) {
    return buildFromExtraWord(lexeme.thai)
  }
  return lookupByStudyId(lexeme.id, lexeme.kind)
}

/** 整句／整段查詢（含句子、短文題） */
export function lookupPhrase(text: string): ThaiLookupResult | null {
  const query = text.trim()
  if (!query) return null

  for (const lex of PHRASE_LEXICON) {
    if (lex.thai === query) {
      return lookupByStudyId(lex.id, lex.kind)
    }
  }
  return lookupThaiText(query)
}
