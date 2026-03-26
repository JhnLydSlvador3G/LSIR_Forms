import { drizzle } from 'drizzle-orm/node-postgres'

import * as schema from './accounts.ts'

export const db = drizzle(process.env.DATABASE_URL!, { schema })
