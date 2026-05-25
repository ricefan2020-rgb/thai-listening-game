import { estimateFlightCost, getFlightOriginLabel } from '../../data/flights'
import { getTopFood } from '../../data/foods'
import { getTopHotel, nightsForStay } from '../../data/hotels'
import { calculateTripBudget } from '../../utils/budget'
import { formatMoneyDual, formatRangeWithCnyHkd } from '../../utils/currency'
import { estimateTripCost } from '../../utils/planner'
import { getRegionMeta } from '../../data/regions'
import type { TripPlan } from '../../types'
import { BUDGET_LABELS, REGION_LABELS } from '../../types'

export interface PlanNavigateOptions {
  guideTab?: string
  day?: number
}

interface BlogIntroProps {
  plan: TripPlan
  onNavigate?: (section: string, options?: PlanNavigateOptions) => void
}

export function BlogIntro({ plan, onNavigate }: BlogIntroProps) {
  const { config } = plan
  const { currency, exchangeRate } = config
  const activityCount = plan.days.reduce((n, d) => n + d.items.length, 0)
  const activitiesTotal = estimateTripCost(plan)
  const budgetSummary = calculateTripBudget(plan)
  const topHotel = getTopHotel(config)
  const topFood = getTopFood(config)
  const nights = nightsForStay(config.days)
  const flight = estimateFlightCost(config)
  const flightOriginLabel = getFlightOriginLabel(config.flightOrigin ?? 'taiwan')
  const regionMeta = getRegionMeta(config.regionId)
  const hubTransferPhrase = regionMeta.needsHubTransfer
    ? `、${regionMeta.hubTransferLabel}`
    : ''

  return (
    <div className="blog-intro prose-block">
      <p className="blog-first-paragraph">
        這趟<strong>{REGION_LABELS[config.regionId]}</strong>（{config.title}）預計
        <strong>{config.days} 天</strong>、
        <strong>{config.travelers} 人</strong>同行，以
        <strong>{BUDGET_LABELS[config.budget]}</strong>
        預算等級安排。目前已排入 <strong>{activityCount}</strong>{' '}
        個景點與活動，景點花費約{' '}
        <strong>{formatMoneyDual(activitiesTotal, currency, exchangeRate)}</strong>
        （僅景點活動）。
      </p>
      <p>
        {flight ? (
          <>
            從<strong>{flightOriginLabel}</strong>出發，來回機票參考約{' '}
            <strong>
              {formatRangeWithCnyHkd(flight.min, flight.max, currency, exchangeRate)}
            </strong>
            ；若含市區交通{hubTransferPhrase}、住宿與餐飲，整趟約{' '}
          </>
        ) : (
          <>若含市區交通{hubTransferPhrase}、住宿與餐飲，整趟約</>
        )}
        <strong>
          {formatRangeWithCnyHkd(
            budgetSummary.totalMinThb,
            budgetSummary.totalMaxThb,
            currency,
            exchangeRate,
          )}
        </strong>
        。以下各章節可展開細讀，也能在文末匯出成 Markdown 文章備份。
      </p>
      {onNavigate && (
        <div className="blog-intro-actions">
          <button type="button" className="blog-intro-chip" onClick={() => onNavigate('budget')}>
            試算預算
          </button>
          <button
            type="button"
            className="blog-intro-chip"
            onClick={() => onNavigate('itinerary', { day: 0 })}
          >
            編輯行程
          </button>
          <button
            type="button"
            className="blog-intro-chip"
            onClick={() => onNavigate('guides', { guideTab: 'food' })}
          >
            美食推介
          </button>
          <button type="button" className="blog-intro-chip" onClick={() => onNavigate('map')}>
            查看地圖
          </button>
        </div>
      )}
      {(topHotel || topFood) && (
        <div className="blog-intro-highlights">
          {topHotel && (
            <blockquote className="blog-pullquote">
              <p className="m-0 font-medium text-stone-800">住宿首推</p>
              <p className="mt-1 font-medium text-stone-900">{topHotel.nameZh}</p>
              <p className="mt-1 text-stone-600">{topHotel.pros}</p>
              <p className="mt-2 text-stone-600">
                {nights} 晚約{' '}
                {formatRangeWithCnyHkd(
                  topHotel.pricePerNightThb.min * nights,
                  topHotel.pricePerNightThb.max * nights,
                  currency,
                  exchangeRate,
                )}
              </p>
            </blockquote>
          )}
          {topFood && (
            <blockquote className="blog-pullquote blog-pullquote--food">
              <p className="m-0 font-medium text-stone-800">美食首推</p>
              <p className="mt-1 font-medium text-stone-900">{topFood.nameZh}</p>
              <p className="mt-1 text-stone-600">{topFood.pros}</p>
              {topFood.mustTry.length > 0 && (
                <p className="mt-2 text-stone-600">必點：{topFood.mustTry.join('、')}</p>
              )}
            </blockquote>
          )}
        </div>
      )}
    </div>
  )
}
