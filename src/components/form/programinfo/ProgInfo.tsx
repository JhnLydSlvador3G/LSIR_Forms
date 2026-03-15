import { useEffect } from 'react'
import { useAppForm } from '@/hooks/useFormContext'
import { FormWrapper } from '../FormWrapper'
import { SectionWrapper } from '../hei/HeiSectionWrapper'
import { progInfoDefaultValues, ProgInfoSchema } from './ProgInfo.types'
import ProgInfoProgOffered from './ProgInfoProgOffered'
import SubscribeButton from '@/components/ui/form/SubscribeButton'
import ResetButton from '@/components/ui/form/ResetButton'
import SaveButton from '@/components/ui/form/SaveButton'
import { loadFormFromLocal } from '@/lib/formLocalStorage'

export default function ProgramInfo() {
  const form = useAppForm({
    defaultValues: progInfoDefaultValues,
    validators: {
      onChange: ProgInfoSchema,
      onBlur: ProgInfoSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  //Note: This useEffect is used to load the form data from local storage when the component mounts. 
  // It uses the loadFormFromLocal function to retrieve the data and resets the form with the retrieved values. 
  // If there are no values in local storage, it falls back to the default values defined in progInfoDefaultValues.
  useEffect(() => {
    const prev = loadFormFromLocal({
      key: 'programinfo',
      fallback: progInfoDefaultValues,
    })
    form.reset(prev ?? progInfoDefaultValues)
  }, [form])

  return (
    <FormWrapper title="Program Information">
      <form
        className="w-full flex flex-col"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <SectionWrapper title="Program Offered">
          <ProgInfoProgOffered form={form} />
        </SectionWrapper>

        <form.AppForm>
          <div className="flex justify-between mt-5">
            <div className="flex flex-row gap-4">
              <ResetButton defaultValues={progInfoDefaultValues} storageKey="programinfo" />
              <SaveButton getValue={() => form.state.values} storageKey="programinfo" />
            </div>
            <SubscribeButton label="Submit" />
          </div>
        </form.AppForm>
      </form>
    </FormWrapper>
  )
}
