import { cn } from '@/lib/utils'
import type { UseStepperReturn } from '@/hooks/useStepper'
import { useFormContext } from '@/hooks/useFormContext'
import ResetButton from '@/components/ui/form/ResetButton'
import SaveButton from '@/components/ui/form/SaveButton'
import type z from 'zod'

type StepperNavProps = {
  stepper: UseStepperReturn
  storageKey: string
  defaultValues: Record<string, any>
  getValue: () => any
  savePreferGetValueFirst?: boolean
  saveSchema?: z.ZodTypeAny
  onNext?: () => boolean | Promise<boolean>
  onReset?: () => void
}

export function StepperNav({
  stepper,
  storageKey,
  defaultValues,
  getValue,
  savePreferGetValueFirst = false,
  saveSchema,
  onNext,
  onReset,
}: StepperNavProps) {
  const form = useFormContext()
  const handleNext = async () => {
    if (onNext) {
      const ok = await onNext()
      if (ok) stepper.goNext()
      return
    }

    const fieldNames = stepper.currentConfig.fields
    await Promise.all(
      fieldNames.map((name) => form.validateField(name as never, 'change')),
    )

    const allErrors = form.getAllErrors().fields as Record<
      string,
      { errors: unknown[] } | undefined
    >
    const hasErrors = fieldNames.some((name) => {
      const fieldErrors = allErrors[name]?.errors ?? []
      return Array.isArray(fieldErrors) && fieldErrors.length > 0
    })

    if (!hasErrors) stepper.goNext()
  }

  return (
    <div className="flex justify-between items-center mt-6 px-6 pb-6 border-t border-gray-100 pt-6">
      <div className="flex gap-3">
        <ResetButton
          defaultValues={defaultValues}
          storageKey={storageKey}
          onReset={onReset}
        />
        <SaveButton
          storageKey={storageKey}
          getValue={getValue}
          preferGetValueFirst={savePreferGetValueFirst}
          schema={saveSchema}
        />
      </div>

      <div className="flex gap-3 items-center">
        <span className="text-xs text-gray-400 mr-2 hidden sm:block">
          {stepper.currentStep + 1} / {stepper.totalSteps}
        </span>

        {!stepper.isFirst && (
          <button
            type="button"
            onClick={stepper.goPrev}
            className={cn(
              'px-5 py-2 rounded-xl text-sm font-medium',
              'border-2 border-leb text-leb',
              'hover:bg-leb/5 transition-colors duration-200',
            )}
          >
            Previous
          </button>
        )}

        {!stepper.isLast && (
          <button
            type="button"
            onClick={handleNext}
            className={cn(
              'px-8 py-2 rounded-xl text-sm font-semibold',
              'bg-leb text-white shadow-md ring-2 ring-leb/30',
              'hover:scale-105 transition-all duration-200',
            )}
          >
            Next
          </button>
        )}
      </div>
    </div>
  )
}
