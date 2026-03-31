import type { StepConfig } from '@/hooks/useStepper'
import type { ZodTypeAny } from 'zod'

export type StepIssue = {
  path: Array<string | number>
  message: string
}

export const issuePathToFieldName = (path: Array<string | number>) =>
  path.reduce<string>((acc, segment) => {
    if (typeof segment === 'number') {
      return `${acc}[${segment}]`
    }

    return acc ? `${acc}.${segment}` : segment
  }, '')

export const getSchemaIssues = (
  schema: ZodTypeAny,
  values: unknown,
): Array<StepIssue> => {
  const result = schema.safeParse(values)

  if (result.success) return []

  return result.error.issues.map((issue) => ({
    path: issue.path.filter(
      (segment): segment is string | number =>
        typeof segment === 'string' || typeof segment === 'number',
    ),
    message: issue.message,
  }))
}

export const getStepFields = (steps: Array<StepConfig>, stepIndex: number) =>
  steps[stepIndex]?.fields ?? []

export const filterIssuesForStep = (
  issues: Array<StepIssue>,
  stepFields: ReadonlyArray<string>,
) =>
  issues.filter((issue) => {
    const topLevelField = String(issue.path[0] ?? '')
    const fullPath = issuePathToFieldName(issue.path)

    return stepFields.includes(topLevelField) || stepFields.includes(fullPath)
  })

export const getStepIssues = <TValues>({
  schema,
  values,
  steps,
  stepIndex,
  getExtraIssues,
}: {
  schema: ZodTypeAny
  values: TValues
  steps: Array<StepConfig>
  stepIndex: number
  getExtraIssues?: (stepIndex: number, values: TValues) => Array<StepIssue>
}) => {
  const stepFields = getStepFields(steps, stepIndex)
  const schemaIssues = filterIssuesForStep(
    getSchemaIssues(schema, values),
    stepFields,
  )
  const extraIssues = getExtraIssues?.(stepIndex, values) ?? []

  return [...schemaIssues, ...extraIssues]
}

export const getFormIssues = <TValues>({
  schema,
  values,
  steps,
  getExtraIssues,
}: {
  schema: ZodTypeAny
  values: TValues
  steps: Array<StepConfig>
  getExtraIssues?: (stepIndex: number, values: TValues) => Array<StepIssue>
}) => {
  const extraIssues = steps.flatMap(
    (_, stepIndex) => getExtraIssues?.(stepIndex, values) ?? [],
  )
  const allIssues = [...getSchemaIssues(schema, values), ...extraIssues]
  const seen = new Set<string>()

  // De-duplicate custom step issues against schema issues before applying them to fields.
  return allIssues.filter((issue) => {
    const key = `${issuePathToFieldName(issue.path)}::${issue.message}`

    if (seen.has(key)) return false

    seen.add(key)
    return true
  })
}

export const getInvalidFieldNames = (issues: Array<StepIssue>) =>
  Array.from(
    new Set(
      issues
        .map((issue) => issuePathToFieldName(issue.path))
        .filter((fieldName) => fieldName.length > 0),
    ),
  )

export const touchFields = (
  form: {
    setFieldMeta: (
      field: never,
      updater: (
        prev: Record<string, unknown> | undefined,
      ) => Record<string, unknown>,
    ) => void
  },
  fieldNames: ReadonlyArray<string>,
) => {
  fieldNames.forEach((fieldName) => {
    form.setFieldMeta(fieldName as never, (prev) => ({
      ...(prev ?? {}),
      isTouched: true,
    }))
  })
}

export const clearFieldIssues = (
  form: {
    setFieldMeta: (
      field: never,
      updater: (
        prev: Record<string, unknown> | undefined,
      ) => Record<string, unknown>,
    ) => void
  },
  fieldNames: ReadonlyArray<string>,
) => {
  fieldNames.forEach((fieldName) => {
    form.setFieldMeta(fieldName as never, (prev) => ({
      ...(prev ?? {}),
      isValid: true,
      errors: [],
      errorMap: {
        ...(((prev ?? {}).errorMap as Record<string, unknown> | undefined) ?? {}),
        onSubmit: undefined,
      },
    }))
  })
}

export const applyIssuesToFields = (
  form: {
    setFieldMeta: (
      field: never,
      updater: (
        prev: Record<string, unknown> | undefined,
      ) => Record<string, unknown>,
    ) => void
  },
  issues: Array<StepIssue>,
) => {
  const issuesByField = new Map<string, Array<{ message: string }>>()

  issues.forEach((issue) => {
    const fieldName = issuePathToFieldName(issue.path)
    if (!fieldName) return

    // Preserve multiple messages when a field can fail both schema and custom step checks.
    const existing = issuesByField.get(fieldName) ?? []
    existing.push({ message: issue.message })
    issuesByField.set(fieldName, existing)
  })

  issuesByField.forEach((fieldErrors, fieldName) => {
    form.setFieldMeta(fieldName as never, (prev) => ({
      ...(prev ?? {}),
      isTouched: true,
      isValid: false,
      errors: fieldErrors,
      errorMap: {
        ...(((prev ?? {}).errorMap as Record<string, unknown> | undefined) ?? {}),
        onSubmit: fieldErrors,
      },
    }))
  })
}

export const getFirstInvalidStep = ({
  steps,
  issues,
}: {
  steps: Array<StepConfig>
  issues: Array<StepIssue>
}) =>
  steps.findIndex((step) =>
    issues.some((issue) => {
      const topLevelField = String(issue.path[0] ?? '')
      const fullPath = issuePathToFieldName(issue.path)

      return (
        step.fields.includes(topLevelField) ||
        step.fields.includes(fullPath)
      )
    }),
  )
