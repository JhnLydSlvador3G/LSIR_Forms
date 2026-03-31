import { useEffect, useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useAppForm } from '@/hooks/useFormContext'
import { useMultistepValidation } from '@/hooks/useMultistepValidation'
import { useStepper } from '@/hooks/useStepper'
import { FormWrapper } from '../FormWrapper'
import { ProgInfoSectionWrapper } from './ProgInfoSectionWrapper'
import {
  progInfoDefaultValues,
  ProgInfoDraftSchema,
  ProgInfoSchema,
  STEP_FIELDS,
  STEP_TITLES,
  type CurriculumEntry,
  type CurriculumLoadEntry,
  type ProgInfoFormData,
} from './ProgInfo.types'
import ProgInfoProgOffered from './ProgInfoProgOffered'
import ProgInfoLawProgramClassification from './ProgInfoLawProgramClassification'
import ProgInfoAcadCalendar from './ProgInfoAcadCalendar'
import ProgInfoClassOperatingSchedule from './ProgInfoClassOperatingSchedule'
import ProgInfoCurricularSched from './ProgInfoCurricularSched'
import ProgInfoCurriculum from './ProgInfoCurriculum'
import ProgInfoProgDuration from './ProgInfoProgDuration'
import Spinner from '@/components/ui/feedback/Spinner'
import ResetButton from '@/components/ui/form/ResetButton'
import SaveButton from '@/components/ui/form/SaveButton'
import StepIndicator from '@/components/ui/form/StepIndicator'
import { appendProgramInfoSubmission } from '@/lib/programInfoSubmissions'
import {
  loadActiveLawSchoolSubmissionId,
  loadLawSchoolSubmissions,
  type LawSchoolSubmission,
} from '@/lib/lawSchoolSubmissions'

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

const PROG_INFO_STEPS = STEP_GROUPS.map((group) => ({
  title: group.indicatorTitle,
  fields: group.sectionIndexes.flatMap((index) => [...STEP_FIELDS[index]]),
}))

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

const normalizeSemestralValue = (value: unknown): number | '' => {
  if (value === '' || value === null || value === undefined) return ''
  if (typeof value === 'number') return Number.isInteger(value) ? value : ''
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return ''
    const parsed = Number(trimmed)
    return Number.isInteger(parsed) ? parsed : ''
  }
  return ''
}

const normalizeCurriculaDraft = (value: unknown): CurriculumEntry[] => {
  if (!Array.isArray(value)) {
    return progInfoDefaultValues.curricula
  }

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

  const normalized = value.map((entry) => {
    if (!entry || typeof entry !== 'object') {
      return progInfoDefaultValues.curricula[0]
    }

    const curriculum = entry as Record<string, unknown>

    if (Array.isArray(curriculum.loads)) {
      const loads = curriculum.loads as Array<Record<string, unknown>>
      return {
        loads: [1, 2, 3, 4, 5].map((year, index) => ({
          year,
          first_sem: normalizeSemestralValue(loads[index]?.first_sem),
          second_sem: normalizeSemestralValue(loads[index]?.second_sem),
        })),
      }
    }

    return {
      loads: firstSemKeys.map((firstKey, index) => ({
        year: index + 1,
        first_sem: normalizeSemestralValue(
          curriculum[firstKey] ?? curriculum.first_sem ?? '',
        ),
        second_sem: normalizeSemestralValue(
          curriculum[secondSemKeys[index]] ?? curriculum.second_sem ?? '',
        ),
      })),
    }
  })

  return normalized.length > 0 ? normalized : progInfoDefaultValues.curricula
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
    const requireCurriculumValue = (
      value: number | '',
      curriculumIndex: number,
      loadIndex: number,
      field: keyof CurriculumLoadEntry,
      label: string,
    ) => {
      if (value !== '') return
      issues.push({
        path: ['curricula', curriculumIndex, 'loads', loadIndex, field],
        message: `${label} is required`,
      })
    }

    if (values.lebApprovalDate.trim().length === 0) {
      issues.push({
        path: ['lebApprovalDate'],
        message: 'LEB Approval Date is required',
      })
    }

    if (values.curricula.length === 0) {
      issues.push({
        path: ['curricula'],
        message: 'At least one semestral academic load is required',
      })
    }

    values.curricula.forEach((curriculum, index) => {
      curriculum.loads.forEach((load, loadIndex) => {
        requireCurriculumValue(
          load.first_sem,
          index,
          loadIndex,
          'first_sem',
          `Year ${load.year} - 1st Sem`,
        )
        requireCurriculumValue(
          load.second_sem,
          index,
          loadIndex,
          'second_sem',
          `Year ${load.year} - 2nd Sem`,
        )
      })
    })
  }

  return issues
}

export default function ProgramInfo() {
  const navigate = useNavigate()
  const stepper = useStepper(PROG_INFO_STEPS)
  const [initialValues, setInitialValues] = useState(progInfoDefaultValues)
  const [lawSchoolSubmissions, setLawSchoolSubmissions] = useState<LawSchoolSubmission[]>([])

  const form = useAppForm({
    defaultValues: initialValues,
    validators: {
      onChange: ProgInfoDraftSchema as any,
    },
    onSubmit: async ({ value }) => {
      appendProgramInfoSubmission(value)
      localStorage.removeItem('programinfo')
      setInitialValues(progInfoDefaultValues)
      stepper.goTo(0)
      navigate({ to: '/programinfo-submissions' })
    },
  })

  const { clearSubmitError, validateCurrentStep, validateBeforeSubmit } =
    useMultistepValidation<ProgInfoFormData>({
      form,
      stepper,
      schema: ProgInfoSchema,
      getExtraIssues: getStepSpecificIssues,
    })

  useEffect(() => {
    const lawSchools = loadLawSchoolSubmissions()
    setLawSchoolSubmissions(lawSchools)

    const raw = localStorage.getItem('programinfo')
    const parsed = raw ? JSON.parse(raw) : {}
    const activeLawSchoolId = loadActiveLawSchoolSubmissionId()
    const searchLawSchoolId =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('lawSchoolId') || ''
        : ''
    const restoredEnumFields = Object.fromEntries(
      ENUM_RESTORED_FIELDS.map((field) => [field, parsed[field] ?? '']),
    )
    const parsedLawSchoolId =
      typeof parsed.lawSchoolId === 'string' ? parsed.lawSchoolId : ''
    const preferredLawSchoolId =
      searchLawSchoolId || parsedLawSchoolId || activeLawSchoolId || lawSchools[0]?.id || ''

    const restored = {
      ...progInfoDefaultValues,
      ...parsed,
      ...restoredEnumFields,
      lawSchoolId: preferredLawSchoolId,
      lebApprovalDate:
        parsed.lebApprovalDate ?? parsed.curricula?.[0]?.lebApprovalDate ?? '',
      curricula: normalizeCurriculaDraft(parsed.curricula),
    }

    setInitialValues(restored)
    form.reset(restored)
  }, [form])

  const handleNext = async () => {
    const ok = await validateCurrentStep()
    if (ok) {
      stepper.goNext()
    }
  }

  const handleResetWizard = () => {
    stepper.goTo(0)
    setInitialValues(progInfoDefaultValues)
    clearSubmitError()
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
        onSubmit={async (e) => {
          e.preventDefault()
          e.stopPropagation()

          const result = await validateBeforeSubmit()
          if (!result.ok) {
            return
          }

          await form.handleSubmit()
        }}
      >
        <form.AppForm>
          <div className="grid gap-0 lg:grid-cols-[320px_minmax(0,1fr)]">
            <div className="border-b border-slate-200 bg-slate-50/70 lg:border-b-0 lg:border-r">
              <StepIndicator
                steps={STEP_GROUPS.map((group) => group.indicatorTitle)}
                currentStep={stepper.currentStep}
                className="h-full"
              />
            </div>

            <div className="bg-slate-50/50">
              <div className="border-b border-slate-200 bg-white px-8 py-6">
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-slate-400">
                  Step {stepper.currentStep + 1} of {stepper.totalSteps}
                </p>
                <h2 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">
                  {stepper.currentConfig.title}
                </h2>
              </div>

              <div className="space-y-5 p-7">
                {lawSchoolSubmissions.length === 0 && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-900">
                    <p className="text-sm font-semibold">No Law School submission found.</p>
                    <p className="mt-1 text-sm">
                      Submit a Law School General Information record first so Program
                      Information can be linked to it.
                    </p>
                    <Link
                      to="/lawschoolinfo"
                      className="mt-3 inline-flex rounded-lg bg-leb px-4 py-2 text-sm font-semibold text-white"
                    >
                      Go to Law School Form
                    </Link>
                  </div>
                )}

                {STEP_GROUPS[stepper.currentStep].sectionIndexes.map((sectionIndex) => {
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

              <div className="px-7">
                <form.FormErrorMessage />
              </div>

              <div className="flex flex-col gap-4 border-t border-slate-200 bg-white px-7 py-5 md:flex-row md:items-center md:justify-between">
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
                  {!stepper.isFirst && (
                    <button
                      type="button"
                      onClick={stepper.goPrev}
                      className="rounded-xl border border-leb px-6 py-2 text-sm text-leb transition-all hover:bg-leb/10"
                    >
                      Back
                    </button>
                  )}

                  {!stepper.isLast ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={lawSchoolSubmissions.length === 0}
                      className="rounded-xl bg-leb px-6 py-2 text-sm text-white shadow transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Continue
                    </button>
                  ) : (
                    <form.Subscribe selector={(state) => state.isSubmitting}>
                      {(isSubmitting) => (
                        <button
                          type="submit"
                          disabled={isSubmitting || lawSchoolSubmissions.length === 0}
                          className="flex items-center gap-2 rounded-xl bg-leb px-8 py-2 text-sm font-semibold text-white shadow-md ring-2 ring-leb/30 transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isSubmitting ? <Spinner size="h-4 w-4" /> : 'Submit'}
                        </button>
                      )}
                    </form.Subscribe>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form.AppForm>
      </form>
    </FormWrapper>
  )
}
