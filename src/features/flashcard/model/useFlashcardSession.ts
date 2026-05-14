import { useDeckStore } from '@features/deck'
import { useProgressStore } from '@features/progress'
import { useVocabQuery } from '@shared/api'
import { REQUIRED_STREAK_NEW, REQUIRED_STREAK_REPEAT } from '@shared/config'
import { buildSchedule, findCurrentDay, getDayDeckIds } from '@shared/lib'
import { computed, watch } from 'vue'

export const useFlashcardSession = () => {
  const query = useVocabQuery()
  const deck = useDeckStore()
  const progress = useProgressStore()

  const words = computed(() => query.state.value.data ?? [])
  const wordsById = computed(() => new Map(words.value.map((word) => [word.id, word])))
  const schedule = computed(() => (words.value.length > 0 ? buildSchedule(words.value) : null))
  const currentDay = computed(() =>
    schedule.value ? findCurrentDay(schedule.value.schedule) : 0,
  )

  const effectiveDay = computed(() =>
    deck.mode.kind === 'day' ? deck.mode.day : currentDay.value,
  )

  const rawDeckIds = computed(() => {
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

  watch(rawDeckIds, (next, prev) => {
    if (deck.shuffleOrder && next.length !== prev.length) deck.setShuffleOrder(null)
  })

  const deckIds = computed(() => {
    const raw = rawDeckIds.value
    const order = deck.shuffleOrder
    if (!order || order.length !== raw.length) return raw
    return order.map((idx) => raw[idx]).filter((id): id is number => id !== undefined)
  })

  const isShuffled = computed(() => deck.shuffleOrder !== null)

  const shuffle = () => {
    const indices = rawDeckIds.value.map((_, idx) => idx)
    for (let i = indices.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[indices[i], indices[j]] = [indices[j], indices[i]]
    }
    deck.setShuffleOrder(indices)
  }

  const resetShuffle = () => {
    deck.setShuffleOrder(null)
  }

  const deckWords = computed(() =>
    deckIds.value.flatMap((id) => {
      const word = wordsById.value.get(id)
      return word ? [word] : []
    }),
  )

  const effectiveIso = computed(() => {
    if (!schedule.value || effectiveDay.value < 1) return null
    const entry = schedule.value.schedule.find((item) => item.day === effectiveDay.value)
    return entry?.iso ?? null
  })

  const requiredFor = (wordId: number): number => {
    if (deck.mode.kind === 'custom') return REQUIRED_STREAK_NEW
    const word = wordsById.value.get(wordId)
    if (!word || !word.introductionDate || !effectiveIso.value) return REQUIRED_STREAK_REPEAT
    return word.introductionDate === effectiveIso.value
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
    isShuffled,
    shuffle,
    resetShuffle,
  }
}
