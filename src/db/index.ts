import { drizzle } from 'drizzle-orm/node-postgres'

import * as schema from './accounts.ts'

/* This tries to connect to PostgreSQL immediately when the server starts. 

export const db = drizzle(process.env.DATABASE_URL!, { schema })
*/

export const db = process.env.DATABASE_URL
  ? drizzle(process.env.DATABASE_URL, { schema })
  : null