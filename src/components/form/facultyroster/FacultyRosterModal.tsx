import { Dialog } from "radix-ui";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useFacultyRosterModal } from "@/hooks/useFacultyModalContext";

interface FacultyRosterModalProps {
    children: React.ReactNode;
    onClose: () => void;
}

const FacultyRosterModal = ({ children, onClose }: FacultyRosterModalProps) => {
    const modalContext = useFacultyRosterModal()
    return (
        <Dialog.Root open={modalContext.open} onOpenChange={modalContext.setOpen} >
            <Dialog.Trigger asChild>
                <button className="inline-flex h-[35px] items-center justify-center rounded bg-leb px-[15px] font-medium leading-none text-white outline-none outline-offset-1 hover:bg-leb/80 focus-visible:outline-2 focus-visible:outline-lebThird select-none">
                    Add Faculty Member
                </button>
            </Dialog.Trigger>
            <Dialog.Portal>

                <Dialog.Overlay className="fixed inset-0 bg-blackBackground animate-overlayShow" />
                <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-md bg-white shadow-[var(--shadow-6)] focus:outline-none animate-contentShow overflow-auto"
                    onInteractOutside={(e) => {
                        e.preventDefault()
                    }}>
                    <Dialog.Title className="m-0 text-[28px] font-medium bg-leb text-white p-3 rounded-t-md text-center">
                        Add Faculty Member
                    </Dialog.Title>

                    <div className="px-10 pb-6">
                        <Dialog.Description className="mb-5 mt-2.5 text-[18px] leading-normal text-mauve11">
                            Fill out the faculty member’s information below and click 'Save' to add them to the roster.
                        </Dialog.Description>

                        {children}

                        <Dialog.Close asChild
                            onClick={() => {
                                onClose()
                            }}>
                            <button
                                className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-black bg-lebSecond hover:bg-lebThird focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none"
                                aria-label="Close">
                                <Cross2Icon />
                            </button>
                        </Dialog.Close>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root >
    )
};

export default FacultyRosterModal
