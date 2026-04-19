import styles from './ScoreBar.module.css'

interface ScoreBarProps {
  score: number
  total: number
  streak: number
}

export default function ScoreBar({ score, total, streak }: ScoreBarProps) {
  const accuracy = total > 0 ? Math.round((score / total) * 100) : 0

  return (
    <div className={styles.bar}>
      <div className={styles.stat}>
        <span className={styles.value}>{score}</span>
        <span className={styles.label}>Acertos</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.value}>{total}</span>
        <span className={styles.label}>Respondidas</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.value}>{accuracy}%</span>
        <span className={styles.label}>Precisão</span>
      </div>
      <div className={styles.stat}>
        <span className={`${styles.value} ${streak >= 3 ? styles.streakHot : ''}`}>
          🔥 {streak}
        </span>
        <span className={styles.label}>Sequência</span>
      </div>
    </div>
  )
}
