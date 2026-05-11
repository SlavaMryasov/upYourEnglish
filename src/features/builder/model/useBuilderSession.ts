import type { SentenceForTense, Tense } from '@entities/sentence'
import type { Word } from '@entities/word'
import { useSentencesQuery, useVocabQuery } from '@shared/api'
import { computed, ref } from 'vue'

export type BuilderTask = {
  word: Word
  tense: Tense
  sentence: SentenceForTense
}

export const useBuilderSession = () => {
  const vocab = useVocabQuery()
  const sentences = useSentencesQuery()

  const words = computed(() => vocab.state.value.data ?? [])
  const sentencesIndex = computed(() => sentences.state.value.data ?? {})

  const wordsWithSentences = computed(() =>
    words.value.filter((word) => Boolean(sentencesIndex.value[word.en.toLowerCase()])),
  )

  const selectedWordIds = ref<Record<number, boolean>>({})
  const selectedTenses = ref<Record<Tense, boolean>>({} as Record<Tense, boolean>)
  const isExercising = ref(false)
  const currentIndex = ref(0)

  const selectedWordCount = computed(
    () => Object.values(selectedWordIds.value).filter(Boolean).length,
  )
  const selectedTenseCount = computed(
    () => Object.values(selectedTenses.value).filter(Boolean).length,
  )

  const queue = computed<BuilderTask[]>(() => {
    const result: BuilderTask[] = []
    for (const word of wordsWithSentences.value) {
      if (!selectedWordIds.value[word.id]) continue
      const bucket = sentencesIndex.value[word.en.toLowerCase()]
      if (!bucket) continue
      for (const tense of Object.keys(bucket) as Tense[]) {
        if (!selectedTenses.value[tense]) continue
        const sentence = bucket[tense]
        if (!sentence) continue
        result.push({ word, tense, sentence })
      }
    }
    return result
  })

  const currentTask = computed<BuilderTask | null>(() => queue.value[currentIndex.value] ?? null)

  const totalTasks = computed(() => queue.value.length)

  const toggleWord = (id: number) => {
    selectedWordIds.value[id] = !selectedWordIds.value[id]
  }
  const toggleTense = (tense: Tense) => {
    selectedTenses.value[tense] = !selectedTenses.value[tense]
  }
  const selectAllWords = () => {
    wordsWithSentences.value.forEach((word) => {
      selectedWordIds.value[word.id] = true
    })
  }
  const clearWords = () => {
    selectedWordIds.value = {}
  }
  const setSelectedByIds = (ids: number[]) => {
    const validIds = new Set(wordsWithSentences.value.map((word) => word.id))
    selectedWordIds.value = {}
    ids.forEach((id) => {
      if (validIds.has(id)) selectedWordIds.value[id] = true
    })
  }
  const setAllTenses = (value: boolean) => {
    selectedTenses.value = {} as Record<Tense, boolean>
    if (value) {
      ;(Object.keys(sentencesIndex.value).length > 0
        ? (Object.keys(
            sentencesIndex.value[Object.keys(sentencesIndex.value)[0]],
          ) as Tense[])
        : []
      ).forEach((tense) => {
        selectedTenses.value[tense] = true
      })
    }
  }

  const start = () => {
    if (queue.value.length === 0) return
    currentIndex.value = 0
    isExercising.value = true
  }

  const next = () => {
    if (currentIndex.value < queue.value.length - 1) {
      currentIndex.value += 1
    } else {
      isExercising.value = false
    }
  }

  const exit = () => {
    isExercising.value = false
    currentIndex.value = 0
  }

  return {
    vocab,
    sentences,
    words,
    wordsWithSentences,
    selectedWordIds,
    selectedTenses,
    selectedWordCount,
    selectedTenseCount,
    isExercising,
    currentIndex,
    currentTask,
    totalTasks,
    queue,
    toggleWord,
    toggleTense,
    selectAllWords,
    clearWords,
    setSelectedByIds,
    setAllTenses,
    start,
    next,
    exit,
  }
}
