import { createFileRoute } from '@tanstack/react-router'
import LawSchoolForm from '@/components/form/lawschool/LawSchoolForm'

// Route file = "page".
// - Because it lives under `src/routes/_protected/...`, it is protected by `src/routes/_protected.tsx`
//   (users will be redirected to `/login` if they are not signed in).
// - `_form` is a pathless grouping folder; this still becomes the URL `/lawschoolinfo`.
export const Route = createFileRoute('/_protected/_form/lawschoolinfo')({
  component: RouteComponent,
})

function RouteComponent() {
  // Keep route files tiny: they should only render a page component.
  // The real UI/form logic lives in `src/components/form/lawschool/LawSchoolForm.tsx`.
  return <LawSchoolForm />
}
