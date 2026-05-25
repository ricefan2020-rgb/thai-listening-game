import { useCallback, useMemo, useState } from 'react'
import { ArticleRead } from './components/ArticleRead'
import { Home } from './components/Home'
import { PhoneticsLearn } from './components/PhoneticsLearn'
import { PronunciationTips } from './components/PronunciationTips'
import { Quiz } from './components/Quiz'
import { Result } from './components/Result'
import { LESSONS, getLessonById, getTopicLabel } from './data/lessons'
import {
  getAllArticleQuestions,
  getArticleById,
  getArticleTopicLabel,
} from './data/articles'
import { SENTENCES, getSentenceTopicLabel } from './data/sentences'
import { TONES } from './data/tones'
import { VOWELS } from './data/vowels'
import { useProgress } from './hooks/useProgress'
import { useSpeech } from './hooks/useSpeech'
import { useSpeechRate } from './hooks/useSpeechRate'
import type {
  GameMode,
  PhoneticsType,
  PracticeTopic,
  QuizQuestion,
  RoundResult,
  Screen,
  ArticlePracticeTopic,
  SentencePracticeTopic,
  StudyItem,
  StudyLevel,
  WrongLevel,
} from './types'
import {
  buildArticleQuizForArticle,
  buildArticleRound,
  buildPhoneticsRound,
  buildPracticeRound,
  buildRound,
  buildSentenceRound,
  buildWordRound,
} from './utils/quiz'

function findStudyItem(id: string, level: WrongLevel): StudyItem | undefined {
  if (level === 'vowel') {
    const item = VOWELS.find((v) => v.id === id)
    return item ? { id: item.id, thai: item.display, meaning: item.nameZh } : undefined
  }
  if (level === 'tone') {
    const item = TONES.find((t) => t.id === id)
    return item ? { id: item.id, thai: item.display, meaning: item.nameZh } : undefined
  }
  if (level === 'article') {
    return getAllArticleQuestions().find((item) => item.id === id)
  }
  const pool = level === 'word' ? LESSONS : SENTENCES
  return pool.find((item) => item.id === id)
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [mode, setMode] = useState<GameMode>('practice')
  const [studyLevel, setStudyLevel] = useState<StudyLevel>('word')
  const [phoneticsType, setPhoneticsType] = useState<PhoneticsType | null>(null)
  const [wordTopic, setWordTopic] = useState<PracticeTopic>('all')
  const [sentenceTopic, setSentenceTopic] = useState<SentencePracticeTopic>('all')
  const [articleTopic, setArticleTopic] = useState<ArticlePracticeTopic>('all')
  const [currentArticleId, setCurrentArticleId] = useState<string | null>(null)
  const [topicLabel, setTopicLabel] = useState<string>('全部隨機')
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [roundResult, setRoundResult] = useState<RoundResult | null>(null)

  const { progress, addWrong, removeWrong, recordAnswer, undoAnswer } = useProgress()
  const { speechRate, setSpeechRate } = useSpeechRate()
  const { speak, stop, speaking, hasThaiVoice, karaoke, resetKaraoke } = useSpeech(speechRate)

  const wrongCountWord = progress.wrongItems.filter((w) => w.level === 'word').length
  const wrongCountSentence = progress.wrongItems.filter(
    (w) => w.level === 'sentence',
  ).length
  const wrongCountPhonetics = progress.wrongItems.filter(
    (w) => w.level === 'vowel' || w.level === 'tone',
  ).length
  const wrongCountArticle = progress.wrongItems.filter((w) => w.level === 'article').length

  const isPhoneticsQuiz = phoneticsType !== null
  const pointsPerCorrect = isPhoneticsQuiz ? 12 : studyLevel === 'sentence' ? 15 : studyLevel === 'article' ? 18 : 10

  const startWordPractice = useCallback((topic: PracticeTopic) => {
    setMode('practice')
    setStudyLevel('word')
    setPhoneticsType(null)
    setWordTopic(topic)
    setTopicLabel(getTopicLabel(topic))
    setQuestions(buildPracticeRound(topic))
    setScreen('quiz')
  }, [])

  const startArticleRead = useCallback((articleId: string) => {
    setCurrentArticleId(articleId)
    setScreen('article-read')
  }, [])

  const startArticlePractice = useCallback((topic: ArticlePracticeTopic) => {
    setMode('practice')
    setStudyLevel('article')
    setPhoneticsType(null)
    setCurrentArticleId(null)
    setArticleTopic(topic)
    setTopicLabel(getArticleTopicLabel(topic))
    setQuestions(buildArticleRound(topic))
    setScreen('quiz')
  }, [])

  const startArticleQuiz = useCallback((articleId: string) => {
    const article = getArticleById(articleId)
    if (!article) return
    setMode('practice')
    setStudyLevel('article')
    setPhoneticsType(null)
    setCurrentArticleId(articleId)
    setTopicLabel(`短文 · ${article.titleZh}`)
    setQuestions(buildArticleQuizForArticle(articleId))
    setScreen('quiz')
  }, [])

  const startSentencePractice = useCallback((topic: SentencePracticeTopic) => {
    setMode('practice')
    setStudyLevel('sentence')
    setPhoneticsType(null)
    setSentenceTopic(topic)
    setTopicLabel(getSentenceTopicLabel(topic))
    setQuestions(buildSentenceRound(topic))
    setScreen('quiz')
  }, [])

  const startPhoneticsLearn = useCallback((type: PhoneticsType) => {
    setPhoneticsType(type)
    setScreen('phonetics-learn')
  }, [])

  const openPronunciationTips = useCallback(() => {
    setPhoneticsType(null)
    setScreen('pronunciation-tips')
  }, [])

  const startPhoneticsQuiz = useCallback((type: PhoneticsType) => {
    setMode('practice')
    setPhoneticsType(type)
    setTopicLabel(type === 'vowel' ? '元音測驗' : '聲調測驗')
    setQuestions(buildPhoneticsRound(type))
    setScreen('quiz')
  }, [])

  const startReview = useCallback(
    (level: WrongLevel) => {
      const items = progress.wrongItems
        .filter((w) => w.level === level)
        .map((w) => findStudyItem(w.id, level))
        .filter((item): item is StudyItem => item !== undefined)

      if (items.length === 0) return

      setMode('review')
      setPhoneticsType(null)
      if (level === 'word' || level === 'sentence' || level === 'article') {
        setStudyLevel(level)
        setCurrentArticleId(null)
      }
      const labelMap: Record<WrongLevel, string> = {
        word: '單字 · 錯題複習',
        sentence: '句子 · 錯題複習',
        article: '短文 · 錯題複習',
        vowel: '元音 · 錯題複習',
        tone: '聲調 · 錯題複習',
      }
      setTopicLabel(labelMap[level])
      if (level === 'word') {
        const lessons = items
          .map((item) => getLessonById(item.id))
          .filter((lesson): lesson is NonNullable<typeof lesson> => lesson !== undefined)
        setQuestions(buildWordRound(lessons))
      } else {
        setQuestions(buildRound(items))
      }
      setScreen('quiz')
    },
    [progress.wrongItems],
  )

  const startReviewPhonetics = useCallback(() => {
    const items = progress.wrongItems
      .filter((w) => w.level === 'vowel' || w.level === 'tone')
      .map((w) => findStudyItem(w.id, w.level))
      .filter((item): item is StudyItem => item !== undefined)

    if (items.length === 0) return

    setMode('review')
    setPhoneticsType('vowel')
    setTopicLabel('基礎 · 錯題複習')
    setQuestions(buildRound(items))
    setScreen('quiz')
  }, [progress.wrongItems])

  const handleAnswer = useCallback(
    (correct: boolean, question: QuizQuestion) => {
      if (correct) {
        recordAnswer(true, pointsPerCorrect)
        if (mode === 'review') {
          removeWrong(question.item.id)
        }
      } else {
        recordAnswer(false, 0)
        addWrong({
          id: question.item.id,
          thai: question.item.thai,
          meaning: question.item.meaning,
          level: isPhoneticsQuiz
            ? question.item.id.startsWith('t')
              ? 'tone'
              : 'vowel'
            : studyLevel,
        })
      }
    },
    [mode, studyLevel, isPhoneticsQuiz, pointsPerCorrect, recordAnswer, removeWrong, addWrong],
  )

  const handleUndoAnswer = useCallback(
    (wasCorrect: boolean, question: QuizQuestion) => {
      undoAnswer(wasCorrect, wasCorrect ? pointsPerCorrect : 0)
      if (wasCorrect) {
        if (mode === 'review') {
          addWrong({
            id: question.item.id,
            thai: question.item.thai,
            meaning: question.item.meaning,
            level: isPhoneticsQuiz
              ? question.item.id.startsWith('t')
                ? 'tone'
                : 'vowel'
              : studyLevel,
          })
        }
      } else {
        removeWrong(question.item.id)
      }
    },
    [
      mode,
      studyLevel,
      isPhoneticsQuiz,
      pointsPerCorrect,
      undoAnswer,
      addWrong,
      removeWrong,
    ],
  )

  const handleComplete = useCallback(
    (stats: { correct: number; roundScore: number; newWrongCount: number }) => {
      setRoundResult({
        correct: stats.correct,
        total: questions.length,
        roundScore: stats.roundScore,
        newWrongCount: stats.newWrongCount,
        topicLabel,
      })
      setScreen('result')
    },
    [questions.length, topicLabel],
  )

  const bgClass = useMemo(
    () => 'min-h-dvh bg-gradient-to-b from-amber-50 to-orange-50',
    [],
  )

  const playAgain = useCallback(() => {
    if (mode === 'review') {
      if (isPhoneticsQuiz && wrongCountPhonetics > 0) {
        startReviewPhonetics()
        return
      }
      if (studyLevel === 'word' && wrongCountWord > 0) {
        startReview('word')
        return
      }
      if (studyLevel === 'sentence' && wrongCountSentence > 0) {
        startReview('sentence')
        return
      }
      if (studyLevel === 'article' && wrongCountArticle > 0) {
        startReview('article')
        return
      }
    }
    if (phoneticsType) {
      startPhoneticsQuiz(phoneticsType)
    } else if (studyLevel === 'article') {
      if (currentArticleId) {
        startArticleQuiz(currentArticleId)
      } else {
        startArticlePractice(articleTopic)
      }
    } else if (studyLevel === 'sentence') {
      startSentencePractice(sentenceTopic)
    } else {
      startWordPractice(wordTopic)
    }
  }, [
    mode,
    studyLevel,
    phoneticsType,
    isPhoneticsQuiz,
    wrongCountPhonetics,
    wrongCountWord,
    wrongCountSentence,
    wrongCountArticle,
    currentArticleId,
    articleTopic,
    startArticleQuiz,
    startArticlePractice,
    startReviewPhonetics,
    startReview,
    startPhoneticsQuiz,
    startSentencePractice,
    startWordPractice,
    sentenceTopic,
    wordTopic,
  ])

  if (screen === 'home') {
    return (
      <div className={bgClass}>
        <Home
          progress={progress}
          speechRate={speechRate}
          onSpeechRateChange={setSpeechRate}
          wrongCountWord={wrongCountWord}
          wrongCountSentence={wrongCountSentence}
          wrongCountPhonetics={wrongCountPhonetics}
          wrongCountArticle={wrongCountArticle}
          onPracticeWord={startWordPractice}
          onPracticeSentence={startSentencePractice}
          onPracticeArticle={startArticlePractice}
          onReadArticle={startArticleRead}
          onArticleQuiz={startArticleQuiz}
          onPhoneticsLearn={startPhoneticsLearn}
          onPhoneticsQuiz={startPhoneticsQuiz}
          onPronunciationTips={openPronunciationTips}
          onReview={startReview}
          onReviewPhonetics={startReviewPhonetics}
        />
      </div>
    )
  }

  if (screen === 'pronunciation-tips') {
    return (
      <div className={bgClass}>
        <PronunciationTips
          speaking={speaking}
          karaoke={karaoke}
          onSpeak={speak}
          onBack={() => setScreen('home')}
        />
      </div>
    )
  }

  if (screen === 'article-read' && currentArticleId) {
    const article = getArticleById(currentArticleId)
    if (!article) {
      setScreen('home')
      return null
    }
    return (
      <div className={bgClass}>
        <ArticleRead
          article={article}
          speaking={speaking}
          karaoke={karaoke}
          onSpeak={speak}
          onStartQuiz={() => startArticleQuiz(currentArticleId)}
          onBack={() => {
            stop()
            setCurrentArticleId(null)
            setScreen('home')
          }}
        />
      </div>
    )
  }

  if (screen === 'phonetics-learn' && phoneticsType) {
    return (
      <div className={bgClass}>
        <PhoneticsLearn
          type={phoneticsType}
          speaking={speaking}
          karaoke={karaoke}
          onSpeak={speak}
          onStartQuiz={() => startPhoneticsQuiz(phoneticsType)}
          onBack={() => {
            setPhoneticsType(null)
            setScreen('home')
          }}
        />
      </div>
    )
  }

  if (screen === 'quiz') {
    return (
      <div className={bgClass}>
        <Quiz
          questions={questions}
          topicLabel={topicLabel}
          variant={isPhoneticsQuiz ? 'phonetics' : studyLevel}
          phoneticsKind={phoneticsType ?? undefined}
          pointsPerCorrect={pointsPerCorrect}
          autoPlay
          hasThaiVoice={hasThaiVoice}
          speaking={speaking}
          karaoke={karaoke}
          speechRate={speechRate}
          onSpeechRateChange={setSpeechRate}
          onSpeak={speak}
          onResetKaraoke={resetKaraoke}
          onAnswer={handleAnswer}
          onUndoAnswer={handleUndoAnswer}
          onComplete={handleComplete}
          onQuit={() => {
            stop()
            setPhoneticsType(null)
            setScreen('home')
          }}
        />
      </div>
    )
  }

  if (screen === 'result' && roundResult) {
    return (
      <div className={bgClass}>
        <Result result={roundResult} onPlayAgain={playAgain} onHome={() => setScreen('home')} />
      </div>
    )
  }

  return null
}
