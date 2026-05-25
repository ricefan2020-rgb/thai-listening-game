import type { ReactNode } from 'react'

interface RecommendationCardProps {
  featured?: boolean
  nameZh: string
  nameTh: string
  meta: string
  priceLabel: string
  priceValue: ReactNode
  tags: string[]
  mustTry?: string[]
  pros: string
  tip: string
  mapQuery: string
  accent?: 'violet' | 'amber'
  /** 已在行程中的景點 */
  scheduled?: boolean
  /** 可對應到景點庫時顯示「加入行程」 */
  linkedPlaceId?: string
  onAddToItinerary?: (placeId: string) => void
}

export function RecommendationCard({
  featured,
  nameZh,
  nameTh,
  meta,
  priceLabel,
  priceValue,
  tags,
  mustTry,
  pros,
  tip,
  mapQuery,
  accent = 'violet',
  scheduled = false,
  linkedPlaceId,
  onAddToItinerary,
}: RecommendationCardProps) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`
  const canAdd = linkedPlaceId && onAddToItinerary && !scheduled

  return (
    <li
      className={`rec-card ${featured ? `rec-card--featured rec-card--${accent}` : ''} ${scheduled ? 'rec-card--scheduled' : ''}`}
    >
      <div className="rec-card-head">
        <div className="rec-card-title-block">
          {featured && <span className="rec-card-badge">首推</span>}
          <h4 className="rec-card-title">{nameZh}</h4>
          <p className="rec-card-thai thai">{nameTh}</p>
          <p className="rec-card-meta">{meta}</p>
        </div>
        <div className="rec-card-price">
          <span className="rec-card-price-label">{priceLabel}</span>
          <span className="rec-card-price-value">{priceValue}</span>
        </div>
      </div>

      {tags.length > 0 && (
        <ul className="rec-card-tags">
          {tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      )}

      {mustTry && mustTry.length > 0 && (
        <p className="rec-card-must">
          <span>必點</span>
          {mustTry.join(' · ')}
        </p>
      )}

      <p className="rec-card-pros">{pros}</p>
      <p className="rec-card-tip">{tip}</p>

      <div className="rec-card-actions">
        {scheduled && <span className="rec-card-badge-scheduled">已在行程</span>}
        {canAdd && (
          <button
            type="button"
            className="rec-card-add"
            onClick={() => onAddToItinerary(linkedPlaceId)}
          >
            加入行程
          </button>
        )}
        <a href={mapsUrl} target="_blank" rel="noreferrer" className="rec-card-map">
          地圖
        </a>
      </div>
    </li>
  )
}
