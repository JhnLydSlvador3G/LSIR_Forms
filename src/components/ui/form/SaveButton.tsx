import type z from 'zod'
import { cn } from '@/lib/utils'
import { saveFormToLocal } from '@/lib/formLocalStorage'

type SaveButtonProps<T> = {
  storageKey: string
  getValue: () => T
  schema?: z.ZodType<T>
}

const SaveButton = <T,>({
  storageKey,
  getValue,
  schema,
}: SaveButtonProps<T>) => {
  return (
    <button
      type="button"
      className={cn(
        'flex-2 md:flex-none',
        'px-2 py-1.5 md:px-8 md:py-3',
        'text-xs md:text-lg',
        'rounded-xl',
        'text-black shadow-lg bg-lebThird ring-2 ring-[#937bd0]/40',
        'transition-all duration-300 ease-out',
        'hover:scale-105 md:hover:scale-105',
        'disabled:opacity-60 disabled:cursor-not-allowed',
      )}
      onClick={(event) => {
        event.preventDefault()
        saveFormToLocal({
          key: storageKey,
          value: getValue(),
          schema: schema,
        })
      }}
    >
      Save
    </button>
  )
}

export default SaveButton
