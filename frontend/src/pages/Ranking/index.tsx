import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLocalRanking } from '../../hooks/useLocalRanking'
import { fetchRanking } from '../../services/api'
import type { Difficulty, RankingEntry } from '../../types'
import RankingTable from '../../components/RankingTable'

const DIFFICULTY_TABS: { value: Difficulty; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'beginner', label: 'Iniciante' },
  { value: 'intermediate', label: 'Intermediário' },
  { value: 'advanced', label: 'Avançado' },
]

export default function Ranking() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('all')
  const [entries, setEntries] = useState<RankingEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { localRanking } = useLocalRanking()
  const navigate = useNavigate()

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    fetchRanking(selectedDifficulty)
      .then((data) => {
        setEntries(data)
      })
      .catch((err) => {
        setError(err.message ?? 'Erro ao carregar ranking')
        setEntries(localRanking)
      })
      .finally(() => setIsLoading(false))
  }, [selectedDifficulty, localRanking])

  return (
    <div className="ranking-page">
      <button onClick={() => navigate('/')} className="ranking-back-btn">
        ← Início
      </button>

      <h1 className="ranking-title">Ranking Global</h1>

      <div className="ranking-tabs">
        {DIFFICULTY_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelectedDifficulty(tab.value)}
            className={`ranking-tab${selectedDifficulty === tab.value ? ' ranking-tab--active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="ranking-error">
          Exibindo ranking local (API indisponível): {error}
        </p>
      )}

      <RankingTable entries={entries} isLoading={isLoading} />

      <button onClick={() => navigate('/')} className="ranking-play-btn">
        Jogar Novamente
      </button>
    </div>
  )
}
