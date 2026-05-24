import type { TocItem } from './BlogToc'

interface BlogSectionNavProps {
  items: TocItem[]
  activeId: string
  onSelect: (id: string) => void
}

export function BlogSectionNav({ items, activeId, onSelect }: BlogSectionNavProps) {
  return (
    <nav className="blog-section-nav" aria-label="章節切換">
      <div className="blog-section-nav-scroll">
        {items.map((item) => {
          const active = item.id === activeId
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`blog-section-tab ${active ? 'blog-section-tab--active' : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              {item.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
