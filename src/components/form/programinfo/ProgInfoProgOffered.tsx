import { withForm } from '@/hooks/useFormContext'
import FieldInfo from '@/components/ui/form/FieldInfo'
import { progInfoDefaultValues, RECOGNITION_STATUSES } from './ProgInfo.types'

const recognitionOptions = RECOGNITION_STATUSES.map((status) => ({
  value: status,
  label: status,
}))

const ProgInfoProgOffered = withForm({
  defaultValues: progInfoDefaultValues,
  render: function Render({ form }) {
    const clearProgramTypeFields = (nextType: '' | 'extension' | 'branch') => {
      form.setFieldValue('programType', nextType)

      if (nextType === 'extension') {
        form.setFieldValue('recognitionStatus', '')
        form.setFieldValue('recognitionNumber', '')
      }

      if (nextType === 'branch') {
        form.setFieldValue('governmentAuthority', '')
        form.setFieldValue('validity', '')
      }

      if (!nextType) {
        form.setFieldValue('governmentAuthority', '')
        form.setFieldValue('validity', '')
        form.setFieldValue('recognitionStatus', '')
        form.setFieldValue('recognitionNumber', '')
        form.setFieldValue('locationSite', '')
        form.setFieldValue('permitNumber', '')
      }
    }

    return (
      <div className="flex flex-col gap-4">
        <form.AppField name="programType">
          {(field) => (
            <form.Subscribe selector={(state) => state.values.programType}>
              {(programType) => (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-row gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={programType === 'extension'}
                        onChange={() =>
                          clearProgramTypeFields(
                            programType === 'extension' ? '' : 'extension'
                          )
                        }
                        onBlur={field.handleBlur}
                        className="w-4 h-4 accent-leb"
                      />
                      <span className="text-sm">Extension</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={programType === 'branch'}
                        onChange={() =>
                          clearProgramTypeFields(
                            programType === 'branch' ? '' : 'branch'
                          )
                        }
                        onBlur={field.handleBlur}
                        className="w-4 h-4 accent-leb"
                      />
                      <span className="text-sm">Branch</span>
                    </label>
                  </div>

                  <FieldInfo field={field} />

                  {programType === 'extension' ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <form.AppField name="governmentAuthority">
                        {(extensionField) => (
                          <extensionField.TextField
                            label="Government Authority"
                            htmlForVal="governmentAuthority"
                            required
                          />
                        )}
                      </form.AppField>

                      <form.AppField name="validity">
                        {(extensionField) => (
                          <extensionField.DateField
                            label="Validity"
                            htmlForVal="validity"
                            required
                          />
                        )}
                      </form.AppField>

                      <form.AppField name="locationSite">
                        {(extensionField) => (
                          <extensionField.TextField
                            label="Location/Site"
                            htmlForVal="locationSite"
                            required
                          />
                        )}
                      </form.AppField>
                    </div>
                  ) : null}

                  {programType === 'branch' ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <form.AppField name="recognitionStatus">
                        {(branchField) => (
                          <branchField.SelectField
                            label="Recognition Status"
                            htmlForVal="recognitionStatus"
                            required
                            options={recognitionOptions}
                          />
                        )}
                      </form.AppField>

                      <form.AppField name="recognitionNumber">
                        {(branchField) => (
                          <branchField.LabeledNumberField
                            label="Recognition Number"
                            htmlForVal="recognitionNumber"
                            required
                          />
                        )}
                      </form.AppField>

                      <form.AppField name="locationSite">
                        {(branchField) => (
                          <branchField.TextField
                            label="Location/Site"
                            htmlForVal="locationSite"
                            required
                          />
                        )}
                      </form.AppField>
                    </div>
                  ) : null}

                  <form.AppField name="permitNumber">
                    {(permitField) => (
                      <permitField.LabeledNumberField
                        label="Permit Number"
                        htmlForVal="permitNumber"
                        required
                      />
                    )}
                  </form.AppField>
                </div>
              )}
            </form.Subscribe>
          )}
        </form.AppField>
      </div>
    )
  },
})

export default ProgInfoProgOffered
