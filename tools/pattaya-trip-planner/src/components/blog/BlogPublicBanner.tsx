import { useEffect, useState } from 'react'
import {
  hasUserLikedNote,
  isSupabaseConfigured,
  toggleCloudNoteLike,
} from '../../utils/cloud'
import type { TravelNote } from '../../types'

interface BlogPublicBannerProps {
  note: TravelNote
  onFork: () => void
  forking?: boolean
}

function isCloudPostId(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
}

export function BlogPublicBanner({ note, onFork, forking }: BlogPublicBannerProps) {
  const date = new Date(note.publishedAt).toLocaleDateString('zh-Hant', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const cloudPost = isSupabaseConfigured() && isCloudPostId(note.id)
  const [likeCount, setLikeCount] = useState(note.likeCount ?? 0)
  const [liked, setLiked] = useState(false)
  const [liking, setLiking] = useState(false)

  useEffect(() => {
    if (!cloudPost) return
    void hasUserLikedNote(note.id).then(setLiked)
  }, [cloudPost, note.id])

  const handleLike = async () => {
    if (!cloudPost || liking) return
    setLiking(true)
    try {
      const count = await toggleCloudNoteLike(note.id)
      setLikeCount(count)
      setLiked(await hasUserLikedNote(note.id))
    } finally {
      setLiking(false)
    }
  }

  return (
    <div className="blog-public-banner">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-stone-700">
            <span className="font-medium text-teal-900">{note.authorName}</span> · {date}
          </p>
          {note.caption && <p className="text-stone-800">{note.caption}</p>}
          <p className="text-stone-500">{note.excerpt}</p>
          {note.tags && note.tags.length > 0 && (
            <p className="mt-1 text-sm text-teal-800">
              {note.tags.map((t) => `#${t}`).join(' ')}
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {cloudPost && (
            <button
              type="button"
              onClick={() => void handleLike()}
              disabled={liking}
              className={`blog-btn ${liked ? 'blog-btn-primary' : 'blog-btn-secondary'}`}
            >
              {liking ? '…' : liked ? `♥ ${likeCount}` : `♡ ${likeCount}`}
            </button>
          )}
          <button
            type="button"
            onClick={onFork}
            disabled={forking}
            className="blog-btn blog-btn-primary shrink-0"
          >
            {forking ? '複製中…' : '複製成我的行程'}
          </button>
        </div>
      </div>
      <p className="mt-2 text-stone-500">
        複製後可自由增刪景點、改預算，資料儲存在你的瀏覽器。
      </p>
    </div>
  )
}
