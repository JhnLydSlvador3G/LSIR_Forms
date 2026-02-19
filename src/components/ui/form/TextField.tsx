import FieldInfo from './FieldInfo'
import { useFieldContext } from '@/hooks/form-context'

export function TextField({ label }: { label: string }) {
  const field = useFieldContext<string>()
  return (
    <label className="block w-full">
      <span className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
      </span>

      <input
        className="input-text"
        value={field.state.value}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      <FieldInfo field={field} />
    </label>
  )
}
