import { useEffect, useMemo, useState } from 'react'
import { AdultNightlifeGuide } from '../AdultNightlifeGuide'
import { BudgetPanel } from '../BudgetPanel'
import { DayTimeline } from '../DayTimeline'
import { FoodRecommendations } from '../FoodRecommendations'
import { HotelRecommendations } from '../HotelRecommendations'
import { MapPanel } from '../MapPanel'
import { ReadingRecommendations } from '../ReadingRecommendations'
import { TransportGuide } from '../TransportGuide'
import type { TimeSlot, TripConfig, TripPlan, TravelNote } from '../../types'
import { BlogCompactHeader } from './BlogCompactHeader'
import { BlogIntro } from './BlogIntro'
import { BlogPublicBanner } from './BlogPublicBanner'
import { BlogPublishPanel } from './BlogPublishPanel'
import { BlogSectionNav } from './BlogSectionNav'
import type { TocItem } from './BlogToc'

interface BlogPlanArticleProps {
  plan: TripPlan
  readOnly?: boolean
  publicNote?: TravelNote
  onFork?: () => void
  forking?: boolean
  onConfigChange?: (config: TripConfig) => void
  onRemoveItem?: (dayIndex: number, itemId: string) => void
  onAddItem?: (dayIndex: number, slot: TimeSlot, placeId: string) => void
  onCopyMarkdown?: () => void
  onExport?: () => void
  markdownCopied?: boolean
}

const SECTION_LEADS: Record<string, string> = {
  intro: '行程摘要與花費概覽',
  budget: '含機票、交通、住宿、餐飲與景點，支援港幣與人民幣換算',
  itinerary: '切換分頁查看各日；編輯模式可增刪景點',
  transport: '曼谷來回與市區移動費用',
  hotels: '依區域與預算排序的飯店建議',
  food: '餐廳、夜市與必點料理，依住宿區域與預算推薦',
  map: '以住宿為中心串連行程景點',
  nightlife: '安全與消費提醒',
  reading: '相關攻略與學泰文資源',
  share: '像小紅書發布筆記：心得、標籤、分享連結，或匯出 Markdown',
}

function buildSections(plan: TripPlan, readOnly: boolean): TocItem[] {
  const items: TocItem[] = [
    { id: 'intro', label: '前言' },
    { id: 'budget', label: '預算' },
    { id: 'itinerary', label: '行程' },
    { id: 'transport', label: '交通' },
    { id: 'hotels', label: '住宿' },
    { id: 'food', label: '美食' },
    { id: 'map', label: '地圖' },
  ]
  if (plan.config.interests.includes('adultNightlife')) {
    items.push({ id: 'nightlife', label: '夜生活' })
  }
  items.push({ id: 'reading', label: '閱讀' })
  if (!readOnly) items.push({ id: 'share', label: '發布' })
  return items
}

export function BlogPlanArticle({
  plan,
  readOnly = false,
  publicNote,
  onFork,
  forking,
  onConfigChange,
  onRemoveItem,
  onAddItem,
  onCopyMarkdown,
  onExport,
  markdownCopied = false,
}: BlogPlanArticleProps) {
  const sections = useMemo(() => buildSections(plan, readOnly), [plan, readOnly])
  const [activeSection, setActiveSection] = useState(sections[0]?.id ?? 'intro')
  const [activeDay, setActiveDay] = useState(0)

  useEffect(() => {
    if (!sections.some((s) => s.id === activeSection)) {
      setActiveSection(sections[0]?.id ?? 'intro')
    }
  }, [sections, activeSection])

  useEffect(() => {
    if (activeDay >= plan.days.length) setActiveDay(0)
  }, [plan.days.length, activeDay])

  const authorLine = publicNote
    ? `${publicNote.authorName} · ${new Date(publicNote.publishedAt).toLocaleDateString('zh-Hant')}`
    : undefined

  const activeLabel = sections.find((s) => s.id === activeSection)?.label ?? ''
  const lead = SECTION_LEADS[activeSection] ?? ''

  return (
    <div className="blog-shell">
      <BlogCompactHeader title={plan.config.title} config={plan.config} authorLine={authorLine} />

      {readOnly && publicNote && onFork && (
        <div className="blog-shell-banner">
          <BlogPublicBanner note={publicNote} onFork={onFork} forking={forking} />
        </div>
      )}

      <BlogSectionNav
        items={sections}
        activeId={activeSection}
        onSelect={(id) => {
          setActiveSection(id)
          if (id === 'itinerary') setActiveDay(0)
        }}
      />

      <div className="blog-panel" key={activeSection}>
        <header className="blog-panel-header">
          <h2 className="blog-panel-title">{activeLabel}</h2>
          {lead && <p className="blog-panel-lead">{lead}</p>}
        </header>

        <div className="blog-panel-body">
          {activeSection === 'intro' && <BlogIntro plan={plan} />}

          {activeSection === 'budget' && (
            <BudgetPanel plan={plan} onConfigChange={onConfigChange} readOnly={readOnly} />
          )}

          {activeSection === 'itinerary' && (
            <div className="blog-itinerary">
              {plan.days.length > 1 && (
                <div className="blog-day-nav">
                  {plan.days.map((day, index) => (
                    <button
                      key={day.day}
                      type="button"
                      onClick={() => setActiveDay(index)}
                      className={`blog-day-tab ${activeDay === index ? 'blog-day-tab--active' : ''}`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              )}
              {plan.days[activeDay] && (
                <DayTimeline
                  day={plan.days[activeDay]}
                  budget={plan.config.budget}
                  travelers={plan.config.travelers}
                  currency={plan.config.currency}
                  exchangeRate={plan.config.exchangeRate}
                  readOnly={readOnly}
                  onRemoveItem={
                    onRemoveItem ? (id) => onRemoveItem(activeDay, id) : undefined
                  }
                  onAddItem={
                    onAddItem
                      ? (slot, placeId) => onAddItem(activeDay, slot, placeId)
                      : undefined
                  }
                />
              )}
            </div>
          )}

          {activeSection === 'transport' && (
            <TransportGuide plan={plan} onConfigChange={onConfigChange} readOnly={readOnly} />
          )}

          {activeSection === 'hotels' && (
            <HotelRecommendations
              plan={plan}
              onConfigChange={onConfigChange}
              readOnly={readOnly}
            />
          )}

          {activeSection === 'food' && <FoodRecommendations plan={plan} />}

          {activeSection === 'map' && <MapPanel plan={plan} />}

          {activeSection === 'nightlife' && (
            <AdultNightlifeGuide config={plan.config} />
          )}

          {activeSection === 'reading' && <ReadingRecommendations plan={plan} />}

          {activeSection === 'share' && onCopyMarkdown && onExport && (
            <BlogPublishPanel
              plan={plan}
              onCopyMarkdown={onCopyMarkdown}
              onExport={onExport}
              markdownCopied={markdownCopied}
            />
          )}
        </div>
      </div>
    </div>
  )
}
