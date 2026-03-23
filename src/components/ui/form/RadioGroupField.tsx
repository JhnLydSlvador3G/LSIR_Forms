import { RadioGroup } from 'radix-ui'
import FieldInfo from './FieldInfo'
import { useFieldContext } from '@/hooks/form-context'
import { cn } from '@/lib/utils'

// A reusable radio-group field for TanStack React Form.
// Why this exists:
// - Our `createFormHook` setup in `src/hooks/form-context.ts` exposes field components as:
//   `(field) => <field.TextField ... />`.
// - The Law School form needs a "pick one" control for Highest Degree, so we add a RadioGroupField.
// - This component binds to the current field via `useFieldContext<string>()`.
type RadioGroupFieldProps = {
  htmlForVal: string
  options: Array<{ value: string; label: string }>
  label?: string
  disabled?: boolean
  required?: boolean
  orientation?: 'horizontal' | 'vertical'
}

export function RadioGroupField({
  htmlForVal,
  options,
  label,
  disabled = false,
  required = false,
  orientation = 'vertical',
}: RadioGroupFieldProps) {
  // Reads the current field state + handlers from TanStack React Form.
  // The field name/path is provided by the parent `<form.AppField name="...">`.
  const field = useFieldContext<string>()
  // Only show error styles after the user has interacted with the field.
  const hasError = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <fieldset className="flex flex-col gap-2">
      {/* Use legend instead of label+htmlFor (radio group has multiple inputs). */}
      {label ? (
        <legend
          id={`${htmlForVal}-legend`}
          className="text-[15px] font-medium leading-8.75 text-black whitespace-nowrap"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </legend>
      ) : null}

      {/* Radix RadioGroup: value is controlled by the form field */}
      <RadioGroup.Root
        value={field.state.value}
        onValueChange={field.handleChange}
        disabled={disabled}
        aria-labelledby={label ? `${htmlForVal}-legend` : undefined}
        className={cn(
          'rounded-md border p-3',
          orientation === 'horizontal'
            ? 'flex flex-row flex-wrap items-center gap-6'
            : 'flex flex-col gap-2',
          disabled && 'bg-gray-100 text-gray-400',
          hasError ? 'border-red-500 ring-2 ring-red-200' : 'border-gray-200',
        )}
      >
        {/* Render each option as a labeled row */}
        {options.map((opt) => (
          <label
            key={opt.value}
            className={cn(
              'flex items-center gap-3 text-sm',
              disabled && 'cursor-not-allowed',
            )}
          >
            {/* The actual radio input */}
            <RadioGroup.Item
              value={opt.value}
              className={cn(
                'h-4 w-4 rounded-[3px] border border-gray-400 bg-white',
                'data-[state=checked]:border-leb data-[state=checked]:bg-leb',
              )}
              aria-label={opt.label}
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </RadioGroup.Root>

      {/* Standard error/help text used across all fields */}
      <FieldInfo field={field} />
    </fieldset>
  )
}
