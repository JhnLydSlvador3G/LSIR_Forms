import { useEffect } from 'react'
import AddressForm from '../address/AddressForm'
import { FormWrapper } from '../FormWrapper'
import { heiFormDefaultValues, heiFormSchema } from './HeiForm.types'
import HeiGeneral from './HeiGeneralInfo'
import HeiPersonel from './HeiPersonel'
import { SectionWrapper } from './HeiSectionWrapper'
import { useAppForm } from '@/hooks/form-context'
import SubscribeButton from '@/components/ui/form/SubscribeButton'
import ResetButton from '@/components/ui/form/ResetButton'
import SaveButton from '@/components/ui/form/SaveButton'
import { loadFormFromLocal } from '@/lib/formLocalStorage'

export default function HeiForm() {
  const form = useAppForm({
    defaultValues: heiFormDefaultValues,
    validators: {
      onChange: heiFormSchema,
      onMount: heiFormSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  // load persisted values only on the client after mount; the server will
  // always render using the fallback, avoiding a hydration mismatch.
  useEffect(() => {
    const prev = loadFormFromLocal({
      key: 'hei',
      fallback: heiFormDefaultValues,
    })
    form.reset(prev ?? heiFormDefaultValues)
  }, [form])

  return (
    <FormWrapper title="HEI General Information">
      <form
        className="w-full flex flex-col"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()

          const isValid = form.validateAllFields('submit')

          if (!isValid) return

          form.handleSubmit()
        }}
      >
        <SectionWrapper title="HEI General Information">
          <HeiGeneral form={form} />
        </SectionWrapper>
        <SectionWrapper title="HEI Address">
          <AddressForm
            form={form}
            fields={{
              building: 'heiAdd.building',
              street: 'heiAdd.street',
              barangay: 'heiAdd.barangay',
              district: 'heiAdd.district',
              cityMult: 'heiAdd.cityMult',
              province: 'heiAdd.province',
              region: 'heiAdd.region',
            }}
          />
        </SectionWrapper>

        <SectionWrapper title="HEI President">
          <HeiPersonel
            form={form}
            title="HEI President"
            type="heiPres"
            fields={{
              firstName: 'heiPres.firstName',
              middleName: 'heiPres.middleName',
              lastName: 'heiPres.lastName',
              suffix: 'heiPres.suffix',
              credential: 'heiPres.credential',
              email: 'heiPres.email',
              telNum: 'heiPres.telNum',
            }}
          />
        </SectionWrapper>
        <SectionWrapper title="HEI Registrar">
          <HeiPersonel
            form={form}
            title="HEI Registrar"
            type="heiReg"
            fields={{
              firstName: 'heiReg.firstName',
              middleName: 'heiReg.middleName',
              lastName: 'heiReg.lastName',
              suffix: 'heiReg.suffix',
              credential: 'heiReg.credential',
              email: 'heiReg.email',
              telNum: 'heiReg.telNum',
            }}
          />
        </SectionWrapper>
        <form.AppForm>
          <div className="flex justify-between mt-5">
            <div className="flex flex-row gap-4">
              <ResetButton defaultVal={heiFormDefaultValues} />
              <SaveButton getValue={() => form.state.values} storageKey="hei" />
            </div>

            <SubscribeButton label="Submit" />
          </div>
        </form.AppForm>
      </form>
    </FormWrapper>
  )
}
