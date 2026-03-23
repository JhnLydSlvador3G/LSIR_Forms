import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAppForm } from '@/hooks/useFormContext'
import { FormWrapper } from '../FormWrapper'
import { ProgInfoSectionWrapper } from './ProgInfoSectionWrapper'
import {
  progInfoDefaultValues,
  ProgInfoSchema,
  STEP_FIELDS,
  STEP_TITLES,
} from './ProgInfo.types'
import ProgInfoProgOffered from './ProgInfoProgOffered'
import ProgInfoLawProgramClassification from './ProgInfoLawProgramClassification'
import ProgInfoAcadCalendar from './ProgInfoAcadCalendar'
import ProgInfoClassOperatingSchedule from './ProgInfoClassOperatingSchedule'
import ProgInfoCurricularSched from './ProgInfoCurricularSched'
import ProgInfoCurriculum from './ProgInfoCurriculum'
import ProgInfoProgDuration from './ProgInfoProgDuration'
import ResetButton from '@/components/ui/form/ResetButton'
import SaveButton from '@/components/ui/form/SaveButton'
import { appendProgramInfoSubmission } from '@/lib/programInfoSubmissions'

const STEPS = [
  ProgInfoLawProgramClassification,
  ProgInfoProgOffered,
  ProgInfoAcadCalendar,
  ProgInfoCurricularSched,
  ProgInfoProgDuration,
  ProgInfoClassOperatingSchedule,
  ProgInfoCurriculum,
]

const LAST_STEP = STEPS.length - 1

const issuePathToFieldName = (path: Array<string | number>) =>
  path.reduce((acc, segment) => {
    if (typeof segment === 'number') {
      return `${acc}[${segment}]`
    }
    return acc ? `${acc}.${segment}` : segment
  }, '')

export default function ProgramInfo() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [initialValues, setInitialValues] = useState(progInfoDefaultValues)

  const form = useAppForm({
    defaultValues: initialValues,
     validators: {
       onChange: ProgInfoSchema,
     },
    onSubmit: async ({ value }) => {
      appendProgramInfoSubmission(value)
      localStorage.removeItem('programinfo')
      setInitialValues(progInfoDefaultValues)
      setCurrentStep(0)
      navigate({ to: '/programinfo-submissions' })
    },
  })

  // Note: On component mount, we attempt to restore any saved draft from localStorage.
  useEffect(() => {
    const raw = localStorage.getItem('programinfo')
    if (!raw) return
    const parsed = JSON.parse(raw)
    // convert null back to empty string for fields that use ''
    const restored = {
      ...progInfoDefaultValues,
      ...parsed,
      lawProgramClassification: parsed.lawProgramClassification ?? '',
      doctorateProgram: parsed.doctorateProgram ?? '',
      programType: parsed.programType ?? '',
      programDuration: parsed.programDuration ?? '',
      curricula: parsed.curricula ?? progInfoDefaultValues.curricula,
    }
    setInitialValues(restored)
    form.reset(restored)
  }, [form])

  // Note: The handleNext function performs light validation on the current step's fields before allowing progression.
  const handleNext = async () => {
    ;(form as any).setErrorMap?.({ onSubmit: undefined })
    const fields = STEP_FIELDS[currentStep] as readonly string[]
    const currentValues = form.state.values
    const result = ProgInfoSchema.safeParse(currentValues)
    const stepIssues = result.success
      ? []
      : result.error.issues.filter((issue) =>
          fields.includes(String(issue.path[0] || ''))
        )

    if (stepIssues.length === 0) {
      setCurrentStep((s) => s + 1)
      return
    }

    const invalidFields = Array.from(
      new Set(
        stepIssues
          .map((issue) => issuePathToFieldName(issue.path as Array<string | number>))
          .filter(Boolean),
      )
    )

    invalidFields.forEach((field) => form.validateField(field as any, 'change'))
    ;(form as any).setErrorMap?.({
      onSubmit: stepIssues[0]?.message || 'Please complete the required field.',
    })
  }

  /*
  const handleNext = () => { // Remove this after testing
    setCurrentStep((s) => s + 1)
  }
  */
  const handlePrev = () => {
    setCurrentStep((s) => s - 1)
  }

  // Note: Resetting the wizard should also clear any validation errors that may be blocking progress.
  const handleResetWizard = () => {
    setCurrentStep(0) 
    setInitialValues(progInfoDefaultValues)
    ;(form as any).setErrorMap?.({ onSubmit: undefined })
  }

  return (
    <FormWrapper title="Program Information">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 px-8 pt-6">
        {STEP_TITLES.map((title, i) => (
            <div key={title} className="flex items-center gap-2">
            <div className={`flex shrink-0 items-center justify-center w-7 h-7 min-w-7 min-h-7 rounded-full text-xs font-bold leading-none
              ${i === currentStep ? 'bg-leb text-white' : i < currentStep ? 'bg-leb/40 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {i + 1}
            </div>
            <span className={`text-xs hidden md:block ${i === currentStep ? 'text-leb font-semibold' : 'text-gray-400'}`}>
              {title}
            </span>
            {i < LAST_STEP && <div className="w-6 h-px bg-gray-300" />}
          </div>
        ))}
      </div>

      <form
        className="w-full flex flex-col"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          //onSubmit Validation
          ;(form as any).setErrorMap?.({ onSubmit: undefined })
          const result = ProgInfoSchema.safeParse(form.state.values)
          if (!result.success) {
            const firstIssue = result.error.issues[0]
            const firstFailedField = firstIssue?.path[0] as string
            const firstFailedFieldPath = firstIssue
              ? issuePathToFieldName(firstIssue.path as Array<string | number>)
              : ''
            const failedStep = STEP_FIELDS.findIndex((fields) =>
              (fields as readonly string[]).includes(firstFailedField)
            )
            if (failedStep !== -1) setCurrentStep(failedStep)
            if (firstFailedFieldPath) {
              form.validateField(firstFailedFieldPath as any, 'change')
            }
            ;(form as any).setErrorMap?.({
              onSubmit: firstIssue?.message || 'Please complete the required field.',
            })
            return
          }
          form.handleSubmit()
        }}
      >
        {STEPS.map((StepComp, i) => (
          <div key={i} className={i === currentStep ? 'block' : 'hidden'}>
            <ProgInfoSectionWrapper title={STEP_TITLES[i]}>
              <StepComp form={form} />
            </ProgInfoSectionWrapper>
          </div>
        ))}

        <form.AppForm>
          <div className="px-6">
            <form.FormErrorMessage />
          </div>
          <div className="flex justify-between items-center px-6 py-5">
            {/* Left — Reset + Save */}
            <div className="flex flex-row gap-4">
              <ResetButton
                defaultValues={progInfoDefaultValues}
                storageKey="programinfo"
                onReset={handleResetWizard} 
              />
              <SaveButton
                getValue={() => ({
                  ...progInfoDefaultValues,
                  ...form.state.values,
                  programType: form.state.values.programType || null,
                  programDuration: form.state.values.programDuration || null,
                })}
                storageKey="programinfo"
              />
            </div>

            {/* Right — Prev / Next / Submit */}
            <div className="flex flex-row gap-3">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-6 py-2 rounded-xl text-sm border border-leb text-leb hover:bg-leb/10 transition-all"
                >
                  Prev
                </button>
              )}
              {currentStep < LAST_STEP ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 rounded-xl text-sm bg-leb text-white shadow hover:scale-105 transition-all"
                >
                  Next
                </button>
              ) : (
                <form.SubscribeButton label="Submit" />
              )}
            </div>
          </div>
        </form.AppForm>
      </form>
    </FormWrapper>
  )
}
