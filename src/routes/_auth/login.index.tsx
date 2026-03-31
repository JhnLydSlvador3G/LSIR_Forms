import { createFileRoute, redirect } from '@tanstack/react-router'
import LoginForm from '@/components/login/LoginForm'
import LoginLayout from '@/components/login/LoginLayout'
import LoginPageContent from '@/components/login/LoginPageContent'
import { checkAuthSession } from '@/lib/auth-fn'


export const Route = createFileRoute('/_auth/login/')({
  component: RouteComponent,
  beforeLoad: async ({ location }) => {
    const session = await checkAuthSession()
    if (session) {
      throw redirect({
        to: '/dashboard',
        search: { redirect: location.href },
      })
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
