import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { eq, desc, asc } from 'drizzle-orm'
import { db } from '../db/index.js'
import { scores } from '../db/schema.js'
import { validateQuery, validateBody } from '../middleware/validate.js'

const router = Router()

const GetRankingSchema = z.object({
  difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'all']).default('all'),
})

const PostScoreSchema = z.object({
  nickname: z.string().min(1).max(30).trim(),
  score: z.number().int().min(0),
  total: z.number().int().min(1),
  streak: z.number().int().min(0),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'all']),
})

type GetRankingQuery = z.infer<typeof GetRankingSchema>
type PostScoreBody = z.infer<typeof PostScoreSchema>

router.get(
  '/ranking',
  validateQuery(GetRankingSchema),
  async (req: Request & { validatedQuery?: GetRankingQuery }, res: Response): Promise<void> => {
    const { difficulty } = req.validatedQuery!

    const rows = await db
      .select()
      .from(scores)
      .where(difficulty !== 'all' ? eq(scores.difficulty, difficulty) : undefined)
      .orderBy(desc(scores.score), asc(scores.total), asc(scores.created_at))
      .limit(10)

    res.json(rows)
  },
)

router.post(
  '/scores',
  validateBody(PostScoreSchema),
  async (req: Request & { validatedBody?: PostScoreBody }, res: Response): Promise<void> => {
    const payload = req.validatedBody!

    const inserted = await db.insert(scores).values(payload).returning()

    res.status(201).json(inserted[0])
  },
)

export default router
