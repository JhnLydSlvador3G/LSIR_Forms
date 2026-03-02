import FieldInfo from './FieldInfo'
import LabelForm from './LabelForm'
import { useFieldContext } from '@/hooks/form-context'
import { cn } from '@/lib/utils'

type TextFieldProps = {
  label: string
  htmlForVal: string
  className?: string
  required?: boolean
}

export function DateField({
  label,
  htmlForVal,
  className,
  required = false,
}: TextFieldProps) {
  const field = useFieldContext<string>()

  const hasError = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <label className={cn('flex flex-col grow', className)}>
      <LabelForm label={label} htmlForVal={htmlForVal} required={required} />

      <input
        type="date"
        id={htmlForVal}
        placeholder="Select a Start Date"
        className={cn(
          'input-text w-full',
          hasError
            ? 'border-red-500 ring-2 ring-red-200 focus:ring-red-400'
            : 'border-gray-200 focus:ring-2 focus:ring-leb/40 focus:border-leb',
        )}
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
      />
      <FieldInfo field={field} />
    </label>
  )
}
