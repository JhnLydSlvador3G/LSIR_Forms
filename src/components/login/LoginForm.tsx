'use client'

import { z } from 'zod'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { useAppForm } from '@/hooks/useFormContext'
import { authClient } from '@/lib/auth-client'

const LoginFormSchema = z.object({
  userName: z.string().min(1, 'Username is required'),
  password: z.string().min(8, 'You must have a length of at least 8'),
})

type LoginFormValues = z.infer<typeof LoginFormSchema>

const defaultValues: LoginFormValues = {
  userName: '',
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
      onChange: LoginFormSchema,
    },
    /* Note: The login form calls authClient.signIn.username(...) which hits the Better Auth API endpoint, which hits the DB. This will error out.
    onSubmit: async ({ value, formApi }) => {
      const { userName, password } = value
      const { data, error } = await authClient.signIn.username({
        username: userName,
        password: password,
      })

      if (error) {
        formApi.setErrorMap({ onSubmit: error.message })
      } else {
        navigate({ to: redirectTo })
      }
    },
    */
   // Note: Before calling authClient, check if the entered credentials match the env vars and short-circuit with a direct navigate().
    onSubmit: async ({ value, formApi }) => {
      const { userName, password } = value

      // DEV BYPASS
      if (import.meta.env.VITE_AUTH_BYPASS === 'true') {
        if (
          userName === import.meta.env.VITE_DEV_LOGIN_USER &&
          password === import.meta.env.VITE_DEV_LOGIN_PASS
        ) {
          navigate({ to: redirectTo })
          return
        } else {
          formApi.setErrorMap({ onSubmit: { message: 'Invalid dev credentials' } as never })
          return
        }
      }

      // normal auth flow below...
      // @ts-expect-error username plugin not reflected in client type
      const { error } = await authClient.signIn.username({ username: userName, password })

      if (error) {
        formApi.setErrorMap({ onSubmit: error.message })
      } else {
        navigate({ to: redirectTo })
      }
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
          name="userName"
          children={(field) => (
            <field.TextField label="Username" htmlForVal="userName" />
          )}
        />
        <form.AppField
          name="password"
          children={(field) => <field.PasswordField label="Password" />}
        />
        <form.FormErrorMessage />
        <form.SubscribeButton label="Sign in" />
      </form.AppForm>
    </form>
  )
}
