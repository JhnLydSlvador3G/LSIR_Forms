import type { AnyFieldApi } from '@tanstack/react-form'

type FieldInfoProps = {
  field: AnyFieldApi
  firstOnly?: boolean
}

export default function FieldInfo({ field, firstOnly = true }: FieldInfoProps) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em className="text-red-400">
          {firstOnly
            ? field.state.meta.errors[0].message
            : field.state.meta.errors.map((error, i) => (
              <div key={i} className="error">
                {error}
              </div>
            ))}
        </em>
      ) : null}
      {field.state.meta.isValidating ? 'Validating...' : null}
    </>
  )
}
