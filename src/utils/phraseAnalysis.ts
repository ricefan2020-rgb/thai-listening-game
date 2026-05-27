import { PHRASE_EXAMPLES } from '../data/phrase-examples'
import { getPhraseSegmentOverride } from '../data/phrase-segment-overrides'
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

/** 修正「เจ้าหน้าที่」被切成 เจ้า + น้า（阿姨）+ ที่ 等錯誤 */
function fixStaffWordSegmentation(
  trimmed: string,
  segments: PhraseSegment[],
): PhraseSegment[] | null {
  if (!trimmed.includes('เจ้าหน้าที่')) return null

  const hasStaffWord = segments.some((s) => s.thai === 'เจ้าหน้าที่')
  const hasBadFragment = segments.some(
    (s) =>
      s.thai === 'น้า' ||
      s.thai === 'น้ำ' ||
      s.thai === 'เจ้าห' ||
      (s.thai === 'หน้า' && !hasStaffWord) ||
      (s.thai === 'ที่' && trimmed.includes('เจ้าหน้าที่') && !hasStaffWord),
  )
  if (hasStaffWord && !hasBadFragment) return null

  const manual = getPhraseSegmentOverride(trimmed)
  if (manual && manual.length >= 2) return manual

  if (trimmed === 'ถามเจ้าหน้าที่') {
    return [
      { thai: 'ถาม', meaning: '問' },
      { thai: 'เจ้าหน้าที่', meaning: '工作人員' },
    ]
  }
  return [{ thai: 'เจ้าหน้าที่', meaning: '工作人員／官員' }]
}

export function buildPhraseAnalysis(
  phraseId: string,
  thai: string,
  translationZh: string,
): PhraseAnalysis {
  const trimmed = thai.trim()
  const override = getPhraseSegmentOverride(trimmed)

  if (override && override.length >= 2) {
    return finalize(phraseId, trimmed, translationZh, override)
  }

  const tokenSegments = tokenizeSegments(trimmed)
  const staffFix = fixStaffWordSegmentation(trimmed, tokenSegments)
  if (staffFix) {
    return finalize(phraseId, trimmed, translationZh, staffFix)
  }

  if (segmentsAllKnown(tokenSegments)) {
    return finalize(phraseId, trimmed, translationZh, tokenSegments)
  }

  const compound = decomposeThaiCompound(trimmed)
  if (compound) {
    const compoundFix = fixStaffWordSegmentation(trimmed, compound.parts)
    if (compoundFix) {
      return finalize(phraseId, trimmed, translationZh, compoundFix)
    }
    if (segmentsAllKnown(compound.parts)) {
      return finalize(phraseId, trimmed, translationZh, compound.parts, compound.patternZh)
    }
  }

  const segments: PhraseSegment[] =
    tokenSegments.length >= 2
      ? tokenSegments
      : [{ thai: trimmed, meaning: translationZh }]

  const finalFix = fixStaffWordSegmentation(trimmed, segments)
  if (finalFix) {
    return finalize(phraseId, trimmed, translationZh, finalFix)
  }

  return finalize(phraseId, trimmed, translationZh, segments)
}
