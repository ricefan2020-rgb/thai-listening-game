import { BUDGET_LABELS, INTEREST_LABELS, type TripConfig } from '../../types'
import { getHotelAreaLabel } from '../../data/regions'
import { REGION_LABELS } from '../../types'

interface BlogCompactHeaderProps {
  title: string
  config: TripConfig
  authorLine?: string
  onTitleChange?: (title: string) => void
}

export function BlogCompactHeader({
  title,
  config,
  authorLine,
  onTitleChange,
}: BlogCompactHeaderProps) {
  const interestLabels = config.interests.map((i) => INTEREST_LABELS[i])
  const interestText =
    interestLabels.length <= 2
      ? interestLabels.join(' · ')
      : `${interestLabels.slice(0, 2).join(' · ')} 等 ${interestLabels.length} 項`

  return (
    <header className="blog-compact-header">
      <p className="blog-compact-eyebrow">Thailand Travel Journal</p>
      {onTitleChange ? (
        <label className="blog-compact-title-edit">
          <span className="sr-only">行程標題</span>
          <input
            type="text"
            className="blog-compact-title-input"
            value={title}
            maxLength={48}
            onChange={(e) => onTitleChange(e.target.value)}
          />
        </label>
      ) : (
        <h1 className="blog-compact-title">{title}</h1>
      )}
      {authorLine && <p className="blog-compact-author">{authorLine}</p>}

      <dl className="blog-stats blog-stats--5">
        <div>
          <dt>目的地</dt>
          <dd>{REGION_LABELS[config.regionId]}</dd>
        </div>
        <div>
          <dt>天數</dt>
          <dd>{config.days} 天</dd>
        </div>
        <div>
          <dt>人數</dt>
          <dd>{config.travelers} 人</dd>
        </div>
        <div>
          <dt>預算</dt>
          <dd>{BUDGET_LABELS[config.budget]}</dd>
        </div>
        <div>
          <dt>住宿區</dt>
          <dd>{getHotelAreaLabel(config.regionId, config.hotelArea).split(' / ')[0]}</dd>
        </div>
      </dl>

      {interestLabels.length > 0 && (
        <p className="blog-compact-interests">
          <span className="blog-compact-interests-label">興趣</span>
          {interestText}
        </p>
      )}
    </header>
  )
}
