import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProgressStore = defineStore('progress', () => {
  const streaks = ref<Record<number, number>>({})

  const getStreak = (id: number): number => streaks.value[id] ?? 0

  const markKnown = (id: number) => {
    streaks.value[id] = getStreak(id) + 1
  }

  const markUnknown = (id: number) => {
    streaks.value[id] = 0
  }

  const reset = () => {
    streaks.value = {}
  }

  return { streaks, getStreak, markKnown, markUnknown, reset }
})
