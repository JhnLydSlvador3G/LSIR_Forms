type StepIndicatorProps = {
  steps: readonly string[]
  currentStep: number
  className?: string
}

export default function StepIndicator({
  steps,
  currentStep,
  className = '',
}: StepIndicatorProps) {
  return (
    <div className={`rounded-l-2xl bg-slate-50/80 ${className}`.trim()}>
      <div className="flex flex-col">
        {steps.map((title, index) => (
          <div
            key={title}
            className={`flex items-center gap-3 border-l-4 px-5 py-4 transition-colors ${
              index === currentStep
                ? 'border-l-leb bg-blue-50/70'
                : index < currentStep
                  ? 'border-l-emerald-400 bg-emerald-50/70'
                  : 'border-l-transparent bg-transparent'
            }`}
          >
            <div className="flex shrink-0 items-center justify-center">
              <div
                className={`relative z-10 flex h-8 w-8 min-h-8 min-w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold leading-none ${
                  index === currentStep
                    ? 'bg-leb text-white shadow-sm'
                    : index < currentStep
                      ? 'bg-emerald-400 text-white'
                      : 'border border-slate-300 bg-white text-slate-500'
                }`}
              >
                {index < currentStep ? '✔' : index + 1}
              </div>
            </div>
            <div className="min-w-0">
              <div
                className={`text-sm leading-5 ${
                  index === currentStep
                    ? 'font-semibold text-leb'
                    : index < currentStep
                      ? 'font-medium text-slate-700'
                      : 'text-slate-400'
                }`}
              >
                {title}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
