import { Request, Response, NextFunction } from 'express'
import { ZodType } from 'zod'

export function validateQuery<T>(schema: ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.query)
    if (!result.success) {
      res.status(400).json({ error: result.error.flatten() })
      return
    }
    ;(req as Request & { validatedQuery: T }).validatedQuery = result.data
    next()
  }
}

export function validateBody<T>(schema: ZodType<T>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      res.status(400).json({ error: result.error.flatten() })
      return
    }
    ;(req as Request & { validatedBody: T }).validatedBody = result.data
    next()
  }
}
