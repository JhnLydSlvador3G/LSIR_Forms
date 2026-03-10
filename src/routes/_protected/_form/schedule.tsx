import ScheduleForm from '@/components/form/schedule/Schedule'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/_form/schedule')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div>
            <ScheduleForm />
        </div>
    )
}
