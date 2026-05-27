import { ARTICLES, getAllArticleQuestions } from '../data/articles'
import { WORD_EXAMPLES } from '../data/word-examples'
import { SENTENCES } from '../data/sentences'
import { tokenizeThaiPhraseUnits } from './thaiToneRoman'
import type { LessonCategory, LessonItem, WordExample } from '../types'

/** 自動產生／舊腳本套用的空泛例句（應以真實語料取代） */
const PLACEHOLDER_TH: RegExp[] = [
  /วันนี้ผมใช้คำว่า\s*「/,
  /วันนี้ผมเรียน\s*「/,
  /วันนี้ฉันใช้คำว่า\s*「/,
  /วันนี้ฉันเรียน\s*「/,
  /เช้านี้ฉันเรียน\s*「/,
  /คำว่า\s*「.+」\s*ใช้บ่อย/,
  /「.+」\s*เป็นคำที่\s*(ใช้บ่อย|สำคัญ)/,
  /เป็นคำที่ใช้บ่อย/,
  /เป็นคำที่สำคัญ/,
  /ผมใช้คำว่า\s*.+\s*บ่อย/,
  /^ตอนเจอเพื่อนผมพูดว่า/,
  /ยินดีที่ได้พบ$/,
  /^ที่สวนสัตว์มี/,
  /^เด็กๆ ชอบ.+มาก$/,
  /^วันนี้อยากกิน/,
]

export function isPlaceholderWordExample(ex: WordExample): boolean {
  const t = ex.exampleTh.trim()
  return PLACEHOLDER_TH.some((re) => re.test(t))
}

/** 子串易誤配：字面上含該字，但語意屬另一詞（一詞多義／複合詞） */
function matchesLexemeSense(text: string, lexeme: string): boolean {
  if (!text.includes(lexeme)) return false

  if (lexeme === 'เหลือ') {
    if (/ช่วยเหลือ|ความช่วยเหลือ|ศูนย์ช่วยเหลือ/.test(text)) return false
    if (/สีเหลือง|เหลืองทอง/.test(text)) return false
    const units = tokenizeThaiPhraseUnits(text)
    if (units.includes('เหลือ')) return true
    if (units.some((u) => /ที่เหลือ$/.test(u) || u === 'ห่อที่เหลือ')) return true
    if (units.some((u) => u.startsWith('อาหารเหลือ'))) return true
    return false
  }

  if (lexeme.length >= 3) {
    return tokenizeThaiPhraseUnits(text).includes(lexeme)
  }
  return tokenizeThaiPhraseUnits(text).includes(lexeme)
}

/** 避免短詞誤配（如 จำ → จำนวน） */
function textContainsLexeme(text: string, lexeme: string): boolean {
  return matchesLexemeSense(text, lexeme)
}

function examplesFromCorpus(thai: string, max = 5): WordExample[] {
  const out: WordExample[] = []
  const seen = new Set<string>()

  const sentenceHits = SENTENCES.filter((s) => textContainsLexeme(s.thai, thai)).sort(
    (a, b) => a.thai.length - b.thai.length,
  )

  for (const s of sentenceHits) {
    if (seen.has(s.thai)) continue
    seen.add(s.thai)
    out.push({ exampleTh: s.thai, exampleZh: s.meaning })
    if (out.length >= max) return out
  }

  const questionHits = getAllArticleQuestions()
    .filter((q) => textContainsLexeme(q.thai, thai))
    .sort((a, b) => a.thai.length - b.thai.length)
  for (const q of questionHits) {
    if (seen.has(q.thai)) continue
    seen.add(q.thai)
    out.push({ exampleTh: q.thai, exampleZh: q.meaning })
    if (out.length >= max) return out
  }

  for (const article of ARTICLES) {
    const lines = article.contentTh
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
    for (const line of lines) {
      if (!textContainsLexeme(line, thai) || seen.has(line)) continue
      seen.add(line)
      const clip = line.length > 110 ? `${line.slice(0, 110)}…` : line
      out.push({ exampleTh: clip, exampleZh: `摘自〈${article.titleZh}〉` })
      if (out.length >= max) return out
    }
  }

  return out
}

function categoryFallback(lesson: LessonItem): WordExample[] {
  const { thai, meaning, category } = lesson

  const byCategory: Partial<Record<LessonCategory, WordExample[]>> = {
    greeting: [
      { exampleTh: `${thai}ครับ`, exampleZh: `「${meaning}。」（禮貌回應）` },
      {
        exampleTh: `— ${thai}นะครับ — ขอบคุณมาก`,
        exampleZh: `—「${meaning}」啊。— 非常感謝。`,
      },
    ],
    travel: [
      {
        exampleTh: `ขอถามหน่อยครับ … ${thai} … อยู่ที่ไหน`,
        exampleZh: `請問……${meaning}……在哪裡？`,
      },
      { exampleTh: `พรุ่งนี้จะ${thai}`, exampleZh: `明天要（${meaning}）。` },
      ...(thai === 'จอง'
        ? [
            { exampleTh: 'จองห้องพักแล้วครับ', exampleZh: '已訂好房間。' },
            { exampleTh: 'จองโต๊ะก่อนได้ไหม', exampleZh: '可以先訂位嗎？' },
          ]
        : []),
    ],
    food: [
      { exampleTh: `ขอ${thai}หนึ่งที่ครับ`, exampleZh: `請給一份（${meaning}）。` },
      { exampleTh: `รสชาติ${thai}มาก`, exampleZh: `味道很（${meaning}）。` },
      ...(thai === 'ห่อ'
        ? [
            { exampleTh: 'ห่อกลับบ้านได้ไหม', exampleZh: '可以打包帶走嗎？' },
            { exampleTh: 'ห่อที่เหลือกลับบ้าน', exampleZh: '把剩下的打包回家。' },
          ]
        : []),
    ],
    fruit: [
      { exampleTh: `อยากกิน${thai}`, exampleZh: `想吃（${meaning}）。` },
      { exampleTh: `ผล${thai}หวานมาก`, exampleZh: `（${meaning}）很甜。` },
    ],
    feeling: [
      { exampleTh: `วันนี้รู้สึก${thai}`, exampleZh: `今天覺得（${meaning}）。` },
      { exampleTh: `ไม่ต้อง${thai}นะ`, exampleZh: `別（${meaning}）喔。` },
    ],
    emotion: [
      { exampleTh: `ทำไม${thai}จัง`, exampleZh: `怎麼這麼（${meaning}）？` },
      { exampleTh: `อย่า${thai}เลย`, exampleZh: `別（${meaning}）了。` },
    ],
    time: [
      { exampleTh: `ตอน${thai}ผมอยู่บ้าน`, exampleZh: `（${meaning}）的時候我在家。` },
      { exampleTh: `รอ${thai}หน่อยนะ`, exampleZh: `稍等（${meaning}）一下。` },
    ],
    holiday: [
      { exampleTh: `ช่วง${thai}ครอบครัวมารวมตัว`, exampleZh: `（${meaning}）全家聚在一起。` },
      { exampleTh: `สุขสันต์${thai}`, exampleZh: `（${meaning}）快樂！` },
    ],
    color: [
      { exampleTh: `ชอบสี${thai}`, exampleZh: `喜歡（${meaning}）色。` },
      { exampleTh: `เสื้อตัวนี้สี${thai}`, exampleZh: `這件是（${meaning}）色。` },
    ],
    object: [
      { exampleTh: `ซื้อ${thai}มาใหม่`, exampleZh: `買了新的（${meaning}）。` },
      { exampleTh: `มี${thai}อยู่ที่บ้าน`, exampleZh: `家裡有（${meaning}）。` },
    ],
    furniture: [
      { exampleTh: `ห้องนี้มี${thai}`, exampleZh: `這個房間有（${meaning}）。` },
      { exampleTh: `ย้าย${thai}ไปมุมนั้น`, exampleZh: `把（${meaning}）搬到那邊。` },
    ],
    body: [
      { exampleTh: `${thai}เจ็บนิดหน่อย`, exampleZh: `（${meaning}）有點痛。` },
      { exampleTh: `ดูแล${thai}ให้ดี`, exampleZh: `好好照顧（${meaning}）。` },
    ],
    animal: [
      { exampleTh: `ที่สวนสัตว์มี${thai}`, exampleZh: `動物園裡有（${meaning}）。` },
      { exampleTh: `เด็กๆ ชอบ${thai}`, exampleZh: `孩子喜歡（${meaning}）。` },
    ],
  }

  return (
    byCategory[category] ?? [
      { exampleTh: `ผมใช้คำว่า ${thai} บ่อย`, exampleZh: `我常用「${meaning}」這個詞。` },
      { exampleTh: `${thai} …`, exampleZh: `（${meaning}）—— 請聽例句發音。` },
    ]
  )
}

const MAX_WORD_EXAMPLES = 6

function takeNonPlaceholder(examples: WordExample[], max: number): WordExample[] {
  const out: WordExample[] = []
  const seen = new Set<string>()
  for (const ex of examples) {
    if (isPlaceholderWordExample(ex)) continue
    if (seen.has(ex.exampleTh)) continue
    seen.add(ex.exampleTh)
    out.push(ex)
    if (out.length >= max) break
  }
  return out
}

/** 回傳最多 6 則有變化的例句：優先人工校訂 → 語料庫 → 分類模板（永不回傳模板句） */
export function resolveWordExamples(lesson: LessonItem): WordExample[] {
  const stored = takeNonPlaceholder(WORD_EXAMPLES[lesson.id] ?? [], MAX_WORD_EXAMPLES)
  if (stored.length >= MAX_WORD_EXAMPLES) return stored

  const merged: WordExample[] = [...stored]
  const seen = new Set(merged.map((e) => e.exampleTh))

  for (const ex of examplesFromCorpus(lesson.thai, MAX_WORD_EXAMPLES)) {
    if (merged.length >= MAX_WORD_EXAMPLES) break
    if (seen.has(ex.exampleTh) || isPlaceholderWordExample(ex)) continue
    seen.add(ex.exampleTh)
    merged.push(ex)
  }

  if (merged.length < 2) {
    for (const ex of categoryFallback(lesson)) {
      if (merged.length >= MAX_WORD_EXAMPLES) break
      if (seen.has(ex.exampleTh) || isPlaceholderWordExample(ex)) continue
      seen.add(ex.exampleTh)
      merged.push(ex)
    }
  }

  const final = takeNonPlaceholder(merged, MAX_WORD_EXAMPLES)
  return final.length > 0 ? final : takeNonPlaceholder(categoryFallback(lesson), 2)
}
