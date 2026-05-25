import { PHRASE_EXAMPLES } from '../data/phrase-examples'
import { PHRASE_SEGMENT_OVERRIDES } from '../data/phrase-segment-overrides'
import { getSimilarCompoundExamples } from '../data/phrase-similar-compounds'
import { decomposeThaiCompound, getPartMeaningInPhrase } from './compoundWord'
import { getArticleContextExamples } from './phraseContext'
import { inferRole } from './sentenceAnalysis'
import { tokenizeThaiPhraseUnits } from './thaiToneRoman'
import { isUnknownMeaning } from './userVocab'
import type { PhraseAnalysis, PhraseSegment, WordExample } from '../types'

export type { PhraseAnalysis, PhraseSegment }

function enrichSegments(segments: PhraseSegment[]): PhraseSegment[] {
  return segments.map((s) => ({
    ...s,
    roleZh: s.roleZh ?? inferRole(s.thai).roleZh,
  }))
}

function buildStructureZh(segments: PhraseSegment[]): string {
  return segments.map((s) => s.roleZh ?? '詞組').join(' → ')
}

function segmentsAllKnown(segments: PhraseSegment[]): boolean {
  return segments.length >= 2 && segments.every((s) => !isUnknownMeaning(s.meaning))
}

function tokenizeSegments(whole: string): PhraseSegment[] {
  return tokenizeThaiPhraseUnits(whole).map((unit) => ({
    thai: unit,
    meaning: getPartMeaningInPhrase(whole, unit),
  }))
}

function buildNoteZh(segments: PhraseSegment[], translationZh: string, patternZh?: string): string {
  const parts = segments.map((s) => `「${s.thai}」→ ${s.meaning}`).join(' · ')
  let note = `整句：${translationZh}。拆解：${parts}`
  if (patternZh) note += `。規律：${patternZh}`
  return note
}

function collectExamples(phraseId: string, thai: string): WordExample[] {
  const seen = new Set<string>()
  const merged: WordExample[] = []
  for (const ex of [...(PHRASE_EXAMPLES[thai] ?? []), ...getArticleContextExamples(phraseId, thai)]) {
    if (seen.has(ex.exampleTh)) continue
    seen.add(ex.exampleTh)
    merged.push(ex)
  }
  return merged.slice(0, 5)
}

function finalize(
  phraseId: string,
  trimmed: string,
  translationZh: string,
  segments: PhraseSegment[],
  patternZh?: string,
): PhraseAnalysis {
  const enriched = enrichSegments(segments)
  const similar = getSimilarCompoundExamples(trimmed)
  return {
    phraseId,
    fullThai: trimmed,
    translationZh,
    segments: enriched,
    structureZh: enriched.length >= 2 ? buildStructureZh(enriched) : undefined,
    noteZh: buildNoteZh(enriched, translationZh, patternZh),
    examples: collectExamples(phraseId, trimmed),
    similarCompounds: similar?.items,
    similarPatternZh: similar?.patternZh,
  }
}

function phraseSegmentOverride(thai: string) {
  const trimmed = thai.trim()
  const compact = trimmed.replace(/\s+/g, '')
  return PHRASE_SEGMENT_OVERRIDES[trimmed] ?? PHRASE_SEGMENT_OVERRIDES[compact]
}

export function buildPhraseAnalysis(
  phraseId: string,
  thai: string,
  translationZh: string,
): PhraseAnalysis {
  const trimmed = thai.trim()
  const override = phraseSegmentOverride(trimmed)

  if (override && override.length >= 2) {
    return finalize(phraseId, trimmed, translationZh, override)
  }

  const tokenSegments = tokenizeSegments(trimmed)
  if (segmentsAllKnown(tokenSegments)) {
    return finalize(phraseId, trimmed, translationZh, tokenSegments)
  }

  const compound = decomposeThaiCompound(trimmed)
  if (compound && segmentsAllKnown(compound.parts)) {
    return finalize(phraseId, trimmed, translationZh, compound.parts, compound.patternZh)
  }

  const segments: PhraseSegment[] =
    tokenSegments.length >= 2
      ? tokenSegments
      : [{ thai: trimmed, meaning: translationZh }]

  return finalize(phraseId, trimmed, translationZh, segments)
}
