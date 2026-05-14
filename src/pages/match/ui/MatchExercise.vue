<script setup lang="ts">
import type { Word } from '@entities/word'
import { usePreferencesStore } from '@features/preferences'
import { cn } from '@shared/lib'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  pool: Word[]
  allWords: Word[]
}>()

const preferences = usePreferencesStore()
const { frontSide } = storeToRefs(preferences)

const queue = ref<number[]>([])
const currentIdx = ref(0)
const pickedIdx = ref<number | null>(null)
const correctCount = ref(0)
const wrongCount = ref(0)

const shuffle = <T,>(arr: T[]): T[] => {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

const reset = () => {
  queue.value = shuffle(props.pool.map((word) => word.id))
  currentIdx.value = 0
  pickedIdx.value = null
  correctCount.value = 0
  wrongCount.value = 0
}

watch(() => props.pool, reset, { immediate: true })
watch(frontSide, reset)

const wordsById = computed(() => new Map(props.allWords.map((word) => [word.id, word])))

const currentWord = computed<Word | null>(() => {
  const id = queue.value[currentIdx.value]
  return id === undefined ? null : (wordsById.value.get(id) ?? null)
})

const prompt = computed(() =>
  currentWord.value
    ? frontSide.value === 'en'
      ? currentWord.value.en
      : currentWord.value.translation
    : '',
)

const correctAnswer = computed(() =>
  currentWord.value
    ? frontSide.value === 'en'
      ? currentWord.value.translation
      : currentWord.value.en
    : '',
)

const options = computed<string[]>(() => {
  if (!currentWord.value) return []
  const correct = correctAnswer.value
  const others = props.allWords.filter((word) => word.id !== currentWord.value!.id)
  const pool = shuffle(others)
  const distractors: string[] = []
  const seen = new Set<string>([correct])
  for (const word of pool) {
    if (distractors.length >= 3) break
    const candidate = frontSide.value === 'en' ? word.translation : word.en
    if (!seen.has(candidate)) {
      distractors.push(candidate)
      seen.add(candidate)
    }
  }
  return shuffle([correct, ...distractors])
})

const total = computed(() => queue.value.length)
const isDone = computed(() => currentIdx.value >= total.value && total.value > 0)

const optionClass = (idx: number, value: string): string => {
  if (pickedIdx.value === null)
    return 'border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800'
  if (value === correctAnswer.value) return 'border-vue-500 bg-vue-500/10 text-vue-400'
  if (pickedIdx.value === idx) return 'border-error-500 bg-error-500/10 text-error-400'
  return 'border-slate-800 bg-slate-900 text-slate-500'
}

const advance = () => {
  pickedIdx.value = null
  currentIdx.value += 1
}

const pickOption = (idx: number) => {
  if (pickedIdx.value !== null) return
  pickedIdx.value = idx
  const value = options.value[idx]
  if (value === correctAnswer.value) {
    correctCount.value += 1
    window.setTimeout(advance, 500)
  } else {
    wrongCount.value += 1
    window.setTimeout(advance, 1200)
  }
}
</script>

<template>
  <div class="space-y-6">
    <div
      v-if="isDone"
      class="flex flex-col items-center gap-3 py-12 text-center text-slate-300"
    >
      <div class="text-6xl">🎉</div>
      <div class="text-xl font-semibold">Готово</div>
      <div class="text-sm text-slate-500">
        Правильно {{ correctCount }} · Ошибок {{ wrongCount }}
      </div>
      <button
        type="button"
        class="rounded-md border border-vue-500 bg-vue-500/10 px-4 py-2 text-sm font-semibold text-vue-400 hover:bg-vue-500/20"
        @click="reset"
      >
        Заново
      </button>
    </div>

    <template v-else-if="currentWord">
      <div class="flex items-center justify-center gap-3 text-sm text-slate-400">
        <span class="font-medium tabular-nums">{{ currentIdx + 1 }} / {{ total }}</span>
        <span class="text-vue-400">✓ {{ correctCount }}</span>
        <span class="text-error-400">✗ {{ wrongCount }}</span>
      </div>

      <div class="rounded-2xl border border-slate-800 bg-slate-900 py-10 text-center">
        <div class="text-xs tracking-wide text-slate-500 uppercase">
          {{ frontSide === 'en' ? 'Переведи на русский' : 'Переведи на английский' }}
        </div>
        <div class="mt-3 text-3xl font-bold text-vue-400 sm:text-4xl">{{ prompt }}</div>
      </div>

      <ul class="grid gap-3">
        <li v-for="(option, idx) in options" :key="`${option}-${idx}`">
          <button
            type="button"
            class="w-full rounded-md border px-4 py-3 text-left text-base transition"
            :class="cn(optionClass(idx, option))"
            :disabled="pickedIdx !== null"
            @click="pickOption(idx)"
          >
            {{ option }}
          </button>
        </li>
      </ul>
    </template>
  </div>
</template>
