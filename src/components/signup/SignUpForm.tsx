import { z } from 'zod'
import { useNavigate, Link } from '@tanstack/react-router'
import { useAppForm } from '@/hooks/useFormContext'
import { authClient } from '@/lib/auth-client'
import { useState } from 'react'
import { CheckCircle } from 'lucide-react'

// Zod validation schema — .refine() cross-validates password match
const SignUpFormSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type SignUpFormValues = z.infer<typeof SignUpFormSchema>

const defaultValues: SignUpFormValues = {
  name: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
}

export default function SignUpForm() {
  const navigate = useNavigate()
  const [success, setSuccess] = useState(false)

  const form = useAppForm({
    defaultValues,
    validators: { onChange: SignUpFormSchema },
    onSubmit: async ({ value, formApi }) => {
      // Call Better Auth signUp.email — username field enabled via usernameClient() in auth-client.ts
      const { error } = await authClient.signUp.email({
        name: value.name,
        email: value.email,
        password: value.password,
        username: value.username,
      })

      // On error show Better Auth message, on success go to dashboard
      if (error) {
        console.error('SignUp error:', error)
        formApi.setErrorMap({ onSubmit: error.message })
      } else {
        setSuccess(true)
        setTimeout(() => navigate({ to: '/login' }), 3000)
      }
    },
  })

  // Success message — shown after account creation, redirects to login after 3 seconds
  if (success) {
    return (
      <div className="w-full flex flex-col items-center gap-4 py-10 text-center">
        <CheckCircle className="text-green-500" size={48} />
        <h4 className="text-xl font-semibold text-leb">Account Created!</h4>
        <p className="text-sm text-gray-500">
          Your account has been successfully created. Redirecting you to the sign in page...
        </p>
      </div>
    )
  }

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
        <div className="flex flex-row gap-3">
          <div className="flex-1 min-w-0">
            <form.AppField
              name="name"
              children={(field) => <field.TextField label="Full Name" htmlForVal="name" />}
            />
          </div>
          <div className="flex-1 min-w-0">
            <form.AppField
              name="username"
              children={(field) => <field.TextField label="Username" htmlForVal="username" />}
            />
          </div>
        </div>
        <form.AppField
          name="email"
          children={(field) => <field.TextField label="Email Address" htmlForVal="email" />}
        />
        <div className="flex flex-row gap-3">
          <div className="flex-1 min-w-0">
            <form.AppField
              name="password"
              children={(field) => <field.PasswordField label="Password" />}
            />
          </div>
          <div className="flex-1 min-w-0">
            <form.AppField
              name="confirmPassword"
              children={(field) => <field.PasswordField label="Confirm Password" />}
            />
          </div>
        </div>
        <form.FormErrorMessage />
        <form.SubscribeButton label="Create Account" />
      </form.AppForm>
      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="text-leb font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  )
}
