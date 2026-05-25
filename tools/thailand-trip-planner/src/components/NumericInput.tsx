import { useEffect, useState } from 'react'

interface NumericInputProps {
  value: number
  min: number
  max: number
  onChange: (value: number) => void
  className?: string
  'aria-label'?: string
}

/** 手機友善數字輸入：允許先清空再輸入，避免 type=number 在 iOS 上無法編輯 */
export function NumericInput({
  value,
  min,
  max,
  onChange,
  className,
  'aria-label': ariaLabel,
}: NumericInputProps) {
  const [text, setText] = useState(String(value))

  useEffect(() => {
    setText(String(value))
  }, [value])

  const clamp = (n: number) => Math.min(max, Math.max(min, n))

  const commit = (raw: string) => {
    const digits = raw.replace(/\D/g, '')
    if (digits === '') {
      const fallback = clamp(value)
      setText(String(fallback))
      onChange(fallback)
      return
    }
    const n = clamp(parseInt(digits, 10))
    setText(String(n))
    onChange(n)
  }

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      autoComplete="off"
      enterKeyHint="done"
      aria-label={ariaLabel}
      value={text}
      onChange={(e) => {
        const digits = e.target.value.replace(/\D/g, '')
        setText(digits)
        if (digits === '') return
        const n = parseInt(digits, 10)
        if (!Number.isNaN(n)) onChange(clamp(n))
      }}
      onBlur={() => commit(text)}
      className={className}
    />
  )
}
