import { AddressDefaultValues } from './AddressForm.type'
import { withForm } from '@/hooks/form-context'

/**
 * Field path map -- callers pass the full dot-notation paths that exist in
 * their own form schema. This lets one AddressForm component be reused under
 * any parent key (heiAdd.*, mailingAddress.*, etc.) without duplicating UI.
 *
 * Example (HEI form):
 *   fields={{ building: 'heiAdd.building', street: 'heiAdd.street', ... }}
 *
 * Example (Law School form):
 *   fields={{ building: 'mailingAddress.building', street: 'mailingAddress.street', ... }}
 */
export type AddressFieldPaths = {
  building: string
  street: string
  barangay: string
  district: string
  cityMult: string
  province: string
  region: string
}

/**
 * Default paths -- used as the withForm defaultValues type anchor only.
 * The actual paths used at runtime always come from the `fields` prop.
 */
const AddressGroup = withForm({
  defaultValues: AddressDefaultValues,
  props: {
    fields: {
      building: 'building',
      street: 'street',
      barangay: 'barangay',
      district: 'district',
      cityMult: 'cityMult',
      province: 'province',
      region: 'region',
    } as AddressFieldPaths,
  },
  render({ form, fields }) {
    return (
      <fieldset className="flex flex-col gap-2 mb-4">
        {/* Building -- optional */}
        <form.AppField name={fields.building as any}>
          {(field) => (
            <field.TextField label="Building" htmlForVal={fields.building} />
          )}
        </form.AppField>

        {/* Street -- required */}
        <form.AppField name={fields.street as any}>
          {(field) => (
            <field.TextField
              label="Street"
              htmlForVal={fields.street}
              required
            />
          )}
        </form.AppField>

        <div className="flex flex-row gap-3">
          {/* Barangay -- required */}
          <form.AppField name={fields.barangay as any}>
            {(field) => (
              <field.TextField
                label="Barangay"
                htmlForVal={fields.barangay}
                required
              />
            )}
          </form.AppField>

          {/* District -- optional */}
          <form.AppField name={fields.district as any}>
            {(field) => (
              <field.TextField label="District" htmlForVal={fields.district} />
            )}
          </form.AppField>

          {/* City/Municipality -- required */}
          <form.AppField name={fields.cityMult as any}>
            {(field) => (
              <field.TextField
                label="City/Municipality"
                htmlForVal={fields.cityMult}
                required
              />
            )}
          </form.AppField>
        </div>

        <div className="flex flex-row gap-3">
          {/* Province -- required */}
          <form.AppField name={fields.province as any}>
            {(field) => (
              <field.TextField
                label="Province"
                htmlForVal={fields.province}
                required
              />
            )}
          </form.AppField>

          {/* Region -- required */}
          <form.AppField name={fields.region as any}>
            {(field) => (
              <field.TextField
                label="Region"
                htmlForVal={fields.region}
                required
              />
            )}
          </form.AppField>
        </div>
      </fieldset>
    )
  },
})

export default AddressGroup

