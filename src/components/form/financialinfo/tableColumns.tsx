import { createColumnHelper } from "@tanstack/react-table";
import { FeeRow } from "./financialInfo.schema";
import { formatNumber } from "./tableUtils";
import { YEARS, COLUMN_SIZES } from "./tableConstants";
import { useFinancialStore } from "./useFinancialtable";
import { Trash, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { handleGridNavigation } from "./tableUtils";

const columnHelper = createColumnHelper<FeeRow>();

export type ColumnFactoryConfig = {
    labelHeader: string;
    dataKey: "tuitionData" | "miscData" | "nonrecurData";
    editableLabel?: boolean;
    editableCell?: boolean
    showAction?: boolean;
    operation?: "add" | "mult"
    labelFooter?: string
};

export function createColumnsFactory(config: ColumnFactoryConfig) {
    const { labelHeader, dataKey, editableLabel = false, editableCell = false, showAction = false, operation = "add", labelFooter = "" } = config;
    const isFirst = dataKey === 'tuitionData'
    return [
        // LABEL COLUMN
        columnHelper.accessor("label", {
            header: labelHeader,
            size: COLUMN_SIZES.label,
            minSize: 300,
            footer: () => <strong>{labelFooter}</strong>,
            cell: editableLabel
                ? ({ getValue, row: { index }, column: { id }, table }) => {
                    const initialValue = getValue<string>() ?? "";

                    return (
                        <input
                            data-row={index}
                            data-col={0}
                            className="w-full border px-2 py-1"
                            defaultValue={initialValue}
                            onKeyDown={handleGridNavigation}
                            onBlur={(e) =>
                                table.options.meta?.updateData?.(
                                    index,
                                    id,
                                    e.target.value,
                                    dataKey
                                )
                            }
                        />
                    );
                }
                : info => info.getValue(),
        }),

        // YEAR COLUMNS
        ...YEARS.map((year, colIndex) =>
            columnHelper.accessor(row => row.years[year], {
                id: year,
                header: isFirst ? `${year} Year` : '',
                size: COLUMN_SIZES.year,
                minSize: COLUMN_SIZES.year,
                cell: editableCell
                    ? ({ getValue, row: { index }, column: { id }, table }) => {
                        const initialValue = getValue<number>() ?? 0;

                        const [value, setValue] = useState<string>(String(initialValue));

                        // Sync external changes (zustand updates)
                        useEffect(() => {
                            setValue(String(initialValue));
                        }, [initialValue]);

                        const updateValue = () => {
                            const numericValue = Number(value.replace(/,/g, "")) || 0;
                            table.options.meta?.updateData?.(index, id, numericValue, dataKey);
                            setValue(String(numericValue)); // normalize after blur
                        };

                        return (
                            <input
                                type="text"
                                value={value}
                                className="w-full text-right px-1"
                                data-row={index}
                                data-col={colIndex + 1}
                                onKeyDown={handleGridNavigation}
                                onFocus={(e) => e.currentTarget.select()}
                                onChange={(e) => {
                                    let input = e.target.value;

                                    // Allow only numbers + single decimal
                                    input = input.replace(/[^0-9.]/g, "");

                                    const parts = input.split(".");
                                    if (parts.length > 2) {
                                        input = parts[0] + "." + parts.slice(1).join("");
                                    }

                                    setValue(input);
                                }}
                                onBlur={updateValue}
                            />
                        );
                    }
                    : info => (
                        <div className="text-right">
                            {formatNumber(info.getValue())}
                        </div>
                    ),
                footer: operation === 'mult' ? (info) => {
                    // Find Fee per Unit and Units rows
                    const feePerUnitRow = info.table.getRowModel().rows.find(r => r.original.key === 1)
                    const unitsRow = info.table.getRowModel().rows.find(r => r.original.key === 2,)

                    const fee = feePerUnitRow?.original.years[year] ?? 0
                    const units = unitsRow?.original.years[year] ?? 0

                    const total = fee * units

                    return <strong>{`${formatNumber(total)}`}</strong>
                } : (info) => {

                    const total = info.table.getRowModel().rows.reduce((sum, row) => {
                        const value = row.getValue<number>(year);
                        return sum + (value ?? 0);
                    }, 0);

                    return <strong>{`${formatNumber(total)}`}</strong>
                },
            })

        ),
        columnHelper.display({
            id: "actions",
            header: isFirst ? "Action" : "",
            size: COLUMN_SIZES.actions,
            minSize: COLUMN_SIZES.actions,
            cell: showAction ? ({ row, table, row: { index }, column: { id } }) => {
                // get total rows from table
                const totalRows = table.getRowModel().rows.length;
                const deleteRowFromStore = useFinancialStore(state => state.deleteRow)

                return (
                    <div className='flex justify-center'>
                        <button
                            data-row={index}
                            data-col={YEARS.length + 1}
                            tabIndex={0}
                            className={`text-red-600 p-1 rounded hover:bg-red-100 ${totalRows === 1 ? 'opacity-50 cursor-not-allowed hover:bg-transparent' : ''
                                }`}
                            onClick={() => {
                                if (totalRows > 1) {
                                    deleteRowFromStore(dataKey, row.original.key);
                                }
                            }}
                            disabled={totalRows === 1}
                            title={totalRows === 1 ? "Cannot delete the last row" : "Delete row"}
                        >
                            <Trash size={16} />
                        </button>
                    </div>
                );
            } : '',
            footer: showAction
                ? () => {
                    const addRowToStore = useFinancialStore((state) => state.addRow);

                    return (
                        <div className="flex justify-center">
                            <button
                                className="text-green-600 p-1 rounded hover:bg-green-100"
                                onClick={() => {
                                    // Add the new row
                                    addRowToStore(dataKey);

                                    // Focus first input of the new row
                                    setTimeout(() => {
                                        // Get the table container
                                        const tableContainer = document.querySelector<HTMLDivElement>(`[data-table="${dataKey}"]`);
                                        if (!tableContainer) return;

                                        // Find the last row (new row) first input
                                        const inputs = tableContainer.querySelectorAll<HTMLInputElement>("input[data-row]");
                                        const lastRowInput = Array.from(inputs).filter(input => Number(input.dataset.row) === inputs.length - 1)[0];

                                        lastRowInput?.focus();
                                        lastRowInput?.select();
                                    }, 10);
                                }}
                                title="Add row"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    );
                }
                : undefined,
        }),
    ]
}