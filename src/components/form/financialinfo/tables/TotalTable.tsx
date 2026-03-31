import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { useFinancialStore } from "../useFinancialtable";
import { useMemo } from "react";
import { ColumnFactoryConfig, createColumnsFactory } from "../tableColumns";



const columnConfig: ColumnFactoryConfig = {
    labelHeader: "Recuring Semestral/Term Fees",
    dataKey: 'tuitionData',
    editableCell: false,
    editableLabel: false,
    showAction: false,
    operation: 'mult'
}

const columns = createColumnsFactory(columnConfig)


export default function TotalTable() {
    const tuitionData = useFinancialStore(state => state.tuitionData);
    const miscData = useFinancialStore(state => state.miscData);

    //Calculate total of tuition and misc using store data
    //can't use function within store since does not update when store values changes (memo is solution)
    const totalRow = useMemo(() => {
        const years = ["1st", "2nd", "3rd", "4th", "5th"];

        if (tuitionData.length < 2) return [];

        // Compute tuition total
        const fees = Object.values(tuitionData[0].years);
        const units = Object.values(tuitionData[1].years);
        const totalTuition = fees.map((fee, i) => (fee ?? 0) * (units[i] ?? 0));

        // Compute misc total
        const miscTotal = years.map(year =>
            miscData.reduce((sum, row) => sum + (row.years[year] ?? 0), 0)
        );

        // Add tuition + misc totals
        const totalRecur = totalTuition.map((t, i) => (t ?? 0) + (miscTotal[i] ?? 0));

        // Return a derived total row
        return [{
            key: 1,
            label: "Total Recurring Semestral/Term Fees",
            years: years.reduce((acc, year, i) => {
                acc[year] = totalRecur[i] ?? 0;
                return acc;
            }, {} as Record<string, number>),
        }];
    }, [tuitionData, miscData]); // only recompute when tuitionData or miscData changes

    const table = useReactTable({
        data: totalRow,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <div className='mx-auto'>
            <table className="table-fixed border-collapse border border-gray-300">
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className="border border-gray-300 p-2 font-bold"
                                    style={{
                                        width: `${cell.column.getSize()}px`,
                                        minWidth: `${cell.column.getSize()}px`
                                    }}>
                                    <strong>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </strong>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}