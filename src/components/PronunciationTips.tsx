import {
  PRONUNCIATION_TIPS,
  TIP_CATEGORIES,
  TIP_CATEGORY_LABELS,
} from '../data/pronunciation-tips'
import type { KaraokeState } from '../hooks/useSpeech'
import { ThaiColorLegend } from './ThaiColorLegend'
import { ThaiWithRoman } from './ThaiWithRoman'

interface PronunciationTipsProps {
  speaking: boolean
  karaoke: KaraokeState | null
  onSpeak: (text: string) => void
  onBack: () => void
}

export function PronunciationTips({
  speaking,
  karaoke,
  onSpeak,
  onBack,
}: PronunciationTipsProps) {
  return (
    <div className="mx-auto min-h-dvh max-w-md px-6 py-8">
      <button
        type="button"
        onClick={onBack}
        className="mb-4 text-sm text-slate-500 hover:text-slate-800"
      >
        ← 返回首頁
      </button>

      <header className="mb-6">
        <p className="text-sm font-medium text-teal-600">基礎教學</p>
        <h1 className="text-2xl font-bold text-slate-900">發音技巧</h1>
        <p className="mt-1 text-sm text-slate-500">
          實用口說要訣 · 共 {PRONUNCIATION_TIPS.length} 則
        </p>
      </header>

      <div className="mb-6 rounded-xl bg-teal-50 p-4 ring-1 ring-teal-200">
        <p className="text-sm leading-relaxed text-teal-900">
          建議搭配「元音」「聲調」教學一起練：先看技巧 → 聽範例 →
          小聲模仿 → 再回到測驗檢查。
        </p>
      </div>

      <div className="mb-6">
        <ThaiColorLegend />
      </div>

      <div className="space-y-8">
        {TIP_CATEGORIES.map((category) => {
          const tips = PRONUNCIATION_TIPS.filter((t) => t.category === category)
          if (tips.length === 0) return null

          return (
            <section key={category}>
              <h2 className="mb-3 text-sm font-bold tracking-wide text-teal-700 uppercase">
                {TIP_CATEGORY_LABELS[category]}
              </h2>
              <div className="space-y-3">
                {tips.map((tip) => (
                  <article
                    key={tip.id}
                    className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
                  >
                    <h3 className="font-semibold text-slate-900">{tip.titleZh}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {tip.bodyZh}
                    </p>
                    {tip.exampleThai && (
                      <div className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2">
                        <div className="min-w-0">
                          <ThaiWithRoman
                            text={tip.exampleThai}
                            align="start"
                            className="text-xl font-semibold"
                            romanClassName="text-xs text-slate-500"
                            karaoke={
                              tip.speakText && karaoke?.text === tip.speakText
                                ? { activeUnitIndex: Math.max(0, karaoke.activeUnitIndex) }
                                : undefined
                            }
                          />
                          {tip.exampleZh && (
                            <p className="mt-0.5 text-xs text-slate-500">{tip.exampleZh}</p>
                          )}
                        </div>
                        {tip.speakText && (
                          <button
                            type="button"
                            onClick={() => onSpeak(tip.speakText!)}
                            disabled={speaking}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-70"
                            aria-label="播放範例"
                          >
                            {speaking ? '🔊' : '▶️'}
                          </button>
                        )}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
