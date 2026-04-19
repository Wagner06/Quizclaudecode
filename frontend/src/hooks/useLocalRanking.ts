import { useState, useCallback } from 'react'
import type { RankingEntry, PostScorePayload } from '../types'

const STORAGE_KEY = 'marvel-quiz-ranking'
const MAX_ENTRIES = 50

function loadFromStorage(): RankingEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as RankingEntry[]) : []
  } catch {
    return []
  }
}

export function useLocalRanking() {
  const [localRanking, setLocalRanking] = useState<RankingEntry[]>(loadFromStorage)

  const saveToLocal = useCallback(
    (entry: PostScorePayload & { id: number; created_at?: string }) => {
      const newEntry: RankingEntry = {
        id: entry.id,
        nickname: entry.nickname,
        score: entry.score,
        total: entry.total,
        streak: entry.streak,
        difficulty: entry.difficulty,
        created_at: entry.created_at ?? new Date().toISOString(),
      }
      setLocalRanking((prev) => {
        const updated = [newEntry, ...prev]
          .sort((a, b) => b.score - a.score || a.total - b.total)
          .slice(0, MAX_ENTRIES)
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
        } catch {
          // localStorage can be full or unavailable
        }
        return updated
      })
    },
    [],
  )

  const clearLocal = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setLocalRanking([])
  }, [])

  return { localRanking, saveToLocal, clearLocal }
}
