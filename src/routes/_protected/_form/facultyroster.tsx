import FacultyRoster from '@/components/form/facultyroster/FacultyRoster'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/_form/facultyroster')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <FacultyRoster />
    )
}
