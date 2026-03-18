import { useEffect, useState } from 'react'
import { useAppForm } from '@/hooks/useFormContext'
import { FormWrapper } from '../FormWrapper'
import { ProgInfoSectionWrapper } from './ProgInfoSectionWrapper'
import {
  progInfoDefaultValues,
  ProgInfoSchema,
  ProgInfoDraftSchema,
  STEP_FIELDS,
  STEP_TITLES,
} from './ProgInfo.types'
import ProgInfoProgOffered from './ProgInfoProgOffered'
import ProgInfoAcadCalendar from './ProgInfoAcadCalendar'
import ProgInfoCurricularSched from './ProgInfoCurricularSched'
import ProgInfoProgDuration from './ProgInfoProgDuration'
import ResetButton from '@/components/ui/form/ResetButton'
import SaveButton from '@/components/ui/form/SaveButton'

const STEPS = [
  ProgInfoProgOffered,
  ProgInfoAcadCalendar,
  ProgInfoCurricularSched,
  ProgInfoProgDuration,
]

const LAST_STEP = STEPS.length - 1

export default function ProgramInfo() {
  const [currentStep, setCurrentStep] = useState(0)
  const [initialValues, setInitialValues] = useState(progInfoDefaultValues)

  const form = useAppForm({
    defaultValues: initialValues,
    validators: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onChange: ProgInfoDraftSchema as any,
    },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  useEffect(() => {
    const raw = localStorage.getItem('programinfo')
    if (!raw) return
    const parsed = JSON.parse(raw)
    // convert null back to empty string for fields that use ''
    const restored = {
      ...progInfoDefaultValues,
      ...parsed,
      programType: parsed.programType ?? '',
      programDuration: parsed.programDuration ?? '',
    }
    setInitialValues(restored)
  }, [])

  const handleNext = async () => {
    const fields = STEP_FIELDS[currentStep] as readonly string[]
    const currentValues = form.state.values

    // pick only the current step's fields from the strict schema
    const stepData = Object.fromEntries(
      fields.map((f) => [f, currentValues[f as keyof typeof currentValues]])
    )
    const stepSchema = ProgInfoSchema.pick(
      Object.fromEntries(fields.map((f) => [f, true])) as any
    )
    const result = stepSchema.safeParse(stepData)

    if (result.success) {
      setCurrentStep((s) => s + 1)
    } else {
      // touch all fields in this step so errors show
      fields.forEach((f) => form.validateField(f as any, 'change'))
    }
  }

  const handlePrev = () => {
    setCurrentStep((s) => s - 1)
  }

  return (
    <FormWrapper title="Program Information">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 px-8 pt-6">
        {STEP_TITLES.map((title, i) => (
          <div key={title} className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold
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
          const result = ProgInfoSchema.safeParse(form.state.values)
          if (!result.success) {
            const firstFailedField = result.error.issues[0]?.path[0] as string
            const failedStep = STEP_FIELDS.findIndex((fields) =>
              (fields as readonly string[]).includes(firstFailedField)
            )
            if (failedStep !== -1) setCurrentStep(failedStep)
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
          <div className="flex justify-between items-center px-6 py-5">
            {/* Left — Reset + Save */}
            <div className="flex flex-row gap-4">
              <ResetButton defaultValues={progInfoDefaultValues} storageKey="programinfo" />
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
