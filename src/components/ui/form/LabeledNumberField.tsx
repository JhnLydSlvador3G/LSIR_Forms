import FieldInfo from './FieldInfo'
import LabelForm from './LabelForm'
import { useFieldContext } from '@/hooks/useFormContext'
import { cn } from '@/lib/utils'

type NumberFieldProps = {
  label?: string
  htmlForVal?: string
  className?: string
  required?: boolean
}

export function LabeledNumberField({
  label,
  htmlForVal,
  className,
  required = false,
}: NumberFieldProps) {
  const field = useFieldContext<number | string>()

  const hasError = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <label className={cn('flex flex-col grow', className)}>
      <LabelForm label={label} htmlForVal={htmlForVal} required={required} />

      <input
        id={htmlForVal}
        type="number"
        className={cn(
          'input-text w-full',
          hasError
            ? 'border-red-500 ring-2 ring-red-200 focus:ring-red-400'
            : 'border-gray-200 focus:ring-2 focus:ring-leb/40 focus:border-leb',
        )}
        value={field.state.value ?? ''}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
      />

      <FieldInfo field={field} />
    </label>
  )
}