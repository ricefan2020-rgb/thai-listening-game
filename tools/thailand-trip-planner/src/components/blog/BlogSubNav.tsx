interface BlogSubNavProps {
  items: { id: string; label: string }[]
  activeId: string
  onSelect: (id: string) => void
}

export function BlogSubNav({ items, activeId, onSelect }: BlogSubNavProps) {
  return (
    <div className="blog-sub-nav" role="tablist">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={item.id === activeId}
          onClick={() => onSelect(item.id)}
          className={`blog-sub-tab ${item.id === activeId ? 'blog-sub-tab--active' : ''}`}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
