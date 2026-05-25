import type { TravelNote, TripPlan } from '../types'
import { buildShareUrl, encodeNoteForShare } from './share'
import { normalizeConfig } from './planner'

const POSTS_KEY = 'pattaya-travel-notes-v1'
const AUTHOR_KEY = 'pattaya-author-name'

function loadIndex(): TravelNote[] {
  try {
    const raw = localStorage.getItem(POSTS_KEY)
    if (!raw) return []
    return JSON.parse(raw) as TravelNote[]
  } catch {
    return []
  }
}

function saveIndex(notes: TravelNote[]): void {
  localStorage.setItem(POSTS_KEY, JSON.stringify(notes))
}

export function getSavedAuthorName(): string {
  return localStorage.getItem(AUTHOR_KEY) ?? ''
}

export function saveAuthorName(name: string): void {
  localStorage.setItem(AUTHOR_KEY, name.trim())
}

function makeExcerpt(plan: TripPlan): string {
  const count = plan.days.reduce((n, d) => n + d.items.length, 0)
  return `${plan.config.days} 天 · ${plan.config.travelers} 人 · ${count} 個景點`
}

function randomId(): string {
  return `n_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export interface PublishResult {
  note: TravelNote
  shareUrl: string
}

export interface PublishOptions {
  caption?: string
  tags?: string[]
}

export async function publishTravelNote(
  plan: TripPlan,
  authorName: string,
  options?: PublishOptions,
): Promise<PublishResult> {
  const name = authorName.trim() || '匿名旅人'
  saveAuthorName(name)

  const normalized: TripPlan = {
    ...plan,
    config: normalizeConfig(plan.config),
    updatedAt: new Date().toISOString(),
  }

  const caption = options?.caption?.trim()
  const tags = (options?.tags ?? [])
    .map((t) => t.trim().replace(/^#/, ''))
    .filter(Boolean)
    .slice(0, 8)

  const note: TravelNote = {
    id: randomId(),
    plan: normalized,
    authorName: name,
    publishedAt: new Date().toISOString(),
    excerpt: makeExcerpt(normalized),
    ...(caption ? { caption } : {}),
    ...(tags.length > 0 ? { tags } : {}),
  }

  const index = loadIndex()
  index.unshift(note)
  saveIndex(index.slice(0, 50))

  const encoded = await encodeNoteForShare(note)
  const shareUrl = buildShareUrl(encoded)

  return { note, shareUrl }
}

export function listMyTravelNotes(): TravelNote[] {
  return loadIndex()
}

/** 將已發布筆記（含雲端）寫入本機「我發布的」列表 */
export function saveNoteToLocalIndex(note: TravelNote): void {
  const index = loadIndex()
  const without = index.filter((n) => n.id !== note.id)
  without.unshift(note)
  saveIndex(without.slice(0, 50))
}

export function getTravelNoteById(id: string): TravelNote | undefined {
  return loadIndex().find((n) => n.id === id)
}

export function forkPlanFromNote(note: TravelNote): TripPlan {
  return {
    config: {
      ...note.plan.config,
      title: note.plan.config.title.includes('（複製）')
        ? note.plan.config.title
        : `${note.plan.config.title}（複製）`,
    },
    days: note.plan.days.map((d) => ({
      ...d,
      items: d.items.map((item) => ({
        ...item,
        id: `${item.id}-fork-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      })),
    })),
    updatedAt: new Date().toISOString(),
  }
}
