import { FOOD_CATEGORY_LABELS, getFoodAreaLabel, getRecommendedFoods } from '../data/foods'
import { getHotelAreaLabel } from '../data/regions'
import { BUDGET_LABELS } from '../types'
import type { TripPlan } from '../types'
import { formatRangeWithCnyHkd } from '../utils/currency'
import { RecommendationCard } from './RecommendationCard'

interface FoodRecommendationsProps {
  plan: TripPlan
}

export function FoodRecommendations({ plan }: FoodRecommendationsProps) {
  const { config } = plan
  const { currency, exchangeRate } = config
  const foods = getRecommendedFoods(config, 8)

  return (
    <div className="rec-section">
      <p className="rec-section-meta">
        {getHotelAreaLabel(config.regionId, config.hotelArea)} · {BUDGET_LABELS[config.budget]} ·{' '}
        {config.days} 天
      </p>

      <p className="rec-section-note rec-section-note--amber">
        預算試算中的「餐飲」為整趟參考；以下為單店每人每餐。
      </p>

      <ul className="rec-list">
        {foods.map((food, index) => {
          const categoryLabel = FOOD_CATEGORY_LABELS[food.category]
          const areaLabel =
            getFoodAreaLabel(config.regionId, food.area)
          const meta = [categoryLabel, areaLabel, food.openHours]
            .filter(Boolean)
            .join(' · ')

          return (
            <RecommendationCard
              key={food.id}
              featured={index === 0}
              accent="amber"
              nameZh={food.nameZh}
              nameTh={food.nameTh}
              meta={meta}
              priceLabel="每人"
              priceValue={formatRangeWithCnyHkd(
                food.pricePerPersonThb.min,
                food.pricePerPersonThb.max,
                currency,
                exchangeRate,
              )}
              tags={food.highlights}
              mustTry={food.mustTry}
              pros={food.pros}
              tip={food.tip}
              mapQuery={food.mapQuery}
            />
          )
        })}
      </ul>

      <p className="rec-section-foot">
        海鮮店請先確認計價；夜市多為現金。對海鮮過敏可選商場美食樓或泰式料理店。
      </p>
    </div>
  )
}
