import { useFormContext } from '@/hooks/form-context'
import { calculateTotalStudRow } from '@/lib/utils'
import { StudentProfileFormData } from '@/components/form/studentprofile/StudentProfile.types'

type ProfileRow = StudentProfileFormData['profiles'][number]

export function ProfileRowTotal({ index }: { index: number }) {
    const form = useFormContext()
    return (
        <form.Subscribe selector={(state) => state.values.profiles[index]}>
            {(row) => <span>{calculateTotalStudRow(row)}</span>}
        </form.Subscribe>
    )
}

export function ProfileColumnTotal({ targetCol }: { targetCol: string }) {
    const form = useFormContext()
    return (
        <form.Subscribe selector={(state) => state.values.profiles as ProfileRow[]}>
            {(profiles) => {
                const total = profiles.reduce((sum, row) => {
                    const val = Number(row[targetCol as keyof ProfileRow] || 0)
                    return sum + (isNaN(val) ? 0 : val)
                }, 0)
                return <span>{total}</span>
            }}
        </form.Subscribe>
    )
}

export function ProfileGrandTotal() {
    const form = useFormContext()
    return (
        <form.Subscribe selector={(state) => state.values.profiles as ProfileRow[]}>
            {(profiles) => {
                const total = profiles.reduce((sum, row) => {
                    const rowTotal = calculateTotalStudRow(row)
                    return sum + (isNaN(rowTotal) ? 0 : rowTotal)
                }, 0)
                return <span>{total}</span>
            }}
        </form.Subscribe>
    )
}