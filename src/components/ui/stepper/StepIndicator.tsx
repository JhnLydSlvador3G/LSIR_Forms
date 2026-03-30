import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { StepConfig } from '@/hooks/useStepper'

type StepIndicatorProps = {
  steps: StepConfig[]
  currentStep: number
  /**
   * Only allow clicking steps the user has already visited (index < currentStep).
   * Forward navigation must go through the Next button so validation runs.
   */
  onStepClick: (index: number) => void
}

export function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <nav aria-label="Form progress" className="flex items-center w-full px-6 py-4">
      {steps.map((step, index) => {
        const isDone = index < currentStep
        const isActive = index === currentStep
        // Users can only go BACK via the indicator -- forward requires Next (validation)
        const isClickable = isDone

        return (
          <div key={step.title} className="flex items-center flex-1 last:flex-none">
            {/* Bubble */}
            <button
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onStepClick(index)}
              aria-current={isActive ? 'step' : undefined}
              className={cn(
                'flex items-center justify-center w-9 h-9 rounded-full border-2 shrink-0',
                'text-sm font-semibold transition-colors duration-200',
                isDone && 'bg-leb border-leb text-white cursor-pointer hover:bg-leb/80',
                isActive && 'bg-white border-leb text-leb cursor-default ring-4 ring-leb/20',
                !isDone &&
                  !isActive &&
                  'bg-white border-gray-200 text-gray-400 cursor-not-allowed',
              )}
            >
              {isDone ? <Check size={16} strokeWidth={2.5} /> : index + 1}
            </button>

            {/* Label -- hidden on small screens */}
            <span
              className={cn(
                'ml-2 text-xs font-medium hidden sm:block whitespace-nowrap',
                isActive ? 'text-leb' : '',
                isDone ? 'text-leb/70' : '',
                !isDone && !isActive ? 'text-gray-400' : '',
              )}
            >
              {step.title}
            </span>

            {/* Connector line -- not after last */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'flex-1 h-0.5 mx-3 rounded-full transition-colors duration-300',
                  isDone ? 'bg-leb' : 'bg-gray-200',
                )}
              />
            )}
          </div>
        )
      })}
    </nav>
  )
}

