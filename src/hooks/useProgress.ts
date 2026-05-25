import { useCallback, useEffect, useState } from 'react'
import type { ProgressData, WrongItem } from '../types'

const STORAGE_KEY = 'thai-listening-game-progress'

const defaultProgress: ProgressData = {
  score: 0,
  bestScore: 0,
  streak: 0,
  wrongItems: [],
}

function loadProgress(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaultProgress }
    const parsed = JSON.parse(raw) as ProgressData
    return {
      score: parsed.score ?? 0,
      bestScore: parsed.bestScore ?? 0,
      streak: parsed.streak ?? 0,
      wrongItems: Array.isArray(parsed.wrongItems)
        ? parsed.wrongItems.map((w) => ({ ...w, level: w.level ?? 'word' }))
        : [],
    }
  } catch {
    return { ...defaultProgress }
  }
}

function saveProgress(data: ProgressData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>(loadProgress)

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  const addWrong = useCallback((item: Omit<WrongItem, 'wrongAt'>) => {
    setProgress((prev) => {
      const exists = prev.wrongItems.some((w) => w.id === item.id)
      const wrongItems = exists
        ? prev.wrongItems.map((w) =>
            w.id === item.id ? { ...w, wrongAt: Date.now() } : w,
          )
        : [...prev.wrongItems, { ...item, wrongAt: Date.now() }]
      return { ...prev, wrongItems }
    })
  }, [])

  const removeWrong = useCallback((id: string) => {
    setProgress((prev) => ({
      ...prev,
      wrongItems: prev.wrongItems.filter((w) => w.id !== id),
    }))
  }, [])

  const recordAnswer = useCallback((correct: boolean, points: number) => {
    setProgress((prev) => {
      const score = correct ? prev.score + points : prev.score
      const streak = correct ? prev.streak + 1 : 0
      const bestScore = Math.max(prev.bestScore, score)
      return { score, bestScore, streak, wrongItems: prev.wrongItems }
    })
  }, [])

  /** 撤回一題的計分（回上一題後改答案時使用） */
  const undoAnswer = useCallback((wasCorrect: boolean, points: number) => {
    setProgress((prev) => {
      const score = wasCorrect ? Math.max(0, prev.score - points) : prev.score
      const streak = wasCorrect ? Math.max(0, prev.streak - 1) : prev.streak
      return { ...prev, score, streak }
    })
  }, [])

  const addRoundScore = useCallback((roundScore: number) => {
    setProgress((prev) => {
      const score = prev.score + roundScore
      const bestScore = Math.max(prev.bestScore, score)
      return { ...prev, score, bestScore }
    })
  }, [])

  return {
    progress,
    addWrong,
    removeWrong,
    recordAnswer,
    undoAnswer,
    addRoundScore,
  }
}
