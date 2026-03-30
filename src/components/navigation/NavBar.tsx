import { useLayoutEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { NavGroup, NavItem } from './NavBarItem'
import { navigationConfig } from './NavBar.constant'
import Backdrop from './BackDrop'
import { cn } from '@/lib/utils'
import { useSideBar } from '@/hooks/useSideBar'

export default function NavigationBar() {
  const { open, toggle, isOpen, close } = useSideBar()
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
      {!isOpen && (
        <div
          className="fixed top-0 left-0 z-30 h-full w-3"
          onMouseEnter={open}
          aria-hidden="true"
        />
      )}

      {/* Header */}
      <header
        className={cn(
          'sticky top-0 left-0 right-0 z-20 flex items-center p-4 text-white shadow-lg transition-colors duration-300',
          isScrolled
            ? 'bg-white/60 shadow-md backdrop-blur-md'
            : 'bg-leb shadow-md backdrop-blur-sm',
        )}
      >
        <button
          onClick={toggle}
          className="group rounded-lg p-2 transition-colors hover:bg-lebSecond"
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
          'fixed top-0 left-0 z-50 flex h-full w-100 flex-col bg-leb text-white shadow-2xl',
          'transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-start justify-between gap-3 border-b border-white/15 px-4 py-3 shadow-lg">
          <div className="mt-1 flex min-w-0 items-start gap-4">
            <img
              src="/leb-logo.png"
              alt="LEB Logo"
              className="h-15 w-auto shrink-0 object-contain"
            />
            <div className="min-w-0">
              <p className="font-gov-serif text-[10px] font-medium uppercase tracking-[0.14em] text-white/75">
                Republic of the Philippines
              </p>
              <p className="font-gov-blackletter text-[13px] text-white/80">
                Office of the President
              </p>
              <div className="my-0.5 h-px w-full bg-white/60" />
              <h2 className="font-gov-board text-[13px] font-bold uppercase tracking-[0.08em] text-white">
                Legal Education Board | LSIR
              </h2>
            </div>
          </div>

          <button
            onClick={close}
            className="group mt-0.5 shrink-0 rounded-lg p-1.5 transition-colors hover:bg-lebSecond"
            aria-label="Close menu"
          >
            <X size={22} className="transition-colors group-hover:text-black" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
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
                    activePaths={entry.activePaths}
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
