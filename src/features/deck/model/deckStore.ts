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
  const shuffleOrder = ref<number[] | null>(null)

  const setMode = (next: DeckMode) => {
    mode.value = next
    pos.value = 0
    shuffleOrder.value = null
  }

  const setPos = (next: number) => {
    pos.value = Math.max(0, next)
  }

  const setShuffleOrder = (order: number[] | null) => {
    shuffleOrder.value = order
    pos.value = 0
  }

  return { mode, pos, shuffleOrder, setMode, setPos, setShuffleOrder }
})
