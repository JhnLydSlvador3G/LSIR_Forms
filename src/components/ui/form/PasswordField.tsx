import { unstable_PasswordToggleField as PasswordToggleField } from 'radix-ui'
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons'
import FieldInfo from './FieldInfo'
import { useFieldContext } from '@/hooks/useFormContext'
import { cn } from '@/lib/utils'

export function PasswordField({ label }: { label: string }) {
  const field = useFieldContext<string>()
  const hasError = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <label className="block w-full">
      <span className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
      </span>
      <PasswordToggleField.Root className="w-full">
        <div
          className={cn(
            'w-full flex items-center gap-2',
            'border rounded-md bg-white',
            'px-3 py-2',
            'focus-within:ring-2 focus-within:ring-leb focus-within:border-leb',
            'transition-colors duration-150',
            hasError
              ? 'border-red-500 ring-2 ring-red-200 focus-within:ring-red-400'
              : 'border-gray-300',
          )}
        >
          <PasswordToggleField.Input
            className="flex-1 min-w-0 bg-transparent text-gray-900 outline-none border-none"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            autoCapitalize="none"
          />
          <PasswordToggleField.Toggle
            className="shrink-0 flex items-center justify-center text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <PasswordToggleField.Icon
              visible={<EyeOpenIcon className="w-4 h-4" />}
              hidden={<EyeClosedIcon className="w-4 h-4" />}
            />
          </PasswordToggleField.Toggle>
        </div>
      </PasswordToggleField.Root>
      <FieldInfo field={field} />
    </label>
  )
}
