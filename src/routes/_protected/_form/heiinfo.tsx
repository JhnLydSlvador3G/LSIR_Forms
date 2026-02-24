import { createFileRoute } from '@tanstack/react-router'
import HeiForm from '@/components/form/hei/HeiForm'

export const Route = createFileRoute('/_protected/_form/heiinfo')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <HeiForm />
    </>
  )
}
