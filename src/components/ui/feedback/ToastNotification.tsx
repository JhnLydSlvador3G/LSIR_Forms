import { useEffect, useState } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastVariant = 'success' | 'error' | 'info'

type ToastNotificationProps = {
  message: string
  title?: string
  variant?: ToastVariant
  className?: string
  onClose?: () => void
  autoCloseMs?: number
}

const variantStyles: Record<
  ToastVariant,
  {
    container: string
    iconWrap: string
    icon: typeof CheckCircle2
  }
> = {
  success: {
    container:
      'border-emerald-500/45 bg-[linear-gradient(135deg,rgba(8,48,52,0.97),rgba(12,68,65,0.94))] text-emerald-100 shadow-[0_18px_50px_rgba(0,0,0,0.28)]',
    iconWrap: 'bg-emerald-400/14 text-emerald-400 ring-1 ring-emerald-400/20',
    icon: CheckCircle2,
  },
  error: {
    container:
      'border-red-500/40 bg-[linear-gradient(135deg,#fee2e2,#fecaca)] text-red-800 shadow-[0_18px_50px_rgba(0,0,0,0.28)]',
    iconWrap: 'bg-red-400/14 text-red-800 ring-1 ring-red-400/20',
    icon: AlertCircle,
  },
  info: {
    container:
      'border-cyan-500/40 bg-[linear-gradient(135deg,rgba(14,33,52,0.97),rgba(18,54,76,0.94))] text-cyan-100 shadow-[0_18px_50px_rgba(0,0,0,0.28)]',
    iconWrap: 'bg-cyan-400/14 text-cyan-400 ring-1 ring-cyan-400/20',
    icon: Info,
  },
}


export default function ToastNotification({
  message,
  title,
  variant = 'success',
  className,
  onClose,
  autoCloseMs = 5000,
}: ToastNotificationProps) {
  const { container, iconWrap, icon: Icon } = variantStyles[variant]
  const [isVisible, setIsVisible] = useState(true)
  const [isMounted, setIsMounted] = useState(true)

  useEffect(() => {
    setIsVisible(true)
    setIsMounted(true)

    const dismissTimer = window.setTimeout(() => {
      setIsVisible(false)
    }, autoCloseMs)

    const removeTimer = window.setTimeout(() => {
      setIsMounted(false)
      onClose?.()
    }, autoCloseMs + 250)

    return () => {
      window.clearTimeout(dismissTimer)
      window.clearTimeout(removeTimer)
    }
  }, [autoCloseMs, message, onClose])

  if (!isMounted) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex items-start gap-4 rounded-[22px] border px-5 py-4 backdrop-blur-sm',
        'transition-all duration-300 ease-out',
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-1 opacity-0',
        container,
        className,
      )}
    >
      <div
        className={cn(
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl',
          iconWrap,
        )}
      >
        <Icon className="h-6 w-6" />
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        {title ? <p className="text-sm font-semibold tracking-wide">{title}</p> : null}
        <p className={cn('text-xl font-medium leading-7', title && 'mt-0.5 text-base leading-6')}>
          {message}
        </p>
      </div>

      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  )
}
