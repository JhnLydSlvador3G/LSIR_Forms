import { createFileRoute, redirect } from '@tanstack/react-router'
import LoginForm from '@/components/login/LoginForm'
import LoginLayout from '@/components/login/LoginLayout'
import LoginPageContent from '@/components/login/LoginPageContent'
import { userQueryOptions } from '@/lib/queries/user'


export const Route = createFileRoute('/_auth/login/')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(userQueryOptions())

    if (user) {
      throw redirect({ to: '/dashboard' }) // no need for search param
    }
  },
})

function RouteComponent() {
  return (
    <div className="flex flex-col md:flex-row">
      <LoginPageContent></LoginPageContent>
      <LoginLayout>
        <LoginForm></LoginForm>
      </LoginLayout>
    </div>
  )
}
