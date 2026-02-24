// Sync and Async Validator
// Async when database is called to verify
export type SyncValidator<T> = (value: T) => boolean
export type AsyncValidator<T> = (value: T) => Promise<boolean>
export type Validator<T> = SyncValidator<T> | AsyncValidator<T>

// ─── Sync Validators (regex & simple checks) ───────────────────────────────

// Regex Validator Factory (Factory Design)
// Used by specific vaidators to create regexp check function
export const matchesRegex =
  (regex: RegExp): SyncValidator<string> =>
  (value) =>
    regex.test(value)

// full RFC‑style email regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i

export const isEmailAddress = matchesRegex(emailRegex)

// ─── Async Validators (API / server checks) ───────────────────────────────

// Used to wrap async function to ensure AsyncValidator type
export const matchesAsync =
  <T>(fn: (value: T) => Promise<boolean>): AsyncValidator<T> =>
  async (value) => {
    console.log('Validating:', value)
    const result = await fn(value)
    return result
  }

export const isEmailAvailable = matchesAsync(async (email) => {
  const res = await fetch(`/api/check-email?email=${email}`)
  const data = await res.json()
  return data.available === true
})
