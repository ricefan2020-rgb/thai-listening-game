import {
  HOTEL_AREA_INTRO,
  HOTEL_AREA_LABELS,
  getRecommendedHotels,
  nightsForStay,
} from '../data/hotels'
import { BUDGET_LABELS } from '../types'
import type { TripConfig, TripPlan } from '../types'
import { formatRangeWithCnyHkd } from '../utils/currency'

interface HotelRecommendationsProps {
  plan: TripPlan
  onConfigChange?: (config: TripConfig) => void
  readOnly?: boolean
}

const AREAS: TripConfig['hotelArea'][] = ['central', 'jomtien', 'north']

export function HotelRecommendations({
  plan,
  onConfigChange,
  readOnly = false,
}: HotelRecommendationsProps) {
  const { config } = plan
  const { currency, exchangeRate } = config
  const nights = nightsForStay(config.days)
  const hotels = getRecommendedHotels(config, 6)

  return (
    <section className="panel-card rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <h3 className="text-lg font-bold text-slate-900">住宿推介</h3>
      <p className="mt-1 text-sm text-slate-600">
        依你選的區域、{BUDGET_LABELS[config.budget]}預算與興趣排序 · 約 {nights} 晚
      </p>

      {!readOnly && onConfigChange ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {AREAS.map((area) => {
            const active = config.hotelArea === area
            return (
              <button
                key={area}
                type="button"
                onClick={() => onConfigChange({ ...config, hotelArea: area })}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  active
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {HOTEL_AREA_LABELS[area]}
              </button>
            )
          })}
        </div>
      ) : (
        <p className="mt-3 text-sm font-medium text-violet-900">
          {HOTEL_AREA_LABELS[config.hotelArea]}
        </p>
      )}

      <p className="mt-3 rounded-xl bg-violet-50/80 px-3 py-2 text-sm text-violet-950 ring-1 ring-violet-100">
        <span className="font-semibold">{HOTEL_AREA_LABELS[config.hotelArea]}：</span>
        {HOTEL_AREA_INTRO[config.hotelArea]}
      </p>

      <ul className="mt-4 space-y-3">
        {hotels.map((hotel, index) => {
          const stayMin = hotel.pricePerNightThb.min * nights
          const stayMax = hotel.pricePerNightThb.max * nights
          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.mapQuery)}`
          return (
            <li
              key={hotel.id}
              className={`rounded-xl border p-4 ${
                index === 0
                  ? 'border-violet-200 bg-gradient-to-br from-violet-50/90 to-teal-50/40 ring-1 ring-violet-100'
                  : 'border-slate-100 bg-slate-50/80'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  {index === 0 && (
                    <span className="mb-1 inline-block rounded-full bg-violet-600 px-2 py-0.5 text-[10px] font-bold text-white">
                      首推
                    </span>
                  )}
                  <h4 className="font-semibold text-slate-900">{hotel.nameZh}</h4>
                  <p className="thai text-sm text-teal-800">{hotel.nameTh}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="font-medium text-amber-900">
                    每晚{' '}
                    {formatRangeWithCnyHkd(
                      hotel.pricePerNightThb.min,
                      hotel.pricePerNightThb.max,
                      currency,
                      exchangeRate,
                    )}
                  </p>
                  <p className="text-xs text-slate-500">
                    {nights} 晚約{' '}
                    {formatRangeWithCnyHkd(stayMin, stayMax, currency, exchangeRate)}
                  </p>
                </div>
              </div>

              <ul className="mt-2 flex flex-wrap gap-1.5">
                {hotel.highlights.map((h) => (
                  <li
                    key={h}
                    className="rounded-full bg-white/90 px-2 py-0.5 text-xs text-slate-600 ring-1 ring-slate-200"
                  >
                    {h}
                  </li>
                ))}
              </ul>

              <p className="mt-2 text-sm text-slate-700">
                <span className="font-medium text-teal-800">優點：</span>
                {hotel.pros}
              </p>
              {hotel.cons && (
                <p className="mt-1 text-sm text-slate-600">
                  <span className="font-medium text-slate-500">注意：</span>
                  {hotel.cons}
                </p>
              )}
              <p className="mt-1 text-xs text-amber-800">💡 {hotel.tip}</p>

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
        房價為參考區間，旺季、周末與節日可能上浮 30–50%。建議透過 Agoda、Booking 比價，並查看近三個月評論。
      </p>
    </section>
  )
}
