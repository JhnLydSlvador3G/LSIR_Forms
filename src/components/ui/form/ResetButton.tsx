import { AlertDialog } from 'radix-ui'
import { useState } from 'react'
import { useFormContext } from '@/hooks/useFormContext'
import { cn } from '@/lib/utils'

// Note: This component is designed to be reusable across different forms, so it accepts defaultValues and an optional storageKey for localStorage management. 
// The onReset callback allows parent components to perform additional reset logic, such as resetting the wizard step in ProgInfo.
type ResetButtonProps = {
  defaultValues: Record<string, any>
  storageKey?: string
  label?: string
  onReset?: () => void // Optional callback for additional reset logic (e.g., resetting wizard step)
}

//Uses as any bad type but can't cast DefaultValues as <Record, never>

const ResetButton = ({
  defaultValues,   
  storageKey, 
  label = 'Reset',
  onReset, // Optional callback for additional reset logic (e.g., resetting wizard step)
}: ResetButtonProps) => {
  const form = useFormContext()
  const [open, setOpen] = useState(false)

  const handleReset = () => {
    if (storageKey) {
      localStorage.removeItem(storageKey)
    }

    form.reset(defaultValues as Record<string, never>)
    onReset?.()
    setOpen(false)
  }

  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger asChild>
        <button
          type="button"
          className={cn(
            'flex-2 md:flex-none',
            'px-2 py-1.5 md:px-5 md:py-2',
            'text-xs md:text-lg',
            'rounded-xl',
            'text-black shadow-lg bg-lebSecond ring-2 ring-[#937bd0]/40',
            'transition-all duration-300 ease-out',
            'hover:scale-105',
          )}
        >
          {label}
        </button>
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-blackBackground animate-overlayShow" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow-lg animate-contentShow">
          <AlertDialog.Title className="text-lg font-bold">
            Are you absolutely sure?
          </AlertDialog.Title>
          <AlertDialog.Description className="mt-4 mb-6">
            This will clear all unsaved changes. This cannot be undone.
          </AlertDialog.Description>

          <div className="flex justify-end gap-4">
            <AlertDialog.Cancel asChild>
              <button className="px-4 py-2 rounded bg-gray-200">
                Cancel
              </button>
            </AlertDialog.Cancel>

            <AlertDialog.Action asChild>
              <button
                type="button"
                onClick={handleReset}
                className="
    px-4 py-2 
    rounded 
    bg-red-500 
    text-white 
    font-medium
    shadow-md
    transition-all 
    duration-200 
    ease-out
    hover:bg-red-600 
    hover:scale-105 
    hover:shadow-lg
    focus:outline-none 
    focus:ring-2 
    focus:ring-red-300
  "
              >
                Reset
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}

export default ResetButton
