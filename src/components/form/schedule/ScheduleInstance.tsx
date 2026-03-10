import { withFieldGroup } from "@/hooks/form-context";
import { BlockDefaultValues } from "./Schedule.type";
import { useStore } from "@tanstack/react-form";
import { Trash2, Plus } from "lucide-react";


const daysOfWeekOptions = [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
    { value: "sunday", label: "Sunday" },
];


export const ScheduleInstance = withFieldGroup({
    defaultValues: BlockDefaultValues,

    render: function Render({ group }) {

        const year_level = useStore(group.store, (state) => state.values.year_level)
        const section = useStore(group.store, (state) => state.values.section)
        //Table should be seperated to its own instance but works for now

        return (

            <div className="flex flex-col w-full">
                <div className="flex flex-row justify-start gap-3 w-1/4">
                    <group.AppField
                        name="year_level">
                        {(field) =>
                            <field.LabeledNumberField label="Year Levels" htmlForVal="Year Level" />
                        }
                    </group.AppField>
                    <group.AppField
                        name="section">
                        {(field) =>
                            <field.TextField label="Section" htmlForVal="Section" />
                        }
                    </group.AppField>
                </div>
                <group.AppField name="schedules" mode="array">
                    {(field) => (
                        <div className="mt-4">

                            <div className="overflow-x-auto">
                                <table className="w-full table-auto border-collapse">
                                    <thead>
                                        <tr className="text-center font-semibold text-gray-700">
                                            <th className="px-3 py-2">Subject</th>
                                            <th className="px-3 py-2 w-30">Weight</th>
                                            <th className="px-3 py-2">Faculty</th>
                                            <th className="px-3 py-2">Day</th>
                                            <th className="px-3 py-2">Start</th>
                                            <th className="px-3 py-2">End</th>
                                            <th className="px-3 py-2 text-center"></th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {field.state.value.map((_, i) => (
                                            <tr key={i} className="hover:bg-gray-50">
                                                <td className="px-1">
                                                    <group.AppField name={`schedules[${i}].subject_title`}>
                                                        {(f) => <f.TextField />}
                                                    </group.AppField>
                                                </td>
                                                <td className="px-1">
                                                    <group.AppField name={`schedules[${i}].academic_weight`}>
                                                        {(f) => <f.LabeledNumberField />}
                                                    </group.AppField>
                                                </td>
                                                <td className="px-1">
                                                    <group.AppField name={`schedules[${i}].faculty_id`}>
                                                        {(f) => <f.TextField />}
                                                    </group.AppField>
                                                </td>
                                                <td className="px-1">
                                                    <group.AppField name={`schedules[${i}].day`}>
                                                        {(f) => <f.SelectField
                                                            options={daysOfWeekOptions}
                                                        />}
                                                    </group.AppField>
                                                </td>
                                                <td className="px-1 py-1">
                                                    <group.AppField name={`schedules[${i}].time_start`}>
                                                        {(f) => <f.TextField placeHolder="HH:MM" />}
                                                    </group.AppField>
                                                </td>
                                                <td className="px-1">
                                                    <group.AppField name={`schedules[${i}].time_end`}>
                                                        {(f) => <f.TextField placeHolder="HH:MM" />}
                                                    </group.AppField>
                                                </td>
                                                <td className="px-2 py-1 text-center whitespace-nowrap">
                                                    <button
                                                        type="button"
                                                        onClick={() => field.removeValue(i)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <Trash2 />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    field.pushValue({
                                        subject_title: "",
                                        academic_weight: "",
                                        faculty_id: "",
                                        day: "",
                                        time_start: "",
                                        time_end: "",
                                    })
                                }
                                className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800 rounded-md font-medium transition"
                            >
                                <Plus size={16} />
                                Add Class
                            </button>
                        </div>
                    )}
                </group.AppField>
            </div>
        )
    }
})