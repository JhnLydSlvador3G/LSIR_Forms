import ProgramInfo from '@/components/form/programinfo/ProgInfo'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/_form/programinfo')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <ProgramInfo />
    </>
  )
}
