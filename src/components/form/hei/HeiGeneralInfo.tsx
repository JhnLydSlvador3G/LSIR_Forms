import { heiFormDefaultValues } from './HeiForm.types'
import { withForm } from '@/hooks/useFormContext'

const HeiGeneral = withForm({
  defaultValues: heiFormDefaultValues,
  render: function Render({ form }) {
    return (
      <div className="flex flex-col gap-4">
        <form.AppField
          name="heiName"
          validators={{
            onBlur: ({ value }) => (!value?.trim() ? 'Required' : undefined),
            onChange: ({ value }) => (!value?.trim() ? 'Required' : undefined),
          }}
        >
          {(field) => (
            <field.TextField label="HEI Name" htmlForVal="heiName" required />
          )}
        </form.AppField>

        <div className="flex flex-wrap items-start justify-start gap-5">
          <form.AppField
            name="heiOwnership"
            validators={{
              onBlur: ({ value }) => (!value ? 'Required' : undefined),
              onChange: ({ value }) => (!value ? 'Required' : undefined),
            }}
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
                validators={{
                  onBlur: ({ value, fieldApi }) => {
                    const ownership = fieldApi.form.getFieldValue('heiOwnership')
                    if (ownership === 'private' && !value) return 'Required'
                    return undefined
                  },
                  onChange: ({ value, fieldApi }) => {
                    const ownership = fieldApi.form.getFieldValue('heiOwnership')
                    if (ownership === 'private' && !value) return 'Required'
                    return undefined
                  },
                }}
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
            validators={{
              onBlur: ({ value }) => (!value ? 'Required' : undefined),
              onChange: ({ value }) => (!value ? 'Required' : undefined),
            }}
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
              <form.AppField
                name="heiOther"
                validators={{
                  onBlur: ({ value, fieldApi }) => {
                    const currentHeiType = fieldApi.form.getFieldValue('heiType')
                    if (currentHeiType === 'others' && !value?.trim()) {
                      return 'Please specify'
                    }
                    return undefined
                  },
                  onChange: ({ value, fieldApi }) => {
                    const currentHeiType = fieldApi.form.getFieldValue('heiType')
                    if (currentHeiType === 'others' && !value?.trim()) {
                      return 'Please specify'
                    }
                    return undefined
                  },
                }}
              >
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

        <div className="flex flex-row items-start gap-3">
          <form.AppField
            name="heiTelNumber"
            validators={{
              onBlur: ({ value }) => (!value?.trim() ? 'Required' : undefined),
              onChange: ({ value }) => (!value?.trim() ? 'Required' : undefined),
            }}
          >
            {(field) => (
              <field.TextField
                label="HEI Telephone Number"
                htmlForVal="heiTelNumber"
                required
              />
            )}
          </form.AppField>
          <form.AppField
            name="heiEmail"
            validators={{
              onBlur: ({ value }) => {
                if (!value?.trim()) return 'Required'
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                  ? undefined
                  : 'Invalid Email'
              },
              onChange: ({ value }) => {
                if (!value?.trim()) return 'Required'
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                  ? undefined
                  : 'Invalid Email'
              },
            }}
          >
            {(field) => (
              <field.TextField
                label="HEI Email Address"
                htmlForVal="heiEmail"
                required
              />
            )}
          </form.AppField>
        </div>

        <form.AppField
          name="heiWebsite"
          validators={{
            onBlur: ({ value }) => {
              if (!value?.trim()) return undefined
              try {
                new URL(value.trim())
                return undefined
              } catch {
                return 'Invalid URL'
              }
            },
            onChange: ({ value }) => {
              if (!value?.trim()) return undefined
              try {
                new URL(value.trim())
                return undefined
              } catch {
                return 'Invalid URL'
              }
            },
          }}
        >
          {(field) => (
            <field.TextField label="HEI Website" htmlForVal="heiWebsite" />
          )}
        </form.AppField>
      </div>
    )
  },
})

export default HeiGeneral
