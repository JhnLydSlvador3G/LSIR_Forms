import { useAppForm } from "@/hooks/useFormContext"
import { FacultyRosterData, facultyRosterFormSchema, defaultFacultyRosterFormValues, } from "./FacultyRoster.type"
import FacultyRosterModal from "./FacultyRosterModal"
import { FacultyModalForm } from "./FacultyRosterIndividual"
import SubscribeButton from "@/components/ui/form/SubscribeButton"
import { FacultyRosterModalContext } from "@/hooks/useFacultyModalContext"
import { useState } from "react"
import FacultyTable from "./table/FacultyRosterTable"

export default function FacultyRoster() {
    //Context for Modal
    const [open, setOpen] = useState(false);
    const [editingIndex, setEditingIndex] = useState<string | null>(null)
    const [facultyState, setFacultyState] = useState<FacultyRosterData | null>(null)


    const onEdit = (index: string) => {
        setEditingIndex(index)

        const currentRoster = form.getFieldValue('facultyRoster');
        const existingIndex = currentRoster.findIndex((item) => item.id === index);

        if (existingIndex !== -1) {
            setFacultyState(form.getFieldValue(`facultyRoster[${existingIndex}]`))
        }

        setOpen(true);
    }

    const onClose = () => {
        setEditingIndex(null)
        setFacultyState(null)
    }

    const onDelete = (index: string) => {
        const currentRoster = form.getFieldValue('facultyRoster');
        const existingIndex = currentRoster.findIndex((item) => item.id === index);

        if (existingIndex !== -1) {
            form.removeFieldValue(`facultyRoster`, existingIndex)
        }
    }

    const form = useAppForm({
        defaultValues: defaultFacultyRosterFormValues,
        validators: {
            onChange: facultyRosterFormSchema,
        },
        onSubmit: async ({ value }) => {
            console.log(value)
        },
    })

    const handleSave = (draft: FacultyRosterData) => {
        // 1. Get the current array from the form state
        const currentRoster = form.getFieldValue('facultyRoster');

        // 2. Try to find the index of the member with the same ID
        const existingIndex = currentRoster.findIndex((item) => item.id === draft.id);

        if (existingIndex !== -1) {
            // REPLACE: We found a match, update that specific row
            form.setFieldValue(`facultyRoster[${existingIndex}]`, draft);
        } else {
            // PUSH: No match found, this is a brand-new entry
            form.pushFieldValue('facultyRoster', draft);
        }

        setOpen(false);
        setEditingIndex(null);
        setFacultyState(null);// Cleanup
    };

    return (
        <form
            className="w-full flex flex-col"
            onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
            }}
        >

            <form.Field name="facultyRoster" mode="array">
                {(field) => (
                    <FacultyTable
                        data={field.state.value}
                        onEdit={onEdit}
                        onDelete={onDelete} />
                )}
            </form.Field>
            <div className="mt-5 w-full flex flex-row justify-center-safe gap-10 items-center">
                <form.AppForm>
                    <FacultyRosterModalContext value={{ open, setOpen }}>
                        <FacultyRosterModal onClose={onClose}>
                            <FacultyModalForm handleSubmit={handleSave} existingData={facultyState} />
                        </FacultyRosterModal>
                    </FacultyRosterModalContext>
                    <SubscribeButton label="Submit" />
                </form.AppForm>
            </div>

        </form>
    )


}