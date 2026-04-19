import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuiz } from '../../hooks/useQuiz'
import ScoreBar from '../../components/ScoreBar'
import QuestionCard from '../../components/QuestionCard'
import TokenButton from '../../components/TokenButton'
import FeedbackOverlay from '../../components/FeedbackOverlay'

export default function Quiz() {
  const { state, submitAnswer, endSession, retryQuestion } = useQuiz()
  const navigate = useNavigate()

  // Guard: redirect if no active session (but not on error state)
  useEffect(() => {
    if (state.phase === 'idle') {
      navigate('/', { replace: true })
    }
  }, [state.phase, navigate])

  // Navigate to result when session finishes (handled by useQuiz but also here as safety)
  // (useQuiz already handles navigation to /result via its own effect)

  if (state.phase === 'idle' || state.phase === 'finished') return null

  return (
    <div className="quiz-page">
      <header className="quiz-header">
        <ScoreBar score={state.score} total={state.total} streak={state.currentStreak} />
        <button onClick={endSession} className="end-session-btn">
          Encerrar Sessão
        </button>
      </header>

      <main className="quiz-main">
        {state.phase === 'loading' && (
          <div className="quiz-loading">
            <div className="spinner" />
            <p>Carregando pergunta...</p>
          </div>
        )}

        {state.phase === 'error' && state.error && (
          <div className="quiz-error">
            <p>Erro ao carregar pergunta: {state.error}</p>
            <button onClick={retryQuestion} className="quiz-retry-btn">
              Tentar novamente
            </button>
          </div>
        )}

        {state.currentQuestion && (state.phase === 'answering' || state.phase === 'feedback') && (
          <>
            <QuestionCard
              question={state.currentQuestion}
              phase={state.phase as 'answering' | 'feedback'}
              isCorrect={state.lastAnswerCorrect ?? undefined}
            />

            <div className="token-buttons">
              <TokenButton
                type="true"
                onClick={() => submitAnswer(true)}
                disabled={state.phase !== 'answering'}
              />
              <TokenButton
                type="false"
                onClick={() => submitAnswer(false)}
                disabled={state.phase !== 'answering'}
              />
            </div>
          </>
        )}
      </main>

      {state.currentQuestion && (
        <FeedbackOverlay
          visible={state.phase === 'feedback'}
          isCorrect={state.lastAnswerCorrect ?? false}
          explanation={state.currentQuestion.explanation}
          correctAnswer={state.currentQuestion.answer}
        />
      )}
    </div>
  )
}
