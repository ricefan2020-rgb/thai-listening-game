import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'thai-listening-game-speech-rate'

export const SPEECH_RATE_MIN = 0.5
export const SPEECH_RATE_MAX = 1.5
export const SPEECH_RATE_DEFAULT = 0.9
export const SPEECH_RATE_STEP = 0.1

export const SPEECH_RATE_PRESETS = [
  { label: '慢', value: 0.6 },
  { label: '較慢', value: 0.8 },
  { label: '標準', value: 0.9 },
  { label: '較快', value: 1.1 },
  { label: '快', value: 1.3 },
] as const

function loadRate(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return SPEECH_RATE_DEFAULT
    const n = Number(raw)
    if (Number.isNaN(n)) return SPEECH_RATE_DEFAULT
    return Math.min(SPEECH_RATE_MAX, Math.max(SPEECH_RATE_MIN, n))
  } catch {
    return SPEECH_RATE_DEFAULT
  }
}

function saveRate(rate: number) {
  localStorage.setItem(STORAGE_KEY, String(rate))
}

export function clampSpeechRate(rate: number): number {
  return Math.min(SPEECH_RATE_MAX, Math.max(SPEECH_RATE_MIN, Math.round(rate * 10) / 10))
}

export function useSpeechRate() {
  const [speechRate, setSpeechRateState] = useState(loadRate)

  useEffect(() => {
    saveRate(speechRate)
  }, [speechRate])

  const setSpeechRate = useCallback((rate: number) => {
    setSpeechRateState(clampSpeechRate(rate))
  }, [])

  return { speechRate, setSpeechRate }
}
