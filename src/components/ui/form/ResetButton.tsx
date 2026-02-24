import { heiFormDefaultValues } from '@/components/form/hei/HeiForm.types'
import { useFormContext } from '@/hooks/form-context'
import { cn } from '@/lib/utils'

const ResetButton = () => {
  const form = useFormContext()
  return (
    <button
      type="reset"
      className={cn(
        'flex-2 md:flex-none',
        'px-2 py-1.5 md:px-8 md:py-3',
        'text-xs md:text-lg',
        'rounded-xl',
        'text-black shadow-lg bg-lebSecond ring-2 ring-[#937bd0]/40',
        'transition-all duration-300 ease-out',
        'hover:scale-105 md:hover:scale-105',
        'disabled:opacity-60 disabled:cursor-not-allowed',
      )}
      onClick={(event) => {
        event.preventDefault()
        form.reset(heiFormDefaultValues as never)
      }}
    >
      {' '}
      Reset
    </button>
  )
}

export default ResetButton
