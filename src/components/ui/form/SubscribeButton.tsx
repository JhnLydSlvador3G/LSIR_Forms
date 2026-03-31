import { AlertDialog } from 'radix-ui'
import { useState } from 'react'
import Spinner from '../feedback/Spinner'
import { useFormContext } from '@/hooks/useFormContext'
import { cn } from '@/lib/utils'

type SubscribeButtonProps = {
  label: string
  confirmTitle?: string
  confirmDescription?: string
  confirmActionLabel?: string
  onConfirm?: () => void
}

export default function SubscribeButton({
  label,
  confirmTitle,
  confirmDescription,
  confirmActionLabel = 'Submit',
  onConfirm,
}: SubscribeButtonProps) {
  const form = useFormContext()
  const [open, setOpen] = useState(false)

  const shouldConfirm = Boolean(confirmTitle && confirmDescription)

  const buttonClasses = cn(
    'flex-2 md:flex-none justify-center flex items-center',
    'px-3 py-1.5 md:px-12 md:py-4',
    'text-xs md:text-lg',
    'rounded-xl',
    'bg-[#937bd0] text-white shadow-lg ring-2 ring-[#937bd0]/40',
    'transition-all duration-300 ease-out',
    'hover:scale-105 md:hover:scale-105',
    'disabled:opacity-60 disabled:cursor-not-allowed',
  )

  return (
    <form.Subscribe
      selector={(state) => [
        state.isSubmitting, state.canSubmit, state.isPristine
      ]}
    >
      {([isSubmitting, canSubmit, isPristine]) =>
        shouldConfirm ? (
          <AlertDialog.Root open={open} onOpenChange={setOpen}>
            <AlertDialog.Trigger asChild>
              <button
                type="button"
                disabled={isSubmitting}
                className={buttonClasses}
              >
                {isSubmitting ? <Spinner /> : label}
              </button>
            </AlertDialog.Trigger>

            <AlertDialog.Portal>
              <AlertDialog.Overlay className="fixed inset-0 bg-blackBackground animate-overlayShow" />
              <AlertDialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow-lg animate-contentShow">
                <AlertDialog.Title className="text-lg font-bold">
                  {confirmTitle}
                </AlertDialog.Title>
                <AlertDialog.Description className="mt-4 mb-6">
                  {confirmDescription}
                </AlertDialog.Description>

                <div className="flex justify-end gap-4">
                  <AlertDialog.Cancel asChild>
                    <button className="rounded bg-gray-200 px-4 py-2">
                      Cancel
                    </button>
                  </AlertDialog.Cancel>

                  <AlertDialog.Action asChild>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false)
                        if (onConfirm) {
                          onConfirm()
                          return
                        }
                        form.handleSubmit()
                      }}
                      className="rounded bg-[#937bd0] px-4 py-2 font-medium text-white shadow-md transition-all duration-200 ease-out hover:scale-105 hover:bg-[#7f64c9] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#937bd0]/40"
                    >
                      {confirmActionLabel}
                    </button>
                  </AlertDialog.Action>
                </div>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog.Root>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting || !canSubmit || isPristine}
            className={buttonClasses}
          >
            {isSubmitting ? <Spinner /> : label}
          </button>
        )
      }
    </form.Subscribe>
  )
}
