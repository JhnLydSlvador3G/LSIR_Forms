type SectionWrapperProps = {
  title: string
  children: React.ReactNode
}

export function ProgInfoSectionWrapper({ title, children }: SectionWrapperProps) {
  return (
    <div className="flex flex-col mx-auto md:flex-col border-b border-gray-200 p-6 gap-6">
      <div className="md:w-1/3">
        <h2 className="text-xl font-semibold text-leb">{title}</h2>
      </div>
      <div className="md:w-2/3 mx-auto flex flex-col gap-4">{children}</div>
    </div>
  )
}
