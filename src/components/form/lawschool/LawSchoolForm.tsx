// Law School General Information (digital version of the paper form).
// Used by the page route: `src/routes/_protected/_form/lawschoolinfo.tsx` → `/lawschoolinfo`.
// Draft persistence:
// - Save/Reset/Load all use the same localStorage key: "lawSchool".
import { useEffect } from 'react'
import { FormWrapper } from '../FormWrapper'
// Reuse the same section layout used in the HEI form.
import { SectionWrapper } from '../hei/HeiSectionWrapper'
// Reuse the shared Address field-group and map it to our schema paths.
import AddressForm from '../address/AddressForm'
import { lawSchoolFormDefaultValues, lawSchoolFormSchema } from './LawSchoolForm.types'
import LawSchoolGeneralInfo from './LawSchoolGeneralInfo'
import LawSchoolDean from './LawSchoolDean'
import LawSchoolDeanDegree from './LawSchoolDeanDegree'
import { useAppForm } from '@/hooks/form-context'
import ResetButton from '@/components/ui/form/ResetButton'
import SaveButton from '@/components/ui/form/SaveButton'
import { loadFormFromLocal } from '@/lib/formLocalStorage'

export default function LawSchoolForm() {
  // Create a TanStack React Form instance, wired to our Zod schema for validation.
  const form = useAppForm({
    defaultValues: lawSchoolFormDefaultValues,
    validators: {
      onChange: lawSchoolFormSchema,
      onBlur: lawSchoolFormSchema,
    },
    // TODO: replace this with a real API call when you’re ready to submit to the backend.
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  // Load a draft from localStorage after the component mounts (client-only).
  // This avoids SSR/client hydration mismatch because localStorage is not available on the server.
  useEffect(() => {
    const prev = loadFormFromLocal({
      // Must match the keys used by SaveButton/ResetButton below.
      key: 'lawSchool',
      fallback: lawSchoolFormDefaultValues,
    })
    form.reset(prev ?? lawSchoolFormDefaultValues)
  }, [form])

  return (
    // Wrap in the standard form card/header UI used across the app.
    <FormWrapper title="Law School General Information">
      <form
        className="w-full flex flex-col"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          // Force validation on submit and stop if any field is invalid.
          const isValid = form.validateAllFields('submit')
          if (!isValid) return
          form.handleSubmit()
        }}
      >
        {/* Section 1: Law School unit details + contacts */}
        <SectionWrapper title="Law School General Information">
          <LawSchoolGeneralInfo form={form} />
        </SectionWrapper>

        {/* Section 2: Mailing Address (reuses AddressForm, mapped to mailingAddress.*) */}
        <SectionWrapper title="Mailing Address">
          <AddressForm
            form={form}
            fields={{
              // These strings are the field paths inside `LawSchoolForm.types.ts`.
              building:  'mailingAddress.building',
              street:    'mailingAddress.street',
              barangay:  'mailingAddress.barangay',
              district:  'mailingAddress.district',
              cityMult:  'mailingAddress.cityMult',
              province:  'mailingAddress.province',
              region:    'mailingAddress.region',
            }}
          />
        </SectionWrapper>

        {/* Section 3: Law Dean */}
        <SectionWrapper title="Law Dean">
          <LawSchoolDean form={form} />
        </SectionWrapper>

        {/* Section 4: Dean's Academic Background */}
        <SectionWrapper title="Dean's Academic Background">
          <LawSchoolDeanDegree form={form} />
        </SectionWrapper>

        {/* Action buttons: Reset clears local draft, Save writes local draft, Submit runs onSubmit */}
        <form.AppForm>
          <div className="flex justify-between mt-5">
            <div className="flex flex-row gap-4">
              <ResetButton defaultValues={lawSchoolFormDefaultValues} storageKey="lawSchool" />
              <SaveButton getValue={() => form.state.values} storageKey="lawSchool" />
            </div>
            <div className="flex flex-col items-end gap-2">
              <form.FormErrorMessage />
              <form.SubscribeButton label="Submit" />
            </div>
          </div>
        </form.AppForm>
      </form>
    </FormWrapper>
  )
}
