import { createAuthClient } from 'better-auth/react'
import { tanstackStartCookies } from 'better-auth/tanstack-start'

export const authClient = createAuthClient({
  baseURL: 'http://localhost:8000',
  fetchOptions: {
    credentials: 'include'
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60 // Cache duration in seconds (5 minutes)
    }
  },
  useSecureCookies: false,
  plugins: [tanstackStartCookies()],
})


