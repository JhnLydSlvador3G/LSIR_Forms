import { useEffect, useRef, useState } from 'react'
import { StepperFormWrapper } from '../StepperFormWrapper'
import AddressForm from '../address/AddressForm'
import {
  HEI_ADDRESS_FIELDS,
  HEI_PRESIDENT_FIELDS,
  HEI_REGISTRAR_FIELDS,
  HEI_STEPS,
  HEI_STEP_SCHEMAS,
  type HeiFormData,
  type HeiOwnership,
  type HeiType,
  heiFormDefaultValues,
  heiFormDraftSchema,
  heiFormSchema,
} from './HeiForm.types'
import HeiGeneral from './HeiGeneralInfo'
import HeiPersonel from './HeiPersonel'
import { SectionWrapper } from './HeiSectionWrapper'
import { useAppForm } from '@/hooks/form-context'
import { StepperNav } from '@/components/ui/stepper/StepperNav'
import { useStepper } from '@/hooks/useStepper'
import { saveFormToLocal } from '@/lib/formLocalStorage'

const isEmptyValue = (value: unknown) =>
  value === undefined ||
  value === null ||
  (typeof value === 'string' && value.trim() === '') ||
  (Array.isArray(value) && value.length === 0)

const isHeiOwnership = (value: unknown): value is HeiOwnership =>
  value === 'private' || value === 'public'

const isHeiType = (value: unknown): value is HeiType =>
  value === 'university' || value === 'college' || value === 'others'

const normalizeHeiDraft = (value: unknown): HeiFormData => {
  const draft = (value as Partial<HeiFormData>) ?? {}
  const ownership = isHeiOwnership(draft.heiOwnership)
    ? draft.heiOwnership
    : heiFormDefaultValues.heiOwnership
  const heiType = isHeiType(draft.heiType)
    ? draft.heiType
    : heiFormDefaultValues.heiType

  return {
    ...heiFormDefaultValues,
    ...draft,
    heiAdd: {
      ...heiFormDefaultValues.heiAdd,
      ...draft.heiAdd,
    },
    heiPres: {
      ...heiFormDefaultValues.heiPres,
      ...draft.heiPres,
      credential: draft.heiPres?.credential ?? heiFormDefaultValues.heiPres.credential,
    },
    heiReg: {
      ...heiFormDefaultValues.heiReg,
      ...draft.heiReg,
      credential: draft.heiReg?.credential ?? heiFormDefaultValues.heiReg.credential,
    },
    heiOwnership: ownership,
    privateOwnerShip: ownership === 'private' ? (draft.privateOwnerShip ?? '') : '',
    heiType,
    heiOther: heiType === 'others' ? (draft.heiOther ?? '') : '',
  }
}

export default function HeiForm() {
  const [initialValues, setInitialValues] = useState<HeiFormData>(() => {
    if (typeof window === 'undefined') return heiFormDefaultValues

    try {
      const raw = localStorage.getItem('hei')
      if (!raw) return heiFormDefaultValues
      return normalizeHeiDraft(JSON.parse(raw))
    } catch {
      return heiFormDefaultValues
    }
  })
  const [formVersion, setFormVersion] = useState(0)

  return (
    <HeiFormContent
      key={formVersion}
      initialValues={initialValues}
      onHardReset={() => {
        setInitialValues(heiFormDefaultValues)
        setFormVersion((value) => value + 1)
      }}
    />
  )
}

function HeiFormContent({
  initialValues,
  onHardReset,
}: {
  initialValues: HeiFormData
  onHardReset: () => void
}) {
  const stepper = useStepper(HEI_STEPS)
  const visitedStepsRef = useRef<Set<number>>(new Set([0]))
  const forcedErrorStepsRef = useRef<Set<number>>(new Set())
  const justAdvancedRef = useRef(false)
  const [resetVersion, setResetVersion] = useState(0)

  const form = useAppForm({
    defaultValues: initialValues,
    validators: {
      onChange: heiFormDraftSchema,
    },
    onSubmit: async ({ value }) => {
      console.log('Submitted:', value)
    },
  })

  const heiSections = [
    {
      key: 'general-information',
      title: 'HEI General Information',
      render: () => <HeiGeneral form={form as any} />,
    },
    {
      key: 'hei-address',
      title: 'HEI Address',
      render: () => <AddressForm form={form as any} fields={HEI_ADDRESS_FIELDS} />,
    },
    {
      key: 'hei-president',
      title: 'HEI President',
      render: () => <HeiPersonel form={form as any} fields={HEI_PRESIDENT_FIELDS} />,
    },
    {
      key: 'hei-registrar',
      title: 'HEI Registrar',
      render: () => <HeiPersonel form={form as any} fields={HEI_REGISTRAR_FIELDS} />,
    },
  ] as const

  const getHeiDraftValues = () => {
    const values = form.state.values
    const ownership = isHeiOwnership(values.heiOwnership)
      ? values.heiOwnership
      : null
    const heiType = isHeiType(values.heiType) ? values.heiType : null

    return {
      ...heiFormDefaultValues,
      ...values,
      heiAdd: {
        ...heiFormDefaultValues.heiAdd,
        ...values.heiAdd,
      },
      heiPres: {
        ...heiFormDefaultValues.heiPres,
        ...values.heiPres,
      },
      heiReg: {
        ...heiFormDefaultValues.heiReg,
        ...values.heiReg,
      },
      heiOwnership: ownership,
      privateOwnerShip: ownership === 'private' ? (values.privateOwnerShip || null) : null,
      heiType,
      heiOther: heiType === 'others' ? (values.heiOther || '') : '',
    }
  }

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

    const result = heiFormSchema.safeParse(form.state.values)

    if (!result.success) {
      const firstFailedPath = result.error.issues[0]?.path?.join('.')
      if (firstFailedPath) {
        const failingStepIndex = HEI_STEPS.findIndex((step) =>
          step.fields.includes(firstFailedPath),
        )

        if (failingStepIndex !== -1) {
          visitedStepsRef.current.add(failingStepIndex)
          forcedErrorStepsRef.current.add(failingStepIndex)
          stepper.goTo(failingStepIndex)

          const failingFields = HEI_STEPS[failingStepIndex]?.fields ?? []
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
      key: 'hei',
      value: getHeiDraftValues(),
    })

    await form.handleSubmit()
    form.reset(form.state.values, { keepDefaultValues: true })
    stepper.goTo(stepper.totalSteps - 1)
  }

  const handleStepNext = async () => {
    const schema = HEI_STEP_SCHEMAS[stepper.currentStep]
    if (!schema) return true

    const result = schema.safeParse(form.state.values)

    if (result.success) {
      const nextFields = HEI_STEPS[stepper.currentStep + 1]?.fields ?? []
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
    <StepperFormWrapper title="HEI General Information" stepper={stepper}>
      <form className="w-full flex flex-col" onSubmit={handleSubmit}>
        {heiSections.map((section, index) => (
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
            storageKey="hei"
            defaultValues={heiFormDefaultValues}
            getValue={getHeiDraftValues}
            savePreferGetValueFirst
            onNext={handleStepNext}
            onReset={() => {
              onHardReset()
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
