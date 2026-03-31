import { userQueryOptions } from '@/lib/queries/user'
import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {

  const user = useSuspenseQuery(userQueryOptions())

  return <div>Hello {user.data?.name}!</div>
}
