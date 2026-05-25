import type { PhraseAnalysis, WordExample, WordPitfall } from '../types'
import { WORD_PITFALL_KIND_LABELS } from '../data/word-meta'
import { InteractiveThaiText } from './InteractiveThaiText'
import { PhraseSegmentPanel } from './PhraseSegmentPanel'

const KIND_STYLES: Record<WordPitfall['kind'], string> = {
  homophone: 'bg-violet-100 text-violet-800 ring-violet-200',
  polyseme: 'bg-amber-100 text-amber-900 ring-amber-200',
  confusable: 'bg-rose-100 text-rose-800 ring-rose-200',
  tonePair: 'bg-sky-100 text-sky-900 ring-sky-200',
}

interface WordLearnPanelProps {
  examples: WordExample[]
  pitfalls: WordPitfall[]
  phraseAnalysis?: PhraseAnalysis
  speaking: boolean
  onSpeak?: (text: string) => void
}

export function WordLearnPanel({
  examples,
  pitfalls,
  phraseAnalysis,
  speaking,
  onSpeak,
}: WordLearnPanelProps) {
  return (
    <div className="space-y-3 text-left">
      {phraseAnalysis && phraseAnalysis.segments.length >= 2 && (
        <div className="rounded-xl bg-violet-50/80 px-3 py-2 ring-1 ring-violet-200">
          <PhraseSegmentPanel
            analysis={phraseAnalysis}
            speaking={speaking}
            onSpeak={onSpeak}
            compact
          />
        </div>
      )}
      {examples.length > 0 && (
        <div className="rounded-xl bg-sky-50 px-4 py-3 ring-1 ring-sky-200">
          <p className="text-xs font-semibold text-sky-700">
            例句 {examples.length > 1 ? `（${examples.length} 則）` : ''}
          </p>
          <ul className="mt-2 space-y-3">
            {examples.map((ex, i) => (
              <li
                key={`${ex.exampleTh}-${i}`}
                className={i > 0 ? 'border-t border-sky-200/80 pt-3' : ''}
              >
                <InteractiveThaiText
                  text={ex.exampleTh}
                  align="start"
                  className="text-base leading-relaxed"
                  romanClassName="text-xs text-sky-600/90"
                  tokenize
                  onSpeak={onSpeak}
                  speaking={speaking}
                />
                <p className="mt-1 text-sm text-slate-600">{ex.exampleZh}</p>
                {onSpeak && (
                  <button
                    type="button"
                    onClick={() => onSpeak(ex.exampleTh)}
                    disabled={speaking}
                    className="mt-1 text-xs font-medium text-sky-700 hover:text-sky-900 disabled:opacity-60"
                  >
                    🔊 朗讀例句 {examples.length > 1 ? i + 1 : ''}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {pitfalls.length > 0 && (
        <div className="rounded-xl bg-white px-4 py-3 ring-1 ring-slate-200">
          <p className="text-xs font-semibold text-slate-700">學習提示</p>
          <ul className="mt-2 space-y-2">
            {pitfalls.map((p, i) => (
              <li
                key={`${p.kind}-${p.thai}-${i}`}
                className="rounded-lg bg-slate-50 px-3 py-2 text-sm"
              >
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-xs font-semibold ring-1 ${KIND_STYLES[p.kind]}`}
                  >
                    {WORD_PITFALL_KIND_LABELS[p.kind]}
                  </span>
                  <InteractiveThaiText
                    text={p.thai}
                    align="start"
                    className="text-base font-semibold"
                    romanClassName="text-xs text-slate-500"
                    hintStudyId={p.lessonId}
                    hintKind="word"
                    onSpeak={onSpeak}
                    speaking={speaking}
                  />
                  <span className="text-slate-600">（{p.meaning}）</span>
                </div>
                <p className="text-xs leading-relaxed text-slate-600">{p.noteZh}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
