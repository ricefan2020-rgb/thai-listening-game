import { getSupabase, isSupabaseConfigured } from '../lib/supabase'
import type { PublishOptions } from './publish'
import { normalizeConfig } from './planner'
import type { TravelNote, TripPlan } from '../types'

export { isSupabaseConfigured }

interface TravelNoteRow {
  id: string
  user_id: string
  author_name: string
  caption: string | null
  tags: string[] | null
  excerpt: string
  plan: TripPlan
  published_at: string
  like_count: number
}

export interface CloudTravelNote extends TravelNote {
  likeCount: number
}

function rowToNote(row: TravelNoteRow): CloudTravelNote {
  return {
    id: row.id,
    plan: {
      ...row.plan,
      config: normalizeConfig(row.plan.config),
    },
    authorName: row.author_name,
    publishedAt: row.published_at,
    excerpt: row.excerpt,
    caption: row.caption ?? undefined,
    tags: row.tags?.length ? row.tags : undefined,
    likeCount: row.like_count ?? 0,
  }
}

function makeExcerpt(plan: TripPlan): string {
  const count = plan.days.reduce((n, d) => n + d.items.length, 0)
  return `${plan.config.days} 天 · ${plan.config.travelers} 人 · ${count} 個景點`
}

export async function ensureSupabaseSession(): Promise<void> {
  const sb = getSupabase()
  if (!sb) throw new Error('Supabase 未設定')

  const { data } = await sb.auth.getSession()
  if (data.session) return

  const { error } = await sb.auth.signInAnonymously()
  if (error) throw error
}

export async function publishCloudTravelNote(
  plan: TripPlan,
  authorName: string,
  options?: PublishOptions,
): Promise<{ note: CloudTravelNote; postUrl: string }> {
  const sb = getSupabase()
  if (!sb) throw new Error('Supabase 未設定')

  await ensureSupabaseSession()

  const {
    data: { user },
  } = await sb.auth.getUser()
  if (!user) throw new Error('無法取得登入狀態')

  const normalized: TripPlan = {
    ...plan,
    config: normalizeConfig(plan.config),
    updatedAt: new Date().toISOString(),
  }

  const name = authorName.trim() || '匿名旅人'
  const caption = options?.caption?.trim() || null
  const tags = (options?.tags ?? [])
    .map((t) => t.trim().replace(/^#/, ''))
    .filter(Boolean)
    .slice(0, 8)

  const { data, error } = await sb
    .from('travel_notes')
    .insert({
      user_id: user.id,
      author_name: name,
      caption,
      tags,
      excerpt: makeExcerpt(normalized),
      plan: normalized,
    })
    .select()
    .single()

  if (error) throw error

  const note = rowToNote(data as TravelNoteRow)
  return { note, postUrl: buildPostUrl(note.id) }
}

export async function listCloudTravelNotes(limit = 40): Promise<CloudTravelNote[]> {
  const sb = getSupabase()
  if (!sb) return []

  const { data, error } = await sb
    .from('travel_notes')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data as TravelNoteRow[]).map(rowToNote)
}

export async function getCloudTravelNoteById(id: string): Promise<CloudTravelNote | null> {
  const sb = getSupabase()
  if (!sb) return null

  const { data, error } = await sb.from('travel_notes').select('*').eq('id', id).maybeSingle()

  if (error) throw error
  if (!data) return null
  return rowToNote(data as TravelNoteRow)
}

export async function toggleCloudNoteLike(noteId: string): Promise<number> {
  const sb = getSupabase()
  if (!sb) throw new Error('Supabase 未設定')

  await ensureSupabaseSession()

  const { data, error } = await sb.rpc('toggle_travel_note_like', { p_note_id: noteId })

  if (error) throw error
  return typeof data === 'number' ? data : 0
}

export async function hasUserLikedNote(noteId: string): Promise<boolean> {
  const sb = getSupabase()
  if (!sb) return false

  const {
    data: { user },
  } = await sb.auth.getUser()
  if (!user) return false

  const { data, error } = await sb
    .from('travel_note_likes')
    .select('note_id')
    .eq('note_id', noteId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (error) return false
  return Boolean(data)
}

export function buildPostUrl(postId: string): string {
  const base = window.location.href.split('?')[0] ?? window.location.pathname
  return `${base}?post=${postId}`
}

export function getPostParamFromLocation(): string | null {
  return new URLSearchParams(window.location.search).get('post')
}
