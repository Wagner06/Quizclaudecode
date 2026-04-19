export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'all'
export type Category = 'basic' | 'heroes' | 'villains' | 'advanced' | 'campaign' | 'all'
export type QuizPhase = 'idle' | 'loading' | 'answering' | 'feedback' | 'finished' | 'error'

export interface Question {
  id: number
  statement: string
  answer: boolean
  explanation: string
  category: Exclude<Category, 'all'>
  difficulty: Exclude<Difficulty, 'all'>
  expansion: string | null
  created_at: string
}

export interface Score {
  id: number
  nickname: string
  score: number
  total: number
  streak: number
  difficulty: string
  created_at: string
}

export interface PostScorePayload {
  nickname: string
  score: number
  total: number
  streak: number
  difficulty: string
}

export type RankingEntry = Score

export interface QuizState {
  difficulty: Difficulty
  category: Category
  currentQuestion: Question | null
  seenIds: number[]
  score: number
  total: number
  currentStreak: number
  maxStreak: number
  phase: QuizPhase
  lastAnswerCorrect: boolean | null
  error: string | null
}

export type QuizAction =
  | { type: 'START_QUIZ'; difficulty: Difficulty; category: Category }
  | { type: 'QUESTION_LOADING' }
  | { type: 'QUESTION_LOADED'; question: Question }
  | { type: 'POOL_EXHAUSTED' }
  | { type: 'ANSWER'; isCorrect: boolean }
  | { type: 'NEXT_QUESTION' }
  | { type: 'END_SESSION' }
  | { type: 'RESET' }
  | { type: 'SET_ERROR'; message: string }
