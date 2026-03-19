import { cn } from '@/lib/utils'

type ContentCardsProps = {
  title: React.ReactNode
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
  compact?: boolean
}

export default function ContentCards({
  title,
  actions,
  children,
  className,
  compact = false,
}: ContentCardsProps) {
  return (
    <div
      className={cn(
        'shrink-0 rounded-2xl border border-gray-200 bg-white shadow-sm',
        compact ? 'w-[360px] p-3.5' : 'w-[420px] p-6',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className={cn('font-bold text-slate-900', compact ? 'text-xl' : 'text-2xl')}>
          {title}
        </div>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>

      <div className={cn(compact ? 'pt-2.5' : 'pt-5')}>{children}</div>
    </div>
  )
}
