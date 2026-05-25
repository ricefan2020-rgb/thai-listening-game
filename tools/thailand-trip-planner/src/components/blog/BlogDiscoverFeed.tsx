import { useCallback, useEffect, useState } from 'react'
import { buildShareUrl, encodeNoteForShare } from '../../utils/share'
import { listMyTravelNotes } from '../../utils/publish'
import { importNoteToDiscoverFeed, listDiscoverNotes, removeDiscoverNote } from '../../utils/feed'
import {
  isSupabaseConfigured,
  listCloudTravelNotes,
  buildPostUrl,
} from '../../utils/cloud'
import type { TravelNote } from '../../types'
import { BlogNoteCard } from './BlogNoteCard'
import { BlogCloudSetup } from './BlogCloudSetup'

interface BlogDiscoverFeedProps {
  onOpenNote: (note: TravelNote) => void
}

export function BlogDiscoverFeed({ onOpenNote }: BlogDiscoverFeedProps) {
  const cloudEnabled = isSupabaseConfigured()
  const [tab, setTab] = useState<'plaza' | 'saved' | 'mine'>(cloudEnabled ? 'plaza' : 'saved')
  const [cloud, setCloud] = useState<TravelNote[]>([])
  const [discover, setDiscover] = useState<TravelNote[]>([])
  const [mine, setMine] = useState<TravelNote[]>([])
  const [importUrl, setImportUrl] = useState('')
  const [importing, setImporting] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const [copyingId, setCopyingId] = useState<string | null>(null)
  const [cloudLoading, setCloudLoading] = useState(false)
  const [cloudError, setCloudError] = useState<string | null>(null)

  const refreshLocal = useCallback(() => {
    setDiscover(listDiscoverNotes())
    setMine(listMyTravelNotes())
  }, [])

  const refreshCloud = useCallback(async () => {
    if (!cloudEnabled) return
    setCloudLoading(true)
    setCloudError(null)
    try {
      setCloud(await listCloudTravelNotes())
    } catch {
      setCloudError('無法載入雲端廣場，請檢查網路與 Supabase 設定。')
    } finally {
      setCloudLoading(false)
    }
  }, [cloudEnabled])

  useEffect(() => {
    refreshLocal()
    void refreshCloud()
  }, [refreshLocal, refreshCloud])

  const handleImport = async () => {
    setImporting(true)
    setImportError(null)
    const result = await importNoteToDiscoverFeed(importUrl)
    setImporting(false)
    if (!result.ok) {
      setImportError(result.error)
      return
    }
    setImportUrl('')
    refreshLocal()
    setTab('saved')
  }

  const handleCopyLink = async (note: TravelNote) => {
    setCopyingId(note.id)
    try {
      if (cloudEnabled && note.id.includes('-') && note.id.length > 20) {
        await navigator.clipboard.writeText(buildPostUrl(note.id))
      } else {
        const encoded = await encodeNoteForShare(note)
        await navigator.clipboard.writeText(buildShareUrl(encoded))
      }
    } finally {
      setTimeout(() => setCopyingId(null), 1500)
    }
  }

  const notes =
    tab === 'plaza' ? cloud : tab === 'mine' ? mine : discover

  const emptyPlaza = tab === 'plaza' && !cloudLoading && cloud.length === 0
  const emptySaved = tab === 'saved' && discover.length === 0
  const emptyMine = tab === 'mine' && mine.length === 0

  return (
    <section className="xhs-feed">
      <div className="xhs-feed-header">
        <h2 className="blog-h3">旅遊筆記牆</h2>
        <p className="mt-1 text-sm text-stone-600">
          {cloudEnabled
            ? '雲端廣場：所有人可瀏覽最新筆記；發布後取得短連結 ?post=…'
            : '本機模式：透過連結分享；設定 Supabase 後可開啟全站廣場。'}
        </p>
      </div>

      {!cloudEnabled && <BlogCloudSetup />}

      {cloudEnabled && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="xhs-cloud-badge">雲端廣場已連線</span>
          <button
            type="button"
            onClick={() => void refreshCloud()}
            disabled={cloudLoading}
            className="blog-btn blog-btn-secondary text-xs"
          >
            {cloudLoading ? '載入中…' : '重新整理'}
          </button>
        </div>
      )}
      {cloudError && <p className="mb-2 text-sm text-rose-700">{cloudError}</p>}

      <div className="xhs-import">
        <p className="text-xs font-medium text-stone-700">收藏連結分享筆記（本機）</p>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            type="url"
            value={importUrl}
            onChange={(e) => setImportUrl(e.target.value)}
            placeholder="貼上 ?share=… 或 ?post=… 連結"
            className="min-w-0 flex-1 rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-900 outline-none ring-teal-500/30 focus:ring-2"
          />
          <button
            type="button"
            onClick={handleImport}
            disabled={importing || !importUrl.trim()}
            className="blog-btn blog-btn-secondary shrink-0"
          >
            {importing ? '加入中…' : '加入收藏'}
          </button>
        </div>
        {importError && <p className="mt-1.5 text-xs text-rose-700">{importError}</p>}
      </div>

      <div className="xhs-tabs" role="tablist">
        {cloudEnabled && (
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'plaza'}
            onClick={() => setTab('plaza')}
            className={`xhs-tab ${tab === 'plaza' ? 'xhs-tab--active' : ''}`}
          >
            廣場 {cloud.length > 0 ? `(${cloud.length})` : ''}
          </button>
        )}
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'saved'}
          onClick={() => setTab('saved')}
          className={`xhs-tab ${tab === 'saved' ? 'xhs-tab--active' : ''}`}
        >
          收藏 {discover.length > 0 ? `(${discover.length})` : ''}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'mine'}
          onClick={() => setTab('mine')}
          className={`xhs-tab ${tab === 'mine' ? 'xhs-tab--active' : ''}`}
        >
          我發布的 {mine.length > 0 ? `(${mine.length})` : ''}
        </button>
      </div>

      {emptyPlaza && (
        <p className="xhs-empty">廣場還沒有筆記。完成行程後到「發布」分頁發布第一篇吧！</p>
      )}
      {emptySaved && (
        <p className="xhs-empty">尚無收藏。可貼上朋友的分享連結，或從廣場瀏覽。</p>
      )}
      {emptyMine && (
        <p className="xhs-empty">尚未發布。完成行程後，在「發布」分頁即可發布。</p>
      )}

      {notes.length > 0 && (
        <ul className="xhs-grid">
          {notes.map((note) => (
            <li key={`${tab}-${note.id}`}>
              <BlogNoteCard
                note={note}
                onOpen={() => onOpenNote(note)}
                onCopyLink={() => handleCopyLink(note)}
                linkCopied={copyingId === note.id}
                onRemove={
                  tab === 'saved'
                    ? () => {
                        removeDiscoverNote(note.id)
                        refreshLocal()
                      }
                    : undefined
                }
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
