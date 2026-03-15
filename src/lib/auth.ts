import { betterAuth } from 'better-auth'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { username } from 'better-auth/plugins'
import { db } from '@/db'
/*
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [tanstackStartCookies(), username()],
})
*/

// wrap the database config: — skip the database adapter entirely when db is null, so Better Auth runs in stateless mode.
export const auth = betterAuth({
  ...(db ? { database: drizzleAdapter(db, { provider: 'pg' }) } : {}),
  emailAndPassword: { enabled: true },
  plugins: [tanstackStartCookies(), username()],
})


