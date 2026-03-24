import * as Popover from '@radix-ui/react-popover'
import { CheckIcon, ChevronDownIcon } from 'lucide-react'
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
  disabled?: boolean
  required?: boolean
  placeholder?: string
  searchPlaceholder?: string
  allowCustomInput?: boolean
}

export function ComboboxField({
  label,
  options,
  htmlForVal,
  className,
  disabled = false,
  required = false,
  placeholder = 'Select value',
  searchPlaceholder = 'Search...',
  allowCustomInput = true,
}: ComboboxFieldProps) {
  const field = useFieldContext<string>()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [contentWidth, setContentWidth] = React.useState<number | undefined>()
  const anchorRef = React.useRef<HTMLDivElement | HTMLButtonElement | null>(null)
  const triggerRef = React.useRef<HTMLButtonElement | null>(null)
  const searchInputRef = React.useRef<HTMLInputElement | null>(null)

  const hasError = field.state.meta.isTouched && !field.state.meta.isValid
  const value = field.state.value ?? ''
  const selectedOption = options.find((opt) => opt.value === value)
  const displayValue = selectedOption?.label ?? value

  const filteredOptions = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) {
      return options
    }
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(normalizedQuery),
    )
  }, [options, query])

  React.useLayoutEffect(() => {
    if (open && anchorRef.current) {
      setContentWidth(anchorRef.current.offsetWidth)
    }
  }, [open])

  React.useEffect(() => {
    if (open) {
      setQuery('')
      window.setTimeout(() => {
        searchInputRef.current?.focus()
      }, 0)
    }
  }, [open])

  const handleSelect = (nextValue: string) => {
    field.handleChange(nextValue)
    field.handleBlur()
    setOpen(false)
    setQuery('')
  }

  return (
    <div className={cn('flex min-w-0 grow flex-col gap-0', className)}>
      <LabelForm label={label} htmlForVal={htmlForVal} required={required} />
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Anchor asChild>
          {allowCustomInput ? (
            <div ref={anchorRef as React.RefObject<HTMLDivElement>} className="relative">
              <input
                ref={searchInputRef}
                id={htmlForVal}
                className={cn(
                  'input-text w-full pr-10',
                  disabled && 'cursor-not-allowed bg-gray-200 text-gray-400',
                  hasError
                    ? 'border-red-500 ring-2 ring-red-200 focus:ring-red-400'
                    : 'border-gray-200 focus:ring-2 focus:ring-leb/40 focus:border-leb',
                )}
                value={value}
                placeholder={placeholder}
                disabled={disabled}
                onChange={(e) => {
                  field.handleChange(e.target.value)
                  if (!open) setOpen(true)
                  setQuery(e.target.value)
                }}
                onFocus={() => {
                  setOpen(true)
                  setQuery(value)
                }}
                onBlur={() => field.handleBlur()}
              />
              <button
                ref={triggerRef}
                type="button"
                tabIndex={-1}
                disabled={disabled}
                aria-label={`Toggle ${label} options`}
                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-leb"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  if (!disabled) {
                    setOpen((current) => !current)
                    setQuery(value)
                  }
                }}
              >
                <ChevronDownIcon className="size-4 shrink-0" />
              </button>
            </div>
          ) : (
            <button
              ref={(node) => {
                triggerRef.current = node
                anchorRef.current = node
              }}
              type="button"
              id={htmlForVal}
              disabled={disabled}
              aria-label={label}
              aria-expanded={open}
              className={cn(
                'input-text flex items-center justify-between gap-3 text-left',
                disabled && 'cursor-not-allowed bg-gray-200 text-gray-400',
                !displayValue && 'text-gray-400',
                hasError
                  ? 'border-red-500 ring-2 ring-red-200 focus:ring-red-400'
                  : 'border-gray-200 focus:ring-2 focus:ring-leb/40 focus:border-leb',
              )}
              onClick={() => {
                if (!disabled) {
                  setOpen((current) => !current)
                }
              }}
              onBlur={() => field.handleBlur()}
            >
              <span className="truncate">{displayValue || placeholder}</span>
              <ChevronDownIcon className="size-4 shrink-0 text-leb" />
            </button>
          )}
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
            {!allowCustomInput ? (
              <input
                ref={searchInputRef}
                className="input-text mb-1"
                value={query}
                placeholder={searchPlaceholder}
                onChange={(e) => setQuery(e.target.value)}
              />
            ) : null}
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">No matches</div>
            ) : (
              filteredOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={cn(
                    'flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm hover:bg-gray-100',
                    value === opt.value && 'bg-lebThird text-leb',
                  )}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(opt.value)}
                >
                  <span>{opt.label}</span>
                  {value === opt.value ? (
                    <CheckIcon className="size-4 shrink-0" />
                  ) : null}
                </button>
              ))
            )}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      <FieldInfo field={field} />
    </div>
  )
}
