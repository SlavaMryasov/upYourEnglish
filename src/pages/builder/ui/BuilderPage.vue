<script setup lang="ts">
import { TENSES, TENSE_LABELS } from '@entities/sentence'
import { SentenceBuilder, useBuilderSession } from '@features/builder'
import { getCurrentDay } from '@shared/config'
import { buildSchedule, getDayDeckIds } from '@shared/lib'
import { PageInfo } from '@shared/ui'
import {
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'
import { computed, ref, watch } from 'vue'

const session = useBuilderSession()
const {
  vocab,
  sentences,
  words,
  wordsWithSentences,
  selectedWordIds,
  selectedTenses,
  selectedWordCount,
  selectedTenseCount,
  isExercising,
  currentTask,
  currentIndex,
  totalTasks,
} = session

const isLoading = computed(() => vocab.isLoading.value || sentences.isLoading.value)
const error = computed(() => vocab.error.value ?? sentences.error.value)

const schedule = computed(() => (words.value.length > 0 ? buildSchedule(words.value) : null))
const currentDay = computed(() => getCurrentDay())

const fmt = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'short',
  weekday: 'short',
})

type DayOption = { value: string; label: string; day: number }

const dayOptions = computed<DayOption[]>(() => {
  if (!schedule.value) return []
  return schedule.value.schedule.flatMap<DayOption>((daySchedule) => {
    const newCount = daySchedule.newIds.length
    const repCount = daySchedule.repetitions.reduce((sum, rep) => sum + rep.ids.length, 0)
    if (newCount === 0 && repCount === 0) return []

    const isToday = daySchedule.day === currentDay.value
    const parts = isToday
      ? ['Сегодня']
      : [`День ${daySchedule.day}`, fmt.format(daySchedule.date)]
    if (newCount > 0) parts.push(`+${newCount} нов`)
    if (repCount > 0) parts.push(`${repCount} повт`)

    return [
      {
        value: `day-${daySchedule.day}`,
        label: parts.join(' · '),
        day: daySchedule.day,
      },
    ]
  })
})

const selectedDay = ref<string | undefined>()
let didAutoSelect = false

const applyDay = (value: string | number | undefined) => {
  if (typeof value !== 'string') return
  const option = dayOptions.value.find((item) => item.value === value)
  if (!option || !schedule.value) return
  const ids = getDayDeckIds(option.day, schedule.value.schedule)
  session.setSelectedByIds(ids)
  selectedDay.value = value
}

watch(
  dayOptions,
  (options) => {
    if (didAutoSelect || options.length === 0) return
    const today = options.find((opt) => opt.day === currentDay.value)
    if (today) {
      applyDay(today.value)
      didAutoSelect = true
    }
  },
  { immediate: true },
)

const refetchBoth = () => {
  void vocab.refetch()
  void sentences.refetch()
}
</script>

<template>
  <div class="h-full overflow-auto">
    <div v-if="isLoading" class="flex h-full items-center justify-center text-slate-400">
      Загружаем словарь и предложения…
    </div>

    <div
      v-else-if="error"
      class="flex h-full flex-col items-center justify-center gap-3 text-error-400"
    >
      <p>Ошибка: {{ error.message }}</p>
      <button
        type="button"
        class="rounded-md border border-error-500 px-3 py-1 text-sm hover:bg-error-500/10"
        @click="refetchBoth"
      >
        Повторить
      </button>
    </div>

    <SentenceBuilder
      v-else-if="isExercising && currentTask"
      :ru-text="currentTask.sentence.ru"
      :en-text="currentTask.sentence.en"
      :tense="currentTask.tense"
      :word-en="currentTask.word.en"
      :position="currentIndex + 1"
      :total="totalTasks"
      @next="session.next"
      @exit="session.exit"
    />

    <div v-else class="mx-auto max-w-3xl space-y-6 p-6 pb-24">
      <header class="flex items-start justify-between gap-3">
        <div class="space-y-1">
          <h1 class="text-2xl font-semibold">Конструктор</h1>
          <p class="text-sm text-slate-400">
            Собирай английские предложения из плиток, отрабатывая 12 времён
          </p>
        </div>
        <PageInfo
          title="Конструктор"
          description="Выбери слова и времена — получишь упражнения. На каждой карточке покажется русский перевод, а английские слова надо собрать в правильном порядке, тапая по плиткам. Слова берутся из основного словаря, для которых есть предложения в отдельном Google Doc (12 времён на каждое)."
        />
      </header>

      <section class="space-y-3">
        <div class="flex items-center justify-between text-sm">
          <h2 class="font-semibold text-slate-200">
            1. Слова · выбрано {{ selectedWordCount }} из {{ wordsWithSentences.length }}
          </h2>
          <div class="flex gap-2">
            <button
              type="button"
              class="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-300 hover:bg-slate-800"
              @click="session.selectAllWords"
            >
              Все
            </button>
            <button
              type="button"
              class="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-300 hover:bg-slate-800"
              @click="session.clearWords"
            >
              Снять
            </button>
          </div>
        </div>

        <SelectRoot :model-value="selectedDay" @update:model-value="applyDay">
          <SelectTrigger
            class="group flex w-full items-center justify-between gap-2 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 focus-visible:border-vue-500"
          >
            <SelectValue placeholder="Выбрать по дню расписания…" />
            <SelectIcon class="text-slate-500 transition-transform group-data-[state=open]:rotate-180">▼</SelectIcon>
          </SelectTrigger>
          <SelectPortal>
            <SelectContent
              position="popper"
              :side-offset="6"
              class="z-50 max-h-[400px] min-w-[var(--reka-select-trigger-width)] overflow-hidden rounded-md border border-slate-700 bg-slate-900 shadow-xl"
            >
              <SelectScrollUpButton
                class="flex h-6 items-center justify-center bg-slate-900 text-slate-500"
              >
                ▲
              </SelectScrollUpButton>
              <SelectViewport class="max-h-[360px] overflow-y-auto p-1">
                <SelectItem
                  v-for="option in dayOptions"
                  :key="option.value"
                  :value="option.value"
                  class="relative flex cursor-pointer items-center rounded px-3 py-2 text-sm text-slate-300 outline-none select-none data-[highlighted]:bg-slate-800 data-[highlighted]:text-slate-50 data-[state=checked]:text-vue-400"
                >
                  <SelectItemText>{{ option.label }}</SelectItemText>
                  <SelectItemIndicator class="ml-auto pl-2 text-vue-400">✓</SelectItemIndicator>
                </SelectItem>
              </SelectViewport>
              <SelectScrollDownButton
                class="flex h-6 items-center justify-center bg-slate-900 text-slate-500"
              >
                ▼
              </SelectScrollDownButton>
            </SelectContent>
          </SelectPortal>
        </SelectRoot>

        <div v-if="wordsWithSentences.length === 0" class="text-sm text-slate-400">
          В доке предложений пока ничего нет — добавь хотя бы одно слово
        </div>

        <ul v-else class="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <li
            v-for="word in wordsWithSentences"
            :key="word.id"
            class="rounded-md border bg-slate-900 px-3 py-2 text-sm transition"
            :class="selectedWordIds[word.id] ? 'border-vue-500' : 'border-slate-800'"
          >
            <label class="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                :checked="!!selectedWordIds[word.id]"
                class="h-4 w-4 accent-vue-500"
                @change="session.toggleWord(word.id)"
              >
              <span class="font-semibold text-vue-400">{{ word.en }}</span>
              <span class="truncate text-xs text-slate-400">{{ word.translation }}</span>
            </label>
          </li>
        </ul>
      </section>

      <section class="space-y-2">
        <div class="flex items-center justify-between text-sm">
          <h2 class="font-semibold text-slate-200">
            2. Времена · выбрано {{ selectedTenseCount }} из 12
          </h2>
          <div class="flex gap-2">
            <button
              type="button"
              class="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-300 hover:bg-slate-800"
              @click="session.setAllTenses(true)"
            >
              Все
            </button>
            <button
              type="button"
              class="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-300 hover:bg-slate-800"
              @click="session.setAllTenses(false)"
            >
              Снять
            </button>
          </div>
        </div>

        <ul class="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <li
            v-for="tense in TENSES"
            :key="tense"
            class="rounded-md border bg-slate-900 px-3 py-2 text-sm transition"
            :class="selectedTenses[tense] ? 'border-vue-500' : 'border-slate-800'"
          >
            <label class="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                :checked="!!selectedTenses[tense]"
                class="h-4 w-4 accent-vue-500"
                @change="session.toggleTense(tense)"
              >
              <span class="text-slate-200">{{ TENSE_LABELS[tense] }}</span>
            </label>
          </li>
        </ul>
      </section>
    </div>

    <div
      v-if="!isExercising && totalTasks > 0"
      class="fixed inset-x-0 bottom-14 z-30 border-t border-slate-800 bg-slate-900/95 p-4 backdrop-blur md:bottom-0"
    >
      <button
        type="button"
        class="mx-auto block w-full max-w-md rounded-xl border border-vue-500 bg-vue-500/10 px-4 py-3 text-base font-semibold text-vue-400 hover:bg-vue-500/20"
        @click="session.start"
      >
        Начать ({{ selectedWordCount }} × {{ selectedTenseCount }} = {{ totalTasks }})
      </button>
    </div>
  </div>
</template>
