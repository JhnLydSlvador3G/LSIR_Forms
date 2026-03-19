import { createFileRoute } from '@tanstack/react-router'
import ProgInfoSubmissionList from '@/components/form/programinfo/ProgInfoSubmissionList'

export const Route = createFileRoute('/_protected/_form/programinfo-submissions')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ProgInfoSubmissionList />
}
