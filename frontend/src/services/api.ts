import type { Difficulty, Category, Question, Score, PostScorePayload, RankingEntry } from '../types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(
  path: string,
  options?: RequestInit,
  signal?: AbortSignal,
): Promise<T | null> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10_000)
  const mergedSignal = signal ?? controller.signal

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) },
      signal: mergedSignal,
    })
    clearTimeout(timeout)

    if (res.status === 204) return null
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new ApiError(
        (body as { message?: string }).message ?? `HTTP ${res.status}`,
        res.status,
      )
    }
    return (await res.json()) as T
  } catch (err) {
    clearTimeout(timeout)
    if (err instanceof ApiError) throw err
    throw new ApiError(err instanceof Error ? err.message : 'Network error', 0)
  }
}

export async function fetchQuestion(
  params: { difficulty: Difficulty; category: Category; exclude: number[] },
  signal?: AbortSignal,
): Promise<Question | null> {
  const qs = new URLSearchParams()
  qs.set('difficulty', params.difficulty)
  qs.set('category', params.category)
  qs.set('limit', '1')
  if (params.exclude.length > 0) {
    qs.set('exclude', params.exclude.join(','))
  }
  const result = await request<Question[]>(`/questions?${qs.toString()}`, {}, signal)
  if (result === null) return null
  return result[0] ?? null
}

export async function postScore(payload: PostScorePayload): Promise<Score> {
  const result = await request<Score>('/scores', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return result!
}

export async function fetchRanking(difficulty: Difficulty): Promise<RankingEntry[]> {
  const result = await request<RankingEntry[]>(`/ranking?difficulty=${difficulty}`)
  return result ?? []
}
