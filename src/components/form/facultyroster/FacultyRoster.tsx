import { useAppForm } from "@/hooks/form-context"
import { defaultFacultyValues, facultyRosterFormSchema, FacultyRosterFormValues } from "./FacultyRoster.type"
import FacultyRosterModal from "./FacultyRosterModal"
import { ChildForm } from "./FacultyRosterIndividual"
import { useStore } from "@tanstack/react-form"

export default function FacultyRoster() {


    const form = useAppForm({
        defaultValues: {
            facultyRoster: [],
            draftFaculty: defaultFacultyValues
        } as FacultyRosterFormValues,
        validators: {
            onChange: facultyRosterFormSchema,
            onBlur: facultyRosterFormSchema
        },
        onSubmit: async ({ value }) => {
            console.log(value)
        },
    })

    const fieldMeta = useStore(form.store, (state) => state.fieldMeta)

    const handleSave = async () => {
        // 1. Force the form to validate all fields
        await form.validateAllFields("blur");


        console.log(fieldMeta)

        // 3. Use Object.entries to safely loop through the keys and values
        const hasDraftErrors = Object.entries(fieldMeta).some(([key, meta]) => {
            // Because fieldMeta is a 'Partial' record, 'meta' could technically be undefined.
            // The optional chaining (?.) and nullish coalescing (??) sasfely handle that.
            const errorCount = meta?.errors?.length ?? 0;
            return key.startsWith('draftFaculty') && errorCount > 0;
        });


        if (hasDraftErrors) {
            console.log("Draft has errors, stopping save!", hasDraftErrors);
            return;
        }


        // 5. If we get past the check, we are safe to save!
        console.log('saved')
        const draft = form.getFieldValue('draftFaculty');
        form.pushFieldValue('facultyRoster', draft);
        return
        // Deep reset the draft state
        form.setFieldValue('draftFaculty', defaultFacultyValues);
        form.resetField('draftFaculty');
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
            <FacultyRosterModal handleSave={handleSave}>
                <ChildForm form={form as any} />
            </FacultyRosterModal>
        </form>
    )


}