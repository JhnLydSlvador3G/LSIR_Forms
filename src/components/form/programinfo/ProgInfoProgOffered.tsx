import { withForm } from '@/hooks/useFormContext'
import { progInfoDefaultValues } from './ProgInfo.types'

const ProgInfoProgOffered = withForm({
  defaultValues: progInfoDefaultValues,
  render: function Render({ form }) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm font-semibold text-gray-700">A. Program Offered</p>

        {/* Checkboxes */}
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
                      programType === 'extension' ? undefined : 'extension',
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
                      programType === 'branch' ? undefined : 'branch',
                    )
                  }
                  className="w-4 h-4 accent-leb"
                />
                <span className="text-sm">Branch</span>
              </label>
            </div>
          )}
        </form.Subscribe>

        {/* Permit Number — only shown when a checkbox is checked */}
        <form.Subscribe selector={(state) => state.values.programType}>
          {(programType) =>
            programType ? (
              <form.AppField
                name="permitNumber"
                children={(field) => (
                  <field.TextField
                    label="Permit Number"
                    htmlForVal="permitNumber"
                    required
                  />
                )}
              />
            ) : null
          }
        </form.Subscribe>
      </div>
    )
  },
})

export default ProgInfoProgOffered
