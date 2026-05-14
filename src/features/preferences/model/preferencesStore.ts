import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type FrontSide = 'en' | 'ru'

const KEY = 'upYourEnglish:preferences'

const readFrontSide = (): FrontSide => {
  if (typeof localStorage === 'undefined') return 'en'
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return 'en'
    const parsed = JSON.parse(raw) as { frontSide?: unknown }
    return parsed.frontSide === 'ru' ? 'ru' : 'en'
  } catch {
    return 'en'
  }
}

const writeFrontSide = (value: FrontSide) => {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(KEY, JSON.stringify({ frontSide: value }))
  } catch {
    // ignore (private mode, quota)
  }
}

export const usePreferencesStore = defineStore('preferences', () => {
  const frontSide = ref<FrontSide>(readFrontSide())

  watch(frontSide, (value) => {
    writeFrontSide(value)
  })

  const toggleFrontSide = () => {
    frontSide.value = frontSide.value === 'en' ? 'ru' : 'en'
  }

  const setFrontSide = (value: FrontSide) => {
    frontSide.value = value
  }

  return { frontSide, toggleFrontSide, setFrontSide }
})
