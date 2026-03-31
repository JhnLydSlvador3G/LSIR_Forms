import { heiFormDefaultValues } from './HeiForm.types'
import type { HeiPersonelFieldPaths } from './HeiPersonel.type'
import { withForm } from '@/hooks/useFormContext'

const HeiPersonel = withForm({
  defaultValues: heiFormDefaultValues,
  props: {
    fields: {
      firstName: 'heiPres.firstName',
      middleName: 'heiPres.middleName',
      lastName: 'heiPres.lastName',
      suffix: 'heiPres.suffix',
      credential: 'heiPres.credential',
      email: 'heiPres.email',
      telNum: 'heiPres.telNum',
    } as HeiPersonelFieldPaths,
    isActive: true,
  },

  render: function Render({ form, fields, isActive }) {
    return (
      <fieldset className="flex flex-col gap-4">
        <div className="flex flex-row gap-3">
          <form.AppField
            name={fields.firstName as any}
            validators={
              isActive
                ? {
                    onBlur: ({ value }) => (!value?.trim() ? 'Required' : undefined),
                    onChange: ({ value }) => (!value?.trim() ? 'Required' : undefined),
                  }
                : undefined
            }
          >
            {(field) => (
              <field.TextField
                label="First Name"
                htmlForVal={fields.firstName}
                className="flex-3"
                required
              />
            )}
          </form.AppField>
          <form.AppField name={fields.middleName as any}>
            {(field) => (
              <field.TextField
                label="Middle Name"
                htmlForVal={fields.middleName}
                className="flex-3"
              />
            )}
          </form.AppField>
          <form.AppField
            name={fields.lastName as any}
            validators={
              isActive
                ? {
                    onBlur: ({ value }) => (!value?.trim() ? 'Required' : undefined),
                    onChange: ({ value }) => (!value?.trim() ? 'Required' : undefined),
                  }
                : undefined
            }
          >
            {(field) => (
              <field.TextField
                label="Last Name"
                htmlForVal={fields.lastName}
                className="flex-3"
                required
              />
            )}
          </form.AppField>
          <form.AppField name={fields.suffix as any}>
            {(field) => (
              <field.TextField
                label="Suffix"
                htmlForVal={fields.suffix}
                className="flex-1"
              />
            )}
          </form.AppField>
        </div>

        <div className="flex flex-row gap-3">
          <form.AppField
            name={fields.email as any}
            validators={
              isActive
                ? {
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
                  }
                : undefined
            }
          >
            {(field) => (
              <field.TextField
                label="Email"
                htmlForVal={fields.email}
                className="flex-1"
                required
              />
            )}
          </form.AppField>
          <form.AppField
            name={fields.telNum as any}
            validators={
              isActive
                ? {
                    onBlur: ({ value }) => {
                      const trimmed = value?.trim() ?? ''
                      if (!trimmed) return 'Required'
                      return /^(09|\+639)\d{9}$/.test(trimmed)
                        ? undefined
                        : 'Invalid Number'
                    },
                    onChange: ({ value }) => {
                      const trimmed = value?.trim() ?? ''
                      if (!trimmed) return 'Required'
                      return /^(09|\+639)\d{9}$/.test(trimmed)
                        ? undefined
                        : 'Invalid Number'
                    },
                  }
                : undefined
            }
          >
            {(field) => (
              <field.TextField
                label="Mobile Number"
                htmlForVal={fields.telNum}
                className="flex-1"
                required
              />
            )}
          </form.AppField>
        </div>
      </fieldset>
    )
  },
})

export default HeiPersonel
