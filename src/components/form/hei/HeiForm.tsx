import AddressForm from '../address/AddressForm'
import { FormWrapper } from '../FormWrapper'
import { heiFormDefaultValues, heiFormSchema } from './HeiForm.types'
import HeiGeneral from './HeiGeneralInfo'
import HeiPersonel from './HeiPersonel'
import { SectionWrapper } from './HeiSectionWrapper'
import type z from 'zod'
import { useAppForm } from '@/hooks/form-context'
import SubscribeButton from '@/components/ui/form/SubscribeButton'
import ResetButton from '@/components/ui/form/ResetButton'
import SaveButton from '@/components/ui/form/SaveButton'

function saveToLocal({ value }: { value: z.infer<typeof heiFormSchema> }) {
  console.log('Parsing...')
  localStorage.setItem('hei', JSON.stringify(value))
}

export default function HeiForm() {
  const data = localStorage.getItem('hei')
  let prevFormValues: z.infer<typeof heiFormSchema>
  prevFormValues = JSON.parse(data as string)

  const form = useAppForm({
    defaultValues: prevFormValues ?? heiFormDefaultValues,
    validators: {
      onChange: heiFormSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  return (
    <FormWrapper title="HEI General Information">
      <form
        className="w-full flex flex-col"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
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
            title="HEI President"
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
              <ResetButton />
              <SaveButton
                saveToLocal={() =>
                  saveToLocal({ value: form.store.state.values })
                }
              />
            </div>

            <SubscribeButton label="Submit" />
          </div>
        </form.AppForm>
      </form>
    </FormWrapper>
  )
}
