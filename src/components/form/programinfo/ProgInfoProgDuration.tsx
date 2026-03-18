import { withForm } from '@/hooks/useFormContext'
import { progInfoDefaultValues } from './ProgInfo.types'

const ProgInfoProgDuration = withForm({
  defaultValues: progInfoDefaultValues,
  render: function Render({ form }) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm font-semibold text-gray-700">D. Program Duration</p>

        <form.Subscribe selector={(state) => state.values.programDuration}>
          {(programDuration) => (
            <div className="flex flex-row gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={programDuration === 'online'}
                  onChange={() =>
                    form.setFieldValue('programDuration',
                      programDuration === 'online' ? '' : 'online'
                    )
                  }
                  className="w-4 h-4 accent-leb"
                />
                <span className="text-sm">Online</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={programDuration === 'hybrid'}
                  onChange={() =>
                    form.setFieldValue('programDuration',
                      programDuration === 'hybrid' ? '' : 'hybrid'
                    )
                  }
                  className="w-4 h-4 accent-leb"
                />
                <span className="text-sm">Hybrid</span>
              </label>
            </div>
          )}
        </form.Subscribe>
      </div>
    )
  },
})

export default ProgInfoProgDuration
