import { defineStore } from 'pinia'
import { ref } from 'vue'

const KEY_PREFIX = 'verb-progress '

const getTodayKey = (): string => {
  const now = new Date()
  const dd = String(now.getDate()).padStart(2, '0')
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const yy = String(now.getFullYear()).slice(-2)
  return `${KEY_PREFIX}${dd}.${mm}.${yy}`
}

const clearStaleKeys = (todayKey: string) => {
  const toRemove: string[] = []
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i)
    if (key && key.startsWith(KEY_PREFIX) && key !== todayKey) {
      toRemove.push(key)
    }
  }
  toRemove.forEach((key) => localStorage.removeItem(key))
}

const loadInitial = (todayKey: string): Record<string, number> => {
  try {
    const raw = localStorage.getItem(todayKey)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    if (parsed && typeof parsed === 'object') return parsed as Record<string, number>
    return {}
  } catch {
    return {}
  }
}

export const REQUIRED_VERB_STREAK = 3

export const useVerbProgressStore = defineStore('verb-progress', () => {
  const todayKey = getTodayKey()
  clearStaleKeys(todayKey)

  const streaks = ref<Record<string, number>>(loadInitial(todayKey))

  const persist = () => {
    localStorage.setItem(todayKey, JSON.stringify(streaks.value))
  }

  const getStreak = (v1: string): number => streaks.value[v1] ?? 0

  const isClosed = (v1: string): boolean => getStreak(v1) >= REQUIRED_VERB_STREAK

  const markKnown = (v1: string) => {
    streaks.value[v1] = getStreak(v1) + 1
    persist()
  }

  const markUnknown = (v1: string) => {
    streaks.value[v1] = 0
    persist()
  }

  const reset = () => {
    streaks.value = {}
    localStorage.removeItem(todayKey)
  }

  return { streaks, getStreak, isClosed, markKnown, markUnknown, reset }
})
