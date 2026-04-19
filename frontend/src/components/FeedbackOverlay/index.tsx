import styles from './FeedbackOverlay.module.css'

interface FeedbackOverlayProps {
  visible: boolean
  isCorrect: boolean
  explanation: string
  correctAnswer: boolean
}

export default function FeedbackOverlay({
  visible,
  isCorrect,
  explanation,
  correctAnswer,
}: FeedbackOverlayProps) {
  if (!visible) return null

  return (
    <div className={`${styles.overlay} ${isCorrect ? styles.overlayCorrect : styles.overlayIncorrect}`}>
      <div className={styles.content}>
        <div className={styles.icon}>{isCorrect ? '✓' : '✗'}</div>
        <p className={styles.verdict}>{isCorrect ? 'Correto!' : 'Incorreto!'}</p>
        <p className={styles.answer}>
          A resposta é: <strong>{correctAnswer ? 'VERDADEIRO' : 'FALSO'}</strong>
        </p>
        <p className={styles.explanation}>{explanation}</p>
      </div>
    </div>
  )
}
