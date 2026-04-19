import { createContext, useContext, useReducer, ReactNode } from 'react'
import type { QuizState, QuizAction, Difficulty, Category } from '../types'

const initialState: QuizState = {
  difficulty: 'all',
  category: 'all',
  currentQuestion: null,
  seenIds: [],
  score: 0,
  total: 0,
  currentStreak: 0,
  maxStreak: 0,
  phase: 'idle',
  lastAnswerCorrect: null,
  error: null,
}

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'START_QUIZ':
      return {
        ...initialState,
        difficulty: action.difficulty,
        category: action.category,
        phase: 'loading',
      }
    case 'QUESTION_LOADING':
      return { ...state, phase: 'loading', currentQuestion: null, error: null }
    case 'QUESTION_LOADED':
      return {
        ...state,
        currentQuestion: action.question,
        seenIds: [...state.seenIds, action.question.id],
        phase: 'answering',
        lastAnswerCorrect: null,
      }
    case 'POOL_EXHAUSTED':
      return { ...state, phase: 'finished' }
    case 'ANSWER': {
      const newCurrentStreak = action.isCorrect ? state.currentStreak + 1 : 0
      return {
        ...state,
        score: action.isCorrect ? state.score + 1 : state.score,
        total: state.total + 1,
        currentStreak: newCurrentStreak,
        maxStreak: Math.max(state.maxStreak, newCurrentStreak),
        lastAnswerCorrect: action.isCorrect,
        phase: 'feedback',
      }
    }
    case 'NEXT_QUESTION':
      return { ...state, phase: 'loading', currentQuestion: null }
    case 'END_SESSION':
      return { ...state, phase: 'finished' }
    case 'RESET':
      return initialState
    case 'SET_ERROR':
      return { ...state, error: action.message, phase: 'error' }
    default:
      return state
  }
}

interface QuizContextValue {
  state: QuizState
  dispatch: React.Dispatch<QuizAction>
  startQuiz: (difficulty: Difficulty, category: Category) => void
}

const QuizContext = createContext<QuizContextValue | null>(null)

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState)

  function startQuiz(difficulty: Difficulty, category: Category) {
    dispatch({ type: 'START_QUIZ', difficulty, category })
  }

  return (
    <QuizContext.Provider value={{ state, dispatch, startQuiz }}>
      {children}
    </QuizContext.Provider>
  )
}

export function useQuizContext(): QuizContextValue {
  const ctx = useContext(QuizContext)
  if (!ctx) throw new Error('useQuizContext deve ser usado dentro de <QuizProvider>')
  return ctx
}
