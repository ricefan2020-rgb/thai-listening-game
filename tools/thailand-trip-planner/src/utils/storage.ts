import type { TripPlan } from '../types'
import { normalizeConfig } from './planner'

const STORAGE_KEY = 'thailand-trip-plan-v2'
const LEGACY_KEY = 'pattaya-trip-plan-v1'

export function loadPlan(): TripPlan | null {
  try {
    let raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      raw = localStorage.getItem(LEGACY_KEY)
      if (raw) {
        const plan = JSON.parse(raw) as TripPlan
        const normalized = {
          ...plan,
          config: normalizeConfig(plan.config),
        }
        savePlan(normalized)
        localStorage.removeItem(LEGACY_KEY)
        return normalized
      }
      return null
    }
    const plan = JSON.parse(raw) as TripPlan
    return {
      ...plan,
      config: normalizeConfig(plan.config),
    }
  } catch {
    return null
  }
}

export function savePlan(plan: TripPlan): void {
  const updated = {
    ...plan,
    config: normalizeConfig(plan.config),
    updatedAt: new Date().toISOString(),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
}

export function clearPlan(): void {
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(LEGACY_KEY)
}
