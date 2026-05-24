export interface AnalysisSection {
  title: string
  html: string
  open?: boolean
}

export interface AnalysisCardOptions {
  title: string
  tag: string
  lead: string
  kpis: string
  pattern: string
  sections: AnalysisSection[]
  footnote?: string
}

export function kpiCard(label: string, value: string): string {
  return `
    <div class="kpi-card">
      <span class="label">${label}</span>
      <strong>${value}</strong>
    </div>
  `
}

export function wrapAnalysisCard(options: AnalysisCardOptions): string {
  const sections = options.sections
    .map(
      (section) => `
        <details class="analysis-section" ${section.open ? 'open' : ''}>
          <summary>${section.title}</summary>
          <div class="analysis-section-body">${section.html}</div>
        </details>
      `,
    )
    .join('')

  return `
    <article class="analysis-card">
      <header class="analysis-card-header">
        <span class="analysis-tag" aria-hidden="true">${options.tag}</span>
        <div>
          <h2 class="analysis-card-title">${options.title}</h2>
          <p class="note analysis-lead">${options.lead}</p>
        </div>
      </header>
      <div class="kpi-grid">${options.kpis}</div>
      <p class="pattern-callout">${options.pattern}</p>
      <div class="analysis-sections">${sections}</div>
      ${options.footnote ? `<p class="note footnote">${options.footnote}</p>` : ''}
    </article>
  `
}

export function wrapAnalysisBlock(
  id: string,
  title: string,
  badge: string,
  innerHtml: string,
  open = true,
): string {
  return `
    <details class="analysis-block" data-analysis="${id}" ${open ? 'open' : ''}>
      <summary>
        <span class="analysis-heading">
          <span class="analysis-title">${title}</span>
          <span class="analysis-badge">${badge}</span>
        </span>
      </summary>
      <div class="analysis-body">${innerHtml}</div>
    </details>
  `
}

export function renderOutputEmpty(message: string): string {
  return `<p class="output-empty">${message}</p>`
}
