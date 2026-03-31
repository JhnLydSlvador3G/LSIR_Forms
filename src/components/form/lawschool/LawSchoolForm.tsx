import { useEffect, useState } from 'react'
import { StepperFormWrapper } from '../StepperFormWrapper'
import { SectionWrapper } from '../hei/HeiSectionWrapper'
import AddressForm from '../address/AddressForm'
import Spinner from '@/components/ui/feedback/Spinner'
import {
  LAW_SCHOOL_ADDRESS_FIELDS,
  LAW_SCHOOL_DEAN_DEGREE_FIELDS,
  LAW_SCHOOL_DEAN_FIELDS,
  LAW_SCHOOL_STEPS,
  lawSchoolFormDefaultValues,
  lawSchoolFormDraftSchema,
  lawSchoolFormSchema,
} from './LawSchoolForm.types'
import type { LawSchoolFormData } from './LawSchoolForm.types'
import LawSchoolGeneralInfo from './LawSchoolGeneralInfo'
import LawSchoolDean from './LawSchoolDean'
import LawSchoolDeanDegree from './LawSchoolDeanDegree'
import { useAppForm } from '@/hooks/useFormContext'
import { useMultistepValidation } from '@/hooks/useMultistepValidation'
import { StepperNav } from '@/components/ui/stepper/StepperNav'
import { useStepper } from '@/hooks/useStepper'
import { loadFormFromLocal, saveFormToLocal } from '@/lib/formLocalStorage'
import {
  clearActiveLawSchoolSubmissionId,
  loadActiveLawSchoolSubmissionId,
  saveLawSchoolSubmission,
} from '@/lib/lawSchoolSubmissions'

export default function LawSchoolForm() {
  // LEI keeps useStepper for navigation while shared validation handles Next/Submit.
  const stepper = useStepper(LAW_SCHOOL_STEPS)
  const [resetVersion, setResetVersion] = useState(0)
  const [initialValues, setInitialValues] = useState(lawSchoolFormDefaultValues)
  const [activeSubmissionId, setActiveSubmissionId] = useState('')

  const form = useAppForm({
    defaultValues: initialValues,
    validators: {
      onChange: lawSchoolFormDraftSchema,
    },
    onSubmit: ({ value }) => {
      console.log('Submitted:', value)
    },
  })

  useEffect(() => {
    const values = loadFormFromLocal({
      key: 'lawSchool',
      fallback: lawSchoolFormDefaultValues,
    })
    setActiveSubmissionId(loadActiveLawSchoolSubmissionId())
    setInitialValues(values)
    form.reset(values)
  }, [form])

  const lawSchoolSections = [
    {
      key: 'general-information',
      title: 'General Information',
      render: () => <LawSchoolGeneralInfo form={form as any} />,
    },
    {
      key: 'mailing-address',
      title: 'Mailing Address',
      render: () => <AddressForm form={form as any} fields={LAW_SCHOOL_ADDRESS_FIELDS} />,
    },
    {
      key: 'law-dean',
      title: 'Law Dean',
      render: () => <LawSchoolDean form={form as any} fields={LAW_SCHOOL_DEAN_FIELDS} />,
    },
    {
      key: 'dean-academic-background',
      title: "Dean's Academic Background",
      render: () => (
        <LawSchoolDeanDegree
          form={form as any}
          fields={LAW_SCHOOL_DEAN_DEGREE_FIELDS}
        />
      ),
    },
  ] as const

  const { clearSubmitError, validateCurrentStep, validateBeforeSubmit } =
    useMultistepValidation<LawSchoolFormData>({
      form,
      stepper,
      schema: lawSchoolFormSchema,
    })
  const handleStepNext = validateCurrentStep

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!stepper.isLast) return

    // Submit runs full-form validation and jumps to the first invalid step when needed.
    const result = await validateBeforeSubmit()

    if (!result.ok) {
      return
    }

    const submittedValues = form.state.values

    saveFormToLocal({
      key: 'lawSchool',
      value: submittedValues,
      schema: lawSchoolFormDraftSchema,
    })

    const savedSubmission = saveLawSchoolSubmission(submittedValues, activeSubmissionId)
    setActiveSubmissionId(savedSubmission.id)
    await form.handleSubmit()

    localStorage.removeItem('lawSchool')
    clearActiveLawSchoolSubmissionId()
    setActiveSubmissionId('')
    setInitialValues(lawSchoolFormDefaultValues)
    clearSubmitError()
    setResetVersion((value) => value + 1)
    form.reset(lawSchoolFormDefaultValues)
    stepper.goTo(0)
  }

  return (
    <StepperFormWrapper title="Law School General Information" stepper={stepper}>
      <form className="w-full flex flex-col" onSubmit={handleSubmit}>
        {lawSchoolSections.map((section, index) => (
          <div
            key={`${section.key}-${resetVersion}`}
            className={index === stepper.currentStep ? 'block' : 'hidden'}
          >
            <SectionWrapper title={section.title}>
              {section.render()}
            </SectionWrapper>
          </div>
        ))}

        <form.AppForm>
          <StepperNav
            stepper={stepper}
            storageKey="lawSchool"
            defaultValues={lawSchoolFormDefaultValues}
            getValue={() => form.state.values}
            savePreferGetValueFirst
            saveSchema={lawSchoolFormDraftSchema}
            onNext={handleStepNext}
            onReset={() => {
              clearActiveLawSchoolSubmissionId()
              setActiveSubmissionId('')
              setInitialValues(lawSchoolFormDefaultValues)
              clearSubmitError()
              setResetVersion((value) => value + 1)
              stepper.goTo(0)
            }}
          />

          <form.FormErrorMessage />

          {stepper.isLast && (
            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <div className="px-6 pb-4 flex justify-end gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-8 py-2 rounded-xl text-sm font-semibold bg-leb text-white shadow-md ring-2 ring-leb/30 hover:scale-105 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? <Spinner size="h-4 w-4" /> : 'Submit'}
                  </button>
                </div>
              )}
            </form.Subscribe>
          )}
        </form.AppForm>
      </form>
    </StepperFormWrapper>
  )
}
