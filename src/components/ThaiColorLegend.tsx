interface ThaiColorLegendProps {
  compact?: boolean
  inverted?: boolean
}

export function ThaiColorLegend({ compact = false, inverted = false }: ThaiColorLegendProps) {
  const muted = inverted ? 'text-slate-300' : 'text-slate-500'
  const label = inverted ? 'text-slate-200' : 'text-slate-600'

  if (compact) {
    return (
      <p className={`flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs ${muted}`}>
        <LegendItem role="consonant" label="輔音" labelClass={label} />
        <LegendItem role="vowel" label="母音" labelClass={label} />
        <LegendItem role="tone" label="聲調" labelClass={label} />
      </p>
    )
  }

  return (
    <div className="rounded-lg bg-white/80 px-3 py-2.5 ring-1 ring-slate-200">
      <p className={`mb-2 text-xs font-semibold ${label}`}>發音著色說明</p>
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm">
        <LegendItem role="consonant" label="輔音（พยัญชนะ）" labelClass={label} />
        <LegendItem role="vowel" label="母音（สระ）" labelClass={label} />
        <LegendItem role="tone" label="聲調（วรรณยุกต์）" labelClass={label} />
      </div>
    </div>
  )
}

function LegendItem({
  role,
  label,
  labelClass = 'text-slate-600',
}: {
  role: 'consonant' | 'vowel' | 'tone'
  label: string
  labelClass?: string
}) {
  const sample = role === 'consonant' ? 'ก' : role === 'vowel' ? 'า' : '่'
  return (
    <span className={`inline-flex items-center gap-1.5 ${labelClass}`}>
      <span className={`thai-text text-base font-semibold thai-part-${role}`} lang="th">
        {sample}
      </span>
      <span>{label}</span>
    </span>
  )
}
