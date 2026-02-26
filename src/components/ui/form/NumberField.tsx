import { useFieldContext } from '@/hooks/form-context'
import { cn } from '@/lib/utils'

type TextFieldProps = {
    htmlForVal: string
    className?: string
}

export function NumberField({
    htmlForVal,
    className,
}: TextFieldProps) {
    const field = useFieldContext<string>()

    const hasError =
        field.state.meta.isTouched &&
        !field.state.meta.isValid

    return (
        <input
            id={htmlForVal}
            aria-label={htmlForVal}
            aria-invalid={hasError}
            aria-describedby={
                hasError ? `${htmlForVal}-error` : undefined
            }
            className={cn(
                'w-20 34234 shrink-0 min-w-0 px-3 py-2 text-sm text-center rounded-lg shadow-sm border transition-all duration-200 focus:outline-none overflow-hid',
                hasError
                    ? 'border-red-500 ring-2 ring-red-200 focus:ring-red-400'
                    : 'border-gray-200 focus:ring-2 focus:ring-leb/40 focus:border-leb',
                className
            )}
            value={field.state.value ?? ''}
            onChange={(e) =>
                field.handleChange(e.target.value)
            }
            onBlur={field.handleBlur}
        />
    )
}