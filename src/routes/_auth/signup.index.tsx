import { createFileRoute } from '@tanstack/react-router'
import SignUpForm from '@/components/signup/SignUpForm'
import SignUpPageContent from '@/components/signup/SignUpPageContent'
import SignUpLayout from '@/components/signup/SignUpLayout'

export const Route = createFileRoute('/_auth/signup/')({
  component: RouteComponent,
  /* beforeLoad: async ({ location }) => {
    const session = await getSession()

    if (session) {
      throw redirect({
        to: '/dashboard',
        search: { redirect: location.href },
      })
    }
  }, */
})

function RouteComponent() {
  return (
    <div className="flex flex-col md:flex-row">
      {/* Left side — signup-specific informational content */}
      <SignUpPageContent />
      {/* Right side — signup-specific layout with header and title */}
      <SignUpLayout>
        <SignUpForm />
      </SignUpLayout>
    </div>
  )
}
