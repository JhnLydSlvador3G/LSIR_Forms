import { heiFormDefaultValues } from './HeiForm.types'
import { withForm } from '@/hooks/useFormContext'

const HeiGeneral = withForm({
  defaultValues: heiFormDefaultValues,
  render: function Render({ form }) {
    return (
      <div className="flex flex-col gap-4">
        <form.AppField name="heiName">
          {(field) => (
            <field.TextField label="HEI Name" htmlForVal="heiName" required />
          )}
        </form.AppField>

        <div className="flex flex-wrap justify-start gap-5">
          <form.AppField
            name="heiOwnership"
            listeners={{
              onChange: ({ value }) => {
                if (value !== 'private') {
                  form.setFieldValue('privateOwnerShip', '')
                }
                void Promise.all([
                  form.validateField('heiOwnership' as never, 'change'),
                  form.validateField('heiOwnership' as never, 'blur'),
                ])
              },
            }}
          >
            {(field) => (
              <field.SelectField
                className="min-w-0 flex-1 basis-64"
                label="Ownership Type"
                htmlForVal="heiOwnership"
                required
                options={[
                  { value: 'public', label: 'Public' },
                  { value: 'private', label: 'Private' },
                ]}
              />
            )}
          </form.AppField>

          <form.Subscribe selector={(state) => state.values.heiOwnership}>
            {(ownership) => (
              <form.AppField
                name="privateOwnerShip"
              >
                {(field) => (
                  <field.SelectField
                    className="min-w-0 flex-1 basis-64"
                    label="Private Classification"
                    htmlForVal="privateOwnerShip"
                    required={ownership === 'private'}
                    disabled={ownership !== 'private'}
                    options={[
                      { value: 'sectarian', label: 'Sectarian' },
                      { value: 'non-sectarian', label: 'Non-Sectarian' },
                    ]}
                  />
                )}
              </form.AppField>
            )}
          </form.Subscribe>

          <form.AppField
            name="heiType"
            listeners={{
              onChange: ({ value }) => {
                if (value !== 'others') {
                  form.setFieldValue('heiOther', '')
                }
                void Promise.all([
                  form.validateField('heiType' as never, 'change'),
                  form.validateField('heiType' as never, 'blur'),
                ])
              },
            }}
          >
            {(field) => (
              <field.SelectField
                className="min-w-0 flex-1 basis-64"
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
          </form.AppField>
        </div>

        <form.Subscribe selector={(state) => state.values.heiType}>
          {(heiType) =>
            heiType === 'others' ? (
              <form.AppField name="heiOther">
                {(field) => (
                  <field.TextField
                    label="Please specify"
                    htmlForVal="heiOther"
                    required
                    className="max-w-md"
                  />
                )}
              </form.AppField>
            ) : null
          }
        </form.Subscribe>

        <div className="flex flex-row gap-3">
          <form.AppField name="heiTelNumber">
            {(field) => (
              <field.TextField
                label="HEI Telephone Number"
                htmlForVal="heiTelNumber"
                required
              />
            )}
          </form.AppField>
          <form.AppField name="heiEmail">
            {(field) => (
              <field.TextField
                label="HEI Email Address"
                htmlForVal="heiEmail"
                required
              />
            )}
          </form.AppField>
        </div>

        <form.AppField name="heiWebsite">
          {(field) => (
            <field.TextField label="HEI Website" htmlForVal="heiWebsite" />
          )}
        </form.AppField>
      </div>
    )
  },
})

export default HeiGeneral
