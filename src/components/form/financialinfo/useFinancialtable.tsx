import { create } from 'zustand'
import { tuitionSummary, miscFeeSummary, FeeRow } from './financialInfo.schema'
import { year } from 'drizzle-orm/mysql-core'

type DataKey = 'tuitionData' | 'miscData' | 'nonrecurData'

export interface FinancialState {
    tuitionData: FeeRow[]
    miscData: FeeRow[]
    nonrecurData: FeeRow[]
    setData: (key: DataKey, rowIndex: number, columnId: string, value: unknown) => void
    // in your store
    deleteRow: (key: DataKey, rowKey: number | string) => void
    addRow: (key: DataKey) => void
}

export const useFinancialStore = create<FinancialState>((set, get) => ({
    tuitionData: tuitionSummary,
    miscData: miscFeeSummary,
    nonrecurData: miscFeeSummary,

    setData: (key, rowIndex, columnId, value) => {
        const old = get()[key]

        const data = old.map((row, index) => {
            if (index === rowIndex) {
                // If editing the label column
                if (columnId === 'label') {
                    return {
                        ...row,
                        label: String(value), // ensure label is string
                    }
                }

                // Otherwise, it's a year column
                return {
                    ...row,
                    years: {
                        ...row.years,
                        [columnId]: Number(value), // ensure numeric
                    },
                }
            }
            return row
        })

        set({ [key]: data } as Pick<FinancialState, DataKey>)
    },

    deleteRow: (key: DataKey, rowKey: number | string) => {
        const old = get()[key]
        const newData = old.filter(row => String(row.key) !== String(rowKey))
        set({ [key]: newData })
    },

    addRow(key) {
        const old = get()[key]

        const newRow: FeeRow = {
            key: old.length + 1,
            label: "",
            years: {
                "1st": 0,
                "2nd": 0,
                "3rd": 0,
                "4th": 0,
                "5th": 0,
            },
        };

        const newData = [...old, newRow]
        set({ [key]: newData })
    },
}))