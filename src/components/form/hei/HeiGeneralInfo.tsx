import { heiFormDefaultValues } from './HeiForm.types'
import { withForm } from '@/hooks/form-context'

const HeiGeneral = withForm({
  defaultValues: heiFormDefaultValues,
  render: function Render({ form }) {
    return (
      <div>
        <form.AppField
          name="heiName"
          children={(field) => (
            <field.TextField label="HEI Name" htmlForVal="heiName" required />
          )}
        />
        <div className="flex flex-row justify-start gap-5">
          <form.AppField
            name="heiOwnership"
            listeners={{
              onChange: ({ value }) => {
                if (value !== 'private') {
                  form.setFieldValue('privateOwnerShip', '')
                }
              },
            }}
            children={(field) => (
              <field.SelectField
                label="Ownership Type"
                htmlForVal="heiOwnership"
                required
                options={[
                  { value: 'public', label: 'Public' },
                  { value: 'private', label: 'Private' },
                ]}
              />
            )}
          />
          <form.Subscribe selector={(state) => state.values.heiOwnership}>
            {(ownership) => {
              return (
                <form.AppField name="privateOwnerShip">
                  {(field) => {
                    return (
                      <field.SelectField
                        label="Private Classification"
                        htmlForVal="privateOwnership"
                        required={ownership === 'private'}
                        disabled={ownership !== 'private'}
                        options={[
                          { value: 'sectarian', label: 'Sectarian' },
                          { value: 'non-sectarian', label: 'Non-Sectarian' },
                        ]}
                      />
                    )
                  }}
                </form.AppField>
              )
            }}
          </form.Subscribe>
          <form.AppField
            name="heiType"
            children={(field) => (
              <field.SelectField
                label="Type"
                htmlForVal="heiType"
                required
                options={[
                  { value: 'university', label: 'University' },
                  { value: 'college', label: 'College' },
                  { value: 'others', label: 'Others' },
                ]}
              />
            )}
          />
        </div>
        <div className="flex flex-row gap-3">
          <form.AppField
            name="heiTelNumber"
            children={(field) => (
              <field.TextField
                label="HEI Telephone Number"
                htmlForVal="heiType"
                required
              />
            )}
          />
          <form.AppField
            name="heiEmail"
            children={(field) => (
              <field.TextField
                label="HEI Email Address"
                htmlForVal="heiEmail"
                required
              />
            )}
          />
        </div>
        <form.AppField
          name="heiWebsite"
          children={(field) => (
            <field.TextField label="HEI Website" htmlForVal="heiWebsite" />
          )}
        />
      </div>
    )
  },
})

export default HeiGeneral
