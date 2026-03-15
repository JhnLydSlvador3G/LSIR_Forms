import { withForm } from '@/hooks/useFormContext'
import { progInfoDefaultValues, CURRICULAR_SCHEDULES } from './ProgInfo.types'

const scheduleOptions = CURRICULAR_SCHEDULES.map((s) => ({ value: s, label: s }))

const ProgInfoCurricularSched = withForm({
  defaultValues: progInfoDefaultValues,
  render: function Render({ form }) {
    return (
      <div className="flex flex-col gap-4">

        <form.AppField
          name="curricularSchedule"
          children={(field) => (
            <field.SelectField
              label="Schedule"
              htmlForVal="curricularSchedule"
              required
              options={scheduleOptions}
            />
          )}
        />
      </div>
    )
  },
})

export default ProgInfoCurricularSched
