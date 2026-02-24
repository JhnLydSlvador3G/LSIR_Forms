import { AddressDefaultValues } from './AddressForm.type'
import { withFieldGroup } from '@/hooks/form-context'

// The defaultValues here are *only used for type inference*
const AddressGroup = withFieldGroup({
  defaultValues: AddressDefaultValues,
  render({ group }) {
    return (
      <fieldset className="flex flex-col gap-2 mb-4">
        <group.AppField name="building">
          {(field) => (
            <field.TextField label="Building" htmlForVal="building" />
          )}
        </group.AppField>

        <group.AppField name="street">
          {(field) => (
            <field.TextField label="Street" htmlForVal="street" required />
          )}
        </group.AppField>

        <div className="flex flex-row gap-3">
          <group.AppField name="barangay">
            {(field) => (
              <field.TextField
                label="Barangay"
                htmlForVal="barangay"
                required
              />
            )}
          </group.AppField>

          <group.AppField name="district">
            {(field) => (
              <field.TextField label="District" htmlForVal="District" />
            )}
          </group.AppField>

          <group.AppField name="cityMult">
            {(field) => (
              <field.TextField
                label="City/Municipality"
                htmlForVal="cityMult"
                required
              />
            )}
          </group.AppField>
        </div>

        <div className="flex flex-row gap-3">
          <group.AppField name="province">
            {(field) => (
              <field.TextField
                label="Province"
                htmlForVal="province"
                required
              />
            )}
          </group.AppField>

          <group.AppField name="region">
            {(field) => (
              <field.TextField label="Region" htmlForVal="region" required />
            )}
          </group.AppField>
        </div>
      </fieldset>
    )
  },
})

export default AddressGroup
