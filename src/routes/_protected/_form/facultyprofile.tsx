import FacultyProfile from '@/components/form/facultyprofile/FacultyProfile'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/_form/facultyprofile')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <FacultyProfile />
    )
}
