import { useFormContext } from '@/hooks/useFormContext'
import ToastNotification from '@/components/ui/feedback/ToastNotification'

export default function FormErrorMessage() {
  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => state.errorMap.onSubmit}>
      {(errors) => {
        if (!errors || (Array.isArray(errors) && errors.length === 0)) return null

        return (
          <div className="fixed top-6 right-6 z-[100] w-full max-w-sm transition-all animate-slide-in">
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