import { useMemo } from 'react'
import { WORD_PITFALL_KIND_LABELS } from '../data/word-meta'
import type { ThaiLookupResult } from '../utils/thaiLookup'
import { decomposeThaiCompound } from '../utils/compoundWord'
import { getThaiRoman, getThaiRomanToneInfo } from '../utils/thaiRoman'
import { useUserVocab } from '../hooks/useUserVocab'
import { SentenceAnalysisPanel } from './SentenceAnalysisPanel'
import { PhraseSegmentPanel } from './PhraseSegmentPanel'
import { ThaiColoredText } from './ThaiColoredText'
import { UserVocabAddChip } from './UserVocabAddChip'

const KIND_STYLES = {
  homophone: 'bg-violet-100 text-violet-800',
  polyseme: 'bg-amber-100 text-amber-900',
  confusable: 'bg-rose-100 text-rose-800',
  tonePair: 'bg-sky-100 text-sky-900',
} as const

interface ThaiWordDetailProps {
  detail: ThaiLookupResult
  speaking?: boolean
  onSpeak?: (text: string) => void
  onClose?: () => void
  compact?: boolean
  inverted?: boolean
  /** 收錄詞後刷新拆解 */
  vocabRevision?: number
  onVocabAdded?: () => void
}

export function ThaiWordDetail({
  detail,
  speaking,
  onSpeak,
  onClose,
  compact,
  inverted,
  vocabRevision = 0,
  onVocabAdded,
}: ThaiWordDetailProps) {
  const { add } = useUserVocab()

  const compound = useMemo(() => {
    void vocabRevision
    return detail.compound ?? decomposeThaiCompound(detail.query) ?? undefined
  }, [detail.compound, detail.query, vocabRevision])

  const toneInfo = getThaiRomanToneInfo(detail.query)

  const handleVocabAdded = (thai: string, meaning: string) => {
    add(thai, meaning)
    onVocabAdded?.()
  }
  const panelClass = inverted
    ? 'bg-slate-800/95 text-white ring-slate-600'
    : 'bg-white text-slate-800 ring-slate-200'

  return (
    <div className={`rounded-lg px-3 py-2.5 text-left ring-1 ${panelClass}`}>
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <ThaiColoredText text={detail.query} className="text-lg font-semibold" />
          <p className={`thai-roman mt-0.5 text-xs ${inverted ? 'text-amber-200/80' : 'text-slate-500'}`}>
            <span>{toneInfo.roman || getThaiRoman(detail.query)}</span>
            {toneInfo.tonesZh && toneInfo.tonesZh !== '平' && (
              <span className={`ml-1.5 ${inverted ? 'text-amber-100/90' : 'text-amber-700'}`}>
                {toneInfo.tonesZh}聲
              </span>
            )}
          </p>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className={`shrink-0 text-xs ${inverted ? 'text-slate-300 hover:text-white' : 'text-slate-400 hover:text-slate-700'}`}
            aria-label="關閉"
          >
            ✕
          </button>
        )}
      </div>

      <ul className="space-y-1.5">
        {detail.entries.map((e, i) => (
          <li key={`${e.lessonId ?? i}-${e.meaning}`} className="text-sm">
            <span className={`font-semibold ${inverted ? 'text-amber-100' : 'text-slate-900'}`}>
              {e.meaning}
            </span>
            {e.tag && (
              <span className={`ml-1.5 text-xs ${inverted ? 'text-slate-400' : 'text-slate-500'}`}>
                · {e.tag}
              </span>
            )}
          </li>
        ))}
      </ul>

      {detail.hintZh && (
        <p className={`mt-2 text-xs leading-relaxed ${inverted ? 'text-slate-300' : 'text-slate-600'}`}>
          {detail.hintZh}
        </p>
      )}

      {detail.phraseAnalysis && (
        <div className={`mt-3 border-t pt-3 ${inverted ? 'border-slate-600' : 'border-slate-100'}`}>
          <PhraseSegmentPanel
            analysis={detail.phraseAnalysis}
            speaking={speaking}
            onSpeak={onSpeak}
            compact={compact}
            inverted={inverted}
          />
        </div>
      )}

      {compound && !detail.phraseAnalysis && (
        <div className={`mt-3 border-t pt-3 ${inverted ? 'border-slate-600' : 'border-slate-100'}`}>
          <p className={`text-xs font-semibold ${inverted ? 'text-violet-300' : 'text-violet-700'}`}>
            組合字拆解
          </p>
          <p className={`mt-0.5 text-[10px] ${inverted ? 'text-slate-400' : 'text-slate-500'}`}>
            未收錄的詞可點「點擊收錄」加入我的詞庫
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {compound.parts.map((p, i) => (
              <UserVocabAddChip
                key={`${p.thai}-${i}-${vocabRevision}`}
                part={p}
                inverted={inverted}
                onAdded={handleVocabAdded}
              />
            ))}
          </div>
          <p className={`mt-1 text-xs leading-relaxed ${inverted ? 'text-violet-200' : 'text-violet-800'}`}>
            {compound.inferredZh}
          </p>
          {compound.patternZh && (
            <p className={`mt-0.5 text-[10px] ${inverted ? 'text-violet-300/80' : 'text-violet-600'}`}>
              規律：{compound.patternZh}
            </p>
          )}
        </div>
      )}

      {detail.kind === 'sentence' && detail.analysis && (
        <div className={`mt-3 border-t pt-3 ${inverted ? 'border-slate-600' : 'border-slate-100'}`}>
          <SentenceAnalysisPanel
            analysis={detail.analysis}
            speaking={speaking}
            onSpeak={onSpeak}
            compact={compact}
          />
        </div>
      )}

      {detail.examples &&
        detail.examples.length > 0 &&
        !detail.phraseAnalysis?.examples.length && (
        <div className={`mt-2 space-y-2 ${inverted ? '' : ''}`}>
          <p className={`text-xs font-semibold ${inverted ? 'text-sky-300' : 'text-sky-700'}`}>
            例句 {detail.examples.length > 1 ? `（${detail.examples.length} 則）` : ''}
          </p>
          {detail.examples.map((ex, i) => (
            <div
              key={`${ex.exampleTh}-${i}`}
              className={`rounded-md px-2 py-1.5 ${inverted ? 'bg-slate-900/60' : 'bg-sky-50'}`}
            >
              <p className="thai-text text-sm leading-relaxed" lang="th">
                {ex.exampleTh}
              </p>
              <p className={`mt-0.5 text-xs ${inverted ? 'text-slate-300' : 'text-slate-600'}`}>
                {ex.exampleZh}
              </p>
              {onSpeak && (
                <button
                  type="button"
                  onClick={() => onSpeak(ex.exampleTh)}
                  disabled={speaking}
                  className={`mt-1 text-xs font-medium disabled:opacity-60 ${inverted ? 'text-amber-200' : 'text-sky-700'}`}
                >
                  🔊 朗讀例句 {detail.examples!.length > 1 ? i + 1 : ''}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {detail.pitfalls.length > 0 && !compact && (
        <ul className={`mt-2 space-y-1 border-t pt-2 ${inverted ? 'border-slate-600' : 'border-slate-100'}`}>
          {detail.pitfalls.map((p, i) => (
            <li key={`${p.kind}-${i}`} className="text-xs">
              <span className={`mr-1 rounded px-1 py-0.5 font-semibold ${KIND_STYLES[p.kind]}`}>
                {WORD_PITFALL_KIND_LABELS[p.kind]}
              </span>
              <ThaiColoredText text={p.thai} className="text-sm font-semibold" />
              <span className={inverted ? 'text-slate-300' : 'text-slate-600'}>
                {' '}
                （{p.meaning}）{p.noteZh}
              </span>
            </li>
          ))}
        </ul>
      )}

      {onSpeak && (
        <button
          type="button"
          onClick={() => onSpeak(detail.query)}
          disabled={speaking}
          className={`mt-2 text-xs font-medium disabled:opacity-60 ${inverted ? 'text-amber-200' : 'text-amber-700'}`}
        >
          🔊 朗讀此詞
        </button>
      )}
    </div>
  )
}
