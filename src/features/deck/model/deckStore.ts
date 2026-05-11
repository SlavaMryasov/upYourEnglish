import { defineStore } from 'pinia'
import { ref } from 'vue'

export type DeckMode =
  | { kind: 'today' }
  | { kind: 'all' }
  | { kind: 'unknown' }
  | { kind: 'first'; n: number }
  | { kind: 'day'; day: number }
  | { kind: 'custom'; ids: number[] }

export const useDeckStore = defineStore('deck', () => {
  const mode = ref<DeckMode>({ kind: 'today' })
  const pos = ref(0)

  const setMode = (next: DeckMode) => {
    mode.value = next
    pos.value = 0
  }

  const setPos = (next: number) => {
    pos.value = Math.max(0, next)
  }

  return { mode, pos, setMode, setPos }
})
