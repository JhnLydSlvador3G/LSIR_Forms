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

export function TextField({
  label,
  htmlForVal,
  className,
  required = false,
}: TextFieldProps) {
  const field = useFieldContext<string>()

  return (
    <label className={cn('flex flex-col grow', className)}>
      <LabelForm label={label} htmlForVal={htmlForVal} required={required} />

      <input
        id={htmlForVal}
        className="input-text w-full"
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
      />
      <FieldInfo field={field} />
    </label>
  )
}
