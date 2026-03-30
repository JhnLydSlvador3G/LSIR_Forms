import { StepIndicator } from '@/components/ui/stepper/StepIndicator'
import type { UseStepperReturn } from '@/hooks/useStepper'

type StepperFormWrapperProps = {
  title: string
  stepper: UseStepperReturn
  children: React.ReactNode
}

export function StepperFormWrapper({
  title,
  stepper,
  children,
}: StepperFormWrapperProps) {
  return (
    <div className="max-w-5xl mx-auto my-10 rounded-xl overflow-hidden shadow-xl border border-[#937bd0]/20 bg-white">
      {/* Header */}
      <div className="relative bg-leb px-8 py-8 text-white">
        <div className="absolute inset-0 bg-white/5" />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-white/70 mt-1 text-sm">
            Step {stepper.currentStep + 1} of {stepper.totalSteps} --{' '}
            {stepper.currentConfig.title}
          </p>
        </div>
      </div>

      {/* Step indicator strip */}
      <div className="border-b border-gray-100 bg-gray-50">
        <StepIndicator
          steps={stepper.steps}
          currentStep={stepper.currentStep}
          onStepClick={stepper.goTo}
        />
      </div>

      {/* Body */}
      <div className="bg-white px-8 py-6 space-y-6">{children}</div>
    </div>
  )
}

