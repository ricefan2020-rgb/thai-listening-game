import { getThaiRoman } from '../utils/thaiRoman'
import { ThaiColoredText } from './ThaiColoredText'
import { ThaiKaraokeText } from './ThaiKaraokeText'

interface ThaiWithRomanProps {
  text: string
  className?: string
  romanClassName?: string
  align?: 'center' | 'start'
  /** K 歌高亮模式 */
  karaoke?: {
    activeUnitIndex: number
  }
  /** 不顯示拼音（例如極長文章可關閉） */
  showRoman?: boolean
}

export function ThaiWithRoman({
  text,
  className = '',
  romanClassName = 'text-sm text-amber-200/90',
  align = 'center',
  karaoke,
  showRoman = true,
}: ThaiWithRomanProps) {
  const roman = showRoman ? getThaiRoman(text) : ''
  const alignClass = align === 'start' ? 'items-start' : 'items-center'

  return (
    <span className={`inline-flex flex-col gap-1 ${alignClass}`}>
      {karaoke ? (
        <ThaiKaraokeText
          text={text}
          activeUnitIndex={karaoke.activeUnitIndex}
          className={className}
        />
      ) : (
        <ThaiColoredText text={text} className={className} />
      )}
      {roman ? (
        <span className={`thai-roman font-normal tracking-wide ${romanClassName}`} lang="en">
          {roman}
        </span>
      ) : null}
    </span>
  )
}
