import type { ReactNode } from 'react'
import { ConfigPanel } from '../ConfigPanel'
import type { TripConfig } from '../../types'

const COVER_IMAGE =
  'https://images.unsplash.com/photo-1563492065599-3520f775efed?w=1600&q=80'

interface BlogSetupProps {
  config: TripConfig
  onChange: (config: TripConfig) => void
  onGenerate: () => void
  onContinue?: () => void
  hasSavedPlan: boolean
  extraBelow?: ReactNode
}

export function BlogSetup({
  config,
  onChange,
  onGenerate,
  onContinue,
  hasSavedPlan,
  extraBelow,
}: BlogSetupProps) {
  return (
    <div className="blog-layout blog-layout--setup">
      <header className="blog-hero blog-hero--compact">
        <div className="blog-hero-cover-wrap">
          <img src={COVER_IMAGE} alt="" className="blog-hero-cover" />
          <div className="blog-hero-overlay" />
        </div>
        <div className="blog-hero-content">
          <p className="blog-eyebrow">Thailand Travel Journal</p>
          <h1 className="blog-title">規劃你的泰國之旅</h1>
          <p className="blog-deck">
            支援芭提雅、曼谷、清邁、普吉、喀比 — 自動排程、預算試算，並可發布分享筆記。
          </p>
        </div>
      </header>

      <div className="blog-container blog-container--narrow">
        <article className="blog-article">
          <div className="blog-intro prose-block">
            <p className="blog-first-paragraph">
              完成下方設定後，你會得到一篇包含<strong>每日行程</strong>、
              <strong>預算試算</strong>、<strong>交通</strong>、<strong>住宿推介</strong>與<strong>相關影片</strong>
              的互動文章，並可匯出 Markdown。
            </p>
          </div>
          <ConfigPanel config={config} onChange={onChange} onGenerate={onGenerate} />
          {hasSavedPlan && onContinue && (
            <p className="mt-6 text-center">
              <button
                type="button"
                onClick={onContinue}
                className="text-sm font-medium text-teal-800 underline-offset-2 hover:underline"
              >
                繼續閱讀上次的行程文章 →
              </button>
            </p>
          )}
          {extraBelow && <div className="mt-8">{extraBelow}</div>}
        </article>
      </div>
    </div>
  )
}
