import { useAppForm, withForm } from "@/hooks/useFormContext"
import { defaultFacultyValues, FacultyRosterData, facultyRosterSchema } from "./FacultyRoster.type"
import { Plus, Trash2 } from "lucide-react";
import { useFacultyRosterModal } from "@/hooks/useFacultyModalContext";

type FacultyRosterModalFormProps = {
    handleSubmit: (draft: FacultyRosterData) => void
}

export function FacultyModalForm({ handleSubmit }: FacultyRosterModalFormProps) {

    const modalContext = useFacultyRosterModal();

    const form = useAppForm({
        defaultValues: defaultFacultyValues,
        validators: {
            onChange: facultyRosterSchema,
            onBlur: facultyRosterSchema,
        },
        onSubmit: async ({ value }) => {
            console.log(value)
            handleSubmit(value)
            modalContext.setOpen(false)
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
            <div className="pt-4 font-bold text-xl">
                General Information
            </div>
            <div className="flex flex-row gap-3">
                <form.AppField name="lastName">
                    {(field) => (
                        <field.TextField required label="Last Name" htmlForVal="lastName" />
                    )}
                </form.AppField>
                <form.AppField name="firstName">
                    {(field) => (
                        <field.TextField required label="First Name" htmlForVal="firstName" />
                    )}
                </form.AppField>
                <form.AppField name="middleName">
                    {(field) => (
                        <field.TextField className="max-w-[100px]" label="Middle Initial" htmlForVal="middleName" />
                    )}
                </form.AppField>
            </div>
            <div className="flex flex-row gap-3">
                <form.AppField name="gender">
                    {(field) => (
                        <field.SelectField required label="Gender" htmlForVal="gender"
                            options={[
                                { value: 'Male', label: 'Male' },
                                { value: 'Female', label: 'Female' },
                                { value: 'Other', label: 'Other' },
                            ]} />
                    )}
                </form.AppField>
                <form.AppField name="heiEmploymentStatus">
                    {(field) => (
                        <field.SelectField required label="Employment Status" htmlForVal="heiEmploymentStatus"
                            options={[
                                { value: 'Part-Time', label: 'Part-Time' },
                                { value: 'Regular', label: 'Regular' },
                            ]} />
                    )}
                </form.AppField>
                <form.AppField name="rollNumber">
                    {(field) => (
                        <field.TextField className="max-w-[200px]" label="Roll Number" htmlForVal="rollNumber" />
                    )}
                </form.AppField>
                <form.AppField name="professionalExperienceYears">
                    {(field) => (
                        <field.LabeledNumberField className="max-w-[200px]" label="Years of Prof. Experience" htmlForVal="professionalExperienceYears" />
                    )}
                </form.AppField>
                <form.AppField name="yearsTeaching">
                    {(field) => (
                        <field.LabeledNumberField className="max-w-[200px]" label="Years of Teaching" htmlForVal="yearsTeaching" />
                    )}
                </form.AppField>
            </div>
            <div className="pt-4 font-bold text-xl">
                Highest Law Degree Attained
            </div>
            <div className="flex flex-row gap-3">
                <form.AppField name="highestLawDegree.degree">
                    {(field) => (
                        <field.TextField label="Degree" htmlForVal="highestLawDegree.degree" className="flex-1" />
                    )}
                </form.AppField>
                <form.AppField name="highestLawDegree.grantingHEI">
                    {(field) => (
                        <field.TextField label="Granting HEI" htmlForVal="highestLawDegree.grantingHEI" className="flex-3" />
                    )}
                </form.AppField>
                <form.AppField name="highestLawDegree.year">
                    {(field) => (
                        <field.TextField label="Year" htmlForVal="highestLawDegree.year" className="flex-1" />
                    )}
                </form.AppField>
            </div>
            <div className="pt-4 pb-4 font-bold text-xl flex flex-row items-center gap-3">
                <span>Assigned Subjects to Teach</span>
                <button
                    type="button"
                    className="inline-flex items-center justify-center w-6 h-6 rounded-full 
                 bg-leb hover:bg-leb/70
                 text-white shadow-md 
                 transition-colors duration-200"
                    onClick={(e) => {
                        form.pushFieldValue('subjects', "")
                    }
                    }
                >
                    <Plus size={16} strokeWidth={2.5} />
                </button>

            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <form.AppField name="subjects" mode="array">
                    {(field) =>
                        field.state.value?.map((_, i) => (
                            <form.AppField key={i} name={`subjects[${i}]`}>
                                {(subfield) => (
                                    <div className="flex items-start gap-2 w-full">
                                        <div className="flex-1">
                                            <subfield.TextField
                                                label=""
                                                htmlForVal={`subjects[${i}]`}
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            className="mt-1 flex items-center justify-center p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition"
                                            onClick={() => {
                                                field.removeValue(i)
                                            }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                )}
                            </form.AppField>
                        ))
                    }
                </form.AppField>
            </div>
            <div className="pt-4 pb-4 font-bold text-xl flex flex-row items-center gap-3">
                <span>Professional Experience/Work Relevant to Teaching Load</span>
                <form.AppField name="relevantToTeachingLoad">
                    {(field) => (
                        <button
                            type="button"
                            className="inline-flex items-center justify-center w-6 h-6 rounded-full 
             bg-leb hover:bg-leb/70 text-white shadow-md 
             transition-colors duration-200"
                            onClick={() => {
                                field.pushValue("");
                            }}
                        >
                            <Plus size={16} strokeWidth={2.5} />
                        </button>
                    )
                    }
                </form.AppField>


            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <form.AppField name="relevantToTeachingLoad" mode="array">
                    {(field) =>
                        field.state.value?.map((_, i) => (
                            <form.AppField key={i} name={`relevantToTeachingLoad[${i}]`}>
                                {(subfield) => (
                                    <div className="flex items-start gap-2 w-full">
                                        <div className="flex-1">
                                            <subfield.TextField
                                                label=""
                                                htmlForVal={`relevantToTeachingLoad[${i}]`}
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            className="mt-1 flex items-center justify-center p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition"
                                            onClick={() => {
                                                field.removeValue(i)
                                            }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                )}
                            </form.AppField>
                        ))
                    }
                </form.AppField>
            </div>
            <div className="mt-6.25 flex justify-end">
                <button type="submit"
                    className="inline-flex h-8.75 items-center justify-center rounded bg-leb px-3.75 font-medium leading-none text-white outline-none outline-offset-1 hover:bg-leb/80 focus-visible:outline-2 focus-visible:outline-leb select-none">
                    Save changes
                </button>
            </div>
        </form>
    )
}
