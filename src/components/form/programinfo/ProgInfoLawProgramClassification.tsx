import { withForm } from '@/hooks/useFormContext'
import FieldInfo from '@/components/ui/form/FieldInfo'
import {
  DOCTORATE_PROGRAM_OPTIONS,
  progInfoDefaultValues,
} from './ProgInfo.types'

const doctorateOptions = DOCTORATE_PROGRAM_OPTIONS.map((option) => ({
  value: option,
  label: option,
}))

const ProgInfoLawProgramClassification = withForm({
  defaultValues: progInfoDefaultValues,
  render: function Render({ form }) {
    const setClassification = (
      nextValue: '' | 'juris-doctor' | 'master-of-laws' | 'doctorate'
    ) => {
      form.setFieldValue('lawProgramClassification', nextValue)

      if (nextValue !== 'doctorate') {
        form.setFieldValue('doctorateProgram', '')
      }
    }

    return (
      <form.AppField name="lawProgramClassification">
        {(field) => (
          <form.Subscribe selector={(state) => state.values.lawProgramClassification}>
            {(classification) => (
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={classification === 'juris-doctor'}
                      onChange={() =>
                        setClassification(
                          classification === 'juris-doctor' ? '' : 'juris-doctor'
                        )
                      }
                      onBlur={field.handleBlur}
                      className="w-4 h-4 accent-leb"
                    />
                    <span className="text-sm">Juris Doctor</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={classification === 'master-of-laws'}
                      onChange={() =>
                        setClassification(
                          classification === 'master-of-laws' ? '' : 'master-of-laws'
                        )
                      }
                      onBlur={field.handleBlur}
                      className="w-4 h-4 accent-leb"
                    />
                    <span className="text-sm">Master of Laws</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={classification === 'doctorate'}
                      onChange={() =>
                        setClassification(
                          classification === 'doctorate' ? '' : 'doctorate'
                        )
                      }
                      onBlur={field.handleBlur}
                      className="w-4 h-4 accent-leb"
                    />
                    <span className="text-sm">Doctorate</span>
                  </label>
                </div>

                <FieldInfo field={field} />

                {classification === 'doctorate' ? (
                  <div className="w-full">
                    <form.AppField name="doctorateProgram">
                      {(doctorateField) => (
                        <doctorateField.SelectField
                          label="Doctorate Program"
                          htmlForVal="doctorateProgram"
                          required
                          options={doctorateOptions}
                        />
                      )}
                    </form.AppField>
                  </div>
                ) : null}
              </div>
            )}
          </form.Subscribe>
        )}
      </form.AppField>
    )
  },
})

export default ProgInfoLawProgramClassification
