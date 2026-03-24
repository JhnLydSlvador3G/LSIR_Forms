import {
  lawSchoolFormDefaultValues,
  type LawSchoolDeanDegreeFieldPaths,
} from './LawSchoolForm.types'
import { withForm } from '@/hooks/form-context'

// Section component used by `src/components/form/lawschool/LawSchoolForm.tsx`.
// It renders the Dean's academic background area.
const LawSchoolDeanDegree = withForm({
  defaultValues: lawSchoolFormDefaultValues,
  props: {
    fields: {
      highestDegreeType: 'dean.degree.highestDegreeType',
      rollNumber: 'dean.degree.rollNumber',
      yearsTeachingExp: 'dean.degree.yearsTeachingExp',
      yearsAdminExp: 'dean.degree.yearsAdminExp',
    } as LawSchoolDeanDegreeFieldPaths,
  },
  render: function Render({ form, fields }) {
    return (
      <div className="flex flex-col gap-4">
        <form.AppField name={fields.highestDegreeType as any}>
          {(field) => (
            <field.ComboboxField
              label="Highest Academic Degree Attained in Legal Education"
              htmlForVal={fields.highestDegreeType}
              required
              className="w-full"
              options={[
                { value: 'Basic Law Course', label: 'Basic Law Course' },
                {
                  value: "Units in Master's Degree in Law",
                  label: "Units in Master's Degree in Law",
                },
                {
                  value: "Master's Degree in Law",
                  label: "Master's Degree in Law",
                },
                {
                  value: 'Units in Doctorate Degree in Law',
                  label: 'Units in Doctorate Degree in Law',
                },
                {
                  value: 'Doctorate Degree in Law',
                  label: 'Doctorate Degree in Law',
                },
              ]}
            />
          )}
        </form.AppField>

        <form.AppField
          name={fields.rollNumber as any}
          children={(field) => (
            <field.LabeledNumberField
              label="Roll Number"
              htmlForVal={fields.rollNumber}
              required
              className="w-full max-w-xs"
            />
          )}
        />

        <form.AppField
          name={fields.yearsTeachingExp as any}
          children={(field) => (
            <field.LabeledNumberField
              label="Years of Teaching Experience in Law School"
              htmlForVal={fields.yearsTeachingExp}
              required
              className="w-full max-w-xs"
            />
          )}
        />

        <form.AppField
          name={fields.yearsAdminExp as any}
          children={(field) => (
            <field.LabeledNumberField
              label="Years of Administrative Experience in Law School"
              htmlForVal={fields.yearsAdminExp}
              required
              className="w-full max-w-xs"
            />
          )}
        />
      </div>
    )
  },
})

export default LawSchoolDeanDegree
