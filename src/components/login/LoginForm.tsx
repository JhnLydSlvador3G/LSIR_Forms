import { z } from 'zod'
import { useLocation, useNavigate, Link } from '@tanstack/react-router'
import { useAppForm } from '@/hooks/useFormContext'
import { authClient } from '@/lib/auth-client'
import { getLoginErrorMessage } from '@/lib/errorMessages'

const isAuthBypassEnabled = import.meta.env.VITE_AUTH_BYPASS === 'true'
const devLoginUser = import.meta.env.VITE_DEV_LOGIN_USER ?? ''
const devLoginPass = import.meta.env.VITE_DEV_LOGIN_PASS ?? ''

const LoginFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .refine(
      (value) =>
        (isAuthBypassEnabled && value === devLoginUser) ||
        z.email().safeParse(value).success,
      'Please enter a valid email',
    ),
  password: z.string().min(8, 'You must have a length of at least 8'),
})

type LoginFormValues = z.infer<typeof LoginFormSchema>

const defaultValues: LoginFormValues = {
  email: '',
  password: '',
}

export default function LoginForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const redirectTo = searchParams.get('redirect') || '/dashboard'

  const form = useAppForm({
    defaultValues,
    validators: {
      onBlur: LoginFormSchema,
      onSubmitAsync: async ({ value }) => {
        const { email, password } = value

        if (
          isAuthBypassEnabled &&
          email === devLoginUser &&
          password === devLoginPass
        ) {
          document.cookie = 'dev_auth_bypass=1; path=/; SameSite=Lax'
          navigate({ to: redirectTo, replace: true })
          return
        }

        const { error } = await authClient.signIn.email({
          email: email,
          password: password,
        })

        if (error) {
          console.log(error)
          return getLoginErrorMessage(error.status);
        } else {
          navigate({ to: redirectTo, replace: true })
        }
      },
    },
  })

  return (
    <form
      className="w-full flex flex-col gap-8"
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      <form.AppForm>
        <form.AppField
          name="email"
          children={(field) => (
            <field.TextField label="Email" htmlForVal="username" />
          )}
        />
        <form.AppField
          name="password"
          children={(field) => <field.PasswordField label="Password" />}
        />
        <form.FormErrorMessage />
        <form.SubscribeButton label="Sign in" />
      </form.AppForm>

      <p className="text-center text-sm text-gray-500">
        Don't have an account?{' '}
        <Link to="/signup" className="text-leb font-medium hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  )
}
