import type { Config } from 'drizzle-kit'
import 'dotenv/config'
import path from 'path'

const dbPath = process.env.DATABASE_PATH || './data/quiz.db'

export default {
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'sqlite',
  driver: 'turso',
  dbCredentials: {
    url: `file:${path.resolve(dbPath)}`,
  },
} satisfies Config
