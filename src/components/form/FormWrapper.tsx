import { cn } from '@/lib/utils'

type FormWrapperProps = {
  title: string
  subtitle?: string
  children: React.ReactNode
  noPadding?: boolean
  className?: string
}

export function FormWrapper({
  title,
  subtitle,
  children,
  noPadding = false,
  className,
}: FormWrapperProps) {
  return (
    <div
      className={cn(
        'mx-auto my-10 max-w-5xl overflow-auto rounded-xl border border-[#937bd0]/20 bg-white shadow-xl',
        className,
      )}
    >
      {/* Header */}
      <div className="relative bg-leb px-8 py-8 text-white">
        <div className="absolute inset-0 bg-white/5" />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="text-white/80 mt-2 text-sm">{subtitle}</p>}
        </div>
      </div>

      {/* Body */}
      <div className={cn(`bg-white space-y-10`, noPadding ? '' : 'px-8 py-5')}>
        {children}
      </div>
    </div>
  )
}
