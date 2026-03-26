
import { getCoreRowModel, useReactTable, flexRender } from "@tanstack/react-table"
import { useSkipper } from "./tableUtils"
import { useFinancialStore } from "./useFinancialtable"
import { ColumnFactoryConfig, createColumnsFactory } from "./tableColumns"
import { useMemo } from "react"



type createTableProps = {
    dataKey: "tuitionData" | "miscData" | "nonrecurData";
    config: ColumnFactoryConfig
}

export function createTable({ dataKey, config }: createTableProps) {
    const data = useFinancialStore((state) => state[dataKey])
    const setData = useFinancialStore((state) => state.setData)
    const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper()

    const columns = useMemo(() => createColumnsFactory(config), [config])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        autoResetPageIndex,
        meta: {
            updateData: (rowIndex, columnId, value) => {
                skipAutoResetPageIndex()
                setData(dataKey, rowIndex, columnId, value)
            },
        },
    })

    return (
        <div className='mx-auto' data-table={dataKey}>
            <table className="table-auto border-collapse border border-gray-300">
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id} className={`border border-gray-300 p-2 w-10`}
                                    style={{
                                        width: `${header.column.getSize()}px`,
                                        minWidth: `${header.column.columnDef.minSize ?? 30}px`
                                    }}>
                                    {header.isPlaceholder ? null :
                                        flexRender(
                                            header.column.columnDef.header,
                                            header.getContext(),
                                        )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className="border border-gray-300 p-2"
                                    style={{
                                        width: `${cell.column.getSize()}px`,
                                        minWidth: `${cell.column.getSize()}px`
                                    }}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="font-bold border-t border-gray-300">
                        {table.getFooterGroups().map(footerGroup =>
                            footerGroup.headers.map(footer => (
                                <td key={footer.id} className="border border-gray-300 p-2 text-right"
                                    style={{ width: `${footer.column.getSize()}px` }}>
                                    {footer.isPlaceholder
                                        ? null
                                        : flexRender(footer.column.columnDef.footer, footer.getContext())}
                                </td>
                            ))
                        )}
                    </tr>
                </tfoot>
            </table>

        </div>
    )
}