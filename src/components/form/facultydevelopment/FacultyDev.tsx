import { useEffect } from 'react'
import { FormWrapper } from '../FormWrapper'
import {
  FacultyActivityDefaultValues,
  FacultyActivityDraftSchema,
  FacultyActivitySchema,
} from './FacultyDev.type'
import FacultyDevelopmentInstance from './FacultyDevInstance'
import { useAppForm } from '@/hooks/form-context'
import SaveButton from '@/components/ui/form/SaveButton'
import ResetButton from '@/components/ui/form/ResetButton'
import SubscribeButton from '@/components/ui/form/SubscribeButton'

import { cn } from '@/lib/utils'
import { loadFormFromLocal } from '@/lib/formLocalStorage'


const defaultValues = {
  activities: FacultyActivityDefaultValues,
}

export default function FacultyActivity() {
  const form = useAppForm({
    defaultValues,
    validators: {
      onChange: FacultyActivitySchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  useEffect(() => {
    const prev = loadFormFromLocal({
      key: 'facultyactivity',
      fallback: defaultValues,
      schema: FacultyActivityDraftSchema,
    })
    form.reset({ activities: prev.activities ?? defaultValues.activities })
  }, [form])

  return (
    <FormWrapper title={'Faculty Activity Development'} noPadding={false}>
      <form
        className="w-full flex flex-col"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <FacultyDevelopmentInstance form={form} />
        <div className="flex justify-center items-center">
          <button
            onClick={() =>
              form.pushFieldValue('activities', FacultyActivityDefaultValues[0])
            }
            type="button"
            className={cn(
              'mx-auto',
              'flex-2 md:flex-none',
              'mt-3',
              'px-2 py-1.5 md:px-8 md:py-3',
              'text-xs md:text-lg',
              'rounded-xl',
              'text-white shadow-lg bg-leb ring-2 ring-[#937bd0]/40',
              'transition-all duration-300 ease-out',
              'hover:scale-105 md:hover:scale-105',
              'disabled:opacity-60 disabled:cursor-not-allowed',
            )}
          >
            Add Activity
          </button>
        </div>
        <form.AppForm>
          <div className="flex justify-between mt-5 m-5">
            <div className="flex flex-row gap-4">
              <ResetButton defaultVal={defaultValues} />
              <SaveButton
                storageKey={'facultyactivity'}
                getValue={() => form.state.values}
                schema={FacultyActivityDraftSchema}
              />
            </div>
            <SubscribeButton label="Submit" />
          </div>
        </form.AppForm>
      </form>
    </FormWrapper>
  )
}
