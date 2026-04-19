import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const questions = sqliteTable('questions', {
  id:          integer('id').primaryKey({ autoIncrement: true }),
  statement:   text('statement').notNull(),
  answer:      integer('answer', { mode: 'boolean' }).notNull(),
  explanation: text('explanation').notNull(),
  category:    text('category', { enum: ['basic', 'heroes', 'villains', 'advanced', 'campaign'] }).notNull(),
  difficulty:  text('difficulty', { enum: ['beginner', 'intermediate', 'advanced'] }).notNull(),
  expansion:   text('expansion'),
  created_at:  text('created_at').default(sql`CURRENT_TIMESTAMP`),
})

export const scores = sqliteTable('scores', {
  id:         integer('id').primaryKey({ autoIncrement: true }),
  nickname:   text('nickname').notNull(),
  score:      integer('score').notNull(),
  total:      integer('total').notNull(),
  streak:     integer('streak').notNull(),
  difficulty: text('difficulty').notNull(),
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
})

export type Question = typeof questions.$inferSelect
export type NewQuestion = typeof questions.$inferInsert
export type Score = typeof scores.$inferSelect
export type NewScore = typeof scores.$inferInsert
