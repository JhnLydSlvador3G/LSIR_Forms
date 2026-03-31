import { ChevronDown, ChevronRight, School } from 'lucide-react'

type SummaryItem = {
  label: string
  value: number
}

export type LawSchoolProgramCardProps = {
  title: string
  subtitle?: string
  summaryItems: SummaryItem[]
  actionLabel?: string
  expanded?: boolean
  onAction: () => void
}

function SummaryStat({
  label,
  value,
}: SummaryItem) {
  return (
    <div>
      <p className="text-[11px] font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  )
}

export default function LawSchoolProgramCard({
  title,
  subtitle = 'Legal Education Institute',
  summaryItems,
  actionLabel = 'View Programs',
  expanded = false,
  onAction,
}: LawSchoolProgramCardProps) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div>
        <div className="min-w-0">
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            {title}
          </h2>
          <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
            <School size={16} className="text-leb" />
            <span>{subtitle}</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          {summaryItems.map((item) => (
            <SummaryStat
              key={item.label}
              label={item.label}
              value={item.value}
            />
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-2 rounded-xl bg-leb px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.02]"
          >
            {actionLabel}
            {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  )
}
