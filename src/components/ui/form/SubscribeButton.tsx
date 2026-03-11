import Spinner from '../feedback/Spinner'
import { useFormContext } from '@/hooks/useFormContext'
import { cn } from '@/lib/utils'

export default function SubscribeButton({ label }: { label: string }) {
  const form = useFormContext()
  return (
    <form.Subscribe
      selector={(state) => [
        state.isSubmitting,
      ]}
    >
      {([isSubmitting]) => (
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'flex-2 md:flex-none justify-center flex items-center',
            'px-3 py-1.5 md:px-12 md:py-4',
            'text-xs md:text-lg',
            'rounded-xl',
            'bg-[#937bd0] text-white shadow-lg ring-2 ring-[#937bd0]/40',
            'transition-all duration-300 ease-out',
            'hover:scale-105 md:hover:scale-105',
            'disabled:opacity-60 disabled:cursor-not-allowed',
          )}
        >
          {isSubmitting ? <Spinner /> : label}
        </button>
      )}
    </form.Subscribe>
  )
}
