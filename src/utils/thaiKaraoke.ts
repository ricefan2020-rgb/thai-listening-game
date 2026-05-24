import { classifyThaiChar } from './thaiScript'

/** 將泰文拆成 K 歌逐段單位（音節／字素群） */
export function splitThaiKaraokeUnits(text: string): string[] {
  const units: string[] = []
  let buf = ''

  const flush = () => {
    if (buf) {
      units.push(buf)
      buf = ''
    }
  }

  for (const ch of text) {
    if (ch === ' ' || ch === '\n') {
      flush()
      continue
    }

    if (ch === '·' || ch === '／' || ch === '/') {
      flush()
      units.push(ch)
      continue
    }

    const role = classifyThaiChar(ch)

    if (buf.length === 0) {
      buf = ch
      continue
    }

    const lastChar = buf[buf.length - 1]
    const lastRole = classifyThaiChar(lastChar)

    // ว／ย 作介音：ควร、ด้วย 等勿拆成单字
    if (role === 'consonant' && (ch === 'ว' || ch === 'ย')) {
      if (lastRole === 'consonant' || lastRole === 'tone') {
        buf += ch
        continue
      }
    }
    if (role === 'consonant' && lastChar === 'ว') {
      buf += ch
      continue
    }

    const startsNewSyllable =
      role === 'consonant' &&
      lastRole !== 'vowel' &&
      lastRole !== 'tone' &&
      !'เแโใไ'.includes(ch)

    if (startsNewSyllable) {
      flush()
      buf = ch
      continue
    }

    buf += ch
  }

  flush()
  return units.length > 0 ? units : [text]
}

export function unitIndexAtChar(units: string[], charIndex: number): number {
  let pos = 0
  for (let i = 0; i < units.length; i++) {
    pos += units[i].length
    if (charIndex < pos) return i
  }
  return Math.max(0, units.length - 1)
}
