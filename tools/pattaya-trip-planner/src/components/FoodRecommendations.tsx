import { FOOD_AREA_LABELS, FOOD_CATEGORY_LABELS, getRecommendedFoods } from '../data/foods'
import { HOTEL_AREA_LABELS } from '../data/hotels'
import { BUDGET_LABELS } from '../types'
import type { TripPlan } from '../types'
import { formatRangeWithCnyHkd } from '../utils/currency'

interface FoodRecommendationsProps {
  plan: TripPlan
}

export function FoodRecommendations({ plan }: FoodRecommendationsProps) {
  const { config } = plan
  const { currency, exchangeRate } = config
  const foods = getRecommendedFoods(config, 8)

  return (
    <section className="panel-card rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <h3 className="text-lg font-bold text-slate-900">美食推介</h3>
      <p className="mt-1 text-sm text-slate-600">
        依住宿區域（{HOTEL_AREA_LABELS[config.hotelArea]}）、{BUDGET_LABELS[config.budget]}
        預算與興趣排序 · 約 {config.days} 天行程
      </p>

      <p className="mt-3 rounded-xl bg-amber-50/90 px-3 py-2 text-sm text-amber-950 ring-1 ring-amber-100">
        預算試算中的「餐飲」為整趟參考；以下為單店每人每餐，可依天數自行分配。
      </p>

      <ul className="mt-4 space-y-3">
        {foods.map((food, index) => {
          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(food.mapQuery)}`
          const categoryLabel = FOOD_CATEGORY_LABELS[food.category]
          const areaLabel =
            food.area === 'any' ? FOOD_AREA_LABELS.any : FOOD_AREA_LABELS[food.area]

          return (
            <li
              key={food.id}
              className={`rounded-xl border p-4 ${
                index === 0
                  ? 'border-amber-200 bg-gradient-to-br from-amber-50/90 to-orange-50/40 ring-1 ring-amber-100'
                  : 'border-slate-100 bg-slate-50/80'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  {index === 0 && (
                    <span className="mb-1 inline-block rounded-full bg-amber-600 px-2 py-0.5 text-[10px] font-bold text-white">
                      首推
                    </span>
                  )}
                  <h4 className="font-semibold text-slate-900">{food.nameZh}</h4>
                  <p className="thai text-sm text-teal-800">{food.nameTh}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {categoryLabel} · {areaLabel}
                    {food.openHours ? ` · ${food.openHours}` : ''}
                  </p>
                </div>
                <div className="text-right text-sm">
                  <p className="font-medium text-amber-900">
                    每人{' '}
                    {formatRangeWithCnyHkd(
                      food.pricePerPersonThb.min,
                      food.pricePerPersonThb.max,
                      currency,
                      exchangeRate,
                    )}
                  </p>
                </div>
              </div>

              <ul className="mt-2 flex flex-wrap gap-1.5">
                {food.highlights.map((h) => (
                  <li
                    key={h}
                    className="rounded-full bg-white/90 px-2 py-0.5 text-xs text-slate-600 ring-1 ring-slate-200"
                  >
                    {h}
                  </li>
                ))}
              </ul>

              {food.mustTry.length > 0 && (
                <p className="mt-2 text-sm text-slate-700">
                  <span className="font-medium text-amber-800">必點：</span>
                  {food.mustTry.join('、')}
                </p>
              )}

              <p className="mt-2 text-sm text-slate-700">
                <span className="font-medium text-teal-800">推薦理由：</span>
                {food.pros}
              </p>
              <p className="mt-1 text-xs text-amber-800">💡 {food.tip}</p>

              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm font-medium text-teal-700 hover:underline"
              >
                Google 地圖 →
              </a>
            </li>
          )
        })}
      </ul>

      <p className="mt-3 text-xs text-slate-500">
        海鮮店請先確認計價方式；夜市多為現金。若對海鮮過敏，可優先選商場美食樓或泰式料理店。
      </p>
    </section>
  )
}
