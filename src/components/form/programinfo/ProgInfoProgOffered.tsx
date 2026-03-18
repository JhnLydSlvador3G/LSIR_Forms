import { withForm } from '@/hooks/useFormContext'
import { progInfoDefaultValues } from './ProgInfo.types'

const ProgInfoProgOffered = withForm({
  defaultValues: progInfoDefaultValues,
  render: function Render({ form }) {
    return (
      <div className="flex flex-col gap-4">

        {/* programType as a single-value toggle stored directly in form state */}
        <form.Subscribe selector={(state) => state.values.programType}>
          {(programType) => (
            <div className="flex flex-row gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={programType === 'extension'}
                  onChange={() =>
                    form.setFieldValue(
                      'programType',
                      programType === 'extension' ? '' : 'extension'
                    )
                  }
                  className="w-4 h-4 accent-leb"
                />
                <span className="text-sm">Extension</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={programType === 'branch'}
                  onChange={() =>
                    form.setFieldValue(
                      'programType',
                      programType === 'branch' ? '' : 'branch'
                    )
                  }
                  className="w-4 h-4 accent-leb"
                />
                <span className="text-sm">Branch</span>
              </label>
            </div>
          )}
        </form.Subscribe>

        {/* permitNumber always mounted, visibility controlled by CSS */}
        <form.AppField name="permitNumber">
          {(field) => (
            <form.Subscribe selector={(state) => state.values.programType}>
              {(programType) => (
                <div className={programType ? 'block' : 'hidden'}>
                  <field.TextField
                    label="Permit Number"
                    htmlForVal="permitNumber"
                    required
                  />
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
