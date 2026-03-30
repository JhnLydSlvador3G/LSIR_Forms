import { useEffect, useRef, useState } from 'react'
import { StepperFormWrapper } from '../StepperFormWrapper'
import { SectionWrapper } from '../hei/HeiSectionWrapper'
import AddressForm from '../address/AddressForm'
import {
  LAW_SCHOOL_ADDRESS_FIELDS,
  LAW_SCHOOL_DEAN_DEGREE_FIELDS,
  LAW_SCHOOL_DEAN_FIELDS,
  LAW_SCHOOL_STEPS,
  LAW_SCHOOL_STEP_SCHEMAS,
  lawSchoolFormDefaultValues,
  lawSchoolFormDraftSchema,
  lawSchoolFormSchema,
} from './LawSchoolForm.types'
import LawSchoolGeneralInfo from './LawSchoolGeneralInfo'
import LawSchoolDean from './LawSchoolDean'
import LawSchoolDeanDegree from './LawSchoolDeanDegree'
import { useAppForm } from '@/hooks/useFormContext'
import { StepperNav } from '@/components/ui/stepper/StepperNav'
import { useStepper } from '@/hooks/useStepper'
import { loadFormFromLocal, saveFormToLocal } from '@/lib/formLocalStorage'

const isEmptyValue = (value: unknown) =>
  value === undefined ||
  value === null ||
  (typeof value === 'string' && value.trim() === '') ||
  (Array.isArray(value) && value.length === 0)

export default function LawSchoolForm() {
  const stepper = useStepper(LAW_SCHOOL_STEPS)
  const visitedStepsRef = useRef<Set<number>>(new Set([0]))
  const forcedErrorStepsRef = useRef<Set<number>>(new Set())
  const justAdvancedRef = useRef(false)
  const [resetVersion, setResetVersion] = useState(0)
  const [initialValues, setInitialValues] = useState(lawSchoolFormDefaultValues)

  const form = useAppForm({
    defaultValues: initialValues,
    validators: {
      onChange: lawSchoolFormDraftSchema,
    },
    onSubmit: async ({ value }) => {
      console.log('Submitted:', value)
    },
  })

  useEffect(() => {
    const values = loadFormFromLocal({
      key: 'lawSchool',
      fallback: lawSchoolFormDefaultValues,
    })
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

  useEffect(() => {
    if (visitedStepsRef.current.has(stepper.currentStep)) return
    if (forcedErrorStepsRef.current.has(stepper.currentStep)) return

    const timer = setTimeout(() => {
      stepper.currentConfig.fields.forEach((field) => {
        const currentValue = form.getFieldValue(field as never)
        if (isEmptyValue(currentValue)) {
          form.setFieldMeta(field as never, (prev) => ({
            ...prev,
            isTouched: false,
          }))
        }
      })
    }, 0)

    visitedStepsRef.current.add(stepper.currentStep)
    return () => clearTimeout(timer)
  }, [form, stepper.currentConfig.fields, stepper.currentStep])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (justAdvancedRef.current) {
      justAdvancedRef.current = false
      return
    }

    if (!stepper.isLast) return

    const result = lawSchoolFormSchema.safeParse(form.state.values)

    if (!result.success) {
      const firstFailedPath = result.error.issues[0]?.path?.join('.')
      if (firstFailedPath) {
        const failingStepIndex = LAW_SCHOOL_STEPS.findIndex((step) =>
          step.fields.includes(firstFailedPath),
        )

        if (failingStepIndex !== -1) {
          visitedStepsRef.current.add(failingStepIndex)
          forcedErrorStepsRef.current.add(failingStepIndex)
          stepper.goTo(failingStepIndex)

          const failingFields = LAW_SCHOOL_STEPS[failingStepIndex]?.fields ?? []
          failingFields.forEach((field) => {
            form.setFieldMeta(field as never, (prev) => ({
              ...prev,
              isTouched: true,
            }))
          })

          void Promise.all(
            failingFields.flatMap((field) => [
              form.validateField(field as never, 'change'),
              form.validateField(field as never, 'blur'),
            ]),
          )
        }
      }
      return
    }

    saveFormToLocal({
      key: 'lawSchool',
      value: form.state.values,
      schema: lawSchoolFormDraftSchema,
    })

    await form.handleSubmit()
    form.reset(form.state.values, { keepDefaultValues: true })
    stepper.goTo(stepper.totalSteps - 1)
  }

  const handleStepNext = async () => {
    const schema = LAW_SCHOOL_STEP_SCHEMAS[stepper.currentStep]
    if (!schema) return true

    const result = schema.safeParse(form.state.values)

    if (result.success) {
      const nextFields = LAW_SCHOOL_STEPS[stepper.currentStep + 1]?.fields ?? []
      nextFields.forEach((field) => {
        const currentValue = form.getFieldValue(field as never)
        if (isEmptyValue(currentValue)) {
          form.setFieldMeta(field as never, (prev) => ({
            ...prev,
            isTouched: false,
          }))
        }
      })

      forcedErrorStepsRef.current.delete(stepper.currentStep)
      justAdvancedRef.current = true
      setTimeout(() => {
        justAdvancedRef.current = false
      }, 0)
      return true
    }

    forcedErrorStepsRef.current.add(stepper.currentStep)
    stepper.currentConfig.fields.forEach((field) => {
      form.setFieldMeta(field as never, (prev) => ({
        ...prev,
        isTouched: true,
      }))
    })

    await Promise.all(
      stepper.currentConfig.fields.flatMap((field) => [
        form.validateField(field as never, 'change'),
        form.validateField(field as never, 'blur'),
      ]),
    )

    return false
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
              setInitialValues(lawSchoolFormDefaultValues)
              visitedStepsRef.current = new Set([0])
              forcedErrorStepsRef.current = new Set()
              justAdvancedRef.current = false
              setResetVersion((value) => value + 1)
              stepper.goTo(0)
            }}
          />

          {stepper.isLast && (
            <div className="px-6 pb-4 flex justify-end">
              <form.FormErrorMessage />
            </div>
          )}
        </form.AppForm>
      </form>
    </StepperFormWrapper>
  )
}
