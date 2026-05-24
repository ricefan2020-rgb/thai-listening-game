import { useCallback, useEffect, useState } from 'react'
import {
  addUserVocab as addUserVocabStore,
  loadUserVocab,
  type UserVocabItem,
} from '../utils/userVocab'
import { invalidateLookupCaches } from '../utils/thaiLookup'

export function useUserVocab() {
  const [items, setItems] = useState<UserVocabItem[]>(() => loadUserVocab())

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'thai-listening-game-user-vocab') {
        setItems(loadUserVocab())
        invalidateLookupCaches()
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const add = useCallback((thai: string, meaning: string) => {
    const item = addUserVocabStore(thai, meaning)
    invalidateLookupCaches()
    setItems(loadUserVocab())
    return item
  }, [])

  const refresh = useCallback(() => {
    setItems(loadUserVocab())
  }, [])

  return { items, add, refresh, count: items.length }
}
