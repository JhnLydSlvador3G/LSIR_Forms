type SectionWrapperProps = {
  title: string
  children: React.ReactNode
}

export function SectionWrapper({ title, children }: SectionWrapperProps) {
  return (
    <div className="flex flex-col md:flex-row border-gray-200 p-6 gap-6">
      {/* Left Title */}
      <div className="md:w-1/3">
        <h2 className="text-2xl font-semibold text-leb">{title}</h2>
      </div>

      {/* Right Content */}
      <div className="md:w-2/3 flex flex-col gap-4">{children}</div>
    </div>
  )
}
