import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '@/lib/auth'
/* Note: calls getSession() in beforeLoad on every protected route. With no DB, auth.api.getSession() will fail or return null, bouncing every request back to /login forever.
export const getSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })

    return session
  },
)

export const ensureSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })

    if (!session) {
      throw new Error('Unauthorized')
    }

    return session
  },
)
  */
 //Add a bypass at the top of the handler — if VITE_AUTH_BYPASS=true, return a fake session object instead of calling Better Auth.
export const getSession = createServerFn({ method: 'GET' }).handler(async () => {
  // DEV BYPASS
  if (process.env.VITE_AUTH_BYPASS === 'true') {
    return {
      user: {
        id: 'dev-user',
        name: process.env.VITE_DEV_LOGIN_USER ?? 'admin',
        email: 'admin@dev.local',
        username: process.env.VITE_DEV_LOGIN_USER ?? 'admin',
      },
      session: { id: 'dev-session' },
    }
  }

  const headers = getRequestHeaders()
  return await auth.api.getSession({ headers })
})

