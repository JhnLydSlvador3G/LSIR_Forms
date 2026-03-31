import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAppForm } from '@/hooks/useFormContext'
import { useMultistepValidation } from '@/hooks/useMultistepValidation'
import { useStepper } from '@/hooks/useStepper'
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
import Spinner from '@/components/ui/feedback/Spinner'
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

const PROG_INFO_STEPS = STEP_TITLES.map((title, index) => ({
  title,
  fields: [...STEP_FIELDS[index]],
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
  // Program Info now uses the same stepper + shared validation pattern as HEI/LEI.
  const stepper = useStepper(PROG_INFO_STEPS)
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
      stepper.goTo(0)
      navigate({ to: '/programinfo-submissions' })
    },
  })

  const { clearSubmitError, validateCurrentStep, validateBeforeSubmit } =
    useMultistepValidation<ProgInfoFormData>({
      form,
      stepper,
      schema: ProgInfoSchema,
      // Program Info still contributes step-specific checks that sit on top of schema validation.
      getExtraIssues: getStepSpecificIssues,
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
    // Next only validates the active step before moving forward.
    const ok = await validateCurrentStep()
    if (ok) {
      stepper.goNext()
    }
  }

  // Note: Resetting the wizard should also clear any validation errors that may be blocking progress.
  const handleResetWizard = () => {
    stepper.goTo(0)
    setInitialValues(progInfoDefaultValues)
    clearSubmitError()
  }

  return (
    <FormWrapper title="Program Information">
      <StepIndicator steps={STEP_TITLES} currentStep={stepper.currentStep} />

      <form
        className="w-full flex flex-col"
        onSubmit={async (e) => {
          e.preventDefault()
          e.stopPropagation()
          // Submit validates the full form and redirects to the first failing step if needed.
          const result = await validateBeforeSubmit()
          if (!result.ok) {
            return
          }
          await form.handleSubmit()
        }}
      >
        {STEPS.map((StepComp, i) => (
          <div key={i} className={i === stepper.currentStep ? 'block' : 'hidden'}>
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
              {!stepper.isFirst && (
                <button
                  type="button"
                  onClick={stepper.goPrev}
                  className="px-6 py-2 rounded-xl text-sm border border-leb text-leb hover:bg-leb/10 transition-all"
                >
                  Prev
                </button>
              )}
              {!stepper.isLast ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 rounded-xl text-sm bg-leb text-white shadow hover:scale-105 transition-all"
                >
                  Next
                </button>
              ) : (
                <form.Subscribe selector={(state) => state.isSubmitting}>
                  {(isSubmitting) => (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-8 py-2 rounded-xl text-sm font-semibold bg-leb text-white shadow-md ring-2 ring-leb/30 hover:scale-105 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? <Spinner size="h-4 w-4" /> : 'Submit'}
                    </button>
                  )}
                </form.Subscribe>
              )}
            </div>
          </div>
        </form.AppForm>
      </form>
    </FormWrapper>
  )
}
