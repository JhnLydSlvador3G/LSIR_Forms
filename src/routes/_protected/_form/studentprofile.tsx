import { createFileRoute } from '@tanstack/react-router'
import StudentProfile from '@/components/form/studentprofile/StudentProfile'

export const Route = createFileRoute('/_protected/_form/studentprofile')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <>
            <StudentProfile />
        </>
    )
}
