import { withForm } from '@/hooks/useFormContext'
import { progInfoDefaultValues, DAYS } from './ProgInfo.types'

const dayOptions = DAYS.map((day) => ({ value: day, label: day }))

const ProgInfoClassOperatingSchedule = withForm({
  defaultValues: progInfoDefaultValues,
  render: function Render({ form }) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-6">
          <form.AppField
            name="classOperatingFrom"
            children={(field) => (
              <field.SelectField
                label="From"
                htmlForVal="classOperatingFrom"
                required
                options={dayOptions}
              />
            )}
          />
          <form.AppField
            name="classOperatingTo"
            children={(field) => (
              <field.SelectField
                label="To"
                htmlForVal="classOperatingTo"
                required
                options={dayOptions}
              />
            )}
          />
        </div>
      </div>
    )
  },
})

export default ProgInfoClassOperatingSchedule
