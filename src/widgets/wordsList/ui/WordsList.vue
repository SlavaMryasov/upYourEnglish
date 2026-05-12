<script setup lang="ts">
import type { Word } from '@entities/word'
import { computed, ref } from 'vue'

const props = defineProps<{
  words: Word[]
}>()

type StatusFilter = 'new' | 'learned' | 'all'

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'new', label: 'Невыученные' },
  { value: 'learned', label: 'Выученные' },
  { value: 'all', label: 'Все' },
]

const statusFilter = ref<StatusFilter>('all')

const query = ref('')

const filteredWords = computed(() => {
  const byStatus =
    statusFilter.value === 'all'
      ? props.words
      : props.words.filter((word) => word.status === statusFilter.value)

  const normalized = query.value.trim().toLowerCase()
  if (!normalized) return byStatus
  return byStatus.filter((word) => {
    const haystack = `${word.en} ${word.translation} ${word.phrase} ${word.phraseTranslation}`
    return haystack.toLowerCase().includes(normalized)
  })
})

const hasFilter = computed(() => Boolean(query.value) || statusFilter.value !== 'all')
</script>

<template>
  <div class="space-y-3">
    <input
      v-model="query"
      type="search"
      placeholder="Поиск по слову, переводу или фразе…"
      class="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:border-vue-500"
    >

    <div class="flex flex-wrap gap-2">
      <label
        v-for="option in STATUS_OPTIONS"
        :key="option.value"
        class="flex cursor-pointer items-center gap-2 rounded-md border bg-slate-900 px-3 py-1.5 text-xs transition"
        :class="
          statusFilter === option.value
            ? 'border-vue-500 text-slate-100'
            : 'border-slate-700 text-slate-400'
        "
      >
        <input
          v-model="statusFilter"
          type="radio"
          name="words-status-filter"
          :value="option.value"
          class="h-4 w-4 accent-vue-500"
        >
        <span>{{ option.label }}</span>
      </label>
    </div>

    <p class="text-xs text-slate-500">
      <template v-if="hasFilter">
        Найдено {{ filteredWords.length }} из {{ words.length }}
      </template>
      <template v-else>Всего {{ words.length }}</template>
    </p>

    <div v-if="filteredWords.length === 0" class="text-sm text-slate-400">
      Ничего не нашлось
    </div>

    <ul v-else class="space-y-2">
      <li
        v-for="word in filteredWords"
        :key="word.id"
        class="rounded-md border border-slate-800 bg-slate-900 px-4 py-3 text-sm"
      >
        <div class="flex items-baseline justify-between gap-3">
          <span class="font-semibold text-vue-400">{{ word.en }}</span>
          <span class="text-xs tracking-wide text-slate-500 uppercase">
            #{{ word.id }} · {{ word.status }}
          </span>
        </div>
        <div class="text-slate-300">{{ word.translation }}</div>
        <div class="mt-1 text-xs text-slate-500 italic">
          «{{ word.phrase }}» — {{ word.phraseTranslation }}
        </div>
      </li>
    </ul>
  </div>
</template>
