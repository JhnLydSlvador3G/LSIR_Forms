import { lawSchoolFormDefaultValues } from './LawSchoolForm.types'
import { withForm } from '@/hooks/form-context'

// Section component used by `src/components/form/lawschool/LawSchoolForm.tsx`.
// It renders the top part of the paper form: law programs and contact numbers.
const LawSchoolGeneralInfo = withForm({
  defaultValues: lawSchoolFormDefaultValues,
  render: function Render({ form }) {
    return (
      <div className="flex flex-col gap-4">
        {/* Row 0: Law School Unit Name */}
        <div className="flex flex-col gap-3">
          <form.AppField
            name="lawSchoolUnitName"
            listeners={{
              onChange: ({ value }) => {
                if (value !== 'others') {
                  form.setFieldValue('lawSchoolUnitNameOtherText', '')
                }
              },
            }}
          >
            {(field) => (
              <field.RadioGroupField
                label="Law School Unit Name"
                htmlForVal="lawSchoolUnitName"
                options={[
                  { value: 'lawSchoolGeneralInformation', label: 'Law School General Information' },
                  { value: 'graduateSchoolOfLaw', label: 'Graduate School of Law' },
                  { value: 'others', label: 'Others' },
                ]}
              />
            )}
          </form.AppField>

          <form.Subscribe selector={(state) => state.values.lawSchoolUnitName}>
            {(lawSchoolUnitName) =>
              lawSchoolUnitName === 'others' ? (
                <form.AppField name="lawSchoolUnitNameOtherText">
                  {(field) => (
                    <field.TextField
                      label="Please specify"
                      htmlForVal="lawSchoolUnitNameOtherText"
                      required
                      className="min-w-[260px]"
                    />
                  )}
                </form.AppField>
              ) : null
            }
          </form.Subscribe>
        </div>

        {/* Row 1: Law program (with conditional doctorate type) */}
        <div className="flex flex-col gap-3">
          <form.AppField
            name="lawProgram"
            listeners={{
              onChange: ({ value }) => {
                if (value !== 'doctorate') {
                  form.setFieldValue('doctoralType', undefined)
                  form.setFieldValue('doctoralOtherText', '')
                }
              },
            }}
          >
            {(field) => (
              <field.RadioGroupField
                label="Law Program Classification "
                htmlForVal="lawProgram"
                orientation="horizontal"
                options={[
                  { value: 'jurisDoctor', label: 'Juris Doctor' },
                  { value: 'masterOfLaws', label: 'Master of Laws' },
                  { value: 'doctorate', label: 'Doctorate' },
                ]}
              />
            )}
          </form.AppField>

          <form.Subscribe selector={(state) => state.values.lawProgram}>
            {(lawProgram) =>
              lawProgram === 'doctorate' ? (
                <form.AppField
                  name="doctoralType"
                  listeners={{
                    onChange: ({ value }) => {
                      if (value !== 'others') {
                        form.setFieldValue('doctoralOtherText', '')
                      }
                    },
                  }}
                >
                  {(field) => (
                    <field.RadioGroupField
                      label="Doctorate Type"
                      htmlForVal="doctoralType"
                      options={[
                        { value: 'doctorCivilLaw', label: 'Doctor in Civil Law' },
                        {
                          value: 'doctorJuridicalScience',
                          label: 'Doctor in Juridical Science',
                        },
                        { value: 'others', label: 'Others' },
                      ]}
                    />
                  )}
                </form.AppField>
              ) : null
            }
          </form.Subscribe>

          <form.Subscribe selector={(state) => state.values.doctoralType}>
            {(doctoralType) =>
              doctoralType === 'others' ? (
                <form.AppField name="doctoralOtherText">
                  {(field) => (
                    <field.TextField
                      label="Please specify"
                      htmlForVal="doctoralOtherText"
                      required
                      className="min-w-[260px]"
                    />
                  )}
                </form.AppField>
              ) : null
            }
          </form.Subscribe>
        </div>

        {/* Row 2: Recognition status (with conditional "Others" text) */}
        <div className="flex flex-col gap-3">
          <form.AppField
            name="recognitionStatus"
            listeners={{
              onChange: ({ value }) => {
                if (value !== 'others') {
                  form.setFieldValue('recognitionStatusOtherText', '')
                }
              },
            }}
          >
            {(field) => (
              <field.RadioGroupField
                label="Law School Classification according to recognition status"
                htmlForVal="recognitionStatus"
                options={[
                  { value: 'govPermit1', label: 'Government Permit I' },
                  { value: 'govPermit2', label: 'Government Permit II' },
                  { value: 'govPermit3', label: 'Government Permit III' },
                  { value: 'govRecognition', label: 'Government Recognition' },
                  { value: 'others', label: 'Others' },
                ]}
              />
            )}
          </form.AppField>

          <form.Subscribe selector={(state) => state.values.recognitionStatus}>
            {(recognitionStatus) =>
              recognitionStatus === 'others' ? (
                <form.AppField name="recognitionStatusOtherText">
                  {(field) => (
                    <field.TextField
                      label="Please specify"
                      htmlForVal="recognitionStatusOtherText"
                      required
                      className="min-w-[260px]"
                    />
                  )}
                </form.AppField>
              ) : null
            }
          </form.Subscribe>

          <form.AppField name="accreditationStatus">
            {(field) => (
              <field.RadioGroupField
                label="Law School Classification according accreditation"
                htmlForVal="accreditationStatus"
                options={[
                  { value: 'level1', label: 'Level 1' },
                  { value: 'level2', label: 'Level 2' },
                  { value: 'level3', label: 'Level 3' },
                  {
                    value: 'centerDevelopment',
                    label: 'Center of Development',
                  },
                  { value: 'centerExcellence', label: 'Center of Excellence' },
                  { value: 'deregulatedStatus', label: 'Deregulated Status' },
                  { value: 'autonomousStatus', label: 'Autonomous Status' },
                ]}
              />
            )}
          </form.AppField>
        </div>

        {/* Row 3: Email + Telephone */}
        <div className="flex flex-row gap-4">
          <form.AppField name="email">
            {(field) => (
              <field.TextField
                label="Email Address"
                htmlForVal="email"
                required
                className="flex-1"
              />
            )}
          </form.AppField>
          <form.AppField name="telNumber">
            {(field) => (
              <field.TextField
                label="Telephone Number"
                htmlForVal="telNumber"
                required
                className="flex-1"
              />
            )}
          </form.AppField>
        </div>

        {/* Row 4: Mobile */}
        <div className="flex flex-row gap-4">
          <form.AppField name="mobileNumber">
            {(field) => (
              <field.TextField
                label="Mobile Number"
                htmlForVal="mobileNumber"
                required
                className="w-full max-w-md"
              />
            )}
          </form.AppField>
        </div>
      </div>
    )
  },
})

export default LawSchoolGeneralInfo
