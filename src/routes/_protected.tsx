import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import NavigationBar from '@/components/navigation/NavBar'
import Footer from '@/components/Footer'
import { SidebarProvider } from '@/hooks/useSideBar'
import { checkAuthSession } from '@/lib/auth-fn'

export const Route = createFileRoute('/_protected')({
  beforeLoad: async ({ location }) => {
    const session = await checkAuthSession()

    if (!session) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }
    const userData = session.user

    return ({ userData })
  },
  component: () => (
    <SidebarProvider>
      <NavigationBar />
      <main className="flex-1 p-5 pb-32">
        <Outlet />
      </main>
      <Footer classNameProp="fixed left-0 bottom-0 z-40 w-full" />
    </SidebarProvider>
  ),
})
