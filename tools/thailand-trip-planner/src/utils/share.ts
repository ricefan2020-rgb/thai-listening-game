import type { TravelNote } from '../types'

const SHARE_VERSION = 1

interface SharePayload {
  v: typeof SHARE_VERSION
  note: TravelNote
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlToBytes(encoded: string): Uint8Array {
  const pad = encoded.length % 4 === 0 ? '' : '='.repeat(4 - (encoded.length % 4))
  const b64 = encoded.replace(/-/g, '+').replace(/_/g, '/') + pad
  const binary = atob(b64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

async function gzipText(text: string): Promise<Uint8Array> {
  const stream = new Blob([text]).stream().pipeThrough(new CompressionStream('gzip'))
  return new Uint8Array(await new Response(stream).arrayBuffer())
}

async function gunzipText(bytes: Uint8Array): Promise<string> {
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'))
  return new Response(stream).text()
}

export async function encodeNoteForShare(note: TravelNote): Promise<string> {
  const payload: SharePayload = { v: SHARE_VERSION, note }
  const compressed = await gzipText(JSON.stringify(payload))
  return bytesToBase64Url(compressed)
}

export async function decodeNoteFromShare(encoded: string): Promise<TravelNote | null> {
  try {
    const bytes = base64UrlToBytes(encoded.trim())
    const json = await gunzipText(bytes)
    const payload = JSON.parse(json) as SharePayload
    if (payload.v !== SHARE_VERSION || !payload.note?.plan) return null
    return payload.note
  } catch {
    return null
  }
}

export function buildShareUrl(encoded: string): string {
  const base = window.location.href.split('?')[0] ?? window.location.pathname
  return `${base}?share=${encoded}`
}

export function getShareParamFromLocation(): string | null {
  const params = new URLSearchParams(window.location.search)
  return params.get('share')
}

/** 從完整 URL 或純 share 參數字串取出 share payload */
export function extractShareParam(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  try {
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      const url = new URL(trimmed)
      const param = url.searchParams.get('share')
      if (param) return param
    }
  } catch {
    /* ignore */
  }

  if (trimmed.includes('share=')) {
    const q = trimmed.includes('?') ? trimmed.slice(trimmed.indexOf('?') + 1) : trimmed
    const param = new URLSearchParams(q).get('share')
    if (param) return param
  }

  if (trimmed.length > 32 && !trimmed.includes(' ')) {
    return trimmed
  }

  return null
}

export function clearShareParamFromUrl(): void {
  const url = new URL(window.location.href)
  url.searchParams.delete('share')
  url.searchParams.delete('post')
  window.history.replaceState({}, '', url.pathname + url.search)
}
