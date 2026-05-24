import type { TripPlan } from '../types'

const STORAGE_KEY = 'pattaya-trip-plan-v1'

export function loadPlan(): TripPlan | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as TripPlan
  } catch {
    return null
  }
}

export function savePlan(plan: TripPlan): void {
  const updated = { ...plan, updatedAt: new Date().toISOString() }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

export function clearPlan(): void {
  localStorage.removeItem(STORAGE_KEY)
}
