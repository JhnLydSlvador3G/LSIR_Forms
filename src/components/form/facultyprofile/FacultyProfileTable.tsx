import { FacultyColumnTotal, FacultyGrandTotal, FacultyRowTotal } from "@/components/ui/form/FacultyProfileTotal"
import { FacultyDefaultValues } from "./FacultyProfile.type"
import { withForm } from "@/hooks/form-context"

const categoryFields = [
    ['basic', 'master', 'doctor'],
    ['regular', 'partTime'],
    ['retired', 'private', 'judges', 'prosecutor', 'otherGov'],
] as const

const FacultyProfileTable = withForm({
    defaultValues: { faculty: FacultyDefaultValues },
    render: function Render({ form }) {
        return (
            <div className="w-full flex flex-col gap-6">

                {/* Table 0 - Total Count */}
                <div className="w-full overflow-x-auto flex justify-center items-center flex-col">
                    <h3 className="font-bold mb-2 text">Total Count</h3>
                    <table className=" w-1/2 border-collapse border text-sm rounded-lg">
                        <thead>
                            <tr className="border border-black bg-leb text-white">
                                <th className="p-2">Gender</th>
                                <th className="p-2">Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            <form.Field name="faculty" mode="array">
                                {(field) => (
                                    <>
                                        {field.state.value.map((row, i) => (
                                            <tr key={row.gender}>
                                                <td className="p-2 font-medium text-center text-lg border-r-2 border-leb">{row.gender}</td>
                                                <form.AppForm>
                                                    <td className="text-center text-xl">
                                                        <FacultyRowTotal index={i} />
                                                    </td>
                                                </form.AppForm>
                                            </tr>
                                        ))}
                                    </>
                                )}
                            </form.Field>
                            <tr>
                                <td className="p-2 font-medium text-center text-lg border-r-2 border-leb">
                                    Total
                                </td>
                                <td className="text-center text-xl font-bold">
                                    <form.AppForm>
                                        <FacultyGrandTotal />
                                    </form.AppForm>
                                </td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Table 1 & 2 - Highest Law Degree and Employment Status side by side */}
                <div className="w-full flex flex-row gap-4">

                    {/* Highest Law Degree */}
                    <div className="flex-1 overflow-x-auto">
                        <h3 className="font-bold mb-2">Highest Law Degree</h3>
                        <table className="w-full border-collapse border text-sm">
                            <thead>
                                <tr className="border border-black bg-leb text-white">
                                    <th className="p-2">Gender</th>
                                    <th className="p-2">Basic</th>
                                    <th className="p-2">Master</th>
                                    <th className="p-2">Doctor</th>
                                </tr>
                            </thead>
                            <tbody>
                                <form.Field name="faculty" mode="array">
                                    {(field) => (
                                        <>
                                            {field.state.value.map((row, i) => (
                                                <tr key={row.gender}>
                                                    <td className="p-2 font-medium text-center text-lg border-r-2 border-leb">{row.gender}</td>
                                                    {(['basic', 'master', 'doctor'] as const).map((subfield) => (
                                                        <td key={subfield} className="text-center">
                                                            <form.AppField
                                                                name={`faculty[${i}].${subfield}`}
                                                                children={(field) => (
                                                                    <field.NumberField htmlForVal={`faculty[${i}].${subfield}`} />
                                                                )}
                                                            />
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </>
                                    )}
                                </form.Field>
                                <tr>
                                    <td className="p-2 font-medium text-center text-lg border-r-2 border-leb">
                                        Total
                                    </td>
                                    <form.AppForm>
                                        {categoryFields[0].map((subfield) => (
                                            <td key={subfield} className="text-center font-bold">
                                                <FacultyColumnTotal targetCol={subfield} />
                                            </td>
                                        ))}
                                    </form.AppForm>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Employment Status */}
                    <div className="flex-1 overflow-x-auto">
                        <h3 className="font-bold mb-2">Employment Status</h3>
                        <table className="w-full border-collapse border text-sm">
                            <thead>
                                <tr className="border border-black bg-leb text-white">
                                    <th className="p-2">Gender</th>
                                    <th className="p-2">Regular</th>
                                    <th className="p-2">Part-Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                <form.Field name="faculty" mode="array">
                                    {(field) => (
                                        <>
                                            {field.state.value.map((row, i) => (
                                                <tr key={row.gender}>
                                                    <td className="p-2 font-medium text-center text-lg border-r-2 border-leb">{row.gender}</td>
                                                    {(['regular', 'partTime'] as const).map((subfield) => (
                                                        <td key={subfield} className="text-center">
                                                            <form.AppField
                                                                name={`faculty[${i}].${subfield}`}
                                                                children={(field) => (
                                                                    <field.NumberField htmlForVal={`faculty[${i}].${subfield}`} />
                                                                )}
                                                            />
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </>
                                    )}
                                </form.Field>
                                <tr>
                                    <td className="p-2 font-medium text-center text-lg border-r-2 border-leb">
                                        Total
                                    </td>
                                    <form.AppForm>
                                        {categoryFields[1].map((subfield) => (
                                            <td key={subfield} className="text-center font-bold">
                                                <FacultyColumnTotal targetCol={subfield} />
                                            </td>
                                        ))}
                                    </form.AppForm>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>

                {/* Table 3 - Primary Employment */}
                <div className="w-full overflow-x-auto">
                    <h3 className="font-bold mb-2">Primary Employment/Practice of Part-Time Professors</h3>
                    <table className="w-full border-collapse border text-sm rounded-lg">
                        <thead>
                            <tr className="border border-black bg-leb text-white">
                                <th className="p-2">Gender</th>
                                <th className="p-2">Retired</th>
                                <th className="p-2">Private</th>
                                <th className="p-2">Judges</th>
                                <th className="p-2">Prosecutor</th>
                                <th className="p-2">Other Gov't</th>
                            </tr>
                        </thead>
                        <tbody>
                            <form.Field name="faculty" mode="array">
                                {(field) => (
                                    <>
                                        {field.state.value.map((row, i) => (
                                            <tr key={row.gender}>
                                                <td className="p-2 font-medium text-center text-lg border-r-2 border-leb">{row.gender}</td>
                                                {categoryFields[2].map((subfield) => (
                                                    <td key={subfield} className="text-center">
                                                        <form.AppField
                                                            name={`faculty[${i}].${subfield}`}
                                                            children={(field) => (
                                                                <field.NumberField htmlForVal={`faculty[${i}].${subfield}`} />
                                                            )}
                                                        />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </>
                                )}
                            </form.Field>
                            <tr>
                                <td className="p-2 font-medium text-center text-lg border-r-2 border-leb">
                                    Total
                                </td>
                                <form.AppForm>
                                    {categoryFields[2].map((subfield) => (
                                        <td key={subfield} className="text-center font-bold">
                                            <FacultyColumnTotal targetCol={subfield} />
                                        </td>
                                    ))}
                                </form.AppForm>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        )
    },
})

export default FacultyProfileTable