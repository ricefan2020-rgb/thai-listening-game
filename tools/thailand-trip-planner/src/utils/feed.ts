import type { TravelNote } from '../types'
import { getCloudTravelNoteById, isSupabaseConfigured } from './cloud'
import { decodeNoteFromShare, extractShareParam } from './share'

const FEED_KEY = 'pattaya-discover-feed-v1'

function loadFeed(): TravelNote[] {
  try {
    const raw = localStorage.getItem(FEED_KEY)
    if (!raw) return []
    return JSON.parse(raw) as TravelNote[]
  } catch {
    return []
  }
}

function saveFeed(notes: TravelNote[]): void {
  localStorage.setItem(FEED_KEY, JSON.stringify(notes))
}

export function listDiscoverNotes(): TravelNote[] {
  return loadFeed()
}

export function removeDiscoverNote(id: string): void {
  saveFeed(loadFeed().filter((n) => n.id !== id))
}

function extractPostId(input: string): string | null {
  const trimmed = input.trim()
  try {
    if (trimmed.startsWith('http')) {
      const id = new URL(trimmed).searchParams.get('post')
      if (id) return id
    }
  } catch {
    /* ignore */
  }
  const m = trimmed.match(/[?&]post=([0-9a-f-]{36})/i)
  return m?.[1] ?? null
}

export async function importNoteToDiscoverFeed(
  shareInput: string,
): Promise<{ ok: true; note: TravelNote } | { ok: false; error: string }> {
  const postId = extractPostId(shareInput)
  if (postId && isSupabaseConfigured()) {
    const cloudNote = await getCloudTravelNoteById(postId)
    if (cloudNote) {
      const feed = loadFeed()
      if (!feed.some((n) => n.id === cloudNote.id)) {
        feed.unshift(cloudNote)
        saveFeed(feed.slice(0, 40))
      }
      return { ok: true, note: cloudNote }
    }
  }

  const param = extractShareParam(shareInput)
  if (!param) {
    return { ok: false, error: '請貼上完整的分享連結（?share=… 或 ?post=…）' }
  }

  const note = await decodeNoteFromShare(param)
  if (!note) {
    return { ok: false, error: '連結無法解析，可能已損壞或過期' }
  }

  const feed = loadFeed()
  if (!feed.some((n) => n.id === note.id)) {
    feed.unshift(note)
    saveFeed(feed.slice(0, 40))
  }

  return { ok: true, note }
}
