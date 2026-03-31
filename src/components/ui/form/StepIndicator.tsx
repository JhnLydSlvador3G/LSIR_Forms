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
    <div className={`rounded-l-2xl ${className}`.trim()}>
      <div className="flex flex-col py-4">
        {steps.map((title, index) => (
          <div
            key={title}
            className={`flex items-center gap-4 border-l-4 px-7 py-5 transition-colors ${
              index === currentStep
                ? 'border-l-leb bg-slate-200/60'
                : index < currentStep
                  ? 'border-l-leb/50 bg-white'
                  : 'border-l-transparent bg-transparent'
            }`}
          >
            <div className="flex shrink-0 items-center justify-center">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-full text-base font-bold ${
                  index === currentStep
                    ? 'bg-leb text-white shadow-sm'
                    : index < currentStep
                      ? 'bg-leb/20 text-leb'
                      : 'border border-slate-300 bg-white text-slate-500'
                }`}
              >
                {index + 1}
              </div>
            </div>
            <div className="min-w-0">
              <div
                className={`text-[1.05rem] leading-6 ${
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
