export interface TocItem {
  id: string
  label: string
}

interface BlogTocProps {
  items: TocItem[]
}

export function BlogToc({ items }: BlogTocProps) {
  return (
    <nav className="blog-toc hidden lg:block" aria-label="文章目錄">
      <p className="blog-toc-title">目錄</p>
      <ol className="blog-toc-list">
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className="blog-toc-link">
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function BlogTocMobile({ items }: BlogTocProps) {
  return (
    <nav className="blog-toc-mobile lg:hidden" aria-label="文章目錄">
      <details className="rounded-lg border border-stone-200 bg-stone-50/80 px-4 py-2">
        <summary className="cursor-pointer text-sm font-semibold text-stone-800">
          跳至章節
        </summary>
        <ol className="mt-2 space-y-1 border-t border-stone-200 pt-2 text-sm">
          {items.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className="text-teal-800 hover:underline">
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </details>
    </nav>
  )
}
