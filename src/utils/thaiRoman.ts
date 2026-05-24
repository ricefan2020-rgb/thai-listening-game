import romanizeLib from '@dehoist/romanize-thai'
import { THAI_ROMAN } from '../data/thai-roman'
import { formatThaiRomanDisplay, getThaiRomanToneInfo, toneRomanWord } from './thaiToneRoman'

export { getThaiRomanToneInfo, formatThaiRomanDisplay, toneRomanWord }

/** 取得泰文發音羅馬拼音（含聲調符號；詞庫有表則優先基底轉寫後標調） */
export function getThaiRoman(text: string, opts?: { plain?: boolean }): string {
  const trimmed = text.trim()
  if (!trimmed) return ''

  if (opts?.plain) {
    if (THAI_ROMAN[trimmed]) return THAI_ROMAN[trimmed]
    if (trimmed.includes('\n')) {
      return trimmed
        .split('\n')
        .map((line) => getThaiRoman(line.trim(), { plain: true }))
        .filter(Boolean)
        .join(' / ')
    }
    return romanizeLib(trimmed)
  }

  if (trimmed.includes('\n')) {
    return trimmed
      .split('\n')
      .map((line) => getThaiRoman(line.trim()))
      .filter(Boolean)
      .join(' / ')
  }

  return formatThaiRomanDisplay(trimmed)
}
