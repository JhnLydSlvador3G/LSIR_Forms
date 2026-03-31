import { createAuthClient } from 'better-auth/react'
import { tanstackStartCookies } from 'better-auth/tanstack-start'

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BETTER_AUTH_URL ?? import.meta.env.BETTER_AUTH_URL ?? 'http://localhost:3000',
  fetchOptions: {
    credentials: 'include'
  },
  plugins: [tanstackStartCookies()],
})


