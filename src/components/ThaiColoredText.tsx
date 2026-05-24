import { splitThaiColored } from '../utils/thaiScript'

const ROLE_CLASS: Record<string, string> = {
  consonant: 'thai-part-consonant',
  vowel: 'thai-part-vowel',
  tone: 'thai-part-tone',
  other: 'thai-part-other',
}

interface ThaiColoredTextProps {
  text: string
  className?: string
}

export function ThaiColoredText({ text, className = '' }: ThaiColoredTextProps) {
  const parts = splitThaiColored(text)

  return (
    <span className={`thai-text inline ${className}`} lang="th">
      {parts.map((part, index) => (
        <span key={`${index}-${part.char}`} className={ROLE_CLASS[part.role]}>
          {part.char}
        </span>
      ))}
    </span>
  )
}
