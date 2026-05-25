import { useCallback, useEffect, useState } from 'react'
import { BlogPlanArticle } from './components/blog/BlogPlanArticle'
import { BlogDiscoverFeed } from './components/blog/BlogDiscoverFeed'
import { BlogSetup } from './components/blog/BlogSetup'
import type { TimeSlot, TravelNote, TripConfig, TripPlan } from './types'
import {
  DEFAULT_CONFIG,
  exportPlanMarkdown,
  generateItinerary,
  normalizeConfig,
} from './utils/planner'
import { forkPlanFromNote } from './utils/publish'
import {
  getCloudTravelNoteById,
  getPostParamFromLocation,
  isSupabaseConfigured,
} from './utils/cloud'
import {
  clearShareParamFromUrl,
  decodeNoteFromShare,
  getShareParamFromLocation,
} from './utils/share'
import { clearPlan, loadPlan, savePlan } from './utils/storage'

type View = 'setup' | 'plan' | 'public'

export function App() {
  const [view, setView] = useState<View>('setup')
  const [config, setConfig] = useState<TripConfig>(DEFAULT_CONFIG)
  const [plan, setPlan] = useState<TripPlan | null>(null)
  const [publicNote, setPublicNote] = useState<TravelNote | null>(null)
  const [loadingShare, setLoadingShare] = useState(true)
  const [copied, setCopied] = useState(false)
  const [forking, setForking] = useState(false)

  useEffect(() => {
    if (publicNote) {
      document.title = `${publicNote.plan.config.title}｜${publicNote.authorName}`
      return
    }
    if (plan) {
      document.title = `${plan.config.title}｜泰國旅遊筆記`
      return
    }
    document.title = '泰國旅遊計劃｜Travel Journal'
  }, [publicNote, plan])

  useEffect(() => {
    const postId = getPostParamFromLocation()
    if (postId && isSupabaseConfigured()) {
      getCloudTravelNoteById(postId)
        .then((note) => {
          if (note) {
            setPublicNote(note)
            setView('public')
          }
        })
        .finally(() => setLoadingShare(false))
      return
    }

    const shareParam = getShareParamFromLocation()
    if (shareParam) {
      decodeNoteFromShare(shareParam)
        .then((note) => {
          if (note) {
            setPublicNote({
              ...note,
              plan: { ...note.plan, config: normalizeConfig(note.plan.config) },
            })
            setView('public')
          }
        })
        .finally(() => setLoadingShare(false))
      return
    }

    const saved = loadPlan()
    if (saved) {
      const normalized = { ...saved, config: normalizeConfig(saved.config) }
      setPlan(normalized)
      setConfig(normalized.config)
      setView('plan')
    }
    setLoadingShare(false)
  }, [])

  const persist = useCallback((next: TripPlan) => {
    setPlan(next)
    savePlan(next)
  }, [])

  const handleGenerate = () => {
    const normalized = normalizeConfig(config)
    setConfig(normalized)
    const next = generateItinerary(normalized)
    persist(next)
    clearShareParamFromUrl()
    setPublicNote(null)
    setView('plan')
  }

  const handleConfigChange = (nextConfig: TripConfig) => {
    setConfig(nextConfig)
    if (plan) persist({ ...plan, config: nextConfig })
  }

  const handleRemoveItem = (dayIndex: number, itemId: string) => {
    if (!plan) return
    const days = plan.days.map((d, i) =>
      i === dayIndex ? { ...d, items: d.items.filter((it) => it.id !== itemId) } : d,
    )
    persist({ ...plan, days })
  }

  const handleAddItem = (dayIndex: number, slot: TimeSlot, placeId: string) => {
    if (!plan) return
    const days = plan.days.map((d, i) => {
      if (i !== dayIndex) return d
      const id = `${d.day}-${slot}-${placeId}-${Date.now()}`
      return {
        ...d,
        items: [...d.items, { id, placeId, slot }],
      }
    })
    persist({ ...plan, days })
  }

  const markdown = plan ? exportPlanMarkdown(plan) : ''

  const handleCopy = async () => {
    if (!markdown) return
    await navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExport = () => {
    if (!plan) return
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${plan.config.title.replace(/\s+/g, '-')}-pattaya.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleReset = () => {
    if (!confirm('確定要清除本機行程並重新設定？')) return
    clearPlan()
    setPlan(null)
    setConfig(DEFAULT_CONFIG)
    setPublicNote(null)
    clearShareParamFromUrl()
    setView('setup')
  }

  const handleFork = () => {
    if (!publicNote) return
    setForking(true)
    const forked = forkPlanFromNote(publicNote)
    persist(forked)
    setConfig(forked.config)
    clearShareParamFromUrl()
    setPublicNote(null)
    setView('plan')
    setForking(false)
  }

  const handleOpenMyNote = (note: TravelNote) => {
    setPublicNote(note)
    setView('public')
  }

  const handleStartOwn = () => {
    clearShareParamFromUrl()
    setPublicNote(null)
    setView(plan ? 'plan' : 'setup')
  }

  const toolbar = (variant: 'public' | 'edit') => (
    <div className="blog-toolbar">
      <button
        type="button"
        onClick={variant === 'public' ? handleStartOwn : () => setView('setup')}
        className="blog-toolbar-link"
      >
        {variant === 'public' ? `← ${plan ? '我的行程' : '開始規劃'}` : '← 設定'}
      </button>
      {variant === 'edit' && (
        <div className="blog-toolbar-actions">
          <button
            type="button"
            onClick={handleGenerate}
            className="blog-toolbar-btn blog-toolbar-btn--accent"
          >
            重排
          </button>
          <button type="button" onClick={handleReset} className="blog-toolbar-btn">
            清除
          </button>
        </div>
      )}
    </div>
  )

  if (loadingShare) {
    return (
      <div className="blog-app-loading">載入中…</div>
    )
  }

  if (view === 'setup') {
    return (
      <div className="blog-app blog-app--scroll">
        <BlogSetup
          config={config}
          onChange={setConfig}
          onGenerate={handleGenerate}
          onContinue={plan ? () => setView('plan') : undefined}
          hasSavedPlan={!!plan}
          extraBelow={<BlogDiscoverFeed onOpenNote={handleOpenMyNote} />}
        />
      </div>
    )
  }

  if (view === 'public' && publicNote) {
    return (
      <div className="blog-app">
        {toolbar('public')}
        <BlogPlanArticle
          plan={publicNote.plan}
          readOnly
          publicNote={publicNote}
          onFork={handleFork}
          forking={forking}
        />
      </div>
    )
  }

  return (
    plan && (
      <div className="blog-app">
        {toolbar('edit')}
        <BlogPlanArticle
          plan={plan}
          onConfigChange={handleConfigChange}
          onRemoveItem={handleRemoveItem}
          onAddItem={handleAddItem}
          onCopyMarkdown={handleCopy}
          onExport={handleExport}
          markdownCopied={copied}
        />
      </div>
    )
  )
}
