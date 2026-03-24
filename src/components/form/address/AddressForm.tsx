import { AddressDefaultValues } from './AddressForm.type'
import { withForm } from '@/hooks/form-context'

const requiredText = (value: string | undefined) =>
  !value?.trim() ? 'Required' : undefined

const regionOptions = [
  { value: 'Ilocos Region (Region I)', label: 'Ilocos Region (Region I)' },
  { value: 'Cagayan Valley (Region II)', label: 'Cagayan Valley (Region II)' },
  { value: 'Central Luzon (Region III)', label: 'Central Luzon (Region III)' },
  { value: 'CALABARZON (Region IV-A)', label: 'CALABARZON (Region IV-A)' },
  { value: 'MIMAROPA (Region IV-B)', label: 'MIMAROPA (Region IV-B)' },
  { value: 'Bicol Region (Region V)', label: 'Bicol Region (Region V)' },
  { value: 'Western Visayas (Region VI)', label: 'Western Visayas (Region VI)' },
  { value: 'Central Visayas (Region VII)', label: 'Central Visayas (Region VII)' },
  { value: 'Eastern Visayas (Region VIII)', label: 'Eastern Visayas (Region VIII)' },
  { value: 'Zamboanga Peninsula (Region IX)', label: 'Zamboanga Peninsula (Region IX)' },
  { value: 'Northern Mindanao (Region X)', label: 'Northern Mindanao (Region X)' },
  { value: 'Davao Region (Region XI)', label: 'Davao Region (Region XI)' },
  { value: 'SOCCSKSARGEN (Region XII)', label: 'SOCCSKSARGEN (Region XII)' },
  { value: 'Caraga (Region XIII)', label: 'Caraga (Region XIII)' },
  {
    value: 'Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)',
    label: 'Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)',
  },
  {
    value: 'Cordillera Administrative Region (CAR)',
    label: 'Cordillera Administrative Region (CAR)',
  },
  {
    value: 'National Capital Region (NCR)',
    label: 'National Capital Region (NCR)',
  },
] as const

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
        <form.AppField
          name={fields.street as any}
          validators={{
            onBlur: ({ value }) => requiredText(value),
            onChange: ({ value }) => requiredText(value),
          }}
        >
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
          <form.AppField
            name={fields.barangay as any}
            validators={{
              onBlur: ({ value }) => requiredText(value),
              onChange: ({ value }) => requiredText(value),
            }}
          >
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
          <form.AppField
            name={fields.cityMult as any}
            validators={{
              onBlur: ({ value }) => requiredText(value),
              onChange: ({ value }) => requiredText(value),
            }}
          >
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
          <form.AppField
            name={fields.province as any}
            validators={{
              onBlur: ({ value }) => requiredText(value),
              onChange: ({ value }) => requiredText(value),
            }}
          >
            {(field) => (
              <field.TextField
                label="Province"
                htmlForVal={fields.province}
                required
              />
            )}
          </form.AppField>

          {/* Region -- required */}
          <form.AppField
            name={fields.region as any}
            validators={{
              onBlur: ({ value }) => requiredText(value),
              onChange: ({ value }) => requiredText(value),
            }}
          >
            {(field) => (
              <field.ComboboxField
                label="Region"
                htmlForVal={fields.region}
                required
                allowCustomInput={false}
                placeholder="Select region"
                searchPlaceholder="Search region..."
                options={regionOptions.map((option) => ({ ...option }))}
              />
            )}
          </form.AppField>
        </div>
      </fieldset>
    )
  },
})

export default AddressGroup
