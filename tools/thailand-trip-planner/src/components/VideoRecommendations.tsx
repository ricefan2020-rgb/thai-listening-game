import { useState } from 'react'
import {
  getVideosForTrip,
  youtubeEmbedUrl,
  youtubeThumbnailUrl,
  youtubeWatchUrl,
} from '../data/videos'
import type { TripPlan } from '../types'

interface VideoRecommendationsProps {
  plan: TripPlan
}

export function VideoRecommendations({ plan }: VideoRecommendationsProps) {
  const videos = getVideosForTrip(plan.config, 6)
  const [expandedId, setExpandedId] = useState<string | null>(videos[0]?.id ?? null)

  return (
    <div className="rec-section video-section">
      <p className="rec-section-meta">
        依你的興趣推薦 YouTube 行程介紹 · 點「播放」在頁內預覽，或於 YouTube 開啟
      </p>

      <ul className="video-list">
        {videos.map((video, index) => {
          const expanded = expandedId === video.id
          const thumb = youtubeThumbnailUrl(video.youtubeId)

          return (
            <li
              key={video.id}
              className={`video-card ${index === 0 ? 'video-card--featured' : ''}`}
            >
              <div className="video-card-main">
                <button
                  type="button"
                  className="video-thumb-btn"
                  onClick={() => setExpandedId(expanded ? null : video.id)}
                  aria-expanded={expanded}
                  aria-label={`${expanded ? '收起' : '播放'}：${video.titleZh}`}
                >
                  <img
                    src={thumb}
                    alt=""
                    className="video-thumb"
                    loading="lazy"
                    width={320}
                    height={180}
                  />
                  <span className="video-thumb-play" aria-hidden>
                    ▶
                  </span>
                  <span className="video-thumb-duration">{video.duration}</span>
                </button>

                <div className="video-card-body">
                  {index === 0 && <span className="video-card-badge">首推</span>}
                  {video.adultOnly && (
                    <span className="video-card-badge video-card-badge--adult">18+</span>
                  )}
                  <h4 className="video-card-title">{video.titleZh}</h4>
                  <p className="video-card-channel">
                    {video.channel}
                    {video.lang === 'en' && (
                      <span className="video-card-lang"> · 英文字幕／旁白</span>
                    )}
                  </p>
                  <p className="video-card-summary">{video.summary}</p>
                  <ul className="video-card-tags">
                    {video.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                  <div className="video-card-actions">
                    <button
                      type="button"
                      className="video-action video-action--primary"
                      onClick={() => setExpandedId(expanded ? null : video.id)}
                    >
                      {expanded ? '收起影片' : '頁內播放'}
                    </button>
                    <a
                      href={youtubeWatchUrl(video.youtubeId)}
                      target="_blank"
                      rel="noreferrer"
                      className="video-action"
                    >
                      YouTube 開啟
                    </a>
                  </div>
                </div>
              </div>

              {expanded && (
                <div className="video-embed-wrap">
                  <iframe
                    title={video.titleZh}
                    src={youtubeEmbedUrl(video.youtubeId)}
                    className="video-embed"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </li>
          )
        })}
      </ul>

      <p className="rec-section-foot">
        影片為第三方創作者內容，價格與營業時間請以現場為準。成人向影片僅供年滿 18 歲旅客參考。
      </p>
    </div>
  )
}
