import { useDeckStore } from '@features/deck'
import { useProgressStore } from '@features/progress'
import { useVocabQuery } from '@shared/api'
import {
  REQUIRED_STREAK_NEW,
  REQUIRED_STREAK_REPEAT,
  getCurrentDay,
} from '@shared/config'
import { buildSchedule, getDayDeckIds, getIntroductionDay } from '@shared/lib'
import { computed } from 'vue'

export const useFlashcardSession = () => {
  const query = useVocabQuery()
  const deck = useDeckStore()
  const progress = useProgressStore()

  const words = computed(() => query.state.value.data ?? [])
  const schedule = computed(() => (words.value.length > 0 ? buildSchedule(words.value) : null))
  const currentDay = computed(() => getCurrentDay())

  const effectiveDay = computed(() =>
    deck.mode.kind === 'day' ? deck.mode.day : currentDay.value,
  )

  const deckIds = computed(() => {
    if (deck.mode.kind === 'custom') return deck.mode.ids
    if (!schedule.value) return []
    if (deck.mode.kind === 'today') {
      return currentDay.value < 1
        ? []
        : getDayDeckIds(currentDay.value, schedule.value.schedule)
    }
    if (deck.mode.kind === 'day') {
      return getDayDeckIds(deck.mode.day, schedule.value.schedule)
    }
    return []
  })

  const deckWords = computed(() => {
    const byId = new Map(words.value.map((word) => [word.id, word]))
    return deckIds.value.flatMap((id) => {
      const word = byId.get(id)
      return word ? [word] : []
    })
  })

  const requiredFor = (wordId: number): number => {
    if (deck.mode.kind === 'custom') return REQUIRED_STREAK_NEW
    return getIntroductionDay(wordId) === effectiveDay.value
      ? REQUIRED_STREAK_NEW
      : REQUIRED_STREAK_REPEAT
  }

  const isCompleted = (wordId: number): boolean =>
    progress.getStreak(wordId) >= requiredFor(wordId)

  const activeWords = computed(() => deckWords.value.filter((word) => !isCompleted(word.id)))

  const currentWord = computed(() => {
    const active = activeWords.value
    if (active.length === 0) return null
    const safePos = ((deck.pos % active.length) + active.length) % active.length
    return active[safePos]
  })

  const completedCount = computed(() => deckWords.value.length - activeWords.value.length)
  const position = computed(() =>
    activeWords.value.length === 0
      ? completedCount.value
      : completedCount.value + (deck.pos % activeWords.value.length) + 1,
  )

  const advance = () => {
    const total = activeWords.value.length
    if (total === 0) return
    deck.setPos((deck.pos + 1) % total)
  }

  const retreat = () => {
    const total = activeWords.value.length
    if (total === 0) return
    deck.setPos((deck.pos - 1 + total) % total)
  }

  const onKnown = () => {
    if (!currentWord.value) return
    const id = currentWord.value.id
    progress.markKnown(id)
    if (activeWords.value.length === 0) return
    if (isCompleted(id)) {
      deck.setPos(deck.pos % activeWords.value.length)
    } else {
      advance()
    }
  }

  const onUnknown = () => {
    if (!currentWord.value) return
    progress.markUnknown(currentWord.value.id)
    advance()
  }

  const isCustomPickerMode = computed(
    () => deck.mode.kind === 'custom' && deck.mode.ids.length === 0,
  )

  const setCustomIds = (ids: number[]) => {
    deck.setMode({ kind: 'custom', ids })
  }

  return {
    query,
    progress,
    words,
    deckWords,
    activeWords,
    currentWord,
    completedCount,
    position,
    currentDay,
    requiredFor,
    advance,
    retreat,
    onKnown,
    onUnknown,
    isCustomPickerMode,
    setCustomIds,
  }
}
