import { checkAuthSession } from '@/lib/auth-fn'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    const session = await checkAuthSession()
    const to = session ? '/dashboard' : '/login'

    throw redirect({
      to
    })
  },
  component: () => null
})
