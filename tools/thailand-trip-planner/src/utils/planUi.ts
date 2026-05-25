const UI_KEY = 'thailand-plan-ui-v1'

export interface PlanUiState {
  section: string
  day: number
  guideTab: string
}

export function loadPlanUi(fallback: PlanUiState): PlanUiState {
  try {
    const raw = sessionStorage.getItem(UI_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw) as Partial<PlanUiState>
    return {
      section: typeof parsed.section === 'string' ? parsed.section : fallback.section,
      day: typeof parsed.day === 'number' ? parsed.day : fallback.day,
      guideTab: typeof parsed.guideTab === 'string' ? parsed.guideTab : fallback.guideTab,
    }
  } catch {
    return fallback
  }
}

export function savePlanUi(state: PlanUiState) {
  try {
    sessionStorage.setItem(UI_KEY, JSON.stringify(state))
  } catch {
    /* quota / private mode */
  }
}

export function readSectionFromHash(): string | null {
  if (typeof window === 'undefined') return null
  const hash = window.location.hash.replace(/^#/, '')
  if (!hash) return null
  const section = hash.split(/[?&]/)[0]
  return section || null
}

export function writeSectionHash(section: string) {
  if (typeof window === 'undefined') return
  const url = new URL(window.location.href)
  url.hash = section
  window.history.replaceState(null, '', url.toString())
}
