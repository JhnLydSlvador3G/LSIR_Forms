import { StudentDefaultValues } from './StudentProfile.types'
import { withForm } from '@/hooks/useFormContext'
import {
  ProfileColumnTotal,
  ProfileGrandTotal,
  ProfileRowTotal,
} from '@/components/ui/form/StudentProfileTotal'

const columnHeaders = [
  'Year Level',
  'Total',
  'Male',
  'Female',
  'Full Time',
  'Working',
  'Scholars',
  'Transfers',
]

const statFields = [
  'male',
  'female',
  'fullTime',
  'working',
  'scholars',
  'transfers',
] as const

const StudentProfileTableForm = withForm({
  defaultValues: {
    profiles: StudentDefaultValues,
  },

  render: function Render({ form }) {
    return (
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-sm ">
          <thead className="bg-lebSecond">
            <tr>
              {columnHeaders.map((field) => {
                return (
                  <th className="p-3 text-lg" key={field}>
                    {field}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            <form.Field name="profiles" mode="array">
              {(field) => {
                return (
                  <>
                    {field.state.value.map((row, i) => {
                      return (
                        <tr className="pb-2" key={row.yearLevel}>
                          <td className="pl-2">{row.yearLevel}</td>
                          <td className="text-center whitespace-nowrap overflow-x-auto">
                            <form.AppForm>
                              <div className="w-20 overflow-auto font-bold">
                                <ProfileRowTotal index={i} />
                              </div>
                            </form.AppForm>
                          </td>
                          {statFields.map((subfield) => {
                            return (
                              <td key={subfield} className="p-1 text-center">
                                <form.AppField
                                  name={`profiles[${i}].${subfield}`}
                                  children={(field) => (
                                    <field.NumberField
                                      htmlForVal={`profiles[${i}].${subfield}`}
                                    />
                                  )}
                                />
                              </td>
                            )
                          })}
                        </tr>
                      )
                    })}
                  </>
                )
              }}
            </form.Field>
            <tr>
              <form.AppForm>
                <td className="text-xl pr-5 font-bold text-right">
                  Total Enrollment:
                </td>
                <td className="text-center text-xl font-bold">
                  <div className="overflow-auto w-20">
                    <ProfileGrandTotal />
                  </div>
                </td>

                {statFields.map((col) => {
                  return (
                    <td
                      className="font-bold text-center overflow-auto"
                      key={col}
                    >
                      <ProfileColumnTotal targetCol={col} />
                    </td>
                  )
                })}
              </form.AppForm>
            </tr>
          </tbody>
        </table>
      </div>
    )
  },
})

export default StudentProfileTableForm
