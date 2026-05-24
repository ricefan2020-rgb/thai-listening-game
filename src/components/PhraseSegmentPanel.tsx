import type { PhraseAnalysis } from '../types'
import { SEGMENT_ROLE_STYLES, inferRole } from '../utils/sentenceAnalysis'
import { getThaiRomanToneInfo } from '../utils/thaiRoman'
import { ThaiColoredText } from './ThaiColoredText'

interface PhraseSegmentPanelProps {
  analysis: PhraseAnalysis
  speaking?: boolean
  onSpeak?: (text: string) => void
  compact?: boolean
  inverted?: boolean
}

export function PhraseSegmentPanel({
  analysis,
  speaking,
  onSpeak,
  compact,
  inverted,
}: PhraseSegmentPanelProps) {
  const showSegments = analysis.segments.length >= 2

  return (
    <div className="space-y-3 text-left">
      <div>
        <p className={`text-xs font-semibold ${inverted ? 'text-violet-300' : 'text-violet-700'}`}>
          分詞分析
        </p>
        {analysis.structureZh && showSegments && (
          <p className={`mt-0.5 text-[10px] ${inverted ? 'text-violet-200/80' : 'text-violet-600/90'}`}>
            結構：{analysis.structureZh}
          </p>
        )}
      </div>

      {showSegments && (
        <div className="flex flex-wrap gap-1.5">
          {analysis.segments.map((seg, i) => {
            const toneInfo = getThaiRomanToneInfo(seg.thai)
            const roleZh = seg.roleZh ?? inferRole(seg.thai).roleZh
            const roleStyle = SEGMENT_ROLE_STYLES[inferRole(seg.thai).role]
            return (
              <div
                key={`${seg.thai}-${i}`}
                className={`min-w-[4.5rem] flex-1 rounded-lg px-2 py-2 ring-1 ${
                  inverted ? 'bg-slate-900/50 ring-slate-600' : 'bg-white ring-violet-200'
                }`}
              >
                <div className="mb-1 flex flex-wrap items-center gap-1">
                  <span
                    className={`rounded px-1 py-0.5 text-[10px] font-semibold ring-1 ${roleStyle}`}
                  >
                    {roleZh}
                  </span>
                  {onSpeak && (
                    <button
                      type="button"
                      onClick={() => onSpeak(seg.thai)}
                      disabled={speaking}
                      className={`text-[10px] disabled:opacity-50 ${
                        inverted ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'
                      }`}
                      aria-label={`播放 ${seg.thai}`}
                    >
                      ▶️
                    </button>
                  )}
                </div>
                <ThaiColoredText text={seg.thai} className="text-base font-semibold" />
                {toneInfo.roman && (
                  <p
                    className={`thai-roman mt-0.5 text-[10px] ${inverted ? 'text-slate-400' : 'text-slate-500'}`}
                  >
                    {toneInfo.roman}
                    {toneInfo.tonesZh && toneInfo.tonesZh !== '平' && (
                      <span className={`ml-1 ${inverted ? 'text-violet-300' : 'text-violet-600'}`}>
                        {toneInfo.tonesZh}聲
                      </span>
                    )}
                  </p>
                )}
                <p
                  className={`mt-0.5 text-xs font-medium ${inverted ? 'text-slate-200' : 'text-slate-700'}`}
                >
                  {seg.meaning}
                </p>
              </div>
            )
          })}
        </div>
      )}

      {!compact && analysis.noteZh && (
        <p
          className={`rounded-lg px-3 py-2 text-xs leading-relaxed ring-1 ${
            inverted
              ? 'bg-violet-950/40 text-violet-100 ring-violet-800/50'
              : 'bg-violet-50 text-violet-900 ring-violet-100'
          }`}
        >
          {analysis.noteZh}
        </p>
      )}

      {analysis.similarCompounds && analysis.similarCompounds.length > 0 && (
        <div className="space-y-2">
          <div>
            <p className={`text-xs font-semibold ${inverted ? 'text-amber-300' : 'text-amber-800'}`}>
              相似組合字
            </p>
            {analysis.similarPatternZh && (
              <p
                className={`mt-0.5 text-[10px] ${inverted ? 'text-amber-200/80' : 'text-amber-700/90'}`}
              >
                句型：{analysis.similarPatternZh}
              </p>
            )}
          </div>
          {analysis.similarCompounds.map((item) => (
            <div
              key={item.thai}
              className={`rounded-lg px-2.5 py-2 ring-1 ${
                inverted ? 'bg-amber-950/30 ring-amber-800/40' : 'bg-amber-50 ring-amber-200/80'
              }`}
            >
              <p className="thai-text text-sm font-semibold" lang="th">
                {item.thai}
              </p>
              <p className={`mt-0.5 text-xs ${inverted ? 'text-slate-300' : 'text-slate-600'}`}>
                {item.meaningZh}
              </p>
              {item.segments.length >= 2 && (
                <p
                  className={`mt-1 text-[10px] leading-relaxed ${
                    inverted ? 'text-amber-100/90' : 'text-amber-900/80'
                  }`}
                >
                  {item.segments.map((s) => `${s.thai}（${s.meaning}）`).join(' + ')}
                </p>
              )}
              {onSpeak && (
                <button
                  type="button"
                  onClick={() => onSpeak(item.thai)}
                  disabled={speaking}
                  className={`mt-1 text-[10px] font-medium disabled:opacity-60 ${
                    inverted ? 'text-amber-200' : 'text-amber-800'
                  }`}
                >
                  ▶️ 朗讀
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {analysis.examples.length > 0 && (
        <div className="space-y-2">
          <p className={`text-xs font-semibold ${inverted ? 'text-sky-300' : 'text-sky-700'}`}>
            例句 {analysis.examples.length > 1 ? `（${analysis.examples.length} 則）` : ''}
          </p>
          {analysis.examples.map((ex, i) => (
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
                  className={`mt-1 text-xs font-medium disabled:opacity-60 ${
                    inverted ? 'text-amber-200' : 'text-sky-700'
                  }`}
                >
                  🔊 朗讀例句 {analysis.examples.length > 1 ? i + 1 : ''}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {onSpeak && (
        <button
          type="button"
          onClick={() => onSpeak(analysis.fullThai)}
          disabled={speaking}
          className={`text-xs font-medium disabled:opacity-60 ${
            inverted ? 'text-violet-300 hover:text-violet-100' : 'text-violet-700 hover:text-violet-900'
          }`}
        >
          🔊 朗讀整句
        </button>
      )}
    </div>
  )
}
