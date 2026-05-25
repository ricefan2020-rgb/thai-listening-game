import { getRecommendedHotels, nightsForStay } from '../data/hotels'
import {
  getHotelAreaIntro,
  getHotelAreaLabel,
  getRegionMeta,
} from '../data/regions'
import { BUDGET_LABELS } from '../types'
import type { TripConfig, TripPlan } from '../types'
import { formatRangeWithCnyHkd } from '../utils/currency'
import { RecommendationCard } from './RecommendationCard'

interface HotelRecommendationsProps {
  plan: TripPlan
  onConfigChange?: (config: TripConfig) => void
  readOnly?: boolean
}

export function HotelRecommendations({
  plan,
  onConfigChange,
  readOnly = false,
}: HotelRecommendationsProps) {
  const { config } = plan
  const { currency, exchangeRate } = config
  const regionMeta = getRegionMeta(config.regionId)
  const nights = nightsForStay(config.days)
  const hotels = getRecommendedHotels(config, 6)

  return (
    <div className="rec-section">
      <p className="rec-section-meta">
        {regionMeta.labelZh} · {BUDGET_LABELS[config.budget]} · 約 {nights} 晚
      </p>

      {!readOnly && onConfigChange ? (
        <div className="rec-area-pills">
          {regionMeta.hotelAreas.map((area) => {
            const active = config.hotelArea === area.id
            return (
              <button
                key={area.id}
                type="button"
                onClick={() => onConfigChange({ ...config, hotelArea: area.id })}
                className={`rec-area-pill ${active ? 'rec-area-pill--active' : ''}`}
              >
                {area.label}
              </button>
            )
          })}
        </div>
      ) : (
        <p className="rec-section-area">
          {getHotelAreaLabel(config.regionId, config.hotelArea)}
        </p>
      )}

      <p className="rec-section-note">
        <strong>{getHotelAreaLabel(config.regionId, config.hotelArea)}：</strong>
        {getHotelAreaIntro(config.regionId, config.hotelArea)}
      </p>

      <ul className="rec-list">
        {hotels.map((hotel, index) => {
          return (
            <RecommendationCard
              key={hotel.id}
              featured={index === 0}
              accent="violet"
              nameZh={hotel.nameZh}
              nameTh={hotel.nameTh}
              meta={hotel.highlights.slice(0, 2).join(' · ')}
              priceLabel="每晚"
              priceValue={formatRangeWithCnyHkd(
                hotel.pricePerNightThb.min,
                hotel.pricePerNightThb.max,
                currency,
                exchangeRate,
              )}
              tags={hotel.highlights}
              pros={hotel.pros}
              tip={
                hotel.cons
                  ? `注意：${hotel.cons} · ${hotel.tip}`
                  : hotel.tip
              }
              mapQuery={hotel.mapQuery}
            />
          )
        })}
      </ul>

      <p className="rec-section-foot">
        房價為參考區間，旺季可能上浮 30–50%。建議 Agoda、Booking 比價並查看近三個月評論。
      </p>
    </div>
  )
}
