import type { ReactNode } from 'react'

interface BlogSectionProps {
  id: string
  title: string
  lead?: string
  children: ReactNode
}

export function BlogSection({ id, title, lead, children }: BlogSectionProps) {
  return (
    <section id={id} className="blog-section scroll-mt-24">
      <header className="blog-section-header">
        <h2 className="blog-h2">{title}</h2>
        {lead && <p className="blog-lead">{lead}</p>}
      </header>
      <div className="blog-section-body">{children}</div>
    </section>
  )
}
