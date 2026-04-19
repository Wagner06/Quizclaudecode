import type { RankingEntry } from '../../types'
import styles from './RankingTable.module.css'

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: 'Iniciante',
  intermediate: 'Intermediário',
  advanced: 'Avançado',
  all: 'Aleatório',
}

interface RankingTableProps {
  entries: RankingEntry[]
  isLoading: boolean
  highlightNickname?: string
}

export default function RankingTable({ entries, isLoading, highlightNickname }: RankingTableProps) {
  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Carregando ranking...</p>
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Nenhuma pontuação salva ainda. Seja o primeiro!</p>
      </div>
    )
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Jogador</th>
            <th>Acertos</th>
            <th>%</th>
            <th>Sequência</th>
            <th>Dificuldade</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => {
            const accuracy =
              entry.total > 0 ? Math.round((entry.score / entry.total) * 100) : 0
            const isHighlighted =
              highlightNickname && entry.nickname === highlightNickname
            const isFirst = index === 0

            return (
              <tr
                key={entry.id}
                className={`${isFirst ? styles.rowFirst : ''} ${isHighlighted ? styles.rowHighlighted : ''}`}
              >
                <td className={styles.rank}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                </td>
                <td className={styles.nickname}>{entry.nickname}</td>
                <td>
                  {entry.score}/{entry.total}
                </td>
                <td>{accuracy}%</td>
                <td>{entry.streak}</td>
                <td>{DIFFICULTY_LABELS[entry.difficulty] ?? entry.difficulty}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
