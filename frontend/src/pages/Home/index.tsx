import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuizContext } from '../../context/QuizContext'
import type { Difficulty, Category } from '../../types'

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: 'beginner', label: 'Iniciante' },
  { value: 'intermediate', label: 'Intermediário' },
  { value: 'advanced', label: 'Avançado' },
  { value: 'all', label: 'Aleatório (todos)' },
]

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'all', label: 'Todas as Categorias' },
  { value: 'basic', label: 'Regras Básicas' },
  { value: 'heroes', label: 'Heróis & Alter Egos' },
  { value: 'villains', label: 'Vilões & Cenários' },
  { value: 'advanced', label: 'Mecânicas Avançadas' },
  { value: 'campaign', label: 'Expansões de Campanha' },
]

export default function Home() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Category>('all')
  const { startQuiz } = useQuizContext()
  const navigate = useNavigate()

  function handleStart() {
    if (!selectedDifficulty) return
    startQuiz(selectedDifficulty, selectedCategory)
    navigate('/quiz')
  }

  return (
    <div className="home-page">
      <header className="home-header">
        <h1 className="home-title">Marvel Champions</h1>
        <h2 className="home-subtitle">Quiz</h2>
        <p className="home-description">
          Teste seus conhecimentos sobre regras, heróis, vilões e expansões!
        </p>
      </header>

      <main className="home-main">
        <section className="home-section">
          <h3 className="home-section-title">Escolha a Dificuldade</h3>
          <div className="difficulty-grid">
            {DIFFICULTIES.map((d) => (
              <button
                key={d.value}
                onClick={() => setSelectedDifficulty(d.value)}
                className={`difficulty-btn${selectedDifficulty === d.value ? ' difficulty-btn--active' : ''}`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </section>

        <section className="home-section">
          <h3 className="home-section-title">Categoria (opcional)</h3>
          <div className="category-grid">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => setSelectedCategory(c.value)}
                className={`category-btn${selectedCategory === c.value ? ' category-btn--active' : ''}`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </section>

        <button
          onClick={handleStart}
          disabled={!selectedDifficulty}
          className="start-btn"
        >
          Iniciar Quiz
        </button>

        <button
          onClick={() => navigate('/ranking')}
          className="ranking-link"
        >
          Ver Ranking
        </button>
      </main>
    </div>
  )
}
