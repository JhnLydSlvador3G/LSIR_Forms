import { useSideBar } from '@/hooks/useSideBar'

export default function Backdrop() {
  const { isOpen, close } = useSideBar()

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
      onClick={close}
    />
  )
}
