import { AlertDialog } from 'radix-ui'
import { useFormContext } from '@/hooks/form-context'
import { cn } from '@/lib/utils'

const ResetButton = () => {
  const form = useFormContext()

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button
          className={cn(
            'flex-2 md:flex-none',
            'px-2 py-1.5 md:px-8 md:py-3',
            'text-xs md:text-lg',
            'rounded-xl',
            'text-black shadow-lg bg-lebSecond ring-2 ring-[#937bd0]/40',
            'transition-all duration-300 ease-out',
            'hover:scale-105 md:hover:scale-105',
            'disabled:opacity-60 disabled:cursor-not-allowed',
          )}
        >
          Reset
        </button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-blackBackground animate-overlayShow" />
        <AlertDialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[var(--shadow-6)] focus:outline-none animate-contentShow">
          <AlertDialog.Title className="m-0 text-[17px] text-black font-bold">
            Are you absolutely sure?
          </AlertDialog.Title>
          <AlertDialog.Description className="mb-5 mt-[15px] text-[15px] leading-normal text-mauve11">
            This action will clear all the data you’ve entered in this form. All
            unsaved changes will be lost. This cannot be undone.
          </AlertDialog.Description>
          <div className="flex justify-end gap-[25px]">
            <AlertDialog.Cancel asChild>
              <button className="inline-flex h-[35px] items-center justify-center rounded bg-mauve4 px-[15px] font-medium leading-none text-leb outline-none outline-offset-1 hover:bg-blackBackground hover:text-white transition-colors ease-in focus-visible:outline-2 focus-visible:outline-mauve7 select-none">
                Cancel
              </button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <button
                onClick={() => {
                  form.reset()
                }}
                className="inline-flex h-[35px] items-center justify-center rounded bg-red-400 px-[15px] font-medium leading-none text-black outline-none outline-offset-1 hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-red-700 select-none transition-colors ease-in"
              >
                Yes, reset form
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}

export default ResetButton
