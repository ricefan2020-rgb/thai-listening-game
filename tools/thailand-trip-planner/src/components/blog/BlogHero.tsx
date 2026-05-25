import { BUDGET_LABELS, INTEREST_LABELS, type TripConfig } from '../../types'
import { getHotelAreaLabel } from '../../data/regions'
import { REGION_LABELS } from '../../types'

const COVER_IMAGE =
  'https://images.unsplash.com/photo-1563492065599-3520f775efed?w=1600&q=80'

interface BlogHeroProps {
  title: string
  config: TripConfig
  updatedAt?: string
  readingMinutes?: number
}

export function BlogHero({ title, config, updatedAt, readingMinutes = 8 }: BlogHeroProps) {
  const dateLabel = config.startDate
    ? new Date(config.startDate).toLocaleDateString('zh-Hant', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '出發日待定'

  const tags = [
    REGION_LABELS[config.regionId],
    `${config.days} 天`,
    `${config.travelers} 人`,
    BUDGET_LABELS[config.budget],
    getHotelAreaLabel(config.regionId, config.hotelArea),
    ...config.interests.slice(0, 4).map((i) => INTEREST_LABELS[i]),
  ]

  return (
    <header className="blog-hero">
      <div className="blog-hero-cover-wrap">
        <img
          src={COVER_IMAGE}
          alt="芭提雅海灘"
          className="blog-hero-cover"
          loading="eager"
        />
        <div className="blog-hero-overlay" />
      </div>
      <div className="blog-hero-content">
        <p className="blog-eyebrow">Thailand Travel Journal</p>
        <h1 className="blog-title">{title}</h1>
        <p className="blog-deck">
          一篇可互動的旅遊計劃文章：自動排程、預算試算、交通與住宿推介，出發前隨時微調。
        </p>
        <div className="blog-meta">
          <span>{dateLabel}</span>
          <span aria-hidden>·</span>
          <span>約 {readingMinutes} 分鐘閱讀</span>
          {updatedAt && (
            <>
              <span aria-hidden>·</span>
              <span>
                更新{' '}
                {new Date(updatedAt).toLocaleDateString('zh-Hant', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </>
          )}
        </div>
        <ul className="blog-tags">
          {tags.map((tag) => (
            <li key={tag} className="blog-tag">
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
