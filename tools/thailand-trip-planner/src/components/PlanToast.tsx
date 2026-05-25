interface PlanToastProps {
  message: string
}

export function PlanToast({ message }: PlanToastProps) {
  if (!message) return null
  return (
    <div className="blog-toast" role="status" aria-live="polite">
      {message}
    </div>
  )
}
