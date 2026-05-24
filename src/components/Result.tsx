import type { RoundResult } from '../types'

interface ResultProps {
  result: RoundResult
  onPlayAgain: () => void
  onHome: () => void
}

export function Result({ result, onPlayAgain, onHome }: ResultProps) {
  const rate = result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-10">
      <header className="mb-8 text-center">
        <p className="text-5xl mb-4">{rate >= 80 ? '🎉' : rate >= 50 ? '👍' : '💪'}</p>
        <h1 className="text-2xl font-bold text-slate-900">本輪結束</h1>
        {result.topicLabel && (
          <p className="mt-1 text-sm text-amber-600">{result.topicLabel}</p>
        )}
      </header>

      <div className="mb-8 space-y-3 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <Row label="答對" value={`${result.correct} / ${result.total}`} />
        <Row label="答對率" value={`${rate}%`} />
        <Row label="本輪得分" value={`+${result.roundScore}`} />
        {result.newWrongCount > 0 && (
          <Row label="新增錯題" value={`${result.newWrongCount} 題`} highlight />
        )}
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={onPlayAgain}
          className="rounded-xl bg-amber-500 px-6 py-4 text-lg font-semibold text-white shadow-md hover:bg-amber-600"
        >
          再玩一次
        </button>
        <button
          type="button"
          onClick={onHome}
          className="rounded-xl bg-white px-6 py-4 text-lg font-semibold text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50"
        >
          回首頁
        </button>
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-600">{label}</span>
      <span
        className={`font-semibold ${highlight ? 'text-red-600' : 'text-slate-900'}`}
      >
        {value}
      </span>
    </div>
  )
}
