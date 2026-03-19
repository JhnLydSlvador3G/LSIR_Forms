import { useBlocker } from '@tanstack/react-router'
import * as AlertDialog from '@radix-ui/react-alert-dialog'

type FormLeaveGuardProps = {
    when: boolean
}

export default function FormLeaveGuard({ when }: FormLeaveGuardProps) {
    const { status, proceed, reset } = useBlocker({
        shouldBlockFn: () => when,
        withResolver: true,
    })

    return (
        <AlertDialog.Root open={status === 'blocked'}>
            <AlertDialog.Portal>
                {/* Overlay */}
                <AlertDialog.Overlay className="
          fixed inset-0 
          bg-black/50 
          backdrop-blur-sm
          animate-overlayShow
          z-20
        " />

                {/* Modal content */}
                <AlertDialog.Content className="
          fixed left-1/2 top-1/2
          w-[90vw] max-w-md
          -translate-x-1/2 -translate-y-1/2
          rounded-lg bg-white p-6 shadow-xl
          animate-scaleUp
          border border-gray-200
          z-500
        ">
                    <AlertDialog.Title className="text-xl font-semibold text-gray-900">
                        Leave this page?
                    </AlertDialog.Title>

                    <AlertDialog.Description className="mt-4 mb-6 text-gray-700 text-sm">
                        Your changes are being saved automatically. You can safely leave this page,
                        and all your progress will be preserved.
                    </AlertDialog.Description>

                    <div className="flex justify-end gap-4">
                        <button
                            onClick={reset}
                            className="
                px-4 py-2
                rounded-md
                bg-gray-200
                text-gray-800
                font-medium
                shadow-sm
                transition-all duration-150
                hover:bg-gray-300 hover:scale-105
                focus:outline-none focus:ring-2 focus:ring-gray-400
              "
                        >
                            Stay
                        </button>

                        <button
                            onClick={proceed}
                            className="
                px-4 py-2
                rounded-md
                bg-red-500
                text-white
                font-medium
                shadow-md
                transition-all duration-150
                hover:bg-red-400 hover:scale-105
                focus:outline-none focus:ring-2 focus:ring-red-300
              "
                        >
                            Leave
                        </button>
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    )
}