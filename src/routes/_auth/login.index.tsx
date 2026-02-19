import { createFileRoute } from '@tanstack/react-router'
import LoginForm from '@/components/login/LoginForm'
import LoginLayout from '@/components/login/LoginLayout'
import LoginPageContent from '@/components/login/LoginPageContent'

export const Route = createFileRoute('/_auth/login/')({
  component: RouteComponent,
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
