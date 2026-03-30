type SectionWrapperProps = {
  title: string
  children: React.ReactNode
}

export function ProgInfoSectionWrapper({ title, children }: SectionWrapperProps) {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  )
}
