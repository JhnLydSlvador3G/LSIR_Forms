import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { NavGroup, NavItem } from './NavBarItem'

import { navigationConfig } from './NavBar.constant'
import Backdrop from './BackDrop'
import { useSideBar } from '@/hooks/SideBarContext'

export default function NavigationBar() {
  const { toggle, isOpen, close } = useSideBar()

  const [groupedExpanded, setGroupedExpanded] = useState<
    Record<string, boolean>
  >({})

  const toggleGroup = (key: string) => {
    setGroupedExpanded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <>
      <header className="p-4 flex items-center bg-leb text-white shadow-lg">
        <button
          onClick={toggle}
          className="p-2 group hover:bg-lebSecond rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu
            size={24}
            className="group-hover:text-black transition-colors"
          />
        </button>
      </header>

      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-leb text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-lebSecond">
          <h2 className="text-3xl font-bold">LEB LSIR</h2>
          <button
            onClick={close}
            className="group p-2 hover:bg-lebSecond rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={24} className="group-hover:text-black transition-colors" />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          {navigationConfig.map((entry) => {
            if (entry.type === 'item') {
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
            if (entry.type === 'group') {
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
          })}
        </nav>
      </aside>

      <Backdrop />
    </>
  )
}
