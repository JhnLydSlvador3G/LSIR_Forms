import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import NavigationBar from '@/components/navigation/NavBar'
import Footer from '@/components/Footer'
import { SidebarProvider } from '@/hooks/useSideBar'
import { userQueryOptions } from '@/lib/queries/user'

export const Route = createFileRoute('/_protected')({
  beforeLoad: async ({ context, location }) => {
    const user = await context.queryClient.ensureQueryData(userQueryOptions())

    if (!user) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      })
    }

    return ({ user })
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
