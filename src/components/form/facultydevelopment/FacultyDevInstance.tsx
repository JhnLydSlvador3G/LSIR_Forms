import { X } from 'lucide-react'
import { FacultyActivityDefaultValues } from './FacultyDev.type'
import { withForm } from '@/hooks/form-context'
import { cn } from '@/lib/utils'

const defaultValues = {
  activities: FacultyActivityDefaultValues,
}

const FacultyDevelopmentInstance = withForm({
  defaultValues,
  render: function Render({ form }) {
    return (
      <div>
        <form.Field name="activities" mode="array">
          {(field) =>
            field.state.value.map((_, i) => (
              <div key={i} className="border-b-2 border-leb pt-3 pb-5">
                <button
                  className={cn(
                    'flex justify-center items-center',
                    'inset-x-0',
                    'p-0.5',
                    'h-5 w-5',
                    'bg-red-400',
                    'rounded-sm',
                  )}
                  onClick={() => field.removeValue(i)}
                >
                  <X />
                </button>
                <div className="text-center font-bold text-2xl">
                  Activity {`${i + 1}`}
                </div>
                <form.AppField name={`activities[${i}].activityTitle`}>
                  {(subfield) => {
                    return (
                      <subfield.TextField
                        label="Activity Title"
                        htmlForVal={`activities[${i}].activityTitle`}
                        required
                      />
                    )
                  }}
                </form.AppField>
                <div className="flex flex-row gap-4">
                  <form.AppField name={`activities[${i}].trainingHours`}>
                    {(subfield) => {
                      return (
                        <subfield.TextField
                          label="Training Hours"
                          htmlForVal={`activities[${i}].activityTitle`}
                        />
                      )
                    }}
                  </form.AppField>
                  <form.AppField name={`activities[${i}].participantCount`}>
                    {(subfield) => {
                      return (
                        <subfield.TextField
                          label="Participant Count"
                          htmlForVal={`activities[${i}].participantCount`}
                        />
                      )
                    }}
                  </form.AppField>
                </div>

                <div className="flex flex-row gap-4 justify-center items-end">
                  <form.AppField name={`activities[${i}].startDate`}>
                    {(subfield) => {
                      return (
                        <subfield.DateField
                          label="Start Date"
                          htmlForVal={`activities[${i}].startDate`}
                        />
                      )
                    }}
                  </form.AppField>
                  <div className="py-3">To</div>
                  <form.AppField name={`activities[${i}].endDate`}>
                    {(subfield) => {
                      return (
                        <subfield.DateField
                          label="End Date"
                          htmlForVal={`activities[${i}].endDate`}
                        />
                      )
                    }}
                  </form.AppField>
                </div>
                <div>
                  <form.AppField name={`activities[${i}].competencies`}>
                    {(subfield) => {
                      return (
                        <subfield.TextAreaField
                          label="Learned Competencies"
                          htmlForVal={`activities[${i}].competencies`}
                        />
                      )
                    }}
                  </form.AppField>
                </div>
              </div>
            ))
          }
        </form.Field>
      </div>
    )
  },
})

export default FacultyDevelopmentInstance
