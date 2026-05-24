import { TONE_RULES, TONES } from '../data/tones'
import { VOWELS } from '../data/vowels'
import type { PhoneticsType } from '../types'
import type { KaraokeState } from '../hooks/useSpeech'
import { ThaiColorLegend } from './ThaiColorLegend'
import { ThaiColoredText } from './ThaiColoredText'
import { ThaiWithRoman } from './ThaiWithRoman'

interface PhoneticsLearnProps {
  type: PhoneticsType
  speaking: boolean
  karaoke: KaraokeState | null
  onSpeak: (text: string) => void
  onStartQuiz: () => void
  onBack: () => void
}

export function PhoneticsLearn({
  type,
  speaking,
  karaoke,
  onSpeak,
  onStartQuiz,
  onBack,
}: PhoneticsLearnProps) {
  const items = type === 'vowel' ? VOWELS : TONES
  const title = type === 'vowel' ? '泰文元音' : '泰文聲調'
  const subtitle =
    type === 'vowel'
      ? '以「ก」為例 · 認識符號與讀音'
      : '以「กา」為例 · 五種聲調與調號'

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
        <p className="text-sm font-medium text-violet-600">基礎教學</p>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </header>

      {type === 'tone' && (
        <div className="mb-5 rounded-xl bg-violet-50 p-4 ring-1 ring-violet-200">
          <p className="mb-2 text-sm font-semibold text-violet-900">記憶要點</p>
          <ul className="space-y-1.5 text-sm text-violet-800">
            {TONE_RULES.map((rule) => (
              <li key={rule}>· {rule}</li>
            ))}
          </ul>
        </div>
      )}

      {type === 'vowel' && (
        <div className="mb-5 rounded-xl bg-violet-50 p-4 ring-1 ring-violet-200">
          <p className="text-sm text-violet-800">
            泰文元音可寫在輔音上下方或前後。先熟悉常見符號，再對照例字「ก +
            元音」練發音。
          </p>
        </div>
      )}

      <div className="mb-5">
        <ThaiColorLegend />
      </div>

      <div className="mb-6 space-y-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <ThaiWithRoman
                  text={item.display}
                  align="start"
                  className="text-3xl font-bold"
                  romanClassName="text-sm text-violet-600"
                  karaoke={
                    karaoke?.text === item.speakText
                      ? { activeUnitIndex: Math.max(0, karaoke.activeUnitIndex) }
                      : undefined
                  }
                />
                <p className="mt-1 font-semibold text-slate-800">{item.nameZh}</p>
                <p className="mt-0.5 flex flex-wrap items-center gap-1 text-xs text-slate-500">
                  <span>符號：</span>
                  <ThaiColoredText text={item.symbol} className="text-base font-semibold" />
                  {item.roman ? <span>· {item.roman}</span> : null}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.hintZh}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSpeak(item.speakText)}
                disabled={speaking}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-500 text-white hover:bg-violet-600 disabled:opacity-70"
                aria-label={`播放 ${item.display}`}
              >
                {speaking ? '🔊' : '▶️'}
              </button>
            </div>
          </article>
        ))}
      </div>

      <button
        type="button"
        onClick={onStartQuiz}
        className="w-full rounded-xl bg-violet-500 px-6 py-4 text-lg font-semibold text-white shadow-md hover:bg-violet-600"
      >
        開始測驗
      </button>
    </div>
  )
}
