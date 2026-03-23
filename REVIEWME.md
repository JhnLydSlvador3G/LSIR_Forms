# REVIEWME — Dev Notes & Concepts

A running log of important concepts, decisions, and gotchas encountered during development.

---

## Auth & Database Bypass (No DB Mode)

When `DATABASE_URL` is not available, the app uses a dev bypass controlled by env vars:

```
VITE_AUTH_BYPASS=true
VITE_DEV_LOGIN_USER=admin
VITE_DEV_LOGIN_PASS=admin12345
```

### Files affected:
- `src/db/index.ts` — wraps `drizzle()` so it only runs when `DATABASE_URL` is set, exports nullable `db`
- `src/lib/auth.ts` — skips `drizzleAdapter` when `db` is null, runs Better Auth in stateless mode
- `src/lib/auth.server.ts` — `getSession()` returns a fake session object when bypass is enabled
- `src/components/login/LoginForm.tsx` — checks env credentials before calling `authClient.signIn`

---

## Project Structure

### Route Layout
```
src/routes/
  __root.tsx              ← root layout, mounts all devtools
  index.tsx               ← public index
  _auth/login.index.tsx   ← login page (unauthenticated)
  _protected.tsx          ← auth guard (redirects to /login if no session)
  _protected/
    dashboard.tsx
    _form/
      heiinfo.tsx
      programinfo.tsx
      facultyroster.tsx
      facultyprofile.tsx
      facultydevelopment.tsx
      studentprofile.tsx
```

### Form Component Layout
Each form section follows this pattern:
```
components/form/<formname>/
  <Form>.tsx                ← owns form state via useAppForm(), mounts sections
  <Form>.types.ts           ← Zod schema, types, defaultValues
  <FormSection>.tsx         ← section fields only, uses withForm()
  <Form>SectionWrapper.tsx  ← left/right two-column layout for that form
```

---

## useAppForm vs withForm

- `useAppForm()` — used **once** in the main form file. Creates and owns the form state.
- `withForm()` — used in **every section file**. Receives the form as a prop, never creates its own. The `defaultValues` passed to `withForm` is only for TypeScript type inference, not for creating state.

---

## /components/ui/form — Field Components

All field components use **context** to get their value — they don't receive `value` or `onChange` as props.

### Two hooks:
- `useFieldContext<T>()` — used inside field components (TextField, SelectField, etc.) to read `field.state.value`, `field.handleChange`, `field.handleBlur`, and `field.state.meta`
- `useFormContext()` — used inside form-level components (SubscribeButton, FormErrorMessage, ResetButton) to access the whole form state

### Field Meta Properties (`field.state.meta`)
These are called **meta flags** — data about the field's interaction state, not the value itself:
- `isTouched` — set to `true` when `field.handleBlur()` is called
- `isValid` — whether the current value passes validation
- `isDirty` — whether the value has changed from defaultValues
- `isValidating` — async validation in progress
- `errors` — array of `{ message: string }` from Zod

### FieldInfo.tsx
Located at `src/components/ui/form/FieldInfo.tsx`. The only file that reads `isTouched`. Shows the red error message under a field when `isTouched && !isValid`.

### Available Components:
| Component | Description |
|---|---|
| `TextField` | Standard text input with label and error |
| `PasswordField` | Text input with show/hide toggle (Radix PasswordToggleField) |
| `NumberField` | Compact number input, no label, fixed small width |
| `LabeledNumberField` | Number input with label |
| `DateField` | Date input (`type="date"`) |
| `TextAreaField` | Multi-line text, accepts `rows` prop |
| `SelectField` | Dropdown using Radix Select, requires `options: {value, label}[]` |
| `SubscribeButton` | Submit button, disables + shows spinner while submitting |
| `SaveButton` | Saves form to localStorage, never submits the form |
| `ResetButton` | Resets form to defaultValues with AlertDialog confirmation, clears localStorage |
| `FormErrorMessage` | Shows form-level submit error from `formApi.setErrorMap({ onSubmit: ... })` |
| `LabelForm` | Styled label using Radix Label primitive, shows red `*` if required |

---

## FormWrapper vs SectionWrapper

- `FormWrapper` (`src/components/form/FormWrapper.tsx`) — the outer page card with purple header and white body. Used **once per page**.
- `SectionWrapper` — the two-column row layout (title left, content right, bottom border). Used **multiple times per page**, once per section. Each form owns its own copy (e.g. `ProgInfoSectionWrapper.tsx`, `HeiSectionWrapper.tsx`).

```
FormWrapper          ← whole card (once)
  ├── SectionWrapper ← one section row
  ├── SectionWrapper ← another section row
  └── SectionWrapper ← another section row
```

---

## localStorage Persistence

### Saving
`SaveButton` calls `saveFormToLocal({ key, getValue() })` on click. No schema is passed so it always saves regardless of validation state.

### Loading
Each form has a `useEffect` that loads from localStorage on mount and calls `form.reset(prev)`:

```ts
useEffect(() => {
  const prev = loadFormFromLocal({ key: 'formkey', fallback: defaultValues })
  if (prev) form.reset(prev)
}, [form.store])
```

- `[form.store]` is used as the dependency — `form.store` is a stable reference unlike `form` itself
- The effect runs once after mount and restores saved values

---

## Radix UI Select — Known Gotchas

### 1. Placeholder not showing for empty string
Radix `Select.Root` with `value=""` does not show the placeholder — it shows a blank trigger. Fix: pass `undefined` instead of `''` for empty values:
```tsx
value={field.state.value || undefined}
```

### 2. handleBlur never fires natively
Radix Select does not fire a native blur event, so `field.handleBlur()` must be called manually:
- On selection → inside `onValueChange`
- On close without selecting → inside `onOpenChange` when `open === false`

```tsx
onValueChange={(val) => {
  field.handleChange(val)
  field.handleBlur()
}}
onOpenChange={(open) => {
  if (!open) field.handleBlur()
}}
```

### 3. Do NOT use key={field.state.value} on Select.Root
Using `key` tied to the value causes React to remount the component on every selection, which wipes `isTouched`/`isValid` meta state and breaks validation display.

---

## Adding a New Page — Checklist

1. `src/components/form/<name>/<Name>.tsx` — main form component
2. `src/components/form/<name>/<Name>.types.ts` — Zod schema + defaultValues
3. `src/components/form/<name>/<Name>SectionWrapper.tsx` — section layout wrapper
4. `src/components/form/<name>/<NameSection>.tsx` — one file per section
5. `src/routes/_protected/_form/<name>.tsx` — route file using `createFileRoute`
6. `src/components/navigation/NavBar.constant.ts` — add nav entry

---

## TypeScript Notes

### Better Auth client type gap
`authClient.signIn.username` shows a red underline because `createAuthClient()` doesn't automatically infer the `username` plugin. Suppressed with `@ts-expect-error`.

### onSubmit error shape
`formApi.setErrorMap({ onSubmit: 'string' })` causes a TS error — the type expects a specific shape. Cast with `as never` to suppress:
```ts
formApi.setErrorMap({ onSubmit: 'message' as never })
```

---

## Database Planning vs Current Schema

`src/db/schema.ts` currently only has Better Auth tables (`user`, `session`, `account`, `verification`).

The full LSIR domain schema (15+ tables) is planned in `db_planning/LSIR.dbml` but not yet migrated into Drizzle.

---

## Wizard / Multi-step Form (programinfo)

### Concept
A wizard shows one section at a time with Prev/Next navigation. The last step has a Submit button instead of Next.

### The Schema Problem
A single strict schema validating all fields at once blocks navigation — fields on future steps are empty and fail validation. Solution is two schemas in the same `ProgInfo.types.ts` file:

- `ProgInfoSchema` — strict, all fields required, used only on final Submit via `safeParse`
- `ProgInfoDraftSchema` — lenient, derived via `ProgInfoSchema.partial()`, used on `onChange` so nothing blocks mid-form

```ts
export const ProgInfoSchema = z.object({ ... })            // strict
export const ProgInfoDraftSchema = ProgInfoSchema.partial() // lenient
```

### Per-step Validation
`STEP_FIELDS` maps each step index to its field names. On Next, only those fields are validated:

```ts
export const STEP_FIELDS = [
  ['programType', 'permitNumber'],  // Step 0
  ['startMonth', 'endMonth'],       // Step 1
  ['curricularSchedule'],           // Step 2
  ['programDuration'],              // Step 3
] as const
```

### Wizard State
`currentStep` is a `useState` in the main form component. `STEPS` array maps index to section component so `STEPS[currentStep]` renders the correct one dynamically.

### onChange Type Mismatch
`ProgInfoDraftSchema.partial()` produces `Month | undefined` but `ProgInfoFormData` has `Month | ''` — TypeScript rejects this on the `onChange` validator. Fix: cast with `as any`:
```ts
onChange: ProgInfoDraftSchema as any,
```

---

## Checkbox Patterns

### Mutually Exclusive (only one can be checked)
Use a single `enum` field. Checking one automatically unchecks the other. Use `undefined` for neither checked:
```ts
programType: 'extension' | 'branch' | undefined
```
Toggle logic: `value === 'extension' ? undefined : 'extension'`

### Independent (multiple can be checked)
Use separate `boolean` fields per checkbox:
```ts
isOnline: boolean
isHybrid: boolean
```
Toggle logic: `form.setFieldValue('isOnline', !isOnline)`

---

## Zod Schema Patterns

### `.partial()` — make all fields optional
```ts
const DraftSchema = StrictSchema.partial()
```

### `.merge()` — combine two schemas
```ts
const FullSchema = SchemaA.merge(SchemaB)
```

### `safeParse` — validate without throwing
```ts
const result = Schema.safeParse(value)
if (!result.success) {
  console.warn(result.error.issues)
  return
}
console.log(result.data)
```

---

## Array Methods Used in React/Forms

| Method | Use |
|---|---|
| `.map()` | Render a list of JSX elements |
| `.filter()` | Remove items before rendering |
| `.filter().map()` | Chain — filter then render |
| `.flatMap()` | Map + flatten one level |
| `.some()` | Check if at least one item matches (used in conditionals) |
| `.every()` | Check if all items match |
| `.reduce()` | Compute totals or group data |

### TanStack Form Field Array Methods
- `form.pushFieldValue('field', newItem)` — add item
- `form.removeFieldValue('field', index)` — remove at index
- `form.getFieldValue('field')` — get current array

### Other Data Structures in React
- `Object.entries()` / `Object.keys()` / `Object.values()` — iterate over objects for rendering
- `Record<string, T>` — typed object, used for field mappings
- `useState` returns a **tuple** — `[value, setter]`
- `Set` — no duplicates, used for logic not rendering
- `Map` — key-value pairs where keys can be any type
