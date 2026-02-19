import { createFileRoute } from '@tanstack/react-router'
import LoginForm from '@/components/login/LoginForm'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return <div></div>
}
