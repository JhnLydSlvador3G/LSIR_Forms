import { createFileRoute } from '@tanstack/react-router'
import FacultyProfile from '@/components/form/facultyprofile/FacultyProfile'

export const Route = createFileRoute('/_protected/_form/facultyprofile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <FacultyProfile />
}
