import { BUDGET_LABELS } from '../../types'
import type { TravelNote } from '../../types'

const CARD_COVER =
  'https://images.unsplash.com/photo-1552465011-b4e21bf6e79d?w=800&q=80'

interface BlogNoteCardProps {
  note: TravelNote
  onOpen: () => void
  onCopyLink?: () => void
  linkCopied?: boolean
  onRemove?: () => void
}

export function BlogNoteCard({
  note,
  onOpen,
  onCopyLink,
  linkCopied,
  onRemove,
}: BlogNoteCardProps) {
  const { config } = note.plan
  const date = new Date(note.publishedAt).toLocaleDateString('zh-Hant', {
    month: 'short',
    day: 'numeric',
  })
  const activityCount = note.plan.days.reduce((n, d) => n + d.items.length, 0)

  return (
    <article className="xhs-card">
      <button type="button" onClick={onOpen} className="xhs-card-cover-btn">
        <img src={CARD_COVER} alt="" className="xhs-card-cover" />
        <div className="xhs-card-cover-overlay" />
        <span className="xhs-card-badge">{BUDGET_LABELS[config.budget]}</span>
      </button>

      <div className="xhs-card-body">
        <button type="button" onClick={onOpen} className="xhs-card-title-btn">
          <h3 className="xhs-card-title">{config.title}</h3>
        </button>
        {note.caption && <p className="xhs-card-caption">{note.caption}</p>}
        <p className="xhs-card-meta">
          <span className="xhs-card-author">{note.authorName}</span>
          <span aria-hidden> · </span>
          {date} · {config.days}天 · {activityCount}景點
          {note.likeCount != null && note.likeCount > 0 && (
            <span aria-hidden> · ♥ {note.likeCount}</span>
          )}
        </p>
        {note.tags && note.tags.length > 0 && (
          <div className="xhs-card-tags">
            {note.tags.map((tag) => (
              <span key={tag} className="xhs-tag">
                #{tag}
              </span>
            ))}
          </div>
        )}
        <div className="xhs-card-actions">
          {onCopyLink && (
            <button type="button" onClick={onCopyLink} className="xhs-card-action">
              {linkCopied ? '已複製' : '分享連結'}
            </button>
          )}
          {onRemove && (
            <button type="button" onClick={onRemove} className="xhs-card-action xhs-card-action--muted">
              移除
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
