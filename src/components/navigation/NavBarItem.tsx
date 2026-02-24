import { Link } from '@tanstack/react-router'
import { ChevronDown, ChevronRight } from 'lucide-react'
import type { ReactNode } from 'react'

interface NavItemProps {
  to: string
  icon: ReactNode
  label: string
  onNavigate?: () => void
}

interface NavGroupProps {
  label: string
  icon: ReactNode
  expanded: boolean
  onToggle: () => void
  children: ReactNode
}

export function NavItem({ to, icon, label, onNavigate }: NavItemProps) {
  return (
    <Link
      to={to}
      onClick={onNavigate}
      className="flex items-center gap-3 p-3 rounded-lg hover:bg-lebSecond hover:text-black transition-colors mb-2"
      activeProps={{
        className:
          'flex items-center gap-3 p-3 rounded-lg bg-lebSecond text-black hover:bg-lebThird transition-colors mb-2',
      }}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  )
}

export function NavGroup({
  label,
  icon,
  expanded,
  onToggle,
  children,
}: NavGroupProps) {
  return (
    <div className="mb-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 p-3 font-medium">
          {icon}
          <span>{label}</span>
        </div>

        <button
          onClick={onToggle}
          className="p-2 hover:bg-lebSecond hover:text-black rounded-lg transition-colors"
        >
          {expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {expanded && (
        <div className="flex flex-col ml-6 mt-1 transition">{children}</div>
      )}
    </div>
  )
}
