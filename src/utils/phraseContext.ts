import { ARTICLES } from '../data/articles'
import type { WordExample } from '../types'

/** 從短文中擷取含該詞的原文句作為例句 */
export function getArticleContextExamples(phraseId: string, thai: string): WordExample[] {
  const trimmed = thai.trim()
  for (const article of ARTICLES) {
    if (!article.questions.some((q) => q.id === phraseId)) continue
    const lines = article.contentTh
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
    const hits = lines.filter((l) => l.includes(trimmed))
    if (hits.length === 0) continue
    return hits.slice(0, 2).map((line) => ({
      exampleTh: line.length > 120 ? `${line.slice(0, 120)}…` : line,
      exampleZh: `摘自〈${article.titleZh}〉`,
    }))
  }
  return []
}
