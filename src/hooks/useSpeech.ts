import { useCallback, useEffect, useRef, useState } from 'react'
import { splitThaiKaraokeUnits, unitIndexAtChar } from '../utils/thaiKaraoke'

function findThaiVoice(): SpeechSynthesisVoice | null {
  const voices = speechSynthesis.getVoices()
  return (
    voices.find((v) => v.lang.toLowerCase().startsWith('th')) ??
    voices.find((v) => v.lang.toLowerCase().includes('th')) ??
    null
  )
}

export interface KaraokeState {
  text: string
  activeUnitIndex: number
}

export function useSpeech(speechRate: number) {
  const [hasThaiVoice, setHasThaiVoice] = useState<boolean | null>(null)
  const [speaking, setSpeaking] = useState(false)
  const [karaoke, setKaraoke] = useState<KaraokeState | null>(null)
  const fallbackTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const speechRateRef = useRef(speechRate)

  speechRateRef.current = speechRate

  const clearFallback = useCallback(() => {
    if (fallbackTimer.current) {
      clearInterval(fallbackTimer.current)
      fallbackTimer.current = null
    }
  }, [])

  useEffect(() => {
    const check = () => {
      setHasThaiVoice(!!findThaiVoice())
    }
    check()
    speechSynthesis.addEventListener('voiceschanged', check)
    return () => {
      speechSynthesis.removeEventListener('voiceschanged', check)
      clearFallback()
    }
  }, [clearFallback])

  const startFallbackKaraoke = useCallback(
    (text: string, units: string[]) => {
      clearFallback()
      if (units.length <= 1) return

      const rate = speechRateRef.current
      const msPerUnit = Math.max(80, (text.length * 100) / units.length / rate)
      let idx = 0

      setKaraoke({ text, activeUnitIndex: 0 })

      fallbackTimer.current = setInterval(() => {
        idx += 1
        if (idx >= units.length) {
          clearFallback()
          return
        }
        setKaraoke({ text, activeUnitIndex: idx })
      }, msPerUnit)
    },
    [clearFallback],
  )

  const speak = useCallback(
    (text: string) => {
      if (!('speechSynthesis' in window)) return

      speechSynthesis.cancel()
      clearFallback()

      const units = splitThaiKaraokeUnits(text)
      const rate = speechRateRef.current
      setKaraoke({ text, activeUnitIndex: -1 })

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'th-TH'
      const voice = findThaiVoice()
      if (voice) utterance.voice = voice
      utterance.rate = rate

      utterance.onstart = () => {
        setSpeaking(true)
        setKaraoke({ text, activeUnitIndex: 0 })
        startFallbackKaraoke(text, units)
      }

      utterance.onboundary = (event) => {
        if (event.charIndex === undefined) return
        clearFallback()
        const unitIndex = unitIndexAtChar(units, event.charIndex)
        setKaraoke({ text, activeUnitIndex: unitIndex })
      }

      utterance.onend = () => {
        clearFallback()
        setSpeaking(false)
        setKaraoke({ text, activeUnitIndex: units.length })
      }

      utterance.onerror = () => {
        clearFallback()
        setSpeaking(false)
        setKaraoke(null)
      }

      speechSynthesis.speak(utterance)
    },
    [clearFallback, startFallbackKaraoke],
  )

  const stop = useCallback(() => {
    speechSynthesis.cancel()
    clearFallback()
    setSpeaking(false)
    setKaraoke(null)
  }, [clearFallback])

  const resetKaraoke = useCallback(() => {
    setKaraoke(null)
  }, [])

  return { speak, stop, speaking, hasThaiVoice, karaoke, resetKaraoke }
}
