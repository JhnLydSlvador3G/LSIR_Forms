type FormWrapperProps = {
  title: string
  subtitle?: string
  children: React.ReactNode
}

export function FormWrapper({ title, subtitle, children }: FormWrapperProps) {
  return (
    <div className="max-w-5xl mx-auto my-10 rounded-xl overflow-hidden shadow-xl border border-[#937bd0]/20 bg-white">
      {/* Header */}
      <div className="relative bg-leb px-8 py-8 text-white">
        <div className="absolute inset-0 bg-white/5" />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="text-white/80 mt-2 text-sm">{subtitle}</p>}
        </div>
      </div>

      {/* Body */}
      <div className="px-8 py-5 bg-white space-y-10">{children}</div>
    </div>
  )
}
