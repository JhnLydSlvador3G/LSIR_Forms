import { useState } from 'react'
import { StepperFormWrapper } from '../StepperFormWrapper'
import AddressForm from '../address/AddressForm'
import Spinner from '@/components/ui/feedback/Spinner'
import {
  HEI_ADDRESS_FIELDS,
  HEI_PRESIDENT_FIELDS,
  HEI_REGISTRAR_FIELDS,
  HEI_STEPS,
  heiFormDefaultValues,
  heiFormDraftSchema,
  heiFormSchema,
} from './HeiForm.types'
import type { HeiFormData, HeiOwnership, HeiType } from './HeiForm.types'
import HeiGeneral from './HeiGeneralInfo'
import HeiPersonel from './HeiPersonel'
import { SectionWrapper } from './HeiSectionWrapper'
import { useAppForm } from '@/hooks/useFormContext'
import { useMultistepValidation } from '@/hooks/useMultistepValidation'
import { StepperNav } from '@/components/ui/stepper/StepperNav'
import { useStepper } from '@/hooks/useStepper'
import { saveFormToLocal } from '@/lib/formLocalStorage'

const isHeiOwnership = (value: unknown): value is HeiOwnership =>
  value === 'private' || value === 'public'

const isHeiType = (value: unknown): value is HeiType =>
  value === 'university' || value === 'college' || value === 'others'

const getActiveHeiStepFields = (
  values: HeiFormData,
  fieldNames: ReadonlyArray<string>,
) =>
  fieldNames.filter((fieldName) => {
    // Only validate conditional fields when their controlling selection is active.
    if (fieldName === 'privateOwnerShip') {
      return values.heiOwnership === 'private'
    }

    if (fieldName === 'heiOther') {
      return values.heiType === 'others'
    }

    return true
  })

const normalizeHeiDraft = (value: unknown): HeiFormData => {
  const draft = (value as Partial<HeiFormData>) ?? {}
  const ownership = isHeiOwnership(draft.heiOwnership)
    ? draft.heiOwnership
    : ''
  const heiType = isHeiType(draft.heiType)
    ? draft.heiType
    : ''

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
      credential: draft.heiPres?.credential || heiFormDefaultValues.heiPres.credential,
    },
    heiReg: {
      ...heiFormDefaultValues.heiReg,
      ...draft.heiReg,
      credential: draft.heiReg?.credential || heiFormDefaultValues.heiReg.credential,
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
  // HEI keeps useStepper for navigation while shared validation handles Next/Submit.
  const stepper = useStepper(HEI_STEPS)
  const [resetVersion, setResetVersion] = useState(0)

  const form = useAppForm({
    defaultValues: initialValues,
    validators: {
      onChange: heiFormDraftSchema,
    },
    onSubmit: ({ value }) => {
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
      render: () => (
        <HeiPersonel
          form={form as any}
          fields={HEI_PRESIDENT_FIELDS}
          isActive={stepper.currentStep === 2}
        />
      ),
    },
    {
      key: 'hei-registrar',
      title: 'HEI Registrar',
      render: () => (
        <HeiPersonel
          form={form as any}
          fields={HEI_REGISTRAR_FIELDS}
          isActive={stepper.currentStep === 3}
        />
      ),
    },
  ] as const

  const getHeiDraftValues = () => {
    const values = form.state.values
    const ownership = isHeiOwnership(values.heiOwnership)
      ? values.heiOwnership
      : ''
    const heiType = isHeiType(values.heiType) ? values.heiType : null
    const normalizedHeiType = heiType ?? ''

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
      heiType: normalizedHeiType,
      heiOther: normalizedHeiType === 'others' ? (values.heiOther || '') : '',
    }
  }

  const { clearSubmitError, validateCurrentStep, validateBeforeSubmit } =
    useMultistepValidation<HeiFormData>({
      form,
      stepper,
      schema: heiFormSchema,
      // HEI has conditional fields on step 1 that should not error while inactive.
      getActiveFields: ({ values, fields }) =>
        getActiveHeiStepFields(values, fields),
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

    saveFormToLocal({
      key: 'hei',
      value: getHeiDraftValues(),
    })

    await form.handleSubmit()
    form.reset(form.state.values, { keepDefaultValues: true })
    stepper.goTo(stepper.totalSteps - 1)
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
