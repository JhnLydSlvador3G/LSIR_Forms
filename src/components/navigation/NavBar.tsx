import { useLayoutEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { NavGroup, NavItem } from './NavBarItem'
import { navigationConfig } from './NavBar.constant'
import Backdrop from './BackDrop'
import { cn } from '@/lib/utils'
import { useSideBar } from '@/hooks/useSideBar'

export default function NavigationBar() {
  const { toggle, isOpen, close } = useSideBar()
  const [isScrolled, setIsScrolled] = useState(false)

  const [groupedExpanded, setGroupedExpanded] = useState<
    Record<string, boolean>
  >({})

  const toggleGroup = (key: string) => {
    setGroupedExpanded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  useLayoutEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', onScroll)
    onScroll()

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Header */}
      <header
        className={cn(
          'p-4 flex items-center text-white shadow-lg sticky top-0 left-0 right-0 z-20 transition-colors duration-300',
          isScrolled
            ? 'bg-white/60 backdrop-blur-md shadow-md'
            : 'bg-leb shadow-md backdrop-blur-sm',
        )}
      >
        <button
          onClick={toggle}
          className="p-2 group hover:bg-lebSecond rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu
            size={24}
            className={cn(
              'transition-colors',
              'group-hover:text-black',
              isScrolled && 'text-black',
            )}
          />
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-80 bg-leb text-white shadow-2xl z-50',
          'transform transition-transform duration-300 ease-in-out flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 shadow-lg">
          <div className="flex flex-row justify-center items-center gap-5">
            <img
              src="/leb-logo.png"
              alt="LEB Logo"
              className="h-10 sm:h-15 object-contain"
            />
            <h2 className="text-3xl font-bold">LEB LSIR</h2>
          </div>

          <button
            onClick={close}
            className="group p-2 hover:bg-lebSecond rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={24} className="group-hover:text-black transition-colors" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          {navigationConfig.map((entry) => {
            switch (entry.type) {
              case 'item': {
                const Icon = entry.icon

                return (
                  <NavItem
                    key={entry.label}
                    to={entry.to}
                    icon={<Icon size={20} />}
                    label={entry.label}
                    onNavigate={close}
                  />
                )
              }

              case 'group': {
                const Icon = entry.icon

                return (
                  <NavGroup
                    key={entry.key}
                    label={entry.label}
                    icon={<Icon size={20} />}
                    expanded={groupedExpanded[entry.key]}
                    onToggle={() => toggleGroup(entry.key)}
                  >
                    {entry.children.map((child) => {
                      const ChildIcon = child.icon

                      return (
                        <NavItem
                          key={child.label}
                          to={child.to}
                          icon={<ChildIcon size={18} />}
                          label={child.label}
                          onNavigate={close}
                        />
                      )
                    })}
                  </NavGroup>
                )
              }
            }
          })}
        </nav>
      </aside>

      <Backdrop />
    </>
  )
}
