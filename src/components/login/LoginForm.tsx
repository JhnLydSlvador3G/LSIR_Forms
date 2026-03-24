import { z } from 'zod'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { useAppForm } from '@/hooks/useFormContext'
import { authClient } from '@/lib/auth-client'
import { getLoginErrorMessage } from '@/lib/errorMessages'
import { sleep } from '@/lib/utils'

const LoginFormSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(8, 'You must have a length of at least 8'),
})

type LoginFormValues = z.infer<typeof LoginFormSchema>

const defaultValues: LoginFormValues = {
  username: '',
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
      onChangeAsyncDebounceMs: 1500,
      onChange: LoginFormSchema,
      onChangeAsync: async () => {

      },
      onSubmitAsync: async ({ value, formApi }) => {
        const { username, password } = value
        await sleep(10000)
        const { error } = await authClient.signIn.username({
          username: username,
          password: password,
        })

        if (error) {
          return getLoginErrorMessage(error.status);
        } else {
          navigate({ to: redirectTo })
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
          name="username"
          children={(field) => (
            <field.TextField label="Username" htmlForVal="username" />
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
