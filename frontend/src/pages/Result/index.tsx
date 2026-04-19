import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuizContext } from '../../context/QuizContext'
import { useLocalRanking } from '../../hooks/useLocalRanking'
import { postScore } from '../../services/api'

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: 'Iniciante',
  intermediate: 'Intermediário',
  advanced: 'Avançado',
  all: 'Aleatório',
}

export default function Result() {
  const { state, dispatch } = useQuizContext()
  const { saveToLocal } = useLocalRanking()
  const navigate = useNavigate()

  const [nickname, setNickname] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  // Guard: redirect if no finished session
  useEffect(() => {
    if (state.phase !== 'finished') {
      navigate('/', { replace: true })
    }
  }, [state.phase, navigate])

  if (state.phase !== 'finished') return null

  const accuracy =
    state.total > 0 ? Math.round((state.score / state.total) * 100) : 0

  async function handleSave() {
    if (!nickname.trim() || saving || saved) return
    setSaving(true)
    setSaveError(null)
    try {
      const result = await postScore({
        nickname: nickname.trim(),
        score: state.score,
        total: state.total,
        streak: state.maxStreak,
        difficulty: state.difficulty,
      })
      saveToLocal({ ...result })
      setSaved(true)
      navigate('/ranking')
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  function handlePlayAgain() {
    dispatch({ type: 'RESET' })
    navigate('/')
  }

  return (
    <div className="result-page">
      <h1 className="result-title">Resultado</h1>

      <div className="result-stats">
        <div className="result-stat">
          <span className="result-stat-label">Acertos</span>
          <span className="result-stat-value">
            {state.score} / {state.total}
          </span>
        </div>
        <div className="result-stat">
          <span className="result-stat-label">Percentual</span>
          <span className="result-stat-value">{accuracy}%</span>
        </div>
        <div className="result-stat">
          <span className="result-stat-label">Maior Sequência</span>
          <span className="result-stat-value">{state.maxStreak}</span>
        </div>
        <div className="result-stat">
          <span className="result-stat-label">Dificuldade</span>
          <span className="result-stat-value">
            {DIFFICULTY_LABELS[state.difficulty] ?? state.difficulty}
          </span>
        </div>
      </div>

      {!saved && (
        <div className="result-save">
          <h2 className="result-save-title">Salvar no Ranking</h2>
          <input
            type="text"
            placeholder="Seu nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={30}
            className="result-nickname-input"
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
          {saveError && <p className="result-save-error">{saveError}</p>}
          <button
            onClick={handleSave}
            disabled={!nickname.trim() || saving}
            className="result-save-btn"
          >
            {saving ? 'Salvando...' : 'Salvar no Ranking'}
          </button>
        </div>
      )}

      <div className="result-actions">
        <button onClick={() => navigate('/ranking')} className="result-btn result-btn--secondary">
          Ver Ranking
        </button>
        <button onClick={handlePlayAgain} className="result-btn result-btn--primary">
          Jogar Novamente
        </button>
      </div>
    </div>
  )
}
