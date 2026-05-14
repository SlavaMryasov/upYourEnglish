<script setup lang="ts">
import type { Word } from '@entities/word'
import { buildSchedule, todayISO } from '@shared/lib'
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

type Props = { words: Word[] }
const props = defineProps<Props>()

type Mode = 'new' | 'repeat'

const fmt = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'short',
  weekday: 'short',
})

const formatDate = (iso: string): string => {
  const [y, m, d] = iso.split('-').map(Number)
  return fmt.format(new Date(y, m - 1, d))
}

const mode = ref<Mode>('new')

const wordsById = computed(() => new Map(props.words.map((word) => [word.id, word])))
const schedule = computed(() =>
  props.words.length > 0 ? buildSchedule(props.words).schedule : [],
)

const learningDates = computed(() => {
  const set = new Set<string>()
  props.words.forEach((word) => {
    if (word.introductionDate) set.add(word.introductionDate)
  })
  return [...set].sort()
})

const repeatDates = computed(() =>
  schedule.value.filter((entry) => entry.repetitions.length > 0).map((entry) => entry.iso),
)

const availableDates = computed(() =>
  mode.value === 'new' ? learningDates.value : repeatDates.value,
)

const today = computed(() => todayISO())

const pickDefault = (dates: string[]): string | null => {
  if (dates.length === 0) return null
  if (dates.includes(today.value)) return today.value
  const past = dates.filter((iso) => iso <= today.value)
  if (past.length > 0) return past[past.length - 1]
  return dates[0]
}

const selectedDate = ref<string | null>(pickDefault(availableDates.value))

watch(
  [availableDates, mode],
  ([dates]) => {
    if (dates.length === 0) {
      selectedDate.value = null
      return
    }
    if (!selectedDate.value || !dates.includes(selectedDate.value)) {
      selectedDate.value = pickDefault(dates)
    }
  },
  { immediate: true },
)

const newWords = computed(() => {
  if (!selectedDate.value) return []
  return props.words.filter((word) => word.introductionDate === selectedDate.value)
})

const repeatWords = computed(() => {
  if (!selectedDate.value) return []
  const entry = schedule.value.find((item) => item.iso === selectedDate.value)
  if (!entry) return []
  return entry.repetitions
    .flatMap((rep) => rep.ids)
    .flatMap((id) => {
      const word = wordsById.value.get(id)
      return word ? [word] : []
    })
})

const isToday = computed(() => selectedDate.value === today.value)

const setMode = (next: Mode) => {
  mode.value = next
}
</script>

<template>
  <div class="space-y-3">
    <div class="inline-flex rounded-md border border-slate-700 bg-slate-900 p-0.5 text-sm">
      <button
        type="button"
        class="rounded px-3 py-1.5 transition"
        :class="
          mode === 'new'
            ? 'bg-slate-700 text-slate-50'
            : 'text-slate-400 hover:text-slate-200'
        "
        @click="setMode('new')"
      >
        Новые
      </button>
      <button
        type="button"
        class="rounded px-3 py-1.5 transition"
        :class="
          mode === 'repeat'
            ? 'bg-slate-700 text-slate-50'
            : 'text-slate-400 hover:text-slate-200'
        "
        @click="setMode('repeat')"
      >
        На повторение
      </button>
    </div>

    <SelectRoot v-model="selectedDate">
      <SelectTrigger
        class="group flex w-full items-center justify-between gap-2 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 focus-visible:border-vue-500"
      >
        <SelectValue placeholder="Выбрать дату…" />
        <SelectIcon
          class="text-slate-500 transition-transform group-data-[state=open]:rotate-180"
        >
          ▼
        </SelectIcon>
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
          <SelectViewport
            class="max-h-[360px] overflow-y-auto p-1 shadow-inner shadow-slate-950/60"
          >
            <SelectItem
              v-for="iso in availableDates"
              :key="iso"
              :value="iso"
              class="relative flex cursor-pointer items-center rounded px-3 py-2 text-sm text-slate-300 outline-none select-none data-[highlighted]:bg-slate-700 data-[highlighted]:text-slate-50 data-[state=checked]:text-vue-400"
            >
              <SelectItemText>
                {{ iso === today ? 'Сегодня · ' + formatDate(iso) : formatDate(iso) }}
              </SelectItemText>
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

    <p v-if="selectedDate" class="text-sm text-slate-400">
      {{ isToday ? 'Сегодня' : formatDate(selectedDate) }} ·
      {{ mode === 'new' ? newWords.length + ' нов.' : repeatWords.length + ' повт.' }}
    </p>

    <template v-if="mode === 'new'">
      <div v-if="newWords.length === 0" class="text-slate-400">
        В этот день новых слов нет
      </div>
      <ul v-else class="space-y-2">
        <li
          v-for="word in newWords"
          :key="word.id"
          class="rounded-md border border-slate-800 bg-slate-900 px-4 py-3 text-sm"
        >
          <div class="flex items-baseline justify-between gap-3">
            <span class="font-semibold text-vue-400">{{ word.en }}</span>
            <span class="text-xs tracking-wide text-slate-500 uppercase">
              #{{ word.id }} · {{ word.introductionDate }}
            </span>
          </div>
          <div class="text-slate-300">{{ word.translation }}</div>
          <div class="mt-1 text-xs text-slate-500 italic">
            «{{ word.phrase }}» — {{ word.phraseTranslation }}
          </div>
        </li>
      </ul>
    </template>

    <template v-else>
      <div v-if="repeatWords.length === 0" class="text-slate-400">
        В этот день повторений нет
      </div>
      <ul v-else class="space-y-2">
        <li
          v-for="word in repeatWords"
          :key="word.id"
          class="rounded-md border border-slate-800 bg-slate-900 px-4 py-3 text-sm"
        >
          <div class="flex items-baseline justify-between gap-3">
            <span class="font-semibold text-vue-400">{{ word.en }}</span>
            <span class="text-xs tracking-wide text-slate-500 uppercase">
              #{{ word.id }} · {{ word.introductionDate }}
            </span>
          </div>
          <div class="text-slate-300">{{ word.translation }}</div>
          <div class="mt-1 text-xs text-slate-500 italic">
            «{{ word.phrase }}» — {{ word.phraseTranslation }}
          </div>
        </li>
      </ul>
    </template>
  </div>
</template>
