import { useState } from 'react'
import { buildPackingList } from '../../utils/planner'
import {
  isSupabaseConfigured,
  publishCloudTravelNote,
} from '../../utils/cloud'
import {
  getSavedAuthorName,
  publishTravelNote,
  saveNoteToLocalIndex,
} from '../../utils/publish'
import type { TripPlan } from '../../types'

interface BlogPublishPanelProps {
  plan: TripPlan
  onCopyMarkdown: () => void
  onExport: () => void
  markdownCopied: boolean
}

export function BlogPublishPanel({
  plan,
  onCopyMarkdown,
  onExport,
  markdownCopied,
}: BlogPublishPanelProps) {
  const [authorName, setAuthorName] = useState(getSavedAuthorName)
  const [caption, setCaption] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [linkCopied, setLinkCopied] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [published, setPublished] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const packing = buildPackingList(plan.config.interests)
  const cloudEnabled = isSupabaseConfigured()

  const handlePublish = async () => {
    setPublishing(true)
    setError(null)
    try {
      const tags = tagsInput
        .split(/[,，\s]+/)
        .map((t) => t.trim())
        .filter(Boolean)
      const options = {
        caption: caption.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
      }

      if (cloudEnabled) {
        const { note, postUrl } = await publishCloudTravelNote(plan, authorName, options)
        saveNoteToLocalIndex(note)
        setShareUrl(postUrl)
        setPublished(true)
        return
      }

      const { shareUrl: url } = await publishTravelNote(plan, authorName, options)
      setShareUrl(url)
      setPublished(true)
      if (url.length > 6000) {
        setError('分享連結較長；設定 Supabase 後可改用短連結 ?post=…')
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : ''
      setError(
        msg.includes('Anonymous') || msg.includes('not_authenticated')
          ? '請在 Supabase 開啟 Anonymous 登入後再試。'
          : '發布失敗，請稍後再試。',
      )
    } finally {
      setPublishing(false)
    }
  }

  const handleCopyLink = async () => {
    if (!shareUrl) return
    await navigator.clipboard.writeText(shareUrl)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  const handleNativeShare = async () => {
    if (!shareUrl || !navigator.share) return
    try {
      await navigator.share({
        title: plan.config.title,
        text:
          caption.trim() ||
          `${authorName.trim() || '旅人'} 的芭提雅 ${plan.config.days} 天行程`,
        url: shareUrl,
      })
    } catch {
      /* user cancelled */
    }
  }

  return (
    <div className="blog-share space-y-6">
      <div className="blog-publish-card">
        <p className="pt-subtitle">發布筆記 · 類小紅書分享</p>
        {!cloudEnabled && (
          <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-950">
            <strong>目前為本機長連結</strong>（網址會很長）。請在專案根目錄{' '}
            <code className="text-xs">.env.local</code> 填入 Publishable key，存檔後
            <strong> 關閉並重新執行 </strong>
            <code className="text-xs">npm run pattaya:dev</code>，成功後會改為短連結{' '}
            <code className="text-xs">?post=…</code>。
          </div>
        )}
        <p className="mt-2 text-sm text-stone-600">
          {cloudEnabled
            ? '發布到雲端廣場，取得短連結；所有人可在首頁「廣場」看到你的筆記。'
            : '填寫心得與標籤後仍可發布，但僅能產生本機長連結。'}
        </p>
        <label className="mt-4 grid gap-1 text-sm text-stone-600">
          你的暱稱
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="例如：阿泰愛旅行"
            maxLength={24}
            className="rounded-lg border border-stone-200 px-3 py-2 text-stone-900 outline-none ring-teal-500/30 focus:ring-2"
          />
        </label>
        <label className="mt-3 grid gap-1 text-sm text-stone-600">
          一句話心得（選填）
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="例如：三天兩夜小資海灘之旅，夜生活必去 Walking Street"
            maxLength={120}
            className="rounded-lg border border-stone-200 px-3 py-2 text-stone-900 outline-none ring-teal-500/30 focus:ring-2"
          />
        </label>
        <label className="mt-3 grid gap-1 text-sm text-stone-600">
          標籤（選填，逗號分隔）
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="芭提雅, 小資, 海灘"
            className="rounded-lg border border-stone-200 px-3 py-2 text-stone-900 outline-none ring-teal-500/30 focus:ring-2"
          />
        </label>
        <button
          type="button"
          onClick={handlePublish}
          disabled={publishing}
          className="blog-btn blog-btn-primary mt-4 w-full sm:w-auto"
        >
          {publishing ? '發布中…' : published ? '再次發布（新連結）' : '發布筆記'}
        </button>
        {error && <p className="mt-2 text-sm text-amber-800">{error}</p>}
        {shareUrl && (
          <div className="mt-4 rounded-lg border border-teal-200 bg-teal-50/60 p-3">
            <p className="text-xs font-semibold text-teal-900">分享連結</p>
            <p className="mt-1 break-all text-xs text-stone-700">{shareUrl}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="blog-btn blog-btn-primary"
                >
                  分享到 App…
                </button>
              )}
              <button type="button" onClick={handleCopyLink} className="blog-btn blog-btn-secondary">
                {linkCopied ? '已複製連結' : '複製連結'}
              </button>
              <a
                href={shareUrl}
                target="_blank"
                rel="noreferrer"
                className="blog-btn blog-btn-secondary inline-block text-center no-underline"
              >
                預覽公開頁
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="blog-packing">
        <p className="pt-subtitle">行李清單</p>
        <ul className="mt-3 columns-1 gap-x-8 sm:columns-2">
          {packing.map((item) => (
            <li key={item} className="mb-1.5 break-inside-avoid text-sm text-stone-700">
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="blog-share-actions">
        <p className="text-sm text-stone-600">也可匯出 Markdown 貼到 Notion 或其他平台。</p>
        <div className="mt-3 flex flex-wrap gap-3">
          <button type="button" onClick={onCopyMarkdown} className="blog-btn blog-btn-secondary">
            {markdownCopied ? '已複製 Markdown' : '複製 Markdown'}
          </button>
          <button type="button" onClick={onExport} className="blog-btn blog-btn-secondary">
            下載 .md
          </button>
        </div>
      </div>

      <p className="border-t border-stone-200 pt-6 text-center text-xs text-stone-500">
        {cloudEnabled
          ? '雲端廣場已啟用 · 未設定時仍可用長連結本機分享'
          : '見首頁「啟用雲端廣場」說明 · 目前以本機連結分享'}
      </p>
    </div>
  )
}
