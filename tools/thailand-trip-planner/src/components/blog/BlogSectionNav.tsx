import type { TocItem } from './BlogToc'

export interface NavGroup {
  label: string
  items: TocItem[]
}

interface BlogSectionNavProps {
  groups: NavGroup[]
  activeId: string
  onSelect: (id: string) => void
}

export function BlogSectionNav({ groups, activeId, onSelect }: BlogSectionNavProps) {
  return (
    <nav className="blog-section-nav" aria-label="章節切換">
      <div className="blog-section-nav-inner">
        {groups.map((group, gi) => (
          <div key={group.label} className="blog-section-group">
            <span className="blog-section-group-label">{group.label}</span>
            <div className="blog-section-group-tabs">
              {group.items.map((item) => {
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
            {gi < groups.length - 1 && <span className="blog-section-divider" aria-hidden />}
          </div>
        ))}
      </div>
    </nav>
  )
}
