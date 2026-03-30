import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAppForm } from '@/hooks/useFormContext'
import { FormWrapper } from '../FormWrapper'
import { ProgInfoSectionWrapper } from './ProgInfoSectionWrapper'
import {
  progInfoDefaultValues,
  ProgInfoSchema,
  ProgInfoDraftSchema,
  STEP_FIELDS,
  STEP_TITLES,
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

const STEP_GROUPS = [
  {
    indicatorTitle: 'Program Offered',
    sectionIndexes: [0, 1],
  },
  {
    indicatorTitle: 'Program Schedule',
    sectionIndexes: [2, 3, 4, 5],
  },
  {
    indicatorTitle: 'Curriculum',
    sectionIndexes: [6],
  },
] as const

const STEP_GROUP_FIELDS = STEP_GROUPS.map((group) =>
  group.sectionIndexes.flatMap((index) => [...STEP_FIELDS[index]])
)

const LAST_STEP = STEP_GROUPS.length - 1
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

const normalizeSemestralValue = (value: unknown) => {
  if (value === '' || value === null || value === undefined) return ''
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return ''
    const parsed = Number(trimmed)
    return Number.isNaN(parsed) ? '' : parsed
  }
  return ''
}

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

  if (currentStep === 2) {
    if (values.lebApprovalDate.trim().length === 0) {
      issues.push({
        path: ['lebApprovalDate'],
        message: 'LEB Approval Date is required',
      })
    }

    if (values.curricula.length === 0) {
      issues.push({
        path: ['curricula'],
        message: 'At least one curriculum entry is required',
      })
    }
  }

  return issues
}

export default function ProgramInfo() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [initialValues, setInitialValues] = useState(progInfoDefaultValues)
  const [errorToastReplayKey, setErrorToastReplayKey] = useState(0)

  const form = useAppForm({
    defaultValues: initialValues,
    validators: {
      onChange: ProgInfoDraftSchema,
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

  useEffect(() => {
    const raw = localStorage.getItem('programinfo')
    if (!raw) return

    const parsed = JSON.parse(raw)
    const restoredEnumFields = Object.fromEntries(
      ENUM_RESTORED_FIELDS.map((field) => [field, parsed[field] ?? ''])
    )

    const restored = {
      ...progInfoDefaultValues,
      ...parsed,
      ...restoredEnumFields,
      lebApprovalDate:
        parsed.lebApprovalDate ?? parsed.curricula?.[0]?.lebApprovalDate ?? '',
      curricula:
        Array.isArray(parsed.curricula) && parsed.curricula.every((entry: any) =>
          entry && typeof entry === 'object' && Array.isArray(entry.loads)
        )
          ? parsed.curricula.map((entry: any) => ({
              ...entry,
              loads: Array.isArray(entry.loads)
                ? entry.loads.map((load: any) => ({
                    ...load,
                    first_sem: normalizeSemestralValue(load.first_sem),
                    second_sem: normalizeSemestralValue(load.second_sem),
                  }))
                : progInfoDefaultValues.curricula[0].loads,
            }))
          : [
              {
                loads: progInfoDefaultValues.curricula[0].loads.map((load, index) => {
                  const legacy = parsed.curricula?.[index] ?? {}
                  const firstSemKeys = [
                    'firstYearFirstSem',
                    'secondYearFirstSem',
                    'thirdYearFirstSem',
                    'fourthYearFirstSem',
                    'fifthYearFirstSem',
                  ] as const
                  const secondSemKeys = [
                    'firstYearSecondSem',
                    'secondYearSecondSem',
                    'thirdYearSecondSem',
                    'fourthYearSecondSem',
                    'fifthYearSecondSem',
                  ] as const

                  return {
                    year: load.year,
                    first_sem: normalizeSemestralValue(
                      legacy[firstSemKeys[index]] ?? legacy.first_sem ?? ''
                    ),
                    second_sem: normalizeSemestralValue(
                      legacy[secondSemKeys[index]] ?? legacy.second_sem ?? ''
                    ),
                  }
                }),
              },
            ],
    }

    setInitialValues(restored)
    form.reset(restored)
  }, [form])

  const handleNext = async () => {
    ;(form as any).setErrorMap?.({ onSubmit: undefined })
    const fields = STEP_GROUP_FIELDS[currentStep] as readonly string[]
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
    setErrorToastReplayKey((key) => key + 1)
  }

  const handlePrev = () => {
    setCurrentStep((s) => s - 1)
  }

  const handleResetWizard = () => {
    setCurrentStep(0)
    setInitialValues(progInfoDefaultValues)
    ;(form as any).setErrorMap?.({ onSubmit: undefined })
  }

  const handleAttemptSubmit = () => {
    ;(form as any).setErrorMap?.({ onSubmit: undefined })
    const result = ProgInfoSchema.safeParse(form.state.values)
    if (!result.success) {
      const firstIssue = result.error.issues[0]
      const firstFailedField = firstIssue?.path[0] as string
      const firstFailedFieldPath = firstIssue
        ? issuePathToFieldName(firstIssue.path as Array<string | number>)
        : ''
      const failedStep = STEP_GROUP_FIELDS.findIndex((fields) =>
        (fields as readonly string[]).includes(firstFailedField)
      )
      if (failedStep !== -1) setCurrentStep(failedStep)
      if (firstFailedFieldPath) {
        form.validateField(firstFailedFieldPath as any, 'change')
      }
      ;(form as any).setErrorMap?.({
        onSubmit: firstIssue?.message || 'Please complete the required field.',
      })
      setErrorToastReplayKey((key) => key + 1)
      return
    }

    form.handleSubmit()
  }

  return (
    <FormWrapper
      title="Program Information"
      subtitle="Complete the grouped sections using the navigation panel."
      noPadding
      className="max-w-6xl"
    >
      <form
        className="flex w-full flex-col"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        <div className="grid gap-0 lg:grid-cols-[260px_minmax(0,1fr)]">
          <div className="border-b border-slate-200 lg:border-b-0 lg:border-r">
            <StepIndicator
              steps={STEP_GROUPS.map((group) => group.indicatorTitle)}
              currentStep={currentStep}
              className="h-full py-4"
            />
          </div>

          <div className="bg-slate-50/60">
            <div className="border-b border-slate-200 bg-white px-6 py-5">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                Step {currentStep + 1} of {STEP_GROUPS.length}
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-800">
                {STEP_GROUPS[currentStep].indicatorTitle}
              </h2>
            </div>

            <div className="space-y-5 p-6">
              {STEP_GROUPS[currentStep].sectionIndexes.map((sectionIndex) => {
                const StepComp = STEPS[sectionIndex]

                return (
                  <ProgInfoSectionWrapper
                    key={STEP_TITLES[sectionIndex]}
                    title={STEP_TITLES[sectionIndex]}
                  >
                    <StepComp form={form} />
                  </ProgInfoSectionWrapper>
                )
              })}
            </div>

            <form.AppForm>
              <div className="px-6">
                <form.FormErrorMessage replayKey={errorToastReplayKey} />
              </div>
              <div className="flex flex-col gap-4 border-t border-slate-200 bg-white px-6 py-5 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap gap-3">
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

                <div className="flex flex-wrap gap-3">
                  {currentStep > 0 && (
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="rounded-xl border border-leb px-6 py-2 text-sm text-leb transition-all hover:bg-leb/10"
                    >
                      Back
                    </button>
                  )}
                  {currentStep < LAST_STEP ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="rounded-xl bg-leb px-6 py-2 text-sm text-white shadow transition-all hover:scale-105"
                    >
                      Continue
                    </button>
                  ) : (
                    <form.SubscribeButton
                      label="Finish"
                      confirmTitle="Submit program information?"
                      confirmDescription="This will submit the current program information entry and save it to the submissions list."
                      confirmActionLabel="Submit"
                      onConfirm={handleAttemptSubmit}
                    />
                  )}
                </div>
              </div>
            </form.AppForm>
          </div>
        </div>
      </form>
    </FormWrapper>
  )
}
