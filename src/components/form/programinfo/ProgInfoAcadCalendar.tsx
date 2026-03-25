import { withForm } from '@/hooks/useFormContext'
import { progInfoDefaultValues, MONTHS } from './ProgInfo.types'

const monthOptions = MONTHS.map((m) => ({ value: m, label: m }))

const ProgInfoAcadCalendar = withForm({
  defaultValues: progInfoDefaultValues,
  render: function Render({ form }) {
    return (
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="w-full min-w-0">
            <form.AppField
              name="startMonth"
              children={(field) => (
                <field.SelectField
                  label="Starting Month"
                  htmlForVal="startMonth"
                  required
                  options={monthOptions}
                />
              )}
            />
          </div>
          <div className="w-full min-w-0">
            <form.AppField
              name="endMonth"
              children={(field) => (
                <field.SelectField
                  label="Ending Month"
                  htmlForVal="endMonth"
                  required
                  options={monthOptions}
                />
              )}
            />
          </div>
        </div>
      </div>
    )
  },
})

export default ProgInfoAcadCalendar
