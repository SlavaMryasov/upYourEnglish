<script setup lang="ts">
import { TENSE_LABELS, type Tense } from '@entities/sentence'
import { cn } from '@shared/lib'
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  ruText: string
  enText: string
  tense: Tense
  wordEn: string
  position: number
  total: number
}>()

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
</script>

<template>
  <div class="flex h-full flex-col gap-4 p-4">
    <header class="flex items-center justify-between text-sm text-slate-400">
      <span class="font-medium tabular-nums">{{ position }} / {{ total }}</span>
      <span class="tracking-wide text-vue-400 uppercase">{{ TENSE_LABELS[tense] }}</span>
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
        v-if="showResult === 'pending'"
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
