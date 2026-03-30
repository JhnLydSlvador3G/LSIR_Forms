import { useFormContext } from '@/hooks/useFormContext'
import ToastNotification from '@/components/ui/feedback/ToastNotification'

type FormErrorMessageProps = {
  replayKey?: number
}

export default function FormErrorMessage({ replayKey = 0 }: FormErrorMessageProps) {
  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => state.errorMap.onSubmit}>
      {(errors) => {
        if (!errors || errors.length === 0) return null

        return (
          <div className="pointer-events-none fixed inset-x-0 top-6 z-[100] flex justify-center px-4">
            <ToastNotification
              key={`${replayKey}-${errors}`}
              variant="error"
              title="Please review this section"
              message={errors}
              className="pointer-events-auto w-full max-w-2xl"
            />
          </div>
        )
      }}
    </form.Subscribe>
  )
}
