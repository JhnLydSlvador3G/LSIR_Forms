import * as Popover from '@radix-ui/react-popover'
import React from 'react'
import FieldInfo from './FieldInfo'
import LabelForm from './LabelForm'
import { useFieldContext } from '@/hooks/form-context'
import { cn } from '@/lib/utils'

type ComboboxFieldProps = {
  label: string
  options: Array<{ value: string; label: string }>
  htmlForVal: string
  className?: string
  required?: boolean
  placeholder?: string
}

export function ComboboxField({
  label,
  options,
  htmlForVal,
  className,
  required = false,
  placeholder = 'Select or type...',
}: ComboboxFieldProps) {
  const field = useFieldContext<string>()
  const [open, setOpen] = React.useState(false)
  const [contentWidth, setContentWidth] = React.useState<number | undefined>()
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const blurTimeoutRef = React.useRef<number | null>(null)

  const hasError = field.state.meta.isTouched && !field.state.meta.isValid
  const value = field.state.value ?? ''

  const filteredOptions = React.useMemo(() => {
    const query = value.trim().toLowerCase()
    if (!query) {
      return options
    }
    return options.filter((opt) => opt.label.toLowerCase().includes(query))
  }, [options, value])

  React.useLayoutEffect(() => {
    if (open && inputRef.current) {
      setContentWidth(inputRef.current.offsetWidth)
    }
  }, [open])

  const handleFocus = () => {
    if (blurTimeoutRef.current) {
      window.clearTimeout(blurTimeoutRef.current)
      blurTimeoutRef.current = null
    }
    setOpen(true)
  }

  const handleBlur = () => {
    blurTimeoutRef.current = window.setTimeout(() => setOpen(false), 120)
    field.handleBlur()
  }

  return (
    <label className={cn('flex flex-col gap-0', className)}>
      <LabelForm label={label} htmlForVal={htmlForVal} required={required} />
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Anchor asChild>
          <input
            ref={inputRef}
            id={htmlForVal}
            className={cn(
              'input-text w-full',
              hasError
                ? 'border-red-500 ring-2 ring-red-200 focus:ring-red-400'
                : 'border-gray-200 focus:ring-2 focus:ring-leb/40 focus:border-leb',
            )}
            value={value}
            placeholder={placeholder}
            onChange={(e) => {
              field.handleChange(e.target.value)
              if (!open) setOpen(true)
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </Popover.Anchor>
        <Popover.Portal>
          <Popover.Content
            sideOffset={4}
            align="start"
            style={{ width: contentWidth }}
            className="z-50 max-h-56 overflow-auto rounded-md border border-gray-200 bg-white p-1 shadow-lg"
            onOpenAutoFocus={(event) => event.preventDefault()}
            onCloseAutoFocus={(event) => event.preventDefault()}
          >
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">No matches</div>
            ) : (
              filteredOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className="flex w-full items-center rounded px-3 py-2 text-left text-sm hover:bg-gray-100"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    field.handleChange(opt.label)
                    setOpen(false)
                  }}
                >
                  {opt.label}
                </button>
              ))
            )}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      <FieldInfo field={field} />
    </label>
  )
}
