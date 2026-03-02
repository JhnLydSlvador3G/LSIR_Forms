import { createFileRoute } from '@tanstack/react-router'
import FacultyActivity from '@/components/form/facultydevelopment/FacultyDev'

export const Route = createFileRoute('/_protected/_form/facultydevelopment')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <FacultyActivity />
    </>
  )
}
