import type { Question } from '../../types'
import styles from './QuestionCard.module.css'

interface QuestionCardProps {
  question: Question
  phase: 'answering' | 'feedback'
  isCorrect?: boolean
}

export default function QuestionCard({ question, phase, isCorrect }: QuestionCardProps) {
  const isFlipped = phase === 'feedback'

  return (
    <div className={styles.card}>
      <div className={`${styles.inner} ${isFlipped ? styles.flipped : ''}`}>
        {/* Front: the statement */}
        <div className={styles.front}>
          <p className={styles.statement}>{question.statement}</p>
        </div>

        {/* Back: answer + explanation */}
        <div className={`${styles.back} ${isCorrect === true ? styles.backCorrect : isCorrect === false ? styles.backIncorrect : ''}`}>
          <div className={styles.answerBadge}>
            {question.answer ? 'VERDADEIRO' : 'FALSO'}
          </div>
          <p className={styles.explanation}>{question.explanation}</p>
        </div>
      </div>
    </div>
  )
}
