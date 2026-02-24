import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { getSession } from '@/lib/auth.server'
import NavigationBar from '@/components/navigation/NavBar'
import Footer from '@/components/Footer'
import { SidebarProvider } from '@/hooks/SideBarContext'

export const Route = createFileRoute('/_protected')({
  beforeLoad: async ({ location }) => {
    const session = await getSession()

    if (!session) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }

    return { user: session.user }
  },
  component: () => (
    <SidebarProvider>
      <NavigationBar />
      <main className="flex-1 p-5 pb-18">
        <Outlet />
      </main>
      <Footer classNameProp="fixed left-0 bottom-0 w-full" />
    </SidebarProvider>
  ),
})
