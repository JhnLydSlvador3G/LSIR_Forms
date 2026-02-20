import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import type {
  ReactNode} from 'react';

type SidebarContextType = {
  isOpen: boolean
  toggle: () => void
  close: () => void
} | null

const SidebarContext = createContext<SidebarContextType>(null)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen((prev) => !prev)
  const close = () => setIsOpen(false)

  // Scroll Lock on open
  useEffect(() => {
    isOpen
      ? (document.body.style.overflow = 'hidden')
      : (document.body.style.overflow = 'auto')

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, close }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSideBar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}
