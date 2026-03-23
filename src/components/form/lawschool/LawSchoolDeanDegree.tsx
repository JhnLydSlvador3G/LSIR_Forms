import { lawSchoolFormDefaultValues } from './LawSchoolForm.types'
import { withForm } from '@/hooks/form-context'

// Section component used by `src/components/form/lawschool/LawSchoolForm.tsx`.
// It renders the Dean's academic background area.
const LawSchoolDeanDegree = withForm({
  defaultValues: lawSchoolFormDefaultValues,
  render: function Render({ form }) {
    return (
      <div className="flex flex-col gap-4">
        <form.AppField name="dean.degree.highestDegreeType">
          {(field) => (
            <field.ComboboxField
              label="Highest Academic Degree Attained in Legal Education"
              htmlForVal="dean.degree.highestDegreeType"
              required
              className="w-full"
              options={[
                { value: 'basicLawCourse', label: 'Basic Law Course' },
                { value: 'unitsMasters', label: "Units in Master's Degree in Law" },
                { value: 'masters', label: "Master's Degree in Law" },
                { value: 'unitsDoctorate', label: 'Units in Doctorate Degree in Law' },
                { value: 'doctorate', label: 'Doctorate Degree in Law' },
              ]}
            />
          )}
        </form.AppField>

        <form.AppField
          name="dean.degree.rollNumber"
          children={(field) => (
            <field.LabeledNumberField
              label="Roll Number"
              htmlForVal="dean.degree.rollNumber"
              required
              className="w-full max-w-xs"
            />
          )}
        />

        <form.AppField
          name="dean.degree.yearsTeachingExp"
          children={(field) => (
            <field.LabeledNumberField
              label="Years of Teaching Experience in Law School"
              htmlForVal="dean.degree.yearsTeachingExp"
              required
              className="w-full max-w-xs"
            />
          )}
        />

        <form.AppField
          name="dean.degree.yearsAdminExp"
          children={(field) => (
            <field.LabeledNumberField
              label="Years of Administrative Experience in Law School"
              htmlForVal="dean.degree.yearsAdminExp"
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
