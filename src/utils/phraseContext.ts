import { ARTICLES } from '../data/articles'
import type { WordExample } from '../types'

function splitArticleParagraphs(text: string): string[] {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
}

function truncate(text: string, max = 120): string {
  return text.length > max ? `${text.slice(0, max)}…` : text
}

/** 從短文中擷取含該詞的原文句作為例句（附對應段落中文譯文） */
export function getArticleContextExamples(phraseId: string, thai: string): WordExample[] {
  const trimmed = thai.trim()
  for (const article of ARTICLES) {
    if (!article.questions.some((q) => q.id === phraseId)) continue
    const thLines = splitArticleParagraphs(article.contentTh)
    const zhLines = splitArticleParagraphs(article.translationZh)
    const hits: { th: string; zh: string }[] = []
    for (let i = 0; i < thLines.length; i++) {
      if (!thLines[i].includes(trimmed)) continue
      hits.push({
        th: thLines[i],
        zh: zhLines[i] ?? '',
      })
      if (hits.length >= 2) break
    }
    if (hits.length === 0) continue
    const source = `摘自〈${article.titleZh}〉`
    return hits.map(({ th, zh }) => ({
      exampleTh: truncate(th),
      exampleZh: zh ? `${truncate(zh)}（${source}）` : source,
    }))
  }
  return []
}
