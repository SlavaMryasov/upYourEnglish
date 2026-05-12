<script setup lang="ts">
import {
  SENTENCE_FORMS,
  SENTENCE_FORM_LABELS,
  TENSES,
  TENSE_LABELS,
} from '@entities/sentence'
import { SentenceBuilder, TenseMultiselect, useBuilderSession } from '@features/builder'
import { getCurrentDay } from '@shared/config'
import { buildSchedule, getDayDeckIds } from '@shared/lib'
import { PageInfo } from '@shared/ui'
import {
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
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
  currentTask,
  currentIndex,
  totalTasks,
} = session

const isLoading = computed(() => vocab.isLoading.value || manifestQuery.isLoading.value)
const error = computed(() => vocab.error.value ?? manifestQuery.error.value)

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
  void manifestQuery.refetch()
}

const startButtonLabel = computed(() => {
  if (isStarting.value) return 'Загружаем первые предложения…'
  return `Начать (${selectedWordCount.value} × ${selectedTenseCount.value} × ${selectedFormCount.value} = ${estimatedTaskCount.value})`
})

const formsSummary = computed(() => {
  if (selectedFormCount.value === 0) return 'Ни одной формы'
  if (selectedFormCount.value === SENTENCE_FORMS.length) return 'Все формы'
  return SENTENCE_FORMS.filter((form) => selectedForms.value[form])
    .map((form) => SENTENCE_FORM_LABELS[form])
    .join(', ')
})

</script>

<template>
  <div class="h-full overflow-auto xl:overflow-hidden">
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
      :form="currentTask.form"
      :word-en="currentTask.word.en"
      :position="currentIndex + 1"
      :total="totalTasks"
      @next="session.next"
      @exit="session.exit"
    />

    <div
      v-else
      class="mx-auto w-full max-w-3xl space-y-4 p-4 pb-28 xl:flex xl:h-full xl:max-w-7xl xl:flex-col xl:gap-4 xl:space-y-0 xl:overflow-hidden xl:p-6 xl:pb-6"
    >
      <header class="flex items-start justify-between gap-3 xl:shrink-0">
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

      <div
        class="space-y-6 xl:flex xl:flex-1 xl:flex-row-reverse xl:gap-6 xl:space-y-0 xl:overflow-hidden"
      >
        <aside
          class="space-y-3 xl:w-72 xl:shrink-0 xl:space-y-4 xl:overflow-y-auto xl:pl-1"
        >
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
              class="z-50 max-h-[400px] min-w-[var(--reka-select-trigger-width)] overflow-hidden rounded-md border border-slate-600 bg-slate-800 shadow-2xl shadow-black/60 ring-1 ring-black/30"
            >
              <SelectScrollUpButton
                class="flex h-6 items-center justify-center bg-slate-800 text-slate-400"
              >
                ▲
              </SelectScrollUpButton>
              <SelectViewport class="max-h-[360px] overflow-y-auto p-1 shadow-inner shadow-slate-950/60">
                <SelectItem
                  v-for="option in dayOptions"
                  :key="option.value"
                  :value="option.value"
                  class="relative flex cursor-pointer items-center rounded px-3 py-2 text-sm text-slate-300 outline-none select-none data-[highlighted]:bg-slate-700 data-[highlighted]:text-slate-50 data-[state=checked]:text-vue-400"
                >
                  <SelectItemText>{{ option.label }}</SelectItemText>
                  <SelectItemIndicator class="ml-auto pl-2 text-vue-400">✓</SelectItemIndicator>
                </SelectItem>
              </SelectViewport>
              <SelectScrollDownButton
                class="flex h-6 items-center justify-center bg-slate-800 text-slate-400"
              >
                ▼
              </SelectScrollDownButton>
            </SelectContent>
          </SelectPortal>
        </SelectRoot>

        <PopoverRoot>
          <PopoverTrigger
            class="group flex w-full items-center justify-between gap-2 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 focus-visible:border-vue-500"
          >
            <span class="truncate text-left">
              <span class="text-slate-500">Формы: </span>{{ formsSummary }}
            </span>
            <span
              class="shrink-0 text-slate-500 transition-transform group-data-[state=open]:rotate-180"
            >
              ▼
            </span>
          </PopoverTrigger>
          <PopoverPortal>
            <PopoverContent
              :side-offset="6"
              align="start"
              class="z-50 w-[var(--reka-popover-trigger-width)] overflow-hidden rounded-md border border-slate-600 bg-slate-800 p-1 shadow-2xl shadow-black/60 ring-1 ring-black/30"
            >
              <ul>
                <li v-for="form in SENTENCE_FORMS" :key="form">
                  <label
                    class="flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm text-slate-200 hover:bg-slate-700"
                  >
                    <input
                      type="checkbox"
                      :checked="!!selectedForms[form]"
                      class="h-4 w-4 accent-vue-500"
                      @change="session.toggleForm(form)"
                    >
                    <span>{{ SENTENCE_FORM_LABELS[form] }}</span>
                  </label>
                </li>
              </ul>
            </PopoverContent>
          </PopoverPortal>
        </PopoverRoot>

        <div class="md:hidden">
          <TenseMultiselect
            :selected="selectedTenses"
            @toggle="(tense) => session.toggleTense(tense)"
            @set-all="(value) => session.setAllTenses(value)"
          />
        </div>

        <section class="hidden space-y-2 md:block">
          <div class="flex items-center justify-between text-sm">
            <h2 class="font-semibold text-slate-200">
              Времена · {{ selectedTenseCount }} / 12
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

          <ul class="grid grid-cols-2 gap-1.5 xl:grid-cols-1">
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

        <button
          v-if="estimatedTaskCount > 0"
          type="button"
          class="hidden w-full rounded-xl border border-vue-500 bg-vue-500/10 px-4 py-3 text-base font-semibold text-vue-400 hover:bg-vue-500/20 disabled:cursor-not-allowed disabled:opacity-60 xl:block"
          :disabled="isStarting"
          @click="session.start"
        >
          {{ startButtonLabel }}
        </button>
        </aside>

        <section
          class="space-y-2 xl:flex xl:flex-1 xl:flex-col xl:gap-2 xl:space-y-0 xl:overflow-hidden"
        >
          <div class="flex items-center justify-between text-sm xl:shrink-0">
            <h2 class="font-semibold text-slate-200">
              Слова · {{ selectedWordCount }} / {{ wordsWithSentences.length }}
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

          <div v-if="wordsWithSentences.length === 0" class="text-sm text-slate-400">
            В доке предложений пока ничего нет — добавь хотя бы одно слово
          </div>

          <ul
            v-else
            class="grid max-h-[55vh] grid-cols-1 gap-2 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950/40 p-3 shadow-inner shadow-slate-950/50 sm:grid-cols-2 xl:max-h-none xl:flex-1"
          >
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
      </div>
    </div>

    <div
      v-if="!isExercising && estimatedTaskCount > 0"
      class="fixed inset-x-0 bottom-14 z-30 border-t border-slate-800 bg-slate-900/95 p-4 backdrop-blur xl:hidden"
    >
      <button
        type="button"
        class="mx-auto block w-full max-w-md rounded-xl border border-vue-500 bg-vue-500/10 px-4 py-3 text-base font-semibold text-vue-400 hover:bg-vue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="isStarting"
        @click="session.start"
      >
        {{ startButtonLabel }}
      </button>
    </div>
  </div>
</template>
