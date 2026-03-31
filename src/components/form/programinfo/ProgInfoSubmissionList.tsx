import { useEffect, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronDown, ChevronRight, FileText, Plus } from 'lucide-react'
import type { ReactNode } from 'react'
import { FormWrapper } from '../FormWrapper'
import { loadProgramInfoSubmissions } from '@/lib/programInfoSubmissions'
import type {
  CurricularSchedule,
  DoctorateProgramOption,
  LawProgramClassification,
  ProgramInfoSubmission,
  RecognitionStatus,
} from './ProgInfo.types'

const LAW_PROGRAM_HEADINGS: Record<LawProgramClassification, string> = {
  'juris-doctor': 'Juris Doctor',
  'master-of-laws': 'Master of Laws',
  doctorate: 'Doctorate',
}

const DOCTORATE_SECTIONS: DoctorateProgramOption[] = [
  'Doctor in Civil Law',
  'Doctor in Juridical Science',
  'Others',
]

const PROGRAM_TYPE_LABELS: Record<'extension' | 'branch', string> = {
  extension: 'Extension',
  branch: 'Branch',
}

const PROGRAM_DURATION_LABELS: Record<'online' | 'hybrid', string> = {
  online: 'Online',
  hybrid: 'Hybrid',
}

const dateTimeFormatter = new Intl.DateTimeFormat('en-PH', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

type DetailItemProps = {
  label: string
  value: string
}

function DetailItem({ label, value }: DetailItemProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-[13px] font-medium leading-5 text-slate-900">{value}</p>
    </div>
  )
}

type SubmissionCardProps = {
  submission: ProgramInfoSubmission
  open: boolean
  onToggle: () => void
}

function SubmissionCard({ submission, open, onToggle }: SubmissionCardProps) {
  const { data } = submission
  const detailItems: Array<{ label: string; value: string }> = [
    {
      label: 'Submitted',
      value: dateTimeFormatter.format(new Date(submission.submittedAt)),
    },
    {
      label: 'Program Offered',
      value: PROGRAM_TYPE_LABELS[data.programType],
    },
    {
      label: 'Permit Number',
      value: data.permitNumber || 'Not provided',
    },
    {
      label: 'Location / Site',
      value: data.locationSite || 'Not provided',
    },
    {
      label: 'Academic Calendar',
      value: `${data.startMonth} to ${data.endMonth}`,
    },
    {
      label: 'Class Operating Schedule',
      value: `${data.classOperatingFrom} to ${data.classOperatingTo}`,
    },
    {
      label: 'Curricular Schedule',
      value: data.curricularSchedule as CurricularSchedule,
    },
    {
      label: 'Program Delivery',
      value: PROGRAM_DURATION_LABELS[data.programDuration],
    },
  ]

  if (data.programType === 'extension') {
    detailItems.push(
      {
        label: 'Government Authority',
        value: data.governmentAuthority || 'Not provided',
      },
      {
        label: 'Validity',
        value: data.validity || 'Not provided',
      },
    )
  }

  if (data.programType === 'branch') {
    detailItems.push(
      {
        label: 'Recognition Status',
        value: (data.recognitionStatus as RecognitionStatus) || 'Not provided',
      },
      {
        label: 'Recognition Number',
        value: data.recognitionNumber || 'Not provided',
      },
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-3 text-left"
      >
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold text-slate-900">
            {data.permitNumber || 'Untitled program'}
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            {PROGRAM_TYPE_LABELS[data.programType]} program
          </p>
        </div>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-leb/10 text-leb">
          {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </span>
      </button>

      {open && (
        <div className="border-t border-slate-200 px-4 py-4">
          <div className="grid gap-3 md:grid-cols-2">
            {detailItems.map((item) => (
              <DetailItem key={item.label} label={item.label} value={item.value} />
            ))}
          </div>

          {data.curricula.length > 0 && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-leb" />
                <h4 className="text-[13px] font-semibold text-slate-900">Curriculum Details</h4>
              </div>
              {data.curricula.map((curriculum, index) => (
                <div
                  key={`${submission.id}-curriculum-${index}`}
                  className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                >
                  <p className="text-[13px] font-semibold text-slate-900">
                    Curriculum {index + 1}
                  </p>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <DetailItem
                      label="LEB Approval Date"
                      value={curriculum.lebApprovalDate || 'Not provided'}
                    />
                    <DetailItem
                      label="Total Load - 1st Sem"
                      value={curriculum.totalAcademicLoadFirstSem || 'Not provided'}
                    />
                    <DetailItem
                      label="Total Load - 2nd Sem"
                      value={curriculum.totalAcademicLoadSecondSem || 'Not provided'}
                    />
                    <DetailItem
                      label="1st Year"
                      value={`${curriculum.firstYearFirstSem || '-'} / ${curriculum.firstYearSecondSem || '-'}`}
                    />
                    <DetailItem
                      label="2nd Year"
                      value={`${curriculum.secondYearFirstSem || '-'} / ${curriculum.secondYearSecondSem || '-'}`}
                    />
                    <DetailItem
                      label="3rd Year"
                      value={`${curriculum.thirdYearFirstSem || '-'} / ${curriculum.thirdYearSecondSem || '-'}`}
                    />
                    <DetailItem
                      label="4th Year"
                      value={`${curriculum.fourthYearFirstSem || '-'} / ${curriculum.fourthYearSecondSem || '-'}`}
                    />
                    <DetailItem
                      label="5th Year"
                      value={`${curriculum.fifthYearFirstSem || '-'} / ${curriculum.fifthYearSecondSem || '-'}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

type SubmissionColumnProps = {
  title: string
  items?: ProgramInfoSubmission[]
  openIds?: Set<string>
  onToggle?: (id: string) => void
  children?: ReactNode
}

function SubmissionColumn({
  title,
  items = [],
  openIds,
  onToggle,
  children,
}: SubmissionColumnProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white pb-5 shadow-sm">
      <div className="rounded-t-2xl bg-leb px-4 py-5 text-center text-white">
        <h2 className="text-2xl font-black tracking-tight">{title}</h2>
      </div>

      {children ? (
        children
      ) : (
        <div className="mx-5 mt-5 space-y-3">
          {items.length > 0 && openIds && onToggle ? (
            items.map((submission) => (
              <SubmissionCard
                key={submission.id}
                submission={submission}
                open={openIds.has(submission.id)}
                onToggle={() => onToggle(submission.id)}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
              No submissions yet.
            </div>
          )}
        </div>
      )}
    </section>
  )
}

export default function ProgInfoSubmissionList() {
  const [submissions, setSubmissions] = useState<ProgramInfoSubmission[]>([])
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())
  const [isLeiOpen, setIsLeiOpen] = useState(true)
  const leiProgram = 1

  useEffect(() => {
    setSubmissions(loadProgramInfoSubmissions())
  }, [])

  const grouped = useMemo(() => {
    const jurisDoctor = submissions.filter(
      (submission) => submission.data.lawProgramClassification === 'juris-doctor',
    )
    const masterOfLaws = submissions.filter(
      (submission) => submission.data.lawProgramClassification === 'master-of-laws',
    )
    const doctorateItems = submissions.filter(
      (submission) => submission.data.lawProgramClassification === 'doctorate',
    )

    const doctorateByProgram: Record<DoctorateProgramOption, ProgramInfoSubmission[]> = {
      'Doctor in Civil Law': [],
      'Doctor in Juridical Science': [],
      Others: [],
    }

    doctorateItems.forEach((submission) => {
      const key = submission.data.doctorateProgram || 'Others'
      doctorateByProgram[key].push(submission)
    })

    return {
      jurisDoctor,
      masterOfLaws,
      doctorateByProgram,
    }
  }, [submissions])

  const toggleSubmission = (id: string) => {
    setOpenIds((current) => {
      const next = new Set(current)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <FormWrapper
      title="Program Information Submissions"
      subtitle="Review saved law program submissions grouped by classification."
      className="w-[90%] max-w-none"
    >
      <div className="space-y-8 px-2 py-4">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setIsLeiOpen((current) => !current)}
            className="flex w-full items-center justify-between gap-3 bg-slate-50 px-5 py-4 text-left transition-colors hover:bg-slate-100"
          >
            <h2 className="text-lg font-bold text-slate-900">LEI {leiProgram}</h2>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-leb/10 text-leb">
              {isLeiOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </span>
          </button>

          {isLeiOpen && (
            <div className="space-y-8 px-4 py-5">
              <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
                <div className="w-full md:flex-1">
                  <h1 className="text-2xl font-black tracking-tight text-slate-900">
                    LEI ({leiProgram})
                  </h1>
                </div>
                <div className="flex w-full justify-center md:flex-1 md:justify-end">
                  <Link
                    to="/programinfo"
                    className="inline-flex items-center gap-2 rounded-xl bg-leb px-4 py-2.5 text-sm font-semibold text-white shadow transition-transform hover:scale-[1.02]"
                  >
                    <Plus size={16} />
                    New submission
                  </Link>
                </div>
              </div>

              <div className="grid gap-5 xl:grid-cols-3">
                <SubmissionColumn
                  title={LAW_PROGRAM_HEADINGS['juris-doctor']}
                  items={grouped.jurisDoctor}
                  openIds={openIds}
                  onToggle={toggleSubmission}
                />
                <SubmissionColumn
                  title={LAW_PROGRAM_HEADINGS['master-of-laws']}
                  items={grouped.masterOfLaws}
                  openIds={openIds}
                  onToggle={toggleSubmission}
                />
                <SubmissionColumn title={LAW_PROGRAM_HEADINGS.doctorate}>
                  <div className="space-y-5">
                    {DOCTORATE_SECTIONS.map((section, index) => {
                      const items = grouped.doctorateByProgram[section]
                      return (
                        <div
                          key={section}
                          className={index > 0 ? 'border-t border-slate-200 pt-5' : undefined}
                        >
                          <div className="rounded-2xl bg-slate-50 px-4 py-4">
                            <h3 className="mt-1 text-lg font-bold text-slate-900">{section}</h3>
                          </div>

                          <div className="mt-3 mr-5 border-l border-slate-200 pl-4">
                            <div className="space-y-3">
                              {items.length > 0 ? (
                                items.map((submission) => (
                                  <SubmissionCard
                                    key={submission.id}
                                    submission={submission}
                                    open={openIds.has(submission.id)}
                                    onToggle={() => toggleSubmission(submission.id)}
                                  />
                                ))
                              ) : (
                                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                                  No submissions yet.
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </SubmissionColumn>
              </div>
            </div>
          )}
        </section>
      </div>
    </FormWrapper>
  )
}
