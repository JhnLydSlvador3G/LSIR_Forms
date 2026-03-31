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
  const lastStep = steps.length - 1

  return (
    <div className={`overflow-x-auto px-8 pt-6 ${className}`.trim()}>
      <div className="mx-auto flex min-w-max items-start justify-center">
        {steps.map((title, index) => (
          <div key={title} className="relative flex items-start">
            <div className="flex w-[104px] flex-col items-center text-center">
              <div
                className={`relative z-10 flex h-7 w-7 min-h-7 min-w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold leading-none ${
                  index === currentStep
                    ? 'bg-leb text-white'
                    : index < currentStep
                      ? 'bg-leb/40 text-white'
                      : 'bg-gray-200 text-gray-500'
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`mt-2 text-xs leading-4 ${
                  index === currentStep ? 'font-semibold text-leb' : 'text-gray-400'
                }`}
              >
                {title}
              </span>
            </div>
            {index < lastStep && (
              <div
                className={`mt-3.5 -ml-0.5 w-6 border-t ${
                  index < currentStep ? 'border-slate-400' : 'border-dashed border-slate-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
