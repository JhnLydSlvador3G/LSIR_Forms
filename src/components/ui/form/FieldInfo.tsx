import type { AnyFieldApi } from '@tanstack/react-form'

type FieldInfoProps = {
  field: AnyFieldApi
  firstOnly?: boolean
}

export default function FieldInfo({ field, firstOnly = true }: FieldInfoProps) {
  const firstError = field.state.meta.errors[0]
  const firstMessage =
    typeof firstError === 'string'
      ? firstError
      : firstError && typeof firstError === 'object' && 'message' in firstError
        ? String(firstError.message)
        : ''

  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em className="text-red-400">
          {firstOnly
            ? firstMessage
            : field.state.meta.errors.map((error, i) => (
              <div key={i} className="error">
                {typeof error === 'string'
                  ? error
                  : error && typeof error === 'object' && 'message' in error
                    ? String(error.message)
                    : String(error)}
              </div>
            ))}
        </em>
      ) : null}
      {field.state.meta.isValidating ? 'Validating...' : null}
    </>
  )
}
