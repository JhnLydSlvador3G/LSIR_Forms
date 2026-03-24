import type z from 'zod'
import { cn } from '@/lib/utils'
import { saveFormToLocal } from '@/lib/formLocalStorage'
import { useFormContext } from '@/hooks/form-context'

type SaveButtonProps<T> = {
  storageKey: string
  getValue: () => T
  schema?: z.ZodType<T>
  preferGetValueFirst?: boolean
}

const SaveButton = <T,>({
  storageKey,
  getValue,
  schema,
  preferGetValueFirst = false,
}: SaveButtonProps<T>) => {
  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => state.values as T}>
      {(values) => (
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
            const value = preferGetValueFirst
              ? getValue() ?? values ?? (form.state.values as T)
              : values ?? getValue() ?? (form.state.values as T)
            saveFormToLocal({
              key: storageKey,
              value,
              schema: schema,
            })
          }}
        >
          Save
        </button>
      )}
    </form.Subscribe>
  )
}

export default SaveButton
