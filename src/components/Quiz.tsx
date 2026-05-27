import { useCallback, useEffect, useState } from 'react'
import type { KaraokeState } from '../hooks/useSpeech'
import { SpeechSpeedControl } from './SpeechSpeedControl'
import type { ThaiLookupKind } from '../utils/thaiLookup'
import { InteractiveThaiText } from './InteractiveThaiText'
import { SentenceAnalysisPanel } from './SentenceAnalysisPanel'
import { PhraseSegmentPanel } from './PhraseSegmentPanel'
import { WordLearnPanel } from './WordLearnPanel'
import { getLessonById } from '../data/lessons'
import { getWordExamples } from '../data/word-meta'
import type { QuizQuestion } from '../types'

interface QuizProps {
  questions: QuizQuestion[]
  topicLabel?: string
  variant?: 'word' | 'sentence' | 'article' | 'phonetics'
  phoneticsKind?: 'vowel' | 'tone'
  pointsPerCorrect?: number
  autoPlay: boolean
  hasThaiVoice: boolean | null
  speaking: boolean
  karaoke: KaraokeState | null
  speechRate: number
  onSpeechRateChange: (rate: number) => void
  onSpeak: (text: string) => void
  onResetKaraoke: () => void
  onAnswer: (correct: boolean, question: QuizQuestion) => void
  onUndoAnswer?: (wasCorrect: boolean, question: QuizQuestion) => void
  onComplete: (result: {
    correct: number
    roundScore: number
    newWrongCount: number
  }) => void
  onQuit: () => void
}

export function Quiz({
  questions,
  topicLabel,
  variant = 'word',
  phoneticsKind,
  pointsPerCorrect = 10,
  autoPlay,
  hasThaiVoice,
  speaking,
  karaoke,
  speechRate,
  onSpeechRateChange,
  onSpeak,
  onResetKaraoke,
  onAnswer,
  onUndoAnswer,
  onComplete,
  onQuit,
}: QuizProps) {
  type AnswerRecord = { selected: number; feedback: 'correct' | 'wrong' }

  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [roundCorrect, setRoundCorrect] = useState(0)
  const [roundScore, setRoundScore] = useState(0)
  const [newWrongCount, setNewWrongCount] = useState(0)
  const [showLearnExtra, setShowLearnExtra] = useState(false)
  const [answers, setAnswers] = useState<(AnswerRecord | null)[]>(() =>
    Array.from({ length: questions.length }, () => null),
  )

  const question = questions[index]
  const total = questions.length

  const recomputeRoundStats = useCallback(
    (records: (AnswerRecord | null)[]) => {
      let correct = 0
      let score = 0
      let wrong = 0
      for (const rec of records) {
        if (!rec) continue
        if (rec.feedback === 'correct') {
          correct += 1
          score += pointsPerCorrect
        } else {
          wrong += 1
        }
      }
      setRoundCorrect(correct)
      setRoundScore(score)
      setNewWrongCount(wrong)
    },
    [pointsPerCorrect],
  )

  const restoreQuestionUi = useCallback((i: number, records: (AnswerRecord | null)[]) => {
    const rec = records[i]
    setSelected(rec?.selected ?? null)
    setFeedback(rec?.feedback ?? null)
  }, [])

  useEffect(() => {
    onResetKaraoke()
    setShowLearnExtra(false)
  }, [index, question?.item.id, onResetKaraoke])

  useEffect(() => {
    restoreQuestionUi(index, answers)
  }, [index, answers, restoreQuestionUi])

  useEffect(() => {
    if (!question || !autoPlay) return
    const t = setTimeout(() => onSpeak(question.item.thai), 400)
    return () => clearTimeout(t)
  }, [index, question, autoPlay, onSpeak])

  const showKaraoke = karaoke?.text === question?.item.thai

  if (!question) return null

  const isWord = variant === 'word'
  const isSentence = variant === 'sentence'
  const isArticle = variant === 'article'
  const isPhonetics = variant === 'phonetics'
  const wordLesson = isWord ? getLessonById(question.item.id) : undefined
  const wordExtras = isWord ? question.wordExtras : undefined
  const wordExamples =
    wordLesson && wordExtras
      ? getWordExamples(wordLesson)
      : (wordExtras?.examples ?? [])
  const sentenceExtras = isSentence ? question.sentenceExtras : undefined
  const articleExtras = isArticle ? question.articleExtras : undefined
  const lookupKind: ThaiLookupKind = isPhonetics
    ? 'phonetics'
    : isWord
      ? 'word'
      : isSentence
        ? 'sentence'
        : 'article'
  const thaiSize = isPhonetics
    ? 'text-2xl sm:text-3xl'
    : isArticle
      ? 'text-base sm:text-lg'
      : isSentence
        ? 'text-lg sm:text-xl'
        : 'text-2xl sm:text-3xl'
  const optionSize =
    isSentence || isArticle || isPhonetics ? 'text-sm leading-snug' : 'text-base'

  const handleSelect = (optionIndex: number) => {
    if (selected !== null) return

    const correct = optionIndex === question.correctIndex
    const prev = answers[index]
    if (prev && onUndoAnswer) {
      onUndoAnswer(prev.feedback === 'correct', question)
    }

    const record: AnswerRecord = {
      selected: optionIndex,
      feedback: correct ? 'correct' : 'wrong',
    }
    const nextAnswers = [...answers]
    nextAnswers[index] = record
    setAnswers(nextAnswers)
    recomputeRoundStats(nextAnswers)

    setSelected(optionIndex)
    setFeedback(record.feedback)
    onAnswer(correct, question)
  }

  const resetCurrentAnswer = () => {
    const prev = answers[index]
    if (!prev) return
    if (onUndoAnswer) {
      onUndoAnswer(prev.feedback === 'correct', question)
    }
    const nextAnswers = [...answers]
    nextAnswers[index] = null
    setAnswers(nextAnswers)
    recomputeRoundStats(nextAnswers)
    setSelected(null)
    setFeedback(null)
    setShowLearnExtra(false)
  }

  const goPrev = () => {
    if (index <= 0) return
    setIndex((i) => i - 1)
  }

  const goNext = () => {
    const answered = answers[index] !== null
    if (!answered) return

    if (index + 1 >= total) {
      onComplete({ correct: roundCorrect, roundScore, newWrongCount })
      return
    }
    setIndex((i) => i + 1)
  }

  const canGoPrev = index > 0
  const canGoNext = answers[index] !== null

  const getOptionClass = (i: number) => {
    const base = `flex min-h-[3.25rem] items-center justify-center rounded-xl px-2 py-2.5 text-center font-medium shadow-sm ring-1 transition active:scale-[0.98] ${optionSize}`

    if (selected === null) {
      return `${base} bg-white text-slate-800 ring-slate-200 hover:bg-amber-50`
    }
    if (i === question.correctIndex) {
      return `${base} bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500`
    }
    if (i === selected) {
      return `${base} bg-red-50 text-red-800 ring-2 ring-red-400`
    }
    return `${base} bg-slate-50 text-slate-400 ring-slate-100`
  }

  return (
    <div className="mx-auto flex h-dvh max-w-md flex-col overflow-hidden px-4 py-3">
      {/* 頂部：返回、進度、速度 */}
      <header className="shrink-0 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onQuit}
              className="text-sm text-slate-500 hover:text-slate-800"
            >
              ← 返回
            </button>
            {canGoPrev && (
              <button
                type="button"
                onClick={goPrev}
                className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-sky-700 sm:text-sm"
              >
                ← 上一題
              </button>
            )}
          </div>
          <div className="min-w-0 text-right">
            {topicLabel && (
              <p className="truncate text-xs font-medium text-amber-600">{topicLabel}</p>
            )}
            <span className="text-sm font-medium text-slate-600">
              {index + 1} / {total}
            </span>
          </div>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-amber-500 transition-all duration-300"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
        <SpeechSpeedControl rate={speechRate} onChange={onSpeechRateChange} compact />
        {hasThaiVoice === false && (
          <p className="rounded-lg bg-amber-50 px-2 py-1.5 text-xs text-amber-800 ring-1 ring-amber-200">
            建議使用 Chrome／Safari 並安裝泰文語音
          </p>
        )}
      </header>

      {/* 題目：播放 + 泰文（橫向緊湊） */}
      <section className="mt-3 shrink-0">
        <div className="flex items-stretch gap-3">
          <button
            type="button"
            onClick={() => onSpeak(question.item.thai)}
            disabled={speaking}
            className="flex h-14 w-14 shrink-0 items-center justify-center self-center rounded-full bg-amber-500 text-2xl text-white shadow-md hover:bg-amber-600 active:scale-95 disabled:opacity-70"
            aria-label={`播放泰文：${question.item.thai}`}
          >
            {speaking ? '🔊' : '▶️'}
          </button>
          <div className="min-w-0 flex-1 rounded-xl bg-slate-900/90 px-3 py-2.5 text-center">
            <InteractiveThaiText
              text={question.item.thai}
              className={`font-semibold ${thaiSize}`}
              romanClassName="text-xs text-amber-200/85"
              inverted
              hintStudyId={question.item.id}
              hintKind={lookupKind}
              tokenize
              onSpeak={onSpeak}
              speaking={speaking}
              karaoke={
                showKaraoke
                  ? { activeUnitIndex: Math.max(0, karaoke!.activeUnitIndex) }
                  : undefined
              }
            />
          </div>
        </div>
        <p className="mt-1.5 text-center text-[11px] text-slate-400">
          {isPhonetics
            ? phoneticsKind === 'vowel'
              ? '聽讀音，選正確元音'
              : phoneticsKind === 'tone'
                ? '聽讀音，選正確聲調'
                : '聽讀音，選正確名稱'
            : isArticle
              ? '聽短語，選中文意思 · 點短語可看分詞分析與例句 · 答題後可展開'
              : isSentence
                ? '聽句子，選中文翻譯 · 可點句中單字 · 答題後可看句子分析'
                : '聽泰文選意思 · 點單字查例句 · 答題後可看分詞與例句'}
        </p>
      </section>

      {/* 四選一：2×2 固定於畫面中下方，無需捲動 */}
      <section className="mt-3 grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-2 content-stretch">
        {question.options.map((option, i) => (
          <button
            key={`${question.item.id}-${option}`}
            type="button"
            disabled={selected !== null}
            onClick={() => handleSelect(i)}
            className={getOptionClass(i)}
          >
            <span className="line-clamp-4">{option}</span>
          </button>
        ))}
      </section>

      {/* 題間導覽：固定雙欄，第 2 題起一定看得到上一題 */}
      <nav
        className="mt-2 grid shrink-0 gap-2 border-t border-slate-200 pt-2"
        style={{ gridTemplateColumns: canGoPrev ? '1fr 1fr' : '1fr' }}
        aria-label="題間導覽"
      >
        {canGoPrev && (
          <button
            type="button"
            onClick={goPrev}
            className="rounded-xl bg-sky-600 py-3 text-sm font-bold text-white shadow-md hover:bg-sky-700 active:scale-[0.98]"
          >
            ← 上一題
          </button>
        )}
        <button
          type="button"
          onClick={goNext}
          disabled={!canGoNext}
          className="rounded-xl bg-slate-900 py-3 text-sm font-bold text-white shadow-md hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {index + 1 >= total ? '查看結果 →' : '下一題 →'}
        </button>
      </nav>

      {/* 答題後：例句可展開 */}
      {feedback && (
        <footer className="mt-2 shrink-0 space-y-2">
          <p
            className={`text-sm font-semibold ${feedback === 'correct' ? 'text-emerald-600' : 'text-red-600'}`}
          >
            {feedback === 'correct' ? '答對了！' : '答錯了'}
            <span className="ml-2 font-normal text-slate-600">{question.item.meaning}</span>
          </p>
          <button
            type="button"
            onClick={resetCurrentAnswer}
            className="text-xs text-slate-500 hover:text-slate-800"
          >
            重新作答
          </button>

          {wordExtras && (
            <>
              <button
                type="button"
                onClick={() => setShowLearnExtra((v) => !v)}
                className="w-full text-center text-xs font-medium text-sky-700 hover:text-sky-900"
              >
                {showLearnExtra ? '收起例句與提示 ▲' : '展開例句與易混淆提示 ▼'}
              </button>
              {showLearnExtra && (
                <div className="max-h-[28vh] overflow-y-auto rounded-xl bg-slate-50 p-2 ring-1 ring-slate-200">
                  <WordLearnPanel
                    examples={wordExamples}
                    pitfalls={wordExtras.pitfalls}
                    phraseAnalysis={wordExtras.phraseAnalysis}
                    speaking={speaking}
                    onSpeak={onSpeak}
                  />
                </div>
              )}
            </>
          )}

          {articleExtras && (
            <>
              <button
                type="button"
                onClick={() => setShowLearnExtra((v) => !v)}
                className="w-full text-center text-xs font-medium text-violet-700 hover:text-violet-900"
              >
                {showLearnExtra ? '收起分詞分析與例句 ▲' : '展開分詞分析與例句 ▼'}
              </button>
              {showLearnExtra && (
                <div className="max-h-[32vh] overflow-y-auto rounded-xl bg-violet-50/50 p-2 ring-1 ring-violet-100">
                  <PhraseSegmentPanel
                    analysis={articleExtras.phraseAnalysis}
                    speaking={speaking}
                    onSpeak={onSpeak}
                  />
                </div>
              )}
            </>
          )}

          {sentenceExtras && (
            <>
              <button
                type="button"
                onClick={() => setShowLearnExtra((v) => !v)}
                className="w-full text-center text-xs font-medium text-indigo-700 hover:text-indigo-900"
              >
                {showLearnExtra ? '收起句子分析 ▲' : '展開句子分析 ▼'}
              </button>
              {showLearnExtra && (
                <div className="max-h-[32vh] overflow-y-auto rounded-xl bg-indigo-50/50 p-2 ring-1 ring-indigo-100">
                  <SentenceAnalysisPanel
                    analysis={sentenceExtras.analysis}
                    speaking={speaking}
                    onSpeak={onSpeak}
                  />
                </div>
              )}
            </>
          )}
        </footer>
      )}
    </div>
  )
}
