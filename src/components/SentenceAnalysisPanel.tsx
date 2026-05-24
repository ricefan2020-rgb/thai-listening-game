import { SEGMENT_ROLE_STYLES } from '../utils/sentenceAnalysis'
import type { SentenceAnalysis } from '../types'
import { getThaiRoman } from '../utils/thaiRoman'
import { ThaiColoredText } from './ThaiColoredText'

interface SentenceAnalysisPanelProps {
  analysis: SentenceAnalysis
  speaking?: boolean
  onSpeak?: (text: string) => void
  compact?: boolean
}

export function SentenceAnalysisPanel({
  analysis,
  speaking,
  onSpeak,
  compact,
}: SentenceAnalysisPanelProps) {
  return (
    <div className="space-y-3 text-left">
      <div>
        <p className="text-xs font-semibold text-indigo-700">句子分析</p>
        {analysis.structureZh && (
          <p className="mt-0.5 text-xs text-indigo-600/90">結構：{analysis.structureZh}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {analysis.segments.map((seg, i) => (
          <div
            key={`${seg.thai}-${i}`}
            className="min-w-[4.5rem] flex-1 rounded-lg bg-white px-2 py-2 ring-1 ring-slate-200"
          >
            <div className="mb-1 flex flex-wrap items-center gap-1">
              <span
                className={`rounded px-1 py-0.5 text-[10px] font-semibold ring-1 ${SEGMENT_ROLE_STYLES[seg.role]}`}
              >
                {seg.roleZh}
              </span>
              {onSpeak && (
                <button
                  type="button"
                  onClick={() => onSpeak(seg.thai)}
                  disabled={speaking}
                  className="text-[10px] text-slate-400 hover:text-slate-700 disabled:opacity-50"
                  aria-label={`播放 ${seg.thai}`}
                >
                  ▶️
                </button>
              )}
            </div>
            <ThaiColoredText text={seg.thai} className="text-base font-semibold" />
            <p className="thai-roman mt-0.5 text-[10px] text-slate-500">{getThaiRoman(seg.thai)}</p>
            <p className="mt-0.5 text-xs font-medium text-slate-700">{seg.meaning}</p>
            {seg.compound && (
              <div className="mt-1.5 space-y-1 border-t border-dashed border-slate-200 pt-1.5">
                <p className="text-[10px] font-semibold text-violet-700">組合字拆解</p>
                <div className="flex flex-wrap gap-1">
                  {seg.compound.parts.map((p, j) => (
                    <span
                      key={`${p.thai}-${j}`}
                      className="inline-flex items-center gap-0.5 rounded bg-violet-50 px-1.5 py-0.5 text-[10px] text-violet-900 ring-1 ring-violet-100"
                    >
                      <span className="thai-text font-medium" lang="th">
                        {p.thai}
                      </span>
                      <span className="text-violet-600">{p.meaning}</span>
                    </span>
                  ))}
                </div>
                <p className="text-[10px] leading-snug text-violet-800">{seg.compound.inferredZh}</p>
                {seg.compound.patternZh && (
                  <p className="text-[10px] text-violet-600/90">規律：{seg.compound.patternZh}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {!compact && (
        <p className="rounded-lg bg-indigo-50 px-3 py-2 text-xs leading-relaxed text-indigo-900 ring-1 ring-indigo-100">
          {analysis.grammarNoteZh}
        </p>
      )}

      {onSpeak && (
        <button
          type="button"
          onClick={() => onSpeak(analysis.fullThai)}
          disabled={speaking}
          className="text-xs font-medium text-indigo-700 hover:text-indigo-900 disabled:opacity-60"
        >
          🔊 朗讀整句
        </button>
      )}
    </div>
  )
}
