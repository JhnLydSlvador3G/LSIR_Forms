import type z from 'zod'

export function saveFormToLocal<T>({
  key,
  value,
  schema,
}: {
  key: string
  value: unknown
  schema?: z.ZodType<T>
}) {
  if (typeof window === 'undefined') return false

  try {
    const result = schema?.safeParse(value)

    if (result && !result.success) {
      console.error('Validation failed before saving:', result.error.issues)
      return false
    }

    const validatedData = result?.success ? result.data : value

    return localStorage.setItem(key, JSON.stringify(validatedData))
  } catch (e) {
    console.error('Form persistence error:', e)
    return false
  }
}

export function loadFormFromLocal<T>({
  key,
  fallback,
  schema,
}: {
  key: string
  fallback: T
  schema?: z.ZodType<T>
}): T {
  // never attempt to read localStorage on the server; the caller should
  // initialise to the fallback value and then update on the client.
  if (typeof window === 'undefined') {
    return fallback
  }

  try {
    const raw = localStorage.getItem(key)

    if (!raw) return fallback

    const parsed = JSON.parse(raw)

    if (schema) {
      const result = schema.safeParse(parsed)
      return result.success ? result.data : fallback
    }

    return parsed
  } catch {
    return fallback
  }
}
