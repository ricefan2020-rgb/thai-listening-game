import { splitThaiColored } from '../utils/thaiScript'
import { splitThaiKaraokeUnits } from '../utils/thaiKaraoke'

const ROLE_CLASS: Record<string, string> = {
  consonant: 'thai-part-consonant',
  vowel: 'thai-part-vowel',
  tone: 'thai-part-tone',
  other: 'thai-part-other',
}

interface ThaiKaraokeTextProps {
  text: string
  /** 已唱完的單位索引（含當前正在唱的） */
  activeUnitIndex: number
  className?: string
}

function ColoredChars({ text, dimmed }: { text: string; dimmed: boolean }) {
  const parts = splitThaiColored(text)
  return (
    <>
      {parts.map((part, index) => (
        <span
          key={`${index}-${part.char}`}
          className={`${ROLE_CLASS[part.role]} ${dimmed ? 'karaoke-dim' : ''}`}
        >
          {part.char}
        </span>
      ))}
    </>
  )
}

export function ThaiKaraokeText({
  text,
  activeUnitIndex,
  className = '',
}: ThaiKaraokeTextProps) {
  const units = splitThaiKaraokeUnits(text)

  return (
    <span className={`thai-text karaoke-line inline ${className}`} lang="th">
      {units.map((unit, index) => {
        let state: 'pending' | 'active' | 'sung' = 'pending'
        if (index < activeUnitIndex) state = 'sung'
        else if (index === activeUnitIndex && activeUnitIndex < units.length) state = 'active'

        return (
          <span
            key={`${index}-${unit}`}
            className={`karaoke-unit karaoke-unit-${state}`}
          >
            <ColoredChars text={unit} dimmed={state === 'pending'} />
          </span>
        )
      })}
    </span>
  )
}
