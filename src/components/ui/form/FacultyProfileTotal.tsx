import { useFormContext } from '@/hooks/useFormContext'

type AnyRow = Record<string, unknown>

function isUniform<T>(input: Array<T>): boolean {
  const base = input[0]
  return input.every((element) => element === base)
}

function sumBy<T extends AnyRow>(
  rows: Array<T>,
  getValue: (row: T) => number,
): number {
  return rows.reduce((sum, row) => {
    const val = getValue(row)
    return sum + (isNaN(val) ? 0 : val)
  }, 0)
}

export function RowTotal({
  index,
  fieldName,
  calculate,
}: {
  index: number
  fieldName: string
  calculate: (row: AnyRow) => number
}) {
  const form = useFormContext()
  return (
    <form.Subscribe
      selector={(state) =>
        ((state.values as AnyRow)[fieldName] as Array<AnyRow>)?.[index]
      }
    >
      {(row) => <span>{row ? calculate(row) : 0}</span>}
    </form.Subscribe>
  )
}

export function ColumnTotal({
  fieldName,
  targetCol,
}: {
  fieldName: string
  targetCol: string
}) {
  const form = useFormContext()
  return (
    <form.Subscribe
      selector={(state) => (state.values as AnyRow)[fieldName] as Array<AnyRow>}
    >
      {(rows) => {
        const total = sumBy(rows ?? [], (row) =>
          row ? Number(row[targetCol] || 0) : 0,
        )
        return <span>{total}</span>
      }}
    </form.Subscribe>
  )
}

export function GrandTotal({
  fieldName,
  calculate,
}: {
  fieldName: string
  calculate: (row: AnyRow) => number
}) {
  const form = useFormContext()
  return (
    <form.Subscribe
      selector={(state) => (state.values as AnyRow)[fieldName] as Array<AnyRow>}
    >
      {(rows) => {
        const total = sumBy(rows ?? [], calculate)
        return <span>{total}</span>
      }}
    </form.Subscribe>
  )
}

export function calculateTotalFacultyRow(row: Record<string, unknown>): number {
  const fields = ['regular', 'partTime']
  return fields.reduce((sum, field) => {
    const val = Number(row[field] || 0)
    return sum + (isNaN(val) ? 0 : val)
  }, 0)
}

export function FacultyRowTotal({ index }: { index: number }) {
  return (
    <RowTotal
      index={index}
      fieldName="faculty"
      calculate={calculateTotalFacultyRow}
    />
  )
}

export function FacultyColumnTotal({ targetCol }: { targetCol: string }) {
  return <ColumnTotal fieldName="faculty" targetCol={targetCol} />
}

export function FacultyGrandTotal() {
  return <GrandTotal fieldName="faculty" calculate={calculateTotalFacultyRow} />
}

type RowConsistencyOptions = {
  tolerance?: number
}

export function validateRowConsistency(
  row: Record<string, unknown>,
  fieldGroups: Array<Array<string>>,
  options: RowConsistencyOptions = {},
) {
  const tolerance = options.tolerance ?? 0

  const categoryTotals = fieldGroups.map((fields) =>
    fields.reduce((sum, field) => {
      const val = Number(row[field] ?? 0)
      return sum + (Number.isFinite(val) ? val : 0)
    }, 0),
  )

  if (categoryTotals.length === 0) return true

  const max = Math.max(...categoryTotals)
  const min = Math.min(...categoryTotals)

  return Math.abs(max - min) <= tolerance
}
