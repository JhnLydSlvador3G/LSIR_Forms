import { RowData } from "@tanstack/react-table"
import { FinancialState } from "./useFinancialtable";

declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowData> {
        updateData: (rowIndex: number, columnId: string, value: unknown, key: keyof FinancialState) => void
    }
}