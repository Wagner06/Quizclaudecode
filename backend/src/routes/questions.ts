import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { and, notInArray, eq, sql } from 'drizzle-orm'
import { db } from '../db/index.js'
import { questions } from '../db/schema.js'
import { validateQuery } from '../middleware/validate.js'

const router = Router()

const GetQuestionsSchema = z.object({
  difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'all']).default('all'),
  category: z.enum(['basic', 'heroes', 'villains', 'advanced', 'campaign', 'all']).default('all'),
  limit: z.coerce.number().int().min(1).max(50).default(1),
  exclude: z.string().optional(),
})

type GetQuestionsQuery = z.infer<typeof GetQuestionsSchema>

router.get(
  '/',
  validateQuery(GetQuestionsSchema),
  async (req: Request & { validatedQuery?: GetQuestionsQuery }, res: Response): Promise<void> => {
    const { difficulty, category, limit, exclude } = req.validatedQuery!

    const excludeIds =
      exclude
        ?.split(',')
        .map(Number)
        .filter((n) => !isNaN(n) && n > 0) ?? []

    const conditions = []
    if (difficulty !== 'all') {
      conditions.push(eq(questions.difficulty, difficulty))
    }
    if (category !== 'all') {
      conditions.push(eq(questions.category, category))
    }
    if (excludeIds.length > 0) {
      conditions.push(notInArray(questions.id, excludeIds))
    }

    const rows = await db
      .select()
      .from(questions)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(sql`RANDOM()`)
      .limit(limit)

    if (rows.length === 0) {
      res.status(204).send()
      return
    }

    res.json(rows)
  },
)

export default router
