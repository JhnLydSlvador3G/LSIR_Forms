import { X } from 'lucide-react'
import { withForm } from '@/hooks/useFormContext'
import { cn } from '@/lib/utils'
import ContentCards from '@/components/ui/form/ContentCards'
import { progInfoDefaultValues, type CurriculumEntry } from './ProgInfo.types'

const emptyCurriculum: CurriculumEntry = {
  loads: [
    { year: 1, first_sem: '', second_sem: '' },
    { year: 2, first_sem: '', second_sem: '' },
    { year: 3, first_sem: '', second_sem: '' },
    { year: 4, first_sem: '', second_sem: '' },
    { year: 5, first_sem: '', second_sem: '' },
  ],
}

const ProgInfoCurriculum = withForm({
  defaultValues: progInfoDefaultValues,
  render: function Render({ form }) {
    return (
      <div className="flex flex-col gap-5">
        <div className="max-w-[420px]">
          <form.AppField name="lebApprovalDate">
            {(subfield) => (
              <subfield.DateField
                label="LEB Approval Date"
                htmlForVal="lebApprovalDate"
                required
                inline
              />
            )}
          </form.AppField>
        </div>

        <form.Field name="curricula" mode="array">
          {(field) => (
            <div className="flex flex-col gap-5">
              <div className="overflow-x-auto pb-2">
                <div className="flex min-w-max gap-4">
                  {field.state.value.map((curriculum, i) => (
                    <ContentCards
                      key={i}
                      title={`Semestral Academic Load ${i + 1}`}
                      compact
                      actions={
                        <button
                          type="button"
                          className={cn(
                            'flex h-5 w-5 items-center justify-center rounded-sm bg-red-400 p-0.5 text-black',
                            field.state.value.length === 1 && 'opacity-50',
                          )}
                          onClick={() => {
                            if (field.state.value.length > 1) {
                              field.removeValue(i)
                            }
                          }}
                        >
                          <X />
                        </button>
                      }
                    >
                      <div className="rounded-xl border border-slate-200 p-3">
                        <div className="pb-3 text-sm font-semibold text-slate-700">
                          Semestral Academic Load
                        </div>

                        <div className="grid grid-cols-[1.45fr_0.95fr_0.95fr] gap-2 pb-1 text-[13px] font-semibold leading-tight">
                          <div />
                          <div className="text-center text-orange-500">1st Sem</div>
                          <div className="text-center text-fuchsia-600">2nd Sem</div>
                        </div>

                        {curriculum.loads.map((row, j) => (
                          <div
                            key={row.year}
                            className="grid grid-cols-[1.45fr_0.95fr_0.95fr] items-center gap-2 pb-1.5"
                          >
                            <div className="text-[13px] leading-snug">
                              {`Year ${row.year}`}
                              <span className="text-red-500"> *</span>
                            </div>
                            <form.AppField name={`curricula[${i}].loads[${j}].first_sem`}>
                              {(subfield) => (
                                <subfield.NumberField
                                  htmlForVal={`curricula[${i}].loads[${j}].first_sem`}
                                />
                              )}
                            </form.AppField>
                            <form.AppField name={`curricula[${i}].loads[${j}].second_sem`}>
                              {(subfield) => (
                                <subfield.NumberField
                                  htmlForVal={`curricula[${i}].loads[${j}].second_sem`}
                                />
                              )}
                            </form.AppField>
                          </div>
                        ))}
                      </div>
                    </ContentCards>
                  ))}
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => form.pushFieldValue('curricula', emptyCurriculum)}
                  className={cn(
                    'mx-auto',
                    'mt-1',
                    'px-2 py-1.5 md:px-8 md:py-3',
                    'text-xs md:text-lg',
                    'rounded-xl',
                    'text-white shadow-lg bg-leb ring-2 ring-[#937bd0]/40',
                    'transition-all duration-300 ease-out',
                    'hover:scale-105',
                  )}
                >
                  Add Semestral Academic Load
                </button>
              </div>
            </div>
          )}
        </form.Field>
      </div>
    )
  },
})

export default ProgInfoCurriculum
