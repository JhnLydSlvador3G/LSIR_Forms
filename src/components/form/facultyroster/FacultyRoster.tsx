import { useAppForm } from "@/hooks/form-context"
import { FacultyRosterData, facultyRosterFormSchema, defaultFacultyRosterFormValues } from "./FacultyRoster.type"
import FacultyRosterModal from "./FacultyRosterModal"
import { FacultyModalForm } from "./FacultyRosterIndividual"
import SubscribeButton from "@/components/ui/form/SubscribeButton"
import { FacultyRosterModalContext } from "@/hooks/FacultyRosterModalContext"
import { useState } from "react"
import FacultyTable from "./table/FacultyRosterTable"
import { TesetTable } from "./table/TestTable"

export default function FacultyRoster() {
    //Context for Modal
    const [open, setOpen] = useState(false);

    const form = useAppForm({
        defaultValues: defaultFacultyRosterFormValues,
        validators: {
            onChange: facultyRosterFormSchema,
        },
        onSubmit: async ({ value }) => {
            console.log(value)
        },
    })

    const handleSave = async (draft: FacultyRosterData) => {
        form.pushFieldValue('facultyRoster', draft);
    }

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
                    <FacultyTable data={field.state.value} />
                )}
            </form.Field>
            <div className="mt-5 w-full flex flex-row justify-center-safe gap-10 items-center">
                <form.AppForm>
                    <FacultyRosterModalContext value={{ open, setOpen }}>
                        <FacultyRosterModal>
                            <FacultyModalForm handleSubmit={handleSave} />
                        </FacultyRosterModal>
                    </FacultyRosterModalContext>
                    <SubscribeButton label="Submit" />
                </form.AppForm>
            </div>

        </form>
    )


}