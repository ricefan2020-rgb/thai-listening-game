import { useState } from 'react'
import { appArticleUrl, getRecommendationsForTrip } from '../data/reading'
import type { TripPlan } from '../types'

interface ReadingRecommendationsProps {
  plan: TripPlan
}

export function ReadingRecommendations({ plan }: ReadingRecommendationsProps) {
  const [openGuideId, setOpenGuideId] = useState<string | null>(null)
  const recs = getRecommendationsForTrip(plan.config.regionId, plan.config.interests, 6)

  return (
    <div className="rec-section">
      <p className="rec-section-meta">依興趣推薦：交通、海灘、美食與泰文短文</p>

      <div className="reading-list">
        {recs.map((rec) => (
          <article key={rec.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-slate-900">{rec.titleZh}</p>
                <p className="mt-0.5 text-sm text-slate-600">{rec.summary}</p>
                <p className="mt-1 text-xs text-slate-500">{rec.tags.join(' · ')} · {rec.readMinutes} 分鐘</p>
              </div>
              {rec.source === 'guide' ? (
                <button
                  type="button"
                  onClick={() => setOpenGuideId(openGuideId === rec.id ? null : rec.id)}
                  className="shrink-0 rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-teal-700 ring-1 ring-teal-200 hover:bg-teal-50"
                >
                  {openGuideId === rec.id ? '收起' : '閱讀'}
                </button>
              ) : (
                <a
                  href={appArticleUrl(rec.articleId!)}
                  target="_blank"
                  rel="noreferrer"
                  className="shrink-0 rounded-lg bg-white px-2.5 py-1 text-xs font-semibold text-teal-700 ring-1 ring-teal-200 hover:bg-teal-50"
                >
                  開啟
                </a>
              )}
            </div>

            {rec.source === 'guide' && openGuideId === rec.id && rec.content && (
              <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-lg bg-white p-3 text-xs leading-6 text-slate-700">
                {rec.content}
              </pre>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}
