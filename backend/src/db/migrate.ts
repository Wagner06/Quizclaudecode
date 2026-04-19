import 'dotenv/config'
import { migrate } from 'drizzle-orm/libsql/migrator'
import { db } from './index.js'

async function main() {
  await migrate(db, { migrationsFolder: './src/db/migrations' })
  console.log('Migrations applied.')
  process.exit(0)
}

main().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
