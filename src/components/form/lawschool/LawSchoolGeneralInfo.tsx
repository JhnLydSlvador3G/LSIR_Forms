import { lawSchoolFormDefaultValues } from './LawSchoolForm.types'
import { withForm } from '@/hooks/useFormContext'

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
            validators={{
              onBlur: ({ value }) => (!value ? 'Required' : undefined),
              onChange: ({ value }) => (!value ? 'Required' : undefined),
            }}
            listeners={{
              onChange: ({ value }) => {
                if (value !== 'Others') {
                  form.setFieldValue('lawSchoolUnitNameOtherText', '')
                }
                void Promise.all([
                  form.validateField('lawSchoolUnitName' as any, 'change'),
                  form.validateField('lawSchoolUnitName' as any, 'blur'),
                ])
              },
            }}
          >
            {(field) => (
              <field.RadioGroupField
                label="Law School Unit Name"
                htmlForVal="lawSchoolUnitName"
                options={[
                  { value: 'College/School of Law', label: 'College/School of Law' },
                  { value: 'Graduate School of Law', label: 'Graduate School of Law' },
                  { value: 'Others', label: 'Others' },
                ]}
              />
            )}
          </form.AppField>

          <form.Subscribe selector={(state) => state.values.lawSchoolUnitName}>
            {(lawSchoolUnitName) =>
              lawSchoolUnitName === 'Others' ? (
                <form.AppField
                  name="lawSchoolUnitNameOtherText"
                  validators={{
                    onBlur: ({ value, fieldApi }) => {
                      const unitName = fieldApi.form.getFieldValue(
                        'lawSchoolUnitName',
                      )
                      if (unitName === 'Others' && !value?.trim())
                        return 'Required'
                      return undefined
                    },
                  }}
                >
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
            validators={{
              onBlur: ({ value }) => (!value ? 'Required' : undefined),
              onChange: ({ value }) => (!value ? 'Required' : undefined),
            }}
            listeners={{
              onChange: ({ value }) => {
                if (value !== 'Doctorate') {
                  form.setFieldValue('doctoralType', undefined)
                  form.setFieldValue('doctoralOtherText', '')
                }
                void Promise.all([
                  form.validateField('lawProgram' as any, 'change'),
                  form.validateField('lawProgram' as any, 'blur'),
                ])
              },
            }}
          >
            {(field) => (
              <field.RadioGroupField
                label="Law Program Classification "
                htmlForVal="lawProgram"
                orientation="horizontal"
                required
                options={[
                  { value: 'Juris Doctor', label: 'Juris Doctor' },
                  { value: 'Master of Laws', label: 'Master of Laws' },
                  { value: 'Doctorate', label: 'Doctorate' },
                ]}
              />
            )}
          </form.AppField>

          <form.Subscribe selector={(state) => state.values.lawProgram}>
            {(lawProgram) =>
              lawProgram === 'Doctorate' ? (
                <form.AppField
                  name="doctoralType"
                  validators={{
                    onBlur: ({ value, fieldApi }) => {
                      const lp = fieldApi.form.getFieldValue('lawProgram')
                      if (lp === 'Doctorate' && !value) return 'Required'
                      return undefined
                    },
                    onChange: ({ value, fieldApi }) => {
                      const lp = fieldApi.form.getFieldValue('lawProgram')
                      if (lp === 'Doctorate' && !value) return 'Required'
                      return undefined
                    },
                  }}
                  listeners={{
                    onChange: ({ value }) => {
                      if (value !== 'Others') {
                        form.setFieldValue('doctoralOtherText', '')
                      }
                      void Promise.all([
                        form.validateField('doctoralType' as any, 'change'),
                        form.validateField('doctoralType' as any, 'blur'),
                      ])
                    },
                  }}
                >
                  {(field) => (
                    <field.RadioGroupField
                      label="Doctorate Type"
                      htmlForVal="doctoralType"
                      options={[
                        { value: 'Doctor of Civil Law', label: 'Doctor in Civil Law' },
                        {
                          value: 'Doctor of Juridical Science',
                          label: 'Doctor in Juridical Science',
                        },
                        { value: 'Others', label: 'Others' },
                      ]}
                    />
                  )}
                </form.AppField>
              ) : null
            }
          </form.Subscribe>

          <form.Subscribe selector={(state) => state.values.doctoralType}>
            {(doctoralType) =>
              doctoralType === 'Others' ? (
                <form.AppField
                  name="doctoralOtherText"
                  validators={{
                    onBlur: ({ value, fieldApi }) => {
                      const lawProgram =
                        fieldApi.form.getFieldValue('lawProgram')
                      const docType = fieldApi.form.getFieldValue('doctoralType')
                      if (
                        lawProgram === 'Doctorate' &&
                        docType === 'Others' &&
                        !value?.trim()
                      )
                        return 'Required'
                      return undefined
                    },
                  }}
                >
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
            validators={{
              onBlur: ({ value }) => (!value ? 'Required' : undefined),
              onChange: ({ value }) => (!value ? 'Required' : undefined),
            }}
            listeners={{
              onChange: ({ value }) => {
                if (value !== 'Others') {
                  form.setFieldValue('recognitionStatusOtherText', '')
                }
                void Promise.all([
                  form.validateField('recognitionStatus' as any, 'change'),
                  form.validateField('recognitionStatus' as any, 'blur'),
                ])
              },
            }}
          >
            {(field) => (
              <field.RadioGroupField
                label="Law School Classification according to recognition status"
                htmlForVal="recognitionStatus"
                required
                options={[
                  { value: 'Government Permit I', label: 'Government Permit I' },
                  { value: 'Government Permit II', label: 'Government Permit II' },
                  { value: 'Government Permit III', label: 'Government Permit III' },
                  { value: 'Government Recognition', label: 'Government Recognition' },
                  { value: 'Others', label: 'Others' },
                ]}
              />
            )}
          </form.AppField>

          <form.Subscribe selector={(state) => state.values.recognitionStatus}>
            {(recognitionStatus) =>
              recognitionStatus === 'Others' ? (
                <form.AppField
                  name="recognitionStatusOtherText"
                  validators={{
                    onBlur: ({ value, fieldApi }) => {
                      const status =
                        fieldApi.form.getFieldValue('recognitionStatus')
                      if (status === 'Others' && !value?.trim())
                        return 'Required'
                      return undefined
                    },
                  }}
                >
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

          <form.AppField
            name="accreditationStatus"
            validators={{
              onBlur: ({ value }) => (!value ? 'Required' : undefined),
              onChange: ({ value }) => (!value ? 'Required' : undefined),
            }}
            listeners={{
              onChange: () => {
                void Promise.all([
                  form.validateField('accreditationStatus' as any, 'change'),
                  form.validateField('accreditationStatus' as any, 'blur'),
                ])
              },
            }}
          >
            {(field) => (
              <field.RadioGroupField
                label="Law School Classification according accreditation"
                htmlForVal="accreditationStatus"
                required
                options={[
                  { value: 'Level I', label: 'Level 1' },
                  { value: 'Level II', label: 'Level 2' },
                  { value: 'Level III', label: 'Level 3' },
                  {
                    value: 'Center of Development',
                    label: 'Center of Development',
                  },
                  { value: 'Center of Excellence', label: 'Center of Excellence' },
                  { value: 'Deregulated Status', label: 'Deregulated Status' },
                  { value: 'Autonomous Status', label: 'Autonomous Status' },
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
