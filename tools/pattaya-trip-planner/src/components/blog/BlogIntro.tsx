import { estimateFlightCost, getFlightOriginLabel } from '../../data/flights'
import { getTopFood } from '../../data/foods'
import { getTopHotel, nightsForStay } from '../../data/hotels'
import { calculateTripBudget } from '../../utils/budget'
import { formatMoneyDual, formatRangeWithCnyHkd } from '../../utils/currency'
import { estimateTripCost } from '../../utils/planner'
import type { TripPlan } from '../../types'
import { BUDGET_LABELS } from '../../types'

interface BlogIntroProps {
  plan: TripPlan
}

export function BlogIntro({ plan }: BlogIntroProps) {
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

  return (
    <div className="blog-intro prose-block">
      <p className="blog-first-paragraph">
        這趟<strong>{config.title}</strong>預計<strong>{config.days} 天</strong>、
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
            ；若含市區交通、曼谷來回、住宿與餐飲，整趟約{' '}
          </>
        ) : (
          <>若含市區交通、曼谷來回、住宿與餐飲，整趟約</>
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
