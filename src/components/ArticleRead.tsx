import type { Article } from '../data/articles'
import type { KaraokeState } from '../hooks/useSpeech'
import { ThaiColorLegend } from './ThaiColorLegend'
import { InteractiveThaiText } from './InteractiveThaiText'

interface ArticleReadProps {
  article: Article
  speaking: boolean
  karaoke: KaraokeState | null
  onSpeak: (text: string) => void
  onStartQuiz: () => void
  onBack: () => void
}

export function ArticleRead({
  article,
  speaking,
  karaoke,
  onSpeak,
  onStartQuiz,
  onBack,
}: ArticleReadProps) {
  const showKaraoke = karaoke?.text === article.contentTh
  const paragraphs = article.contentTh.split('\n\n').filter(Boolean)
  const translationParagraphs = article.translationZh.split('\n\n').filter(Boolean)

  return (
    <div className="mx-auto min-h-dvh max-w-md px-6 py-8 pb-12">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 text-sm text-slate-500 hover:text-slate-800"
      >
        ← 返回首頁
      </button>

      <header className="mb-6">
        <p className="text-sm font-medium text-sky-600">短文章閱讀</p>
        <h1 className="text-2xl font-bold text-slate-900">{article.titleZh}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {paragraphs.length} 段 · {article.questions.length} 道測驗題
        </p>
      </header>

      <button
        type="button"
        onClick={() => onSpeak(article.contentTh)}
        disabled={speaking}
        className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 py-3.5 font-semibold text-white shadow-md hover:bg-sky-600 disabled:opacity-70"
      >
        {speaking ? '🔊 朗讀中…' : '▶️ 朗讀全文（K 歌字幕）'}
      </button>

      <div className="mb-6 rounded-2xl bg-slate-900/90 px-4 py-5">
        {showKaraoke ? (
          <InteractiveThaiText
            text={article.contentTh.replace(/\n\n/g, ' ')}
            className="text-base font-medium leading-loose sm:text-lg"
            inverted
            tokenize
            showRoman={false}
            hintKind="article"
            onSpeak={onSpeak}
            speaking={speaking}
            karaoke={{ activeUnitIndex: Math.max(0, karaoke.activeUnitIndex) }}
          />
        ) : (
          <div className="space-y-4 text-left">
            {paragraphs.map((p, i) => (
              <InteractiveThaiText
                key={i}
                text={p}
                align="start"
                className="text-base font-medium leading-loose sm:text-lg"
                inverted
                tokenize
                showRoman={false}
                hintKind="article"
                onSpeak={onSpeak}
                speaking={speaking}
              />
            ))}
          </div>
        )}
        {!showKaraoke && (
          <p className="mt-3 text-left text-xs text-amber-200/70">
            點選虛線單字可查看拼音、意思與例句；朗讀時以 K 歌字幕標示音節。
          </p>
        )}
        <div className="mt-3">
          <ThaiColorLegend compact inverted />
        </div>
      </div>

      <div className="mb-6 space-y-4">
        <h2 className="text-sm font-semibold text-slate-700">中文翻譯</h2>
        {translationParagraphs.map((para, i) => (
          <p key={i} className="rounded-lg bg-white p-3 text-sm leading-relaxed text-slate-600 ring-1 ring-slate-200">
            {para}
          </p>
        ))}
      </div>

      <button
        type="button"
        onClick={onStartQuiz}
        className="w-full rounded-xl bg-amber-500 px-6 py-4 text-lg font-semibold text-white shadow-md hover:bg-amber-600"
      >
        開始測驗（{article.questions.length} 題）
      </button>
    </div>
  )
}
