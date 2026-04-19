import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from './schema.js'
import path from 'path'

const dbPath = process.env.DATABASE_PATH || './data/quiz.db'
const absolutePath = path.resolve(dbPath)

const client = createClient({ url: `file:${absolutePath}` })

export const db = drizzle(client, { schema })
