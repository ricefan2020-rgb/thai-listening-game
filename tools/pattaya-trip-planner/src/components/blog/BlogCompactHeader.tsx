import { BUDGET_LABELS, INTEREST_LABELS, type TripConfig } from '../../types'
import { HOTEL_AREA_LABELS } from '../../data/hotels'

interface BlogCompactHeaderProps {
  title: string
  config: TripConfig
  authorLine?: string
}

export function BlogCompactHeader({ title, config, authorLine }: BlogCompactHeaderProps) {
  const tags = [
    `${config.days} 天`,
    `${config.travelers} 人`,
    BUDGET_LABELS[config.budget],
    HOTEL_AREA_LABELS[config.hotelArea],
  ]

  return (
    <header className="blog-compact-header">
      <p className="blog-compact-eyebrow">Pattaya Travel Journal</p>
      <h1 className="blog-compact-title">{title}</h1>
      {authorLine && <p className="blog-compact-author">{authorLine}</p>}
      <ul className="blog-compact-tags">
        {tags.map((t) => (
          <li key={t}>{t}</li>
        ))}
        {config.interests.slice(0, 3).map((i) => (
          <li key={i}>{INTEREST_LABELS[i]}</li>
        ))}
      </ul>
    </header>
  )
}
