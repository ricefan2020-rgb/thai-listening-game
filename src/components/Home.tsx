import { useState } from 'react'
import {
  CATEGORY_LABELS,
  LESSON_CATEGORIES,
  LESSON_COUNT,
  PITFALL_LESSON_COUNT,
  TONE_PAIR_LESSON_COUNT,
  getCategoryCount,
  getRoundSize,
} from '../data/lessons'
import {
  ARTICLE_CATEGORIES,
  ARTICLE_CATEGORY_LABELS,
  ARTICLE_COUNT,
  ARTICLES,
  getArticleRoundSize,
  getArticlesByCategory,
} from '../data/articles'
import {
  SENTENCE_CATEGORIES,
  SENTENCE_CATEGORY_LABELS,
  SENTENCE_COUNT,
  getSentenceCategoryCount,
  getSentenceRoundSize,
} from '../data/sentences'
import { TIP_COUNT } from '../data/pronunciation-tips'
import { TONE_COUNT } from '../data/tones'
import { VOWEL_COUNT } from '../data/vowels'
import { SpeechSpeedControl } from './SpeechSpeedControl'
import type {
  ArticlePracticeTopic,
  HomeTab,
  PhoneticsType,
  PracticeTopic,
  ProgressData,
  SentencePracticeTopic,
  WrongLevel,
} from '../types'

function getArticleCategoryQuestionCount(category: ArticlePracticeTopic): number {
  if (category === 'all') {
    return ARTICLES.reduce((n, a) => n + a.questions.length, 0)
  }
  return getArticlesByCategory(category).reduce((n, a) => n + a.questions.length, 0)
}

interface HomeProps {
  progress: ProgressData
  speechRate: number
  onSpeechRateChange: (rate: number) => void
  wrongCountWord: number
  wrongCountSentence: number
  wrongCountPhonetics: number
  wrongCountArticle: number
  onPracticeWord: (topic: PracticeTopic) => void
  onPracticeSentence: (topic: SentencePracticeTopic) => void
  onPracticeArticle: (topic: ArticlePracticeTopic) => void
  onReadArticle: (articleId: string) => void
  onArticleQuiz: (articleId: string) => void
  onPhoneticsLearn: (type: PhoneticsType) => void
  onPhoneticsQuiz: (type: PhoneticsType) => void
  onPronunciationTips: () => void
  onReview: (level: WrongLevel) => void
  onReviewPhonetics: () => void
}

const WORD_TOPICS: { id: PracticeTopic; label: string; count: number }[] = [
  { id: 'all', label: '全部隨機', count: LESSON_COUNT },
  {
    id: 'confusable',
    label: '易混淆專練',
    count: PITFALL_LESSON_COUNT,
  },
  {
    id: 'tonePair',
    label: '同字異聲調',
    count: TONE_PAIR_LESSON_COUNT,
  },
  ...LESSON_CATEGORIES.map((cat) => ({
    id: cat as PracticeTopic,
    label: CATEGORY_LABELS[cat],
    count: getCategoryCount(cat),
  })),
]

const SENTENCE_TOPICS: { id: SentencePracticeTopic; label: string; count: number }[] =
  [
    { id: 'all', label: '全部隨機', count: SENTENCE_COUNT },
    ...SENTENCE_CATEGORIES.map((cat) => ({
      id: cat as SentencePracticeTopic,
      label: SENTENCE_CATEGORY_LABELS[cat],
      count: getSentenceCategoryCount(cat),
    })),
  ]

const ARTICLE_TOPICS: { id: ArticlePracticeTopic; label: string; count: number }[] = [
  {
    id: 'all',
    label: '全部隨機',
    count: getArticleCategoryQuestionCount('all'),
  },
  ...ARTICLE_CATEGORIES.map((cat) => ({
    id: cat as ArticlePracticeTopic,
    label: ARTICLE_CATEGORY_LABELS[cat],
    count: getArticleCategoryQuestionCount(cat),
  })),
]

const TOTAL_ARTICLE_QUESTIONS = getArticleCategoryQuestionCount('all')

export function Home({
  progress,
  speechRate,
  onSpeechRateChange,
  wrongCountWord,
  wrongCountSentence,
  wrongCountPhonetics,
  wrongCountArticle,
  onPracticeWord,
  onPracticeSentence,
  onPracticeArticle,
  onReadArticle,
  onArticleQuiz,
  onPhoneticsLearn,
  onPhoneticsQuiz,
  onPronunciationTips,
  onReview,
  onReviewPhonetics,
}: HomeProps) {
  const [tab, setTab] = useState<HomeTab>('word')

  const wrongCount =
    tab === 'word'
      ? wrongCountWord
      : tab === 'sentence'
        ? wrongCountSentence
        : tab === 'article'
          ? wrongCountArticle
          : wrongCountPhonetics

  return (
    <div className="mx-auto min-h-dvh max-w-md px-6 py-8">
      <header className="mb-6 text-center">
        <p className="mb-2 text-sm font-medium text-amber-600">泰文聽力小遊戲</p>
        <h1 className="text-3xl font-bold text-slate-900">聽一聽，選意思</h1>
        <p className="mt-2 text-sm text-slate-500">
          {tab === 'word' &&
            `單字 ${LESSON_COUNT} 詞 · 泰文附發音拼音 · 答題後例句與易混淆提示`}
          {tab === 'sentence' && `進階句子 ${SENTENCE_COUNT} 句 · 選擇主題開始`}
          {tab === 'article' &&
            `短文章 ${ARTICLE_COUNT} 篇 · ${TOTAL_ARTICLE_QUESTIONS} 道測驗句`}
          {tab === 'foundation' && '元音與聲調 · 先學再測'}
        </p>
      </header>

      <div className="mb-6 grid grid-cols-3 gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <Stat label="總分" value={progress.score} />
        <Stat label="最高分" value={progress.bestScore} />
        <Stat label="連續答對" value={progress.streak} />
      </div>

      <div className="mb-5">
        <SpeechSpeedControl rate={speechRate} onChange={onSpeechRateChange} />
      </div>

      <div className="mb-5 grid grid-cols-4 gap-1 rounded-xl bg-slate-200/80 p-1">
        <TabButton active={tab === 'word'} onClick={() => setTab('word')}>
          單字
        </TabButton>
        <TabButton active={tab === 'sentence'} onClick={() => setTab('sentence')}>
          句子
        </TabButton>
        <TabButton active={tab === 'article'} onClick={() => setTab('article')}>
          短文
        </TabButton>
        <TabButton active={tab === 'foundation'} onClick={() => setTab('foundation')}>
          基礎
        </TabButton>
      </div>

      {tab === 'foundation' ? (
        <div className="mb-6 space-y-4">
          <FoundationCard
            title="元音教學"
            meta={`${VOWEL_COUNT} 個 · 認識符號與讀音`}
            onLearn={() => onPhoneticsLearn('vowel')}
            onQuiz={() => onPhoneticsQuiz('vowel')}
          />
          <FoundationCard
            title="聲調教學"
            meta={`${TONE_COUNT} 個聲調 · 平／低／降／高／升`}
            onLearn={() => onPhoneticsLearn('tone')}
            onQuiz={() => onPhoneticsQuiz('tone')}
          />
          <TipsCard
            title="發音技巧"
            meta={`${TIP_COUNT} 則實用要訣 · 含範例朗讀`}
            onOpen={onPronunciationTips}
          />
        </div>
      ) : tab === 'article' ? (
        <>
          <p className="mb-3 text-sm font-semibold text-slate-700">按分類測驗</p>
          <div className="mb-6 grid grid-cols-2 gap-2">
            {ARTICLE_TOPICS.map((topic) => (
              <TopicCard
                key={topic.id}
                label={topic.label}
                meta={`${topic.count} 句 · 每輪 ${getArticleRoundSize(topic.id)} 題`}
                highlight={topic.id === 'all'}
                onClick={() => onPracticeArticle(topic.id)}
              />
            ))}
          </div>
          <p className="mb-3 text-sm font-semibold text-slate-700">閱讀文章</p>
          <div className="mb-6 space-y-2">
            {ARTICLES.map((article) => (
              <ArticleCard
                key={article.id}
                title={article.titleZh}
                category={ARTICLE_CATEGORY_LABELS[article.category]}
                questionCount={article.questions.length}
                onRead={() => onReadArticle(article.id)}
                onQuiz={() => onArticleQuiz(article.id)}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="mb-3 text-sm font-semibold text-slate-700">按主題練習</p>
          <div className="mb-6 grid grid-cols-2 gap-2">
            {tab === 'word'
              ? WORD_TOPICS.map((topic) => (
                  <TopicCard
                    key={topic.id}
                    label={topic.label}
                    meta={`${topic.count} 詞 · 每輪 ${getRoundSize(topic.id)} 題`}
                    highlight={topic.id === 'all'}
                    accent={topic.id === 'confusable' || topic.id === 'tonePair'}
                    onClick={() => onPracticeWord(topic.id)}
                  />
                ))
              : SENTENCE_TOPICS.map((topic) => (
                  <TopicCard
                    key={topic.id}
                    label={topic.label}
                    meta={`${topic.count} 句 · 每輪 ${getSentenceRoundSize(topic.id)} 題`}
                    highlight={topic.id === 'all'}
                    onClick={() => onPracticeSentence(topic.id)}
                  />
                ))}
          </div>
        </>
      )}

      <button
        type="button"
        onClick={() =>
          tab === 'foundation' ? onReviewPhonetics() : onReview(tab)
        }
        disabled={wrongCount === 0}
        className="w-full rounded-xl bg-white px-6 py-4 text-lg font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {tab === 'word'
          ? '單字'
          : tab === 'sentence'
            ? '句子'
            : tab === 'article'
              ? '短文'
              : '基礎'}
        錯題複習{' '}
        {wrongCount > 0 ? `（${wrongCount} 題）` : ''}
      </button>

      <p className="mt-6 text-center text-xs text-slate-500">
        使用瀏覽器朗讀泰文 · 進度儲存在本機
      </p>
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg py-2 text-xs font-semibold transition sm:py-2.5 sm:text-sm ${
        active ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
      }`}
    >
      {children}
    </button>
  )
}

function ArticleCard({
  title,
  category,
  questionCount,
  onRead,
  onQuiz,
}: {
  title: string
  category: string
  questionCount: number
  onRead: () => void
  onQuiz: () => void
}) {
  return (
    <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <p className="mt-0.5 text-xs text-slate-500">
        {category} · {questionCount} 道測驗
      </p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onRead}
          className="rounded-lg bg-sky-100 py-2 text-sm font-semibold text-sky-800 hover:bg-sky-200"
        >
          閱讀
        </button>
        <button
          type="button"
          onClick={onQuiz}
          className="rounded-lg bg-amber-500 py-2 text-sm font-semibold text-white hover:bg-amber-600"
        >
          測驗
        </button>
      </div>
    </div>
  )
}

function TopicCard({
  label,
  meta,
  highlight,
  accent,
  onClick,
}: {
  label: string
  meta: string
  highlight: boolean
  accent?: boolean
  onClick: () => void
}) {
  const accentStyle =
    'col-span-2 bg-rose-500 text-white ring-rose-600 hover:bg-rose-600'
  const highlightStyle =
    'col-span-2 bg-amber-500 text-white ring-amber-600 hover:bg-amber-600'
  const normalStyle = 'bg-white text-slate-800 ring-slate-200 hover:bg-amber-50'

  const style = highlight ? highlightStyle : accent ? accentStyle : normalStyle
  const metaClass = highlight
    ? 'text-amber-100'
    : accent
      ? 'text-rose-100'
      : 'text-slate-500'

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-3 py-3 text-left shadow-sm ring-1 transition active:scale-[0.98] ${style}`}
    >
      <span className="block font-semibold">{label}</span>
      <span className={`mt-0.5 block text-xs ${metaClass}`}>{meta}</span>
    </button>
  )
}

function TipsCard({
  title,
  meta,
  onOpen,
}: {
  title: string
  meta: string
  onOpen: () => void
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full rounded-xl bg-teal-500 p-4 text-left shadow-sm ring-1 ring-teal-600 transition hover:bg-teal-600 active:scale-[0.98]"
    >
      <h2 className="font-semibold text-white">{title}</h2>
      <p className="mt-0.5 text-xs text-teal-100">{meta}</p>
      <p className="mt-2 text-sm font-medium text-teal-50">點擊查看 →</p>
    </button>
  )
}

function FoundationCard({
  title,
  meta,
  onLearn,
  onQuiz,
}: {
  title: string
  meta: string
  onLearn: () => void
  onQuiz: () => void
}) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-violet-200">
      <h2 className="font-semibold text-slate-900">{title}</h2>
      <p className="mt-0.5 text-xs text-slate-500">{meta}</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onLearn}
          className="rounded-lg bg-violet-100 py-2.5 text-sm font-semibold text-violet-800 hover:bg-violet-200"
        >
          學習
        </button>
        <button
          type="button"
          onClick={onQuiz}
          className="rounded-lg bg-violet-500 py-2.5 text-sm font-semibold text-white hover:bg-violet-600"
        >
          測驗
        </button>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  )
}
