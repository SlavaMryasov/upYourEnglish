import {
  SENTENCE_FORMS,
  TENSES,
  type SentenceForm,
  type SentencePair,
  type SentencesIndex,
  type Tense,
} from '@entities/sentence'
import type { Word } from '@entities/word'
import { useSentencesManifestQuery, useVocabQuery } from '@shared/api'
import { env } from '@shared/config'
import { parseSentencesDoc } from '@shared/lib'
import { computed, ref } from 'vue'

export type BuilderTask = {
  word: Word
  tense: Tense
  form: SentenceForm
  sentence: SentencePair
}

const FIRST_BATCH = 5

const docUrl = (docId: string): string =>
  import.meta.env.DEV
    ? `/gdoc/document/d/${docId}/export?format=txt`
    : `https://docs.google.com/document/d/${docId}/export?format=txt`

export const useBuilderSession = () => {
  const vocab = useVocabQuery()
  const manifestQuery = useSentencesManifestQuery()

  const words = computed(() => vocab.state.value.data ?? [])
  const manifest = computed(() => manifestQuery.state.value.data ?? {})

  const wordsWithSentences = computed(() =>
    words.value.filter((word) => Boolean(manifest.value[word.en.toLowerCase()])),
  )

  const selectedWordIds = ref<Record<number, boolean>>({})
  const selectedTenses = ref<Record<Tense, boolean>>({} as Record<Tense, boolean>)
  const selectedForms = ref<Record<SentenceForm, boolean>>({
    affirmative: true,
    negative: true,
    question: true,
  })
  const isExercising = ref(false)
  const isStarting = ref(false)
  const currentIndex = ref(0)
  const loadedSentences = ref<SentencesIndex>({})
  const loadedWordOrder = ref<string[]>([])

  const selectedWordCount = computed(
    () => Object.values(selectedWordIds.value).filter(Boolean).length,
  )
  const selectedTenseCount = computed(
    () => Object.values(selectedTenses.value).filter(Boolean).length,
  )
  const selectedFormCount = computed(
    () => Object.values(selectedForms.value).filter(Boolean).length,
  )

  const estimatedTaskCount = computed(
    () => selectedWordCount.value * selectedTenseCount.value * selectedFormCount.value,
  )

  const queue = computed<BuilderTask[]>(() => {
    const result: BuilderTask[] = []
    const wordByKey = new Map(
      wordsWithSentences.value.map((word) => [word.en.toLowerCase(), word]),
    )
    for (const key of loadedWordOrder.value) {
      const word = wordByKey.get(key)
      if (!word) continue
      if (!selectedWordIds.value[word.id]) continue
      const bucket = loadedSentences.value[key]
      if (!bucket) continue
      for (const tense of Object.keys(bucket) as Tense[]) {
        if (!selectedTenses.value[tense]) continue
        const forms = bucket[tense]
        if (!forms) continue
        for (const form of SENTENCE_FORMS) {
          if (!selectedForms.value[form]) continue
          const sentence = forms[form]
          if (!sentence) continue
          result.push({ word, tense, form, sentence })
        }
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
  const toggleForm = (form: SentenceForm) => {
    selectedForms.value[form] = !selectedForms.value[form]
  }
  const setAllForms = (value: boolean) => {
    selectedForms.value = {
      affirmative: value,
      negative: value,
      question: value,
    }
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
      TENSES.forEach((tense) => {
        selectedTenses.value[tense] = true
      })
    }
  }

  const loadWord = async (word: Word) => {
    const key = word.en.toLowerCase()
    const docId = manifest.value[key]
    if (!docId) return
    try {
      const response = await fetch(docUrl(docId))
      if (!response.ok) throw new Error(`status ${response.status}`)
      const text = await response.text()
      const parsed = parseSentencesDoc(text)
      loadedSentences.value[key] = parsed[key] ?? {}
      loadedWordOrder.value.push(key)
    } catch (err) {
      console.warn(`Builder: failed to load "${word.en}":`, err)
    }
  }

  const start = async () => {
    if (isStarting.value) return
    if (estimatedTaskCount.value === 0) return
    if (!env.sentencesManifestDocId) return

    const selectedWords = wordsWithSentences.value.filter(
      (word) => selectedWordIds.value[word.id],
    )
    if (selectedWords.length === 0) return

    isStarting.value = true
    loadedSentences.value = {}
    loadedWordOrder.value = []

    const firstBatch = selectedWords.slice(0, Math.min(FIRST_BATCH, selectedWords.length))
    const rest = selectedWords.slice(firstBatch.length)

    try {
      await Promise.all(firstBatch.map(loadWord))
      currentIndex.value = 0
      isExercising.value = true
    } finally {
      isStarting.value = false
    }

    if (rest.length > 0) {
      Promise.all(rest.map(loadWord)).catch(() => {})
    }
  }

  const next = () => {
    if (currentIndex.value < queue.value.length - 1) {
      currentIndex.value += 1
    } else {
      isExercising.value = false
      loadedSentences.value = {}
      loadedWordOrder.value = []
    }
  }

  const exit = () => {
    isExercising.value = false
    currentIndex.value = 0
    loadedSentences.value = {}
    loadedWordOrder.value = []
  }

  return {
    vocab,
    manifestQuery,
    words,
    wordsWithSentences,
    selectedWordIds,
    selectedTenses,
    selectedForms,
    selectedWordCount,
    selectedTenseCount,
    selectedFormCount,
    estimatedTaskCount,
    isExercising,
    isStarting,
    currentIndex,
    currentTask,
    totalTasks,
    queue,
    toggleWord,
    toggleTense,
    toggleForm,
    setAllForms,
    selectAllWords,
    clearWords,
    setSelectedByIds,
    setAllTenses,
    start,
    next,
    exit,
  }
}
