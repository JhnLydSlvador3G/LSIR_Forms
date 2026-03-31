import { X } from 'lucide-react'
import { withForm } from '@/hooks/useFormContext'
import { cn } from '@/lib/utils'
import ContentCards from '@/components/ui/form/ContentCards'
import {
  CurriculumEntry,
  progInfoDefaultValues,
} from './ProgInfo.types'

const curriculumRowFields: Array<{
  label: string
  firstSemKey: keyof CurriculumEntry
  secondSemKey: keyof CurriculumEntry
}> = [
  {
    label: 'First Year Level',
    firstSemKey: 'firstYearFirstSem',
    secondSemKey: 'firstYearSecondSem',
  },
  {
    label: 'Second Year Level',
    firstSemKey: 'secondYearFirstSem',
    secondSemKey: 'secondYearSecondSem',
  },
  {
    label: 'Third Year Level',
    firstSemKey: 'thirdYearFirstSem',
    secondSemKey: 'thirdYearSecondSem',
  },
  {
    label: 'Fourth Year Level',
    firstSemKey: 'fourthYearFirstSem',
    secondSemKey: 'fourthYearSecondSem',
  },
  {
    label: 'Fifth Year Level',
    firstSemKey: 'fifthYearFirstSem',
    secondSemKey: 'fifthYearSecondSem',
  },
  {
    label: 'Total academic load',
    firstSemKey: 'totalAcademicLoadFirstSem',
    secondSemKey: 'totalAcademicLoadSecondSem',
  },
]

const emptyCurriculum: CurriculumEntry = {
  lebApprovalDate: '',
  firstYearFirstSem: '',
  firstYearSecondSem: '',
  secondYearFirstSem: '',
  secondYearSecondSem: '',
  thirdYearFirstSem: '',
  thirdYearSecondSem: '',
  fourthYearFirstSem: '',
  fourthYearSecondSem: '',
  fifthYearFirstSem: '',
  fifthYearSecondSem: '',
  totalAcademicLoadFirstSem: '',
  totalAcademicLoadSecondSem: '',
}

const ProgInfoCurriculum = withForm({
  defaultValues: progInfoDefaultValues,
  render: function Render({ form }) {
    return (
      <div>
        <form.Field name="curricula" mode="array">
          {(field) => (
            <div className="flex flex-col gap-5">
              <div className="overflow-x-auto pb-2">
                <div className="flex min-w-max gap-4">
                  {field.state.value.map((_, i) => (
                    <ContentCards
                      key={i}
                      title={`Curriculum ${i + 1}`}
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
                      <div className="max-w-[320px] pb-2">
                        <form.AppField name={`curricula[${i}].lebApprovalDate`}>
                          {(subfield) => (
                            <subfield.DateField
                              label="LEB Approval Date"
                              htmlForVal={`curricula[${i}].lebApprovalDate`}
                              required
                              inline
                            />
                          )}
                        </form.AppField>
                      </div>

                      <div className="grid grid-cols-[1.45fr_0.95fr_0.95fr] gap-2 pb-1 text-[13px] font-semibold leading-tight">
                        <div>Semestral academic load</div>
                        <div className="text-center text-orange-500">1st Sem</div>
                        <div className="text-center text-fuchsia-600">2nd Sem</div>
                      </div>

                      {curriculumRowFields.map((row) => (
                        <div
                          key={row.label}
                          className="grid grid-cols-[1.45fr_0.95fr_0.95fr] items-center gap-2 pb-1.5"
                        >
                          <div className="text-[13px] leading-snug">
                            {row.label}
                            <span className="text-red-500"> *</span>
                          </div>
                          <form.AppField
                            name={`curricula[${i}].${row.firstSemKey}`}
                          >
                            {(subfield) => (
                              <subfield.TextField
                                label=""
                                htmlForVal={`curricula[${i}].${row.firstSemKey}`}
                                required
                                noLabel
                              />
                            )}
                          </form.AppField>
                          <form.AppField
                            name={`curricula[${i}].${row.secondSemKey}`}
                          >
                            {(subfield) => (
                              <subfield.TextField
                                label=""
                                htmlForVal={`curricula[${i}].${row.secondSemKey}`}
                                required
                                noLabel
                              />
                            )}
                          </form.AppField>
                        </div>
                      ))}
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
                  Add Curriculum
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
