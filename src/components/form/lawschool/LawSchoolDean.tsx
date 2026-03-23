import { lawSchoolFormDefaultValues } from './LawSchoolForm.types'
import { withForm } from '@/hooks/form-context'

const LawSchoolDean = withForm({
  defaultValues: lawSchoolFormDefaultValues,
  render: function Render({ form }) {
    return (
      <div className="flex flex-col gap-6">
        {/* Row 1: Name */}
        <div className="flex flex-row gap-3">
          <form.AppField name="dean.firstName">
            {(field) => (
              <field.TextField
                label="First Name"
                htmlForVal="dean.firstName"
                className="flex-3"
                required
              />
            )}
          </form.AppField>
          <form.AppField name="dean.middleName">
            {(field) => (
              <field.TextField
                label="Middle Name"
                htmlForVal="dean.middleName"
                className="flex-3"
              />
            )}
          </form.AppField>
          <form.AppField name="dean.lastName">
            {(field) => (
              <field.TextField
                label="Last Name"
                htmlForVal="dean.lastName"
                className="flex-3"
                required
              />
            )}
          </form.AppField>
          <form.AppField name="dean.suffix">
            {(field) => (
              <field.TextField
                label="Suffix"
                htmlForVal="dean.suffix"
                className="flex-1"
              />
            )}
          </form.AppField>
        </div>

        {/* Row 2: Date of Appointment + Email */}
        <div className="flex flex-row gap-4">
          <form.AppField name="dean.dateOfAppointment">
            {(field) => (
              <field.DateField
                label="Date of Appointment"
                htmlForVal="dean.dateOfAppointment"
                required
                className="flex-1"
              />
            )}
          </form.AppField>
          <form.AppField
            name="dean.email"
            children={(field) => (
              <field.TextField
                label="Email Address"
                htmlForVal="dean.email"
                required
                className="flex-1"
              />
            )}
          />
        </div>

        {/* Row 3: Mobile */}
        <div className="flex flex-row gap-4">
          <form.AppField
            name="dean.mobileNumber"
            children={(field) => (
              <field.TextField
                label="Mobile Number"
                htmlForVal="dean.mobileNumber"
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
