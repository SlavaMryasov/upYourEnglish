<script setup lang="ts">
import type { Word } from '@entities/word'
import { computed, ref } from 'vue'

const props = defineProps<{
  words: Word[]
}>()

const query = ref('')

const filteredWords = computed(() => {
  const normalized = query.value.trim().toLowerCase()
  if (!normalized) return props.words
  return props.words.filter((word) => {
    const haystack = `${word.en} ${word.translation} ${word.phrase} ${word.phraseTranslation}`
    return haystack.toLowerCase().includes(normalized)
  })
})
</script>

<template>
  <div class="space-y-3">
    <input
      v-model="query"
      type="search"
      placeholder="Поиск по слову, переводу или фразе…"
      class="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:border-vue-500"
    >

    <p v-if="query" class="text-xs text-slate-500">
      Найдено {{ filteredWords.length }} из {{ words.length }}
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
