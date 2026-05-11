import { defineStore } from 'pinia'
import { ref } from 'vue'

const KEY_PREFIX = 'progress '

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

const loadInitial = (todayKey: string): Record<number, number> => {
  try {
    const raw = localStorage.getItem(todayKey)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as unknown
    if (parsed && typeof parsed === 'object') return parsed as Record<number, number>
    return {}
  } catch {
    return {}
  }
}

export const useProgressStore = defineStore('progress', () => {
  const todayKey = getTodayKey()
  clearStaleKeys(todayKey)

  const streaks = ref<Record<number, number>>(loadInitial(todayKey))

  const persist = () => {
    localStorage.setItem(todayKey, JSON.stringify(streaks.value))
  }

  const getStreak = (id: number): number => streaks.value[id] ?? 0

  const markKnown = (id: number) => {
    streaks.value[id] = getStreak(id) + 1
    persist()
  }

  const markUnknown = (id: number) => {
    streaks.value[id] = 0
    persist()
  }

  const reset = () => {
    streaks.value = {}
    localStorage.removeItem(todayKey)
  }

  return { streaks, getStreak, markKnown, markUnknown, reset }
})
