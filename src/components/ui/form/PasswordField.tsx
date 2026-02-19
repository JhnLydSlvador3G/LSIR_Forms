import { unstable_PasswordToggleField as PasswordToggleField } from 'radix-ui'
import { EyeClosedIcon, EyeOpenIcon } from '@radix-ui/react-icons'
import FieldInfo from './FieldInfo'
import { useFieldContext } from '@/hooks/form-context'

export function PasswordField({ label }: { label: string }) {
  const field = useFieldContext<string>()
  return (
    <label className="block w-full">
      <span className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
      </span>
      <PasswordToggleField.Root>
        <div
          className="
        w-full flex items-center gap-2
        border border-gray-300 rounded-md bg-white
        px-3 py-2
        focus-within:ring-2 focus-within:ring-leb
        focus-within:border-leb
        transition-colors duration-150
      "
        >
          <PasswordToggleField.Input
            className="
          flex-1 bg-transparent text-gray-900
          outline-none border-none"
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
          />

          <PasswordToggleField.Toggle
            className="
          flex items-center justify-center
          text-gray-500 hover:text-gray-700
          focus:outline-none
        "
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
