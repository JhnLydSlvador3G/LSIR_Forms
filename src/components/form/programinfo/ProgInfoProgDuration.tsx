import { withForm } from '@/hooks/useFormContext'
import { progInfoDefaultValues } from './ProgInfo.types'
import FieldInfo from '@/components/ui/form/FieldInfo'

const ProgInfoProgDuration = withForm({
  defaultValues: progInfoDefaultValues,
  render: function Render({ form }) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm font-semibold text-gray-700">D. Program Duration</p>

        <form.AppField name="programDuration">
          {(field) => (
            <form.Subscribe selector={(state) => state.errorMap.onSubmit}>
              {(submitError) => (
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={field.state.value === 'online'}
                        onChange={() =>
                          form.setFieldValue(
                            'programDuration',
                            field.state.value === 'online' ? '' : 'online'
                          )
                        }
                        className="w-4 h-4 accent-leb"
                      />
                      <span className="text-sm">Online</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={field.state.value === 'hybrid'}
                        onChange={() =>
                          form.setFieldValue(
                            'programDuration',
                            field.state.value === 'hybrid' ? '' : 'hybrid'
                          )
                        }
                        className="w-4 h-4 accent-leb"
                      />
                      <span className="text-sm">Hybrid</span>
                    </label>
                  </div>

                  {submitError && !field.state.meta.isValid ? (
                    <FieldInfo field={field} />
                  ) : null}
                </div>
              )}
            </form.Subscribe>
          )}
        </form.AppField>
      </div>
    )
  },
})

export default ProgInfoProgDuration
