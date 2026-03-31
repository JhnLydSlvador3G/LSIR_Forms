import { ColumnDef } from '@tanstack/react-table'
import { useState, useEffect } from 'react'
import { formatNumber } from './tableUtils'
import { FinancialState } from './useFinancialtable'

// 1️⃣ Generic Editable Cell with comma formatting
export function createDefaultColumn<T>(key: keyof FinancialState): Partial<ColumnDef<T, unknown>> {
    return {
        cell: ({ getValue, row: { index }, column: { id }, table }) => {
            const initialValue = getValue<unknown>() // the cell's value
            const [value, setValue] = useState(initialValue)

            // Update table data when input is blurred
            const onBlurUpdate = (numericValue: number) => {
                table.options.meta?.updateData?.(index, id, numericValue, key)
            }

            // Sync external changes
            useEffect(() => {
                setValue(initialValue)
            }, [initialValue])

            return (
                <input
                    type="text"
                    value={formatNumber(value as number)}
                    className='w-25'
                    onChange={(e) => {
                        let input = e.target.value
                        // Remove all non-digits and non-dot characters
                        input = input.replace(/[^0-9.]/g, "")
                        // Allow only one dot
                        const parts = input.split(".")
                        if (parts.length > 2) {
                            input = parts[0] + "." + parts.slice(1).join("")
                        }
                        // Keep as string for smooth editing
                        setValue(input ? input : "0")
                    }}
                    onBlur={() => {
                        const numericValue = Number(String(value).replace(/,/g, ""))
                        onBlurUpdate(numericValue)
                        setValue(numericValue)
                    }}
                />
            )
        },
    }
}