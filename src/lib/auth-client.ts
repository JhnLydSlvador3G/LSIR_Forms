import { createAuthClient } from 'better-auth/react'
import { usernameClient } from 'better-auth/client/plugins'

// Initialize Better Auth client with the username plugin
// usernameClient() enables signIn.username and signUp.email with username field
export const authClient = createAuthClient({
  plugins: [usernameClient()],
})
