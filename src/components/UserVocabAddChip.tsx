import { useState } from 'react'
import { isUnknownMeaning } from '../utils/userVocab'
import type { CompoundPart } from '../types'

interface UserVocabAddChipProps {
  part: CompoundPart
  inverted?: boolean
  onAdded: (thai: string, meaning: string) => void
}

export function UserVocabAddChip({ part, inverted, onAdded }: UserVocabAddChipProps) {
  const [open, setOpen] = useState(false)
  const [meaning, setMeaning] = useState('')

  if (!isUnknownMeaning(part.meaning)) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] ring-1 ${
          inverted
            ? 'bg-slate-900/60 text-violet-100 ring-slate-600'
            : 'bg-violet-50 text-violet-900 ring-violet-100'
        }`}
      >
        <span className="thai-text font-medium" lang="th">
          {part.thai}
        </span>
        <span>{part.meaning}</span>
      </span>
    )
  }

  const chipClass = inverted
    ? 'bg-amber-900/40 text-amber-100 ring-amber-600/80 hover:bg-amber-900/60'
    : 'bg-amber-50 text-amber-900 ring-amber-200 hover:bg-amber-100'

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] ring-1 ${chipClass}`}
        title="加入我的詞庫"
      >
        <span className="thai-text font-medium" lang="th">
          {part.thai}
        </span>
        <span className="underline decoration-dotted">點擊收錄</span>
      </button>
    )
  }

  return (
    <span
      className={`inline-flex max-w-full flex-col gap-1 rounded px-1.5 py-1 text-[10px] ring-1 ${
        inverted ? 'bg-slate-900/80 ring-slate-600' : 'bg-white ring-amber-200'
      }`}
    >
      <span className="thai-text font-medium" lang="th">
        {part.thai}
      </span>
      <span className="flex flex-wrap items-center gap-1">
        <input
          type="text"
          value={meaning}
          onChange={(e) => setMeaning(e.target.value)}
          placeholder="中文意思"
          className={`min-w-[5rem] flex-1 rounded border px-1 py-0.5 text-[10px] ${
            inverted
              ? 'border-slate-600 bg-slate-800 text-white placeholder:text-slate-500'
              : 'border-amber-200 bg-white text-slate-800'
          }`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && meaning.trim()) {
              onAdded(part.thai, meaning.trim())
              setOpen(false)
              setMeaning('')
            }
            if (e.key === 'Escape') setOpen(false)
          }}
          autoFocus
        />
        <button
          type="button"
          disabled={!meaning.trim()}
          onClick={() => {
            onAdded(part.thai, meaning.trim())
            setOpen(false)
            setMeaning('')
          }}
          className={`shrink-0 rounded px-1.5 py-0.5 font-semibold disabled:opacity-40 ${
            inverted ? 'bg-amber-600 text-white' : 'bg-amber-500 text-white'
          }`}
        >
          收錄
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className={inverted ? 'text-slate-400' : 'text-slate-500'}
        >
          取消
        </button>
      </span>
    </span>
  )
}
