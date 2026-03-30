import { useState, useCallback } from 'react'

export type StepConfig = {
  title: string
  /**
   * Every field path that lives in this step's UI.
   * Include ALL conditional fields too (e.g. doctoralType, doctoralOtherText)
   * even if they are only rendered sometimes -- the validator skips them when
   * they have no errors, so listing them here is safe and necessary.
   */
  fields: string[]
}

export type UseStepperReturn = {
  currentStep: number
  totalSteps: number
  isFirst: boolean
  isLast: boolean
  goNext: () => void
  goPrev: () => void
  goTo: (index: number) => void
  steps: StepConfig[]
  currentConfig: StepConfig
}

export function useStepper(steps: StepConfig[]): UseStepperReturn {
  const [currentStep, setCurrentStep] = useState(0)

  const isFirst = currentStep === 0
  const isLast = currentStep === steps.length - 1

  const goNext = useCallback(
    () => {
      if (!isLast) setCurrentStep((s) => s + 1)
    },
    [isLast],
  )

  const goPrev = useCallback(
    () => {
      if (!isFirst) setCurrentStep((s) => s - 1)
    },
    [isFirst],
  )

  const goTo = useCallback(
    (index: number) => {
      if (index >= 0 && index < steps.length) setCurrentStep(index)
    },
    [steps.length],
  )

  return {
    currentStep,
    totalSteps: steps.length,
    isFirst,
    isLast,
    goNext,
    goPrev,
    goTo,
    steps,
    currentConfig: steps[currentStep],
  }
}

