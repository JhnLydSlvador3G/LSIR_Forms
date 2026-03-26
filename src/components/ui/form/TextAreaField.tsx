import FieldInfo from './FieldInfo'
import LabelForm from './LabelForm'
import { useFieldContext } from '@/hooks/useFormContext'
import { cn } from '@/lib/utils'

type TextAreaFieldProps = {
  label: string
  htmlForVal: string
  className?: string
  required?: boolean
  rows?: number // optional: allow customizing the number of rows
}

export function TextAreaField({
  label,
  htmlForVal,
  className,
  required = false,
  rows = 4, // default rows
}: TextAreaFieldProps) {
  const field = useFieldContext<string>()

  const hasError = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <label className={cn('flex flex-col grow', className)}>
      <LabelForm label={label} htmlForVal={htmlForVal} required={required} />

      <textarea
        id={htmlForVal}
        rows={rows}
        className={cn(
          'input-text w-full resize-none', // added resize-none to prevent manual resizing
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
