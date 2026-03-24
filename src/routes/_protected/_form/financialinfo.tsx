import FinancialInfo from '@/components/form/financialinfo/FinancialInfo'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/_form/financialinfo')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <>
            <FinancialInfo />
        </>
    )
}
