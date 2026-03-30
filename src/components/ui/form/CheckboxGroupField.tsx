import FieldInfo from './FieldInfo'
import LabelForm from './LabelForm'
import { useFieldContext } from '@/hooks/form-context'
import { cn } from '@/lib/utils'

type CheckboxGroupFieldProps = {
  htmlForVal: string
  options: Array<{ value: string; label: string }>
  label?: string
  disabled?: boolean
  required?: boolean
  orientation?: 'horizontal' | 'vertical'
}

export function CheckboxGroupField({
  htmlForVal,
  options,
  label,
  disabled = false,
  required = false,
  orientation = 'vertical',
}: CheckboxGroupFieldProps) {
  const field = useFieldContext<Array<string>>()
  const hasError = field.state.meta.isTouched && !field.state.meta.isValid

  const selected = Array.isArray(field.state.value) ? field.state.value : []

  const toggleValue = (value: string) => {
    const next = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value]
    field.handleChange(next)
  }

  return (
    <div className="flex flex-col gap-2">
      {label ? (
        <LabelForm label={label} htmlForVal={htmlForVal} required={required} />
      ) : null}

      <div
        className={cn(
          'rounded-md border p-3',
          orientation === 'horizontal'
            ? 'flex flex-row flex-wrap items-center gap-6'
            : 'flex flex-col gap-2',
          disabled && 'bg-gray-100 text-gray-400',
          hasError ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200',
        )}
      >
        {options.map((opt) => {
          const checked = selected.includes(opt.value)
          return (
            <label
              key={opt.value}
              className={cn(
                'flex items-center gap-3 text-sm',
                disabled && 'cursor-not-allowed',
              )}
            >
              <input
                id={`${htmlForVal}-${opt.value}`}
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={() => toggleValue(opt.value)}
                className={cn(
                  'h-4 w-4 rounded-[3px] border border-gray-400 bg-white',
                  checked ? 'accent-leb' : '',
                )}
                aria-label={opt.label}
              />
              <span>{opt.label}</span>
            </label>
          )
        })}
      </div>

      <FieldInfo field={field} />
    </div>
  )
}
