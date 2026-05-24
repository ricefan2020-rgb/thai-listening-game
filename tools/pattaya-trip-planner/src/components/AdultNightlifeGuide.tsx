import { ADULT_NIGHTLIFE_TIPS } from '../data/transport'
import { ADULT_NIGHTLIFE_PLACES } from '../data/places-adult'
import type { TripConfig } from '../types'

interface AdultNightlifeGuideProps {
  config: TripConfig
}

export function AdultNightlifeGuide({ config }: AdultNightlifeGuideProps) {
  if (!config.interests.includes('adultNightlife')) return null

  return (
    <section className="panel-card rounded-2xl border border-rose-200 bg-gradient-to-br from-rose-50 to-slate-50 p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="pt-subtitle">成人夜生活（18+）</span>
        <span className="rounded-full bg-rose-600 px-2 py-0.5 text-xs font-medium text-white">
          僅限成年旅客
        </span>
      </div>
      <p className="mt-1 text-sm text-slate-600">
        已納入 {ADULT_NIGHTLIFE_PLACES.length} 個酒吧街／夜店區資料，排程時會優先建議此類景點。
      </p>

      <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
        {ADULT_NIGHTLIFE_TIPS.map((tip) => (
          <li key={tip} className="flex gap-2">
            <span className="text-rose-600">⚠</span>
            {tip}
          </li>
        ))}
      </ul>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {ADULT_NIGHTLIFE_PLACES.map((p) => (
          <div key={p.id} className="rounded-lg bg-white/80 px-3 py-2 text-sm ring-1 ring-rose-100">
            <p className="font-medium text-slate-900">{p.nameZh}</p>
            <p className="text-xs text-slate-500">{p.area} · 約 {p.durationHours} 小時</p>
          </div>
        ))}
      </div>
    </section>
  )
}
