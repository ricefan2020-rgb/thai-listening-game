export type ThaiCharRole = 'consonant' | 'vowel' | 'tone' | 'other'

/** 依 Unicode 區段判斷泰文字元類型（輔音／母音／聲調） */
export function classifyThaiChar(char: string): ThaiCharRole {
  if (char.length !== 1) return 'other'

  const code = char.charCodeAt(0)

  // 聲調符號 ่ ้ ๊ ๋
  if (code >= 0x0e48 && code <= 0x0e4b) return 'tone'

  // 前置母音 เ แ โ ใ ไ
  if (code >= 0x0e40 && code <= 0x0e44) return 'vowel'

  // 上下方母音、ำ、า、็ 等
  if (
    code === 0x0e33 || // ำ
    code === 0x0e32 || // า
    code === 0x0e31 || // ั
    (code >= 0x0e34 && code <= 0x0e3a) ||
    code === 0x0e30 // ะ
  ) {
    return 'vowel'
  }

  // 辅音 ก–ฮ（含 อ）
  if (code >= 0x0e01 && code <= 0x0e2e) return 'consonant'

  return 'other'
}

export function splitThaiColored(text: string): { char: string; role: ThaiCharRole }[] {
  return [...text].map((char) => ({
    char,
    role: classifyThaiChar(char),
  }))
}
