import { useAppForm } from "@/hooks/form-context"
import { defaultFacultyValues, facultyRosterFormSchema } from "./FacultyRoster.type"
import FacultyRosterModal from "./FacultyRosterModal"

export default function FacultyRoster() {
    const form = useAppForm({
        defaultValues: {
            facultyRoster: [defaultFacultyValues,]
        },
        validators: {
            onChange: facultyRosterFormSchema,
        },
        onSubmit: async ({ value }) => {
            console.log(value)
        },
    })

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
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Subjects</th>
                            </tr>
                        </thead>
                        <tbody>
                            {field.state.value.map((_, i) => (
                                <tr key={i}>
                                    <td>
                                        <form.Field name={`facultyRoster[${i}].lastName`}>
                                            {(sub) => <span>{sub.state.value}</span>}
                                        </form.Field>
                                    </td>
                                    <td>
                                        <form.Field name={`facultyRoster[${i}].subjects`}>
                                            {(sub) => (
                                                <span>{sub.state.value.join(", ")}</span>
                                            )}
                                        </form.Field>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </form.Field>

            <FacultyRosterModal />
        </form>
    )


}