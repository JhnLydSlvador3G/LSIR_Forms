import { useCallback } from 'react'
import type { ZodTypeAny } from 'zod'
import type { UseStepperReturn } from './useStepper'
import {
  applyIssuesToFields,
  clearFieldIssues,
  filterIssuesForStep,
  getFirstInvalidStep,
  getFormIssues,
  getInvalidFieldNames,
  getStepIssues,
  type StepIssue,
  touchFields,
} from '@/lib/multistepValidation'

type ActiveFieldsGetter<TValues> = (args: {
  stepIndex: number
  values: TValues
  fields: ReadonlyArray<string>
}) => ReadonlyArray<string>

export function useMultistepValidation<TValues>({
  form,
  stepper,
  schema,
  getExtraIssues,
  getActiveFields,
}: {
  form: any
  stepper: UseStepperReturn
  schema: ZodTypeAny
  getExtraIssues?: (stepIndex: number, values: TValues) => Array<StepIssue>
  getActiveFields?: ActiveFieldsGetter<TValues>
}) {
  // Keep form-level toast state in sync with the latest validation attempt.
  const clearSubmitError = useCallback(() => {
    ;(form as any).setErrorMap?.({ onSubmit: undefined })
  }, [form])

  // Some steps expose conditional fields, so callers can trim the active field set here.
  const getCurrentStepFields = useCallback(() => {
    const baseFields = stepper.currentConfig.fields

    return getActiveFields
      ? [...getActiveFields({
          stepIndex: stepper.currentStep,
          values: form.state.values,
          fields: baseFields,
        })]
      : [...baseFields]
  }, [form.state.values, getActiveFields, stepper.currentConfig.fields, stepper.currentStep])

  const validateCurrentStep = useCallback(async () => {
    clearSubmitError()

    // Match prog-info behavior: only the active step is validated on Next.
    const activeFields = getCurrentStepFields()
    clearFieldIssues(form, activeFields)

    const issues = getStepIssues({
      schema,
      values: form.state.values,
      steps: stepper.steps,
      stepIndex: stepper.currentStep,
      getExtraIssues,
    })
    const activeIssues = filterIssuesForStep(issues, activeFields)

    if (activeIssues.length === 0) {
      return true
    }

    const invalidFields = getInvalidFieldNames(activeIssues)
    touchFields(form, invalidFields)
    applyIssuesToFields(form, activeIssues)
    await Promise.all(
      invalidFields.map((field) => form.validateField(field as never, 'change')),
    )

    ;(form as any).setErrorMap?.({
      onSubmit:
        activeIssues[0]?.message || 'Please complete the required field.',
    })

    return false
  }, [
    clearSubmitError,
    form,
    getCurrentStepFields,
    getExtraIssues,
    schema,
    stepper.currentStep,
    stepper.steps,
  ])

  const validateBeforeSubmit = useCallback(async () => {
    clearSubmitError()

    // Final submit validates the whole form, then redirects to the first failing step.
    const allFields = stepper.steps.flatMap((step) => step.fields)
    clearFieldIssues(form, allFields)

    const issues = getFormIssues({
      schema,
      values: form.state.values,
      steps: stepper.steps,
      getExtraIssues,
    })

    if (issues.length === 0) {
      return { ok: true as const, issues: [] as Array<StepIssue> }
    }

    const failingStepIndex = getFirstInvalidStep({
      steps: stepper.steps,
      issues,
    })

    if (failingStepIndex !== -1) {
      stepper.goTo(failingStepIndex)
    }

    const invalidFields = getInvalidFieldNames(issues)
    touchFields(form, invalidFields)
    applyIssuesToFields(form, issues)
    await Promise.all(
      invalidFields.map((field) => form.validateField(field as never, 'change')),
    )

    ;(form as any).setErrorMap?.({
      onSubmit: issues[0]?.message || 'Please complete the required field.',
    })

    return { ok: false as const, issues }
  }, [clearSubmitError, form, getExtraIssues, schema, stepper])

  return {
    clearSubmitError,
    validateCurrentStep,
    validateBeforeSubmit,
  }
}
