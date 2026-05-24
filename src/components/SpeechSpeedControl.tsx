import {
  SPEECH_RATE_MAX,
  SPEECH_RATE_MIN,
  SPEECH_RATE_PRESETS,
  SPEECH_RATE_STEP,
} from '../hooks/useSpeechRate'

interface SpeechSpeedControlProps {
  rate: number
  onChange: (rate: number) => void
  compact?: boolean
}

export function SpeechSpeedControl({ rate, onChange, compact = false }: SpeechSpeedControlProps) {
  return (
    <div
      className={`rounded-xl bg-white shadow-sm ring-1 ring-slate-200 ${compact ? 'p-3' : 'p-4'}`}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className={`font-semibold text-slate-800 ${compact ? 'text-sm' : 'text-base'}`}>
          朗讀速度
        </span>
        <span className="text-sm font-bold text-amber-600">{rate.toFixed(1)}×</span>
      </div>

      <input
        type="range"
        min={SPEECH_RATE_MIN}
        max={SPEECH_RATE_MAX}
        step={SPEECH_RATE_STEP}
        value={rate}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mb-3 h-2 w-full cursor-pointer accent-amber-500"
        aria-label="調整朗讀速度"
      />

      <div className="flex flex-wrap gap-1.5">
        {SPEECH_RATE_PRESETS.map((preset) => (
          <button
            key={preset.value}
            type="button"
            onClick={() => onChange(preset.value)}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition ${
              Math.abs(rate - preset.value) < 0.05
                ? 'bg-amber-500 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-amber-50'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {!compact && (
        <p className="mt-2 text-xs text-slate-500">
          調慢適合初學聽清音節；調快適合複習。K 歌字幕會跟著速度同步。
        </p>
      )}
    </div>
  )
}
