import {
  lawSchoolFormDefaultValues,
  type LawSchoolDeanFieldPaths,
} from './LawSchoolForm.types'
import { withForm } from '@/hooks/form-context'

const LawSchoolDean = withForm({
  defaultValues: lawSchoolFormDefaultValues,
  props: {
    fields: {
      firstName: 'dean.firstName',
      middleName: 'dean.middleName',
      lastName: 'dean.lastName',
      suffix: 'dean.suffix',
      dateOfAppointment: 'dean.dateOfAppointment',
      email: 'dean.email',
      mobileNumber: 'dean.mobileNumber',
    } as LawSchoolDeanFieldPaths,
  },
  render: function Render({ form, fields }) {
    return (
      <div className="flex flex-col gap-6">
        {/* Row 1: Name */}
        <div className="flex flex-row gap-3">
          <form.AppField
            name={fields.firstName as any}
            validators={{
              onBlur: ({ value }) => (!value?.trim() ? 'Required' : undefined),
              onChange: ({ value }) => (!value?.trim() ? 'Required' : undefined),
            }}
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
            validators={{
              onBlur: ({ value }) => (!value?.trim() ? 'Required' : undefined),
              onChange: ({ value }) => (!value?.trim() ? 'Required' : undefined),
            }}
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

        {/* Row 2: Date of Appointment + Email */}
        <div className="flex flex-row gap-4">
          <form.AppField
            name={fields.dateOfAppointment as any}
            validators={{
              onBlur: ({ value }) => (!value ? 'Required' : undefined),
              onChange: ({ value }) => (!value ? 'Required' : undefined),
            }}
          >
            {(field) => (
              <field.DateField
                label="Date of Appointment"
                htmlForVal={fields.dateOfAppointment}
                required
                className="flex-1"
              />
            )}
          </form.AppField>
          <form.AppField
            name={fields.email as any}
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
            children={(field) => (
              <field.TextField
                label="Email Address"
                htmlForVal={fields.email}
                required
                className="flex-1"
              />
            )}
          />
        </div>

        {/* Row 3: Mobile */}
        <div className="flex flex-row gap-4">
          <form.AppField
            name={fields.mobileNumber as any}
            validators={{
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
            }}
            children={(field) => (
              <field.TextField
                label="Mobile Number"
                htmlForVal={fields.mobileNumber}
                required
                className="flex-1"
              />
            )}
          />
        </div>
      </div>
    )
  },
})

export default LawSchoolDean
