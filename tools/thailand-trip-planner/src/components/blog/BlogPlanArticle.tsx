import { useEffect, useMemo, useState } from 'react'
import { AdultNightlifeGuide } from '../AdultNightlifeGuide'
import { BudgetPanel } from '../BudgetPanel'
import { DayTimeline } from '../DayTimeline'
import { FoodRecommendations } from '../FoodRecommendations'
import { HotelRecommendations } from '../HotelRecommendations'
import { MapPanel } from '../MapPanel'
import { ReadingRecommendations } from '../ReadingRecommendations'
import { TransportGuide } from '../TransportGuide'
import { VideoRecommendations } from '../VideoRecommendations'
import type { TimeSlot, TripConfig, TripPlan, TravelNote } from '../../types'
import { BlogCompactHeader } from './BlogCompactHeader'
import { BlogIntro } from './BlogIntro'
import { BlogPublicBanner } from './BlogPublicBanner'
import { BlogPublishPanel } from './BlogPublishPanel'
import { BlogSectionNav, type NavGroup } from './BlogSectionNav'
import { BlogSubNav } from './BlogSubNav'
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

type GuideTab = 'hotels' | 'food' | 'videos' | 'reading' | 'nightlife'

const SECTION_LEADS: Record<string, string> = {
  intro: '行程摘要與花費概覽',
  budget: '含機票、交通、住宿、餐飲與景點，支援港幣與人民幣換算',
  itinerary: '切換分頁查看各日；編輯模式可增刪景點',
  transport: '機場轉乘與市區移動費用',
  guides: '住宿、美食、影片與延伸閱讀',
  map: '以住宿為中心串連行程景點',
  share: '心得、標籤、分享連結，或匯出 Markdown',
}

const GUIDE_LEADS: Record<GuideTab, string> = {
  hotels: '依區域與預算排序的飯店建議',
  food: '餐廳、夜市與必點料理',
  videos: 'YouTube 行程與景點實景介紹',
  reading: '攻略與學泰文資源',
  nightlife: '安全與消費提醒',
}

function buildNavGroups(plan: TripPlan, readOnly: boolean): NavGroup[] {
  const overview: TocItem[] = [
    { id: 'intro', label: '前言' },
    { id: 'budget', label: '預算' },
  ]
  const trip: TocItem[] = [
    { id: 'itinerary', label: '行程' },
    { id: 'transport', label: '交通' },
    { id: 'guides', label: '推介' },
    { id: 'map', label: '地圖' },
  ]
  const groups: NavGroup[] = [
    { label: '概覽', items: overview },
    { label: '行程', items: trip },
  ]
  if (!readOnly) {
    groups.push({ label: '分享', items: [{ id: 'share', label: '發布' }] })
  }
  return groups
}

function buildGuideTabs(plan: TripPlan): { id: GuideTab; label: string }[] {
  const tabs: { id: GuideTab; label: string }[] = [
    { id: 'hotels', label: '住宿' },
    { id: 'food', label: '美食' },
    { id: 'videos', label: '影片' },
    { id: 'reading', label: '閱讀' },
  ]
  if (
    plan.config.regionId === 'pattaya' &&
    plan.config.interests.includes('adultNightlife')
  ) {
    tabs.push({ id: 'nightlife', label: '夜生活' })
  }
  return tabs
}

function allSectionIds(groups: NavGroup[]): string[] {
  return groups.flatMap((g) => g.items.map((i) => i.id))
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
  const navGroups = useMemo(() => buildNavGroups(plan, readOnly), [plan, readOnly])
  const guideTabs = useMemo(() => buildGuideTabs(plan), [plan])
  const sectionIds = useMemo(() => allSectionIds(navGroups), [navGroups])

  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? 'intro')
  const [guideTab, setGuideTab] = useState<GuideTab>('hotels')
  const [activeDay, setActiveDay] = useState(0)

  useEffect(() => {
    if (!sectionIds.includes(activeSection)) {
      setActiveSection(sectionIds[0] ?? 'intro')
    }
  }, [sectionIds, activeSection])

  useEffect(() => {
    if (!guideTabs.some((t) => t.id === guideTab)) {
      setGuideTab(guideTabs[0]?.id ?? 'hotels')
    }
  }, [guideTabs, guideTab])

  useEffect(() => {
    if (activeDay >= plan.days.length) setActiveDay(0)
  }, [plan.days.length, activeDay])

  const authorLine = publicNote
    ? `${publicNote.authorName} · ${new Date(publicNote.publishedAt).toLocaleDateString('zh-Hant')}`
    : undefined

  const activeLabel =
    activeSection === 'guides'
      ? guideTabs.find((t) => t.id === guideTab)?.label ?? '推介'
      : navGroups.flatMap((g) => g.items).find((s) => s.id === activeSection)?.label ?? ''

  const lead =
    activeSection === 'guides'
      ? GUIDE_LEADS[guideTab]
      : SECTION_LEADS[activeSection] ?? ''

  const selectSection = (id: string) => {
    setActiveSection(id)
    if (id === 'itinerary') setActiveDay(0)
    if (id === 'guides' && !guideTabs.some((t) => t.id === guideTab)) {
      setGuideTab(guideTabs[0]?.id ?? 'hotels')
    }
  }

  return (
    <div className="blog-shell">
      <BlogCompactHeader title={plan.config.title} config={plan.config} authorLine={authorLine} />

      {readOnly && publicNote && onFork && (
        <div className="blog-shell-banner">
          <BlogPublicBanner note={publicNote} onFork={onFork} forking={forking} />
        </div>
      )}

      <BlogSectionNav groups={navGroups} activeId={activeSection} onSelect={selectSection} />

      <div className="blog-panel" key={`${activeSection}-${activeSection === 'guides' ? guideTab : ''}`}>
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

          {activeSection === 'guides' && (
            <div className="blog-guides">
              <BlogSubNav
                items={guideTabs}
                activeId={guideTab}
                onSelect={(id) => setGuideTab(id as GuideTab)}
              />
              {guideTab === 'hotels' && (
                <HotelRecommendations
                  plan={plan}
                  onConfigChange={onConfigChange}
                  readOnly={readOnly}
                />
              )}
              {guideTab === 'food' && <FoodRecommendations plan={plan} />}
              {guideTab === 'videos' && <VideoRecommendations plan={plan} />}
              {guideTab === 'reading' && <ReadingRecommendations plan={plan} />}
              {guideTab === 'nightlife' && <AdultNightlifeGuide config={plan.config} />}
            </div>
          )}

          {activeSection === 'map' && <MapPanel plan={plan} />}

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
