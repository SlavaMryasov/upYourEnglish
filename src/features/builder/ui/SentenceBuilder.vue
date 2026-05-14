<script setup lang="ts">
import {
  SENTENCE_FORM_LABELS,
  TENSE_LABELS,
  type SentenceForm,
  type Tense,
} from '@entities/sentence'
import { findTenseByCode, TenseSchema } from '@entities/tense'
import { cn } from '@shared/lib'
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  ruText: string
  enText: string
  tense: Tense
  form: SentenceForm
  wordEn: string
  position: number
  total: number
}>()

const FORM_BADGE: Record<SentenceForm, string> = {
  affirmative: '+',
  negative: '−',
  question: '?',
}

const emit = defineEmits<{
  next: []
  exit: []
}>()

type Tile = { id: number; token: string }

const tokens = computed(() => props.enText.split(/\s+/).filter(Boolean))

const shuffled = ref<Tile[]>([])
const placed = ref<Tile[]>([])
const showResult = ref<'pending' | 'correct' | 'wrong'>('pending')

const reset = () => {
  const indexed = tokens.value.map((token, index) => ({ id: index, token }))
  shuffled.value = [...indexed].sort(() => Math.random() - 0.5)
  placed.value = []
  showResult.value = 'pending'
}

watch(
  () => props.enText,
  () => reset(),
  { immediate: true },
)

const placedSentence = computed(() => placed.value.map((tile) => tile.token).join(' '))

const placeTile = (tile: Tile) => {
  if (showResult.value === 'correct') return
  shuffled.value = shuffled.value.filter((item) => item.id !== tile.id)
  placed.value.push(tile)
}

const removeTile = (tile: Tile) => {
  if (showResult.value === 'correct') return
  placed.value = placed.value.filter((item) => item.id !== tile.id)
  shuffled.value.push(tile)
}

const check = () => {
  if (placedSentence.value === props.enText) {
    showResult.value = 'correct'
  } else {
    showResult.value = 'wrong'
  }
}

const showAnswer = () => {
  const indexed = tokens.value.map((token, index) => ({ id: index, token }))
  placed.value = indexed
  shuffled.value = []
  showResult.value = 'correct'
}

const isHintShown = ref(false)
const toggleHint = () => {
  isHintShown.value = !isHintShown.value
}

const isAutoCheck = ref(false)
const toggleAutoCheck = () => {
  isAutoCheck.value = !isAutoCheck.value
}

watch(
  [() => shuffled.value.length, isAutoCheck],
  ([len, auto]) => {
    if (auto && len === 0 && placed.value.length > 0 && showResult.value === 'pending') {
      check()
    }
  },
)

const tenseInfo = computed(() => findTenseByCode(props.tense))

watch(
  () => props.tense,
  () => {
    isHintShown.value = false
  },
)
</script>

<template>
  <div class="flex h-full flex-col gap-4 overflow-y-auto p-4 pb-28 md:pb-4">
    <header class="flex items-center justify-between gap-2 text-sm text-slate-400">
      <span class="font-medium tabular-nums">{{ position }} / {{ total }}</span>
      <div class="flex flex-col items-center gap-0.5 text-center">
        <span class="tracking-wide text-vue-400 uppercase">{{ TENSE_LABELS[tense] }}</span>
        <span class="text-[10px] tracking-wide text-slate-500 uppercase">
          {{ FORM_BADGE[form] }} {{ SENTENCE_FORM_LABELS[form] }}
        </span>
      </div>
      <button
        type="button"
        class="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-400 hover:bg-slate-800"
        @click="emit('exit')"
      >
        Выйти
      </button>
    </header>

    <div class="text-center text-base text-slate-200">{{ ruText }}</div>

    <div
      class="min-h-[120px] rounded-md border-2 border-dashed border-slate-700 bg-slate-900 p-3"
      :class="
        cn(
          showResult === 'correct' && 'border-vue-500 bg-vue-500/10',
          showResult === 'wrong' && 'border-error-500 bg-error-500/10',
        )
      "
    >
      <div v-if="placed.length === 0" class="text-center text-sm text-slate-500">
        Тапни слова снизу, чтобы собрать предложение
      </div>
      <div v-else class="flex flex-wrap gap-2">
        <button
          v-for="tile in placed"
          :key="`p-${tile.id}`"
          type="button"
          class="rounded-md border border-vue-500 bg-vue-500/10 px-3 py-1.5 text-sm text-vue-400 hover:bg-vue-500/20"
          @click="removeTile(tile)"
        >
          {{ tile.token }}
        </button>
      </div>
    </div>

    <div class="rounded-md border border-slate-800 bg-slate-950 p-3">
      <div v-if="shuffled.length === 0" class="text-center text-sm text-slate-500">
        Все слова использованы
      </div>
      <div v-else class="flex flex-wrap gap-2">
        <button
          v-for="tile in shuffled"
          :key="`s-${tile.id}`"
          type="button"
          class="rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-800"
          @click="placeTile(tile)"
        >
          {{ tile.token }}
        </button>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-2">
      <button
        type="button"
        class="rounded-md border border-vue-500/50 bg-vue-500/10 px-3 py-1.5 text-xs font-semibold text-vue-400 hover:bg-vue-500/20"
        @click="toggleHint"
      >
        {{ isHintShown ? 'Скрыть грамматику' : 'Грамматика' }}
      </button>
      <button
        type="button"
        class="rounded-md border px-3 py-1.5 text-xs font-semibold transition"
        :class="
          isAutoCheck
            ? 'border-vue-500 bg-vue-500/10 text-vue-400'
            : 'border-slate-700 text-slate-400 hover:bg-slate-800'
        "
        @click="toggleAutoCheck"
      >
        Авто-проверка {{ isAutoCheck ? 'вкл' : 'выкл' }}
      </button>
    </div>

    <div
      v-if="isHintShown && tenseInfo"
      class="space-y-2 rounded-md border border-slate-800 bg-slate-900 p-3 text-sm"
    >
      <div class="flex items-center justify-between gap-3">
        <div class="space-y-0.5">
          <div class="font-semibold text-vue-400">{{ tenseInfo.name }}</div>
          <div class="text-xs text-slate-500">{{ tenseInfo.nameRu }}</div>
        </div>
        <TenseSchema :group="tenseInfo.group" :aspect="tenseInfo.aspect" />
      </div>
      <dl class="space-y-1 text-xs">
        <div>
          <dt class="inline text-slate-500">Утверждение: </dt>
          <dd class="inline font-mono text-slate-200">{{ tenseInfo.affirmative }}</dd>
        </div>
        <div>
          <dt class="inline text-slate-500">Отрицание: </dt>
          <dd class="inline font-mono text-slate-200">{{ tenseInfo.negative }}</dd>
        </div>
        <div>
          <dt class="inline text-slate-500">Вопрос: </dt>
          <dd class="inline font-mono text-slate-200">{{ tenseInfo.question }}</dd>
        </div>
      </dl>
      <p class="text-xs text-slate-300">{{ tenseInfo.when }}</p>
    </div>

    <div v-if="showResult === 'wrong'" class="text-sm text-error-400">
      Не совсем — попробуй переставить или нажми «Показать ответ»
    </div>
    <div v-else-if="showResult === 'correct'" class="text-sm text-vue-400">
      Правильно! Слово: <span class="font-semibold">{{ wordEn }}</span>
    </div>

    <div class="mt-auto flex gap-2">
      <button
        v-if="showResult !== 'correct'"
        type="button"
        class="flex-1 rounded-xl border border-slate-700 px-3 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-800"
        @click="reset"
      >
        Сбросить
      </button>
      <button
        v-if="showResult !== 'correct'"
        type="button"
        class="flex-1 rounded-xl border border-error-500/50 px-3 py-3 text-sm font-semibold text-error-400 hover:bg-error-500/10"
        @click="showAnswer"
      >
        Ответ
      </button>
      <button
        v-if="showResult === 'pending' && !isAutoCheck"
        type="button"
        class="flex-1 rounded-xl border border-vue-500 bg-vue-500/10 px-3 py-3 text-sm font-semibold text-vue-400 hover:bg-vue-500/20"
        :disabled="shuffled.length > 0"
        @click="check"
      >
        Проверить
      </button>
      <button
        v-if="showResult === 'correct'"
        type="button"
        class="flex-1 rounded-xl border border-vue-500 bg-vue-500/10 px-3 py-3 text-sm font-semibold text-vue-400 hover:bg-vue-500/20"
        @click="emit('next')"
      >
        {{ position < total ? 'Дальше' : 'Завершить' }}
      </button>
    </div>
  </div>
</template>
