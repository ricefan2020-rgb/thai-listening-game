/** 使用者自行收錄的詞（存於 localStorage） */
export interface UserVocabItem {
  thai: string
  meaning: string
  addedAt: number
}

const STORAGE_KEY = 'thai-listening-game-user-vocab'

export const UNKNOWN_MEANING = '（未收錄）'

export function isUnknownMeaning(meaning: string): boolean {
  return meaning === UNKNOWN_MEANING
}

export function loadUserVocab(): UserVocabItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as UserVocabItem[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter((x) => x.thai?.trim() && x.meaning?.trim())
  } catch {
    return []
  }
}

function saveUserVocab(items: UserVocabItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function getUserVocabItem(thai: string): UserVocabItem | undefined {
  const t = thai.trim()
  return loadUserVocab().find((x) => x.thai === t)
}

export function getUserVocabMeaning(thai: string): string | undefined {
  return getUserVocabItem(thai)?.meaning
}

export function userVocabId(thai: string): string {
  return `uv_${thai.trim()}`
}

export function addUserVocab(thai: string, meaning: string): UserVocabItem {
  const t = thai.trim()
  const m = meaning.trim()
  if (!t || !m) throw new Error('泰文與中文意思不可為空')

  const items = loadUserVocab().filter((x) => x.thai !== t)
  const item: UserVocabItem = { thai: t, meaning: m, addedAt: Date.now() }
  items.push(item)
  saveUserVocab(items)
  return item
}

export function removeUserVocab(thai: string): void {
  const t = thai.trim()
  saveUserVocab(loadUserVocab().filter((x) => x.thai !== t))
}
