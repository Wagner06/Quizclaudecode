import styles from './TokenButton.module.css'

interface TokenButtonProps {
  type: 'true' | 'false'
  onClick: () => void
  disabled?: boolean
}

export default function TokenButton({ type, onClick, disabled = false }: TokenButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={type === 'true' ? 'Verdadeiro' : 'Falso'}
      className={`${styles.token} ${type === 'true' ? styles.tokenTrue : styles.tokenFalse} ${disabled ? styles.tokenDisabled : ''}`}
    >
      <span className={styles.icon}>{type === 'true' ? '✓' : '✗'}</span>
      <span className={styles.label}>{type === 'true' ? 'Verdadeiro' : 'Falso'}</span>
    </button>
  )
}
