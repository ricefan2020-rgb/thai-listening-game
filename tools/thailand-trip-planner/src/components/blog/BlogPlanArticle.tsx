import { useCallback, useEffect, useMemo, useState } from 'react'
import { getPlaceById } from '../../data/places'
import { AdultNightlifeGuide } from '../AdultNightlifeGuide'
import { PlanToast } from '../PlanToast'
import { BudgetPanel } from '../BudgetPanel'
import { DayTimeline } from '../DayTimeline'
import { FoodRecommendations } from '../FoodRecommendations'
import { HotelRecommendations } from '../HotelRecommendations'
import { MapPanel } from '../MapPanel'
import { ReadingRecommendations } from '../ReadingRecommendations'
import { TransportGuide } from '../TransportGuide'
import { VideoRecommendations } from '../VideoRecommendations'
import type {
  ScheduledItem,
  TimeSlot,
  TripConfig,
  TripPlan,
  TravelNote,
} from '../../types'
import { SLOT_LABELS } from '../../types'
import {
  loadPlanUi,
  readSectionFromHash,
  savePlanUi,
  writeSectionHash,
} from '../../utils/planUi'
import type { PlanNavigateOptions } from './BlogIntro'
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
  onUpdateItem?: (
    dayIndex: number,
    itemId: string,
    patch: Partial<ScheduledItem>,
  ) => void
  onTitleChange?: (title: string) => void
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
  onUpdateItem,
  onTitleChange,
  onCopyMarkdown,
  onExport,
  markdownCopied = false,
}: BlogPlanArticleProps) {
  const navGroups = useMemo(() => buildNavGroups(plan, readOnly), [plan, readOnly])
  const guideTabs = useMemo(() => buildGuideTabs(plan), [plan])
  const sectionIds = useMemo(() => allSectionIds(navGroups), [navGroups])

  const defaultUi = useMemo(
    () => ({
      section: readSectionFromHash() ?? sectionIds[0] ?? 'intro',
      day: 0,
      guideTab: 'hotels' as GuideTab,
    }),
    [sectionIds],
  )
  const initialUi = useMemo(() => loadPlanUi(defaultUi), [defaultUi])

  const [activeSection, setActiveSection] = useState(() => {
    const s = initialUi.section
    return sectionIds.includes(s) ? s : sectionIds[0] ?? 'intro'
  })
  const [guideTab, setGuideTab] = useState<GuideTab>(() => {
    const t = initialUi.guideTab as GuideTab
    return guideTabs.some((g) => g.id === t) ? t : 'hotels'
  })
  const [activeDay, setActiveDay] = useState(initialUi.day)
  const [panelAnim, setPanelAnim] = useState(false)
  const [toast, setToast] = useState('')

  const scheduledPlaceIds = useMemo(
    () => new Set(plan.days.flatMap((d) => d.items.map((i) => i.placeId))),
    [plan.days],
  )

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

  useEffect(() => {
    savePlanUi({ section: activeSection, day: activeDay, guideTab })
    if (sectionIds.includes(activeSection)) {
      writeSectionHash(activeSection)
    }
  }, [activeSection, activeDay, guideTab, sectionIds])

  useEffect(() => {
    setPanelAnim(true)
    const t = window.setTimeout(() => setPanelAnim(false), 220)
    return () => window.clearTimeout(t)
  }, [activeSection, guideTab])

  const flashToast = useCallback((message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2800)
  }, [])

  const selectSection = useCallback(
    (id: string, opts?: PlanNavigateOptions) => {
      setActiveSection(id)
      if (opts?.day !== undefined) setActiveDay(opts.day)
      else if (id === 'itinerary') setActiveDay((d) => (d < plan.days.length ? d : 0))
      if (opts?.guideTab) setGuideTab(opts.guideTab as GuideTab)
      if (id === 'guides' && !guideTabs.some((t) => t.id === guideTab)) {
        setGuideTab(guideTabs[0]?.id ?? 'hotels')
      }
    },
    [guideTab, guideTabs, plan.days.length],
  )

  const handleQuickAddPlace = useCallback(
    (placeId: string) => {
      if (!onAddItem || readOnly) return
      const place = getPlaceById(placeId)
      const slot: TimeSlot = place?.bestSlots[0] ?? 'afternoon'
      const dayIndex = activeDay < plan.days.length ? activeDay : 0
      onAddItem(dayIndex, slot, placeId)
      selectSection('itinerary', { day: dayIndex })
      flashToast(
        `已加入「${place?.nameZh ?? '景點'}」→ ${plan.days[dayIndex]?.label ?? ''} · ${SLOT_LABELS[slot]}`,
      )
    },
    [activeDay, flashToast, onAddItem, plan.days, readOnly, selectSection],
  )

  return (
    <div className="blog-shell">
      <PlanToast message={toast} />
      <BlogCompactHeader
        title={plan.config.title}
        config={plan.config}
        authorLine={authorLine}
        onTitleChange={readOnly ? undefined : onTitleChange}
      />

      {readOnly && publicNote && onFork && (
        <div className="blog-shell-banner">
          <BlogPublicBanner note={publicNote} onFork={onFork} forking={forking} />
        </div>
      )}

      <BlogSectionNav groups={navGroups} activeId={activeSection} onSelect={selectSection} />

      <div
        className={`blog-panel ${panelAnim ? 'blog-panel--enter' : ''}`}
      >
        <header className="blog-panel-header">
          <h2 className="blog-panel-title">{activeLabel}</h2>
          {lead && <p className="blog-panel-lead">{lead}</p>}
        </header>

        <div className="blog-panel-body">
          {activeSection === 'intro' && (
            <BlogIntro plan={plan} onNavigate={selectSection} />
          )}

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
                  regionId={plan.config.regionId}
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
                      ? (slot, placeId) => {
                          onAddItem(activeDay, slot, placeId)
                          const place = getPlaceById(placeId)
                          flashToast(
                            `已加入「${place?.nameZh ?? '景點'}」· ${SLOT_LABELS[slot]}`,
                          )
                        }
                      : undefined
                  }
                  onUpdateItem={
                    onUpdateItem
                      ? (itemId, patch) => onUpdateItem(activeDay, itemId, patch)
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
                  scheduledPlaceIds={scheduledPlaceIds}
                  onAddToItinerary={
                    readOnly ? undefined : handleQuickAddPlace
                  }
                />
              )}
              {guideTab === 'food' && (
                <FoodRecommendations
                  plan={plan}
                  scheduledPlaceIds={scheduledPlaceIds}
                  onAddToItinerary={
                    readOnly ? undefined : handleQuickAddPlace
                  }
                />
              )}
              {guideTab === 'videos' && <VideoRecommendations plan={plan} />}
              {guideTab === 'reading' && <ReadingRecommendations plan={plan} />}
              {guideTab === 'nightlife' && <AdultNightlifeGuide config={plan.config} />}
            </div>
          )}

          {activeSection === 'map' && (
            <MapPanel
              plan={plan}
              onSelectPlace={(placeId) => {
                const place = getPlaceById(placeId)
                if (place) flashToast(`地圖已標示：${place.nameZh}`)
              }}
            />
          )}

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
