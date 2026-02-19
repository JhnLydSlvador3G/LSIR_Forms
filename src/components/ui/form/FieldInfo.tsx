import type { AnyFieldApi } from '@tanstack/react-form'

export default function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em className="text-red-400">
          {field.state.meta.errors.map((err: any) => err.message).join(',')}
        </em>
      ) : null}
      {field.state.meta.isValidating ? 'Validating...' : null}
    </>
  )
}
