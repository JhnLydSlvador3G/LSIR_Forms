import { useFormContext } from '@/hooks/useFormContext'
import ToastNotification from '@/components/ui/feedback/ToastNotification'

export default function FormErrorMessage() {
  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => state.errorMap.onSubmit}>
      {(errors) => {
        if (!errors || errors.length === 0) return null

        return (
          <div className="pb-4">
            <ToastNotification
              variant="error"
              title="Please review this section"
              message={errors}
            />
          </div>
        )
      }}
    </form.Subscribe>
  )
}
