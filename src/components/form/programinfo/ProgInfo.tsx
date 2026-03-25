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
  type CurriculumEntry,
  type ProgInfoFormData,
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
import StepIndicator from '@/components/ui/form/StepIndicator'
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
const ENUM_RESTORED_FIELDS = [
  'lawProgramClassification',
  'doctorateProgram',
  'programType',
  'recognitionStatus',
  'startMonth',
  'endMonth',
  'classOperatingFrom',
  'classOperatingTo',
  'curricularSchedule',
  'programDuration',
] as const

const issuePathToFieldName = (path: Array<string | number>) =>
  path.reduce((acc, segment) => {
    if (typeof segment === 'number') {
      return `${acc}[${segment}]`
    }
    return acc ? `${acc}.${segment}` : segment
  }, '')
//Note

const getStepSpecificIssues = (
  currentStep: number,
  values: ProgInfoFormData,
) => {
  const issues: Array<{ path: Array<string | number>; message: string }> = []

  if (currentStep === 0) {
    if (
      values.lawProgramClassification === 'doctorate' &&
      !values.doctorateProgram
    ) {
      issues.push({
        path: ['doctorateProgram'],
        message: 'Doctorate program is required',
      })
    }
  }

  if (currentStep === 1) {
    if (values.locationSite.trim().length === 0) {
      issues.push({
        path: ['locationSite'],
        message: 'Location/Site is required',
      })
    }

    if (values.programType === 'extension') {
      if (values.governmentAuthority.trim().length === 0) {
        issues.push({
          path: ['governmentAuthority'],
          message: 'Government Authority is required',
        })
      }

      if (values.validity.trim().length === 0) {
        issues.push({
          path: ['validity'],
          message: 'Validity is required',
        })
      }
    }

    if (values.programType === 'branch') {
      if (!values.recognitionStatus) {
        issues.push({
          path: ['recognitionStatus'],
          message: 'Recognition Status is required',
        })
      }

      if (values.recognitionNumber.trim().length === 0) {
        issues.push({
          path: ['recognitionNumber'],
          message: 'Recognition Number is required',
        })
      }
    }
  }

  if (currentStep === 6) {
    const requireCurriculumValue = (
      value: string,
      curriculumIndex: number,
      field: keyof CurriculumEntry,
      label: string,
    ) => {
      if (value.trim().length > 0) return
      issues.push({
        path: ['curricula', curriculumIndex, field],
        message: `${label} is required`,
      })
    }

    if (values.curricula.length === 0) {
      issues.push({
        path: ['curricula'],
        message: 'At least one curriculum entry is required',
      })
    }

    values.curricula.forEach((curriculum, index) => {
      requireCurriculumValue(
        curriculum.lebApprovalDate,
        index,
        'lebApprovalDate',
        'LEB Approval Date',
      )
      requireCurriculumValue(
        curriculum.firstYearFirstSem,
        index,
        'firstYearFirstSem',
        'First Year Level - 1st Sem',
      )
      requireCurriculumValue(
        curriculum.firstYearSecondSem,
        index,
        'firstYearSecondSem',
        'First Year Level - 2nd Sem',
      )
      requireCurriculumValue(
        curriculum.secondYearFirstSem,
        index,
        'secondYearFirstSem',
        'Second Year Level - 1st Sem',
      )
      requireCurriculumValue(
        curriculum.secondYearSecondSem,
        index,
        'secondYearSecondSem',
        'Second Year Level - 2nd Sem',
      )
      requireCurriculumValue(
        curriculum.thirdYearFirstSem,
        index,
        'thirdYearFirstSem',
        'Third Year Level - 1st Sem',
      )
      requireCurriculumValue(
        curriculum.thirdYearSecondSem,
        index,
        'thirdYearSecondSem',
        'Third Year Level - 2nd Sem',
      )
      requireCurriculumValue(
        curriculum.fourthYearFirstSem,
        index,
        'fourthYearFirstSem',
        'Fourth Year Level - 1st Sem',
      )
      requireCurriculumValue(
        curriculum.fourthYearSecondSem,
        index,
        'fourthYearSecondSem',
        'Fourth Year Level - 2nd Sem',
      )
      requireCurriculumValue(
        curriculum.fifthYearFirstSem,
        index,
        'fifthYearFirstSem',
        'Fifth Year Level - 1st Sem',
      )
      requireCurriculumValue(
        curriculum.fifthYearSecondSem,
        index,
        'fifthYearSecondSem',
        'Fifth Year Level - 2nd Sem',
      )
      requireCurriculumValue(
        curriculum.totalAcademicLoadFirstSem,
        index,
        'totalAcademicLoadFirstSem',
        'Total academic load - 1st Sem',
      )
      requireCurriculumValue(
        curriculum.totalAcademicLoadSecondSem,
        index,
        'totalAcademicLoadSecondSem',
        'Total academic load - 2nd Sem',
      )
    })
  }

  return issues
}

//Note: The getStepSpecificIssues function performs additional validation that is specific to certain steps and cannot be easily captured by the overall schema validation.
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
      console.log('Program information submitted:', value)
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
    const restoredEnumFields = Object.fromEntries(
      ENUM_RESTORED_FIELDS.map((field) => [field, parsed[field] ?? ''])
    )
    const restored = {
      //Note: Merge the default values with the parsed values to ensure any missing fields are populated with defaults, preventing potential issues with undefined values in the form.
      ...progInfoDefaultValues,
      ...parsed,
      ...restoredEnumFields,
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
    const schemaStepIssues = result.success
      ? []
      : result.error.issues.filter((issue) =>
          fields.includes(String(issue.path[0] || ''))
        )
    const stepIssues = [
      ...schemaStepIssues,
      ...getStepSpecificIssues(currentStep, currentValues),
    ]

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
      <StepIndicator steps={STEP_TITLES} currentStep={currentStep} />

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
