<script setup lang="ts">
import type { Word } from '@entities/word'
import { todayISO } from '@shared/lib'
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
import MatchExercise from './MatchExercise.vue'

const props = defineProps<{ words: Word[] }>()

const fmt = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'short',
  weekday: 'short',
})

const formatDate = (iso: string): string => {
  const [y, m, d] = iso.split('-').map(Number)
  return fmt.format(new Date(y, m - 1, d))
}

const dates = computed(() => {
  const set = new Set<string>()
  props.words.forEach((word) => {
    if (word.introductionDate) set.add(word.introductionDate)
  })
  return [...set].sort()
})

const today = computed(() => todayISO())

const pickDefault = (list: string[]): string | null => {
  if (list.length === 0) return null
  if (list.includes(today.value)) return today.value
  const past = list.filter((iso) => iso <= today.value)
  if (past.length > 0) return past[past.length - 1]
  return list[0]
}

const selectedDate = ref<string | null>(pickDefault(dates.value))

watch(
  dates,
  (list) => {
    if (list.length === 0) {
      selectedDate.value = null
      return
    }
    if (!selectedDate.value || !list.includes(selectedDate.value)) {
      selectedDate.value = pickDefault(list)
    }
  },
  { immediate: true },
)

const pool = computed(() => {
  if (!selectedDate.value) return []
  return props.words.filter((word) => word.introductionDate === selectedDate.value)
})

const hasEnoughForDistractors = computed(() => props.words.length >= 4)
</script>

<template>
  <div class="space-y-4">
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
              v-for="iso in dates"
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

    <div
      v-if="pool.length === 0"
      class="rounded-md border border-slate-800 bg-slate-900 p-6 text-center text-slate-400"
    >
      В этот день новых слов нет
    </div>
    <div
      v-else-if="!hasEnoughForDistractors"
      class="rounded-md border border-slate-800 bg-slate-900 p-6 text-center text-slate-400"
    >
      В словаре меньше 4 слов — не хватит для вариантов
    </div>
    <MatchExercise v-else :pool="pool" :all-words="words" />
  </div>
</template>
