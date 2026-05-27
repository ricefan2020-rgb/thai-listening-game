import { useEffect, useMemo, useState } from 'react'
import type { ThaiLookupKind } from '../utils/thaiLookup'
import {
  lookupByStudyId,
  lookupLexeme,
  lookupPhrase,
  lookupThaiText,
  shouldAutoTokenize,
  tokenizeThaiForLookup,
} from '../utils/thaiLookup'
import { getPhraseSegmentOverride } from '../data/phrase-segment-overrides'
import { lookupPartMeaning } from '../utils/compoundWord'
import { isUnknownMeaning } from '../utils/userVocab'
import { getThaiRoman } from '../utils/thaiRoman'
import { ThaiColoredText } from './ThaiColoredText'
import { ThaiKaraokeText } from './ThaiKaraokeText'
import { ThaiWordDetail } from './ThaiWordDetail'

interface InteractiveThaiTextProps {
  text: string
  className?: string
  romanClassName?: string
  align?: 'center' | 'start'
  inverted?: boolean
  karaoke?: { activeUnitIndex: number }
  showRoman?: boolean
  hintStudyId?: string
  hintKind?: ThaiLookupKind
  onSpeak?: (text: string) => void
  speaking?: boolean
  /** 強制句中點詞；未指定時長句自動啟用 */
  tokenize?: boolean
}

function viewWholeLabel(kind?: ThaiLookupKind): string {
  if (kind === 'article') return '查看短語意思'
  if (kind === 'word') return '查看詞義與例句'
  if (kind === 'sentence') return '查看整句意思'
  return '查看完整意思'
}

function tokenizeHintText(kind?: ThaiLookupKind): string {
  if (kind === 'sentence') {
    return '點選單字查看意思；「查看整句意思」可看句子分析'
  }
  if (kind === 'article') {
    return '點選單字（虛線）查看意思；點整句可看分詞分析與例句'
  }
  if (kind === 'word') {
    return '點選單字（虛線）查看意思；「查看詞義與例句」可看例句與提示'
  }
  return '點選單字（虛線）查看意思與例句'
}

export function InteractiveThaiText({
  text,
  className = '',
  romanClassName = 'text-sm text-amber-200/90',
  align = 'center',
  inverted = false,
  karaoke,
  showRoman = true,
  hintStudyId,
  hintKind,
  onSpeak,
  speaking,
  tokenize,
}: InteractiveThaiTextProps) {
  const [activeQuery, setActiveQuery] = useState<string | null>(null)
  const [vocabRevision, setVocabRevision] = useState(0)

  const useTokenize = tokenize ?? shouldAutoTokenize(text)
  const useKaraoke = Boolean(karaoke) && !useTokenize

  useEffect(() => {
    setActiveQuery(null)
  }, [text, hintStudyId])

  const useArticlePhrases = hintKind === 'article'

  const segments = useMemo(
    () =>
      useTokenize
        ? tokenizeThaiForLookup(text, { articlePhrases: useArticlePhrases })
        : null,
    [text, useTokenize, useArticlePhrases],
  )

  const activeDetail = useMemo(() => {
    if (!activeQuery) return null
    if (hintStudyId && hintKind && activeQuery === text.trim()) {
      return lookupByStudyId(hintStudyId, hintKind)
    }
    const phrase = lookupPhrase(activeQuery)
    if (phrase) return phrase
    return lookupThaiText(activeQuery)
  }, [activeQuery, hintStudyId, hintKind, text, vocabRevision])

  const openWhole = () => {
    if (hintStudyId && hintKind) {
      setActiveQuery(text.trim())
      return
    }
    const d = lookupPhrase(text.trim())
    if (d) setActiveQuery(d.query)
  }

  const openWord = (query: string, lexeme?: { thai: string; kind: ThaiLookupKind; id: string }) => {
    const q = query.trim()
    const whole = text.trim()
    if (hintStudyId && hintKind && whole.includes(q) && q !== whole) {
      const gloss = lookupPartMeaning(q)
      const shouldUseWholePhrase =
        Boolean(getPhraseSegmentOverride(whole)) ||
        q.length <= 3 ||
        isUnknownMeaning(gloss)
      if (shouldUseWholePhrase) {
        const d = lookupByStudyId(hintStudyId, hintKind)
        if (d?.phraseAnalysis && d.phraseAnalysis.segments.length >= 2) {
          setActiveQuery(whole)
          return
        }
      }
    }
    if (lexeme) {
      const d = lookupLexeme(lexeme)
      if (d) {
        setActiveQuery(d.query)
        return
      }
    }
    setActiveQuery((prev) => (prev === q ? null : q))
  }

  const alignClass = align === 'start' ? 'items-start' : 'items-center'
  const wordBtnClass = inverted
    ? 'cursor-pointer rounded px-0.5 underline decoration-amber-400/70 decoration-dotted underline-offset-4 hover:bg-white/15'
    : 'cursor-pointer rounded px-0.5 underline decoration-sky-500 decoration-dotted underline-offset-4 hover:bg-sky-50'
  const plainBtnClass = inverted
    ? 'cursor-pointer rounded px-0.5 text-slate-300 hover:bg-white/10 hover:text-white'
    : 'cursor-pointer rounded px-0.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800'

  const renderTokenized = () => {
    if (!segments) return null

    const lexemeCount = segments.filter((s) => s.type === 'lexeme').length

    return (
      <>
        <span className={`thai-text inline leading-relaxed ${className}`} lang="th">
          {segments.map((seg, i) => {
            if (seg.type === 'text') {
              const trimmed = seg.text.trim()
              if (!trimmed) {
                return (
                  <span key={i} className="thai-part-other">
                    {seg.text}
                  </span>
                )
              }
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => openWord(trimmed)}
                  className={`border-0 bg-transparent p-0 font-inherit ${plainBtnClass}`}
                  title="詞庫暫無，點擊嘗試查詢"
                >
                  <ThaiColoredText text={seg.text} className="inline opacity-90" />
                </button>
              )
            }
            const isActive = activeQuery === seg.text
            const gloss = lookupPartMeaning(seg.text)
            const glossLabel =
              gloss && gloss !== '（未收錄）' ? gloss : undefined
            return (
              <button
                key={`${i}-${seg.text}`}
                type="button"
                onClick={() => openWord(seg.text, seg.lexeme)}
                className={`border-0 bg-transparent p-0 font-inherit ${wordBtnClass} ${
                  isActive ? (inverted ? 'bg-white/20' : 'bg-amber-100') : ''
                }`}
                title={glossLabel ? `${seg.text}：${glossLabel}` : `查詢：${seg.text}`}
              >
                <ThaiColoredText text={seg.text} className="inline font-semibold" />
                {glossLabel && (
                  <span
                    className={`mt-0.5 block text-[10px] font-normal leading-tight ${
                      inverted ? 'text-amber-100/85' : 'text-amber-700/90'
                    }`}
                  >
                    {glossLabel}
                  </span>
                )}
              </button>
            )
          })}
        </span>
        {lexemeCount === 0 && (
          <button
            type="button"
            onClick={openWhole}
            className={`mt-1 text-xs font-medium ${inverted ? 'text-amber-200' : 'text-amber-700'}`}
          >
            {viewWholeLabel(hintKind)}
          </button>
        )}
      </>
    )
  }

  const renderBody = () => {
    if (useKaraoke && karaoke) {
      return (
        <button
          type="button"
          onClick={openWhole}
          className={`border-0 bg-transparent p-0 ${wordBtnClass}`}
        >
          <ThaiKaraokeText
            text={text}
            activeUnitIndex={karaoke.activeUnitIndex}
            className={className}
          />
        </button>
      )
    }

    if (useTokenize) {
      const tokenized = renderTokenized()
      if (tokenized) return tokenized
    }

    return (
      <button
        type="button"
        onClick={openWhole}
        className={`border-0 bg-transparent p-0 ${wordBtnClass}`}
      >
        <ThaiColoredText text={text} className={className} />
      </button>
    )
  }

  const roman = showRoman ? getThaiRoman(text) : ''

  return (
    <div className={`flex w-full flex-col gap-1.5 ${alignClass}`}>
      {renderBody()}

      {useTokenize && hintStudyId && (
        <button
          type="button"
          onClick={openWhole}
          className={`text-[10px] font-medium ${inverted ? 'text-amber-200/90 hover:text-amber-100' : 'text-amber-700 hover:text-amber-900'}`}
        >
          {viewWholeLabel(hintKind)}
        </button>
      )}

      {roman ? (
        <span className={`thai-roman font-normal tracking-wide ${romanClassName}`} lang="en">
          {roman}
        </span>
      ) : null}

      {!activeDetail && (
        <p className={`text-[10px] ${inverted ? 'text-slate-400' : 'text-slate-400'}`}>
          {useTokenize ? tokenizeHintText(hintKind) : '點泰文查看意思與例句'}
        </p>
      )}

      {activeDetail && (
        <ThaiWordDetail
          detail={activeDetail}
          speaking={speaking}
          onSpeak={onSpeak}
          onClose={() => setActiveQuery(null)}
          inverted={inverted}
          compact={useTokenize}
          vocabRevision={vocabRevision}
          onVocabAdded={() => setVocabRevision((v) => v + 1)}
        />
      )}
    </div>
  )
}
