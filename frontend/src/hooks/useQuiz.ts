import { useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuizContext } from '../context/QuizContext'
import { fetchQuestion } from '../services/api'

export function useQuiz() {
  const { state, dispatch } = useQuizContext()
  const navigate = useNavigate()
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Fetch next question whenever phase enters 'loading'
  useEffect(() => {
    if (state.phase !== 'loading') return

    const controller = new AbortController()

    fetchQuestion(
      {
        difficulty: state.difficulty,
        category: state.category,
        exclude: state.seenIds,
      },
      controller.signal,
    )
      .then((question) => {
        if (controller.signal.aborted) return
        if (question === null) {
          dispatch({ type: 'POOL_EXHAUSTED' })
        } else {
          dispatch({ type: 'QUESTION_LOADED', question })
        }
      })
      .catch((err) => {
        if (controller.signal.aborted) return
        dispatch({ type: 'SET_ERROR', message: err.message ?? 'Erro ao buscar pergunta' })
      })

    return () => {
      controller.abort()
    }
  }, [state.phase, state.difficulty, state.category, state.seenIds, dispatch])

  // Navigate to result when session finishes
  useEffect(() => {
    if (state.phase === 'finished') {
      navigate('/result')
    }
  }, [state.phase, navigate])

  const submitAnswer = useCallback(
    (answer: boolean) => {
      if (state.phase !== 'answering' || !state.currentQuestion) return

      const isCorrect = answer === state.currentQuestion.answer
      dispatch({ type: 'ANSWER', isCorrect })

      feedbackTimerRef.current = setTimeout(() => {
        dispatch({ type: 'NEXT_QUESTION' })
      }, 2000)
    },
    [state.phase, state.currentQuestion, dispatch],
  )

  const endSession = useCallback(() => {
    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current)
    }
    dispatch({ type: 'END_SESSION' })
  }, [dispatch])

  const retryQuestion = useCallback(() => {
    dispatch({ type: 'NEXT_QUESTION' })
  }, [dispatch])

  return { state, submitAnswer, endSession, retryQuestion }
}
