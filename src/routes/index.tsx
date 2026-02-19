import { createFileRoute, redirect } from '@tanstack/react-router'
import { getSession } from '@/lib/auth.server'

export const Route = createFileRoute('/')({
  beforeLoad: async ({ location }) => {
    const session = await getSession()
    const to = session ? '/dashboard' : '/login'

    throw redirect({
      to,
      search: { redirect: location.href },
    })
  },
  component: () => null,
})
