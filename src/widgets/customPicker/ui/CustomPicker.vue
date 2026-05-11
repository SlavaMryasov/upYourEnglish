<script setup lang="ts">
import type { Word } from '@entities/word'
import { computed, ref } from 'vue'

const props = defineProps<{
  words: Word[]
}>()

const emit = defineEmits<{
  start: [ids: number[]]
}>()

const selected = ref<Record<number, boolean>>({})
const query = ref('')

const filteredWords = computed(() => {
  const normalized = query.value.trim().toLowerCase()
  if (!normalized) return props.words
  return props.words.filter((word) => {
    const haystack = `${word.en} ${word.translation} ${word.phrase} ${word.phraseTranslation}`
    return haystack.toLowerCase().includes(normalized)
  })
})

const selectedCount = computed(() => Object.values(selected.value).filter(Boolean).length)

const toggle = (id: number) => {
  selected.value[id] = !selected.value[id]
}

const selectAll = () => {
  filteredWords.value.forEach((word) => {
    selected.value[word.id] = true
  })
}

const clearAll = () => {
  selected.value = {}
}

const startStudy = () => {
  const ids = props.words.map((word) => word.id).filter((id) => selected.value[id])
  if (ids.length === 0) return
  emit('start', ids)
}
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="space-y-3 border-b border-slate-800 px-4 py-3">
      <div class="flex items-center justify-between gap-3">
        <span class="text-sm text-slate-400">
          Выбрано: {{ selectedCount }} из {{ words.length }}
        </span>
        <div class="flex gap-2">
          <button
            type="button"
            class="rounded-md border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:bg-slate-800"
            @click="selectAll"
          >
            Все
          </button>
          <button
            type="button"
            class="rounded-md border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:bg-slate-800"
            @click="clearAll"
          >
            Снять
          </button>
        </div>
      </div>

      <input
        v-model="query"
        type="search"
        placeholder="Поиск по слову, переводу или фразе…"
        class="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:border-vue-500"
      >

      <p v-if="query" class="text-xs text-slate-500">
        Найдено {{ filteredWords.length }} из {{ words.length }}
      </p>
    </div>

    <div
      v-if="filteredWords.length === 0"
      class="flex-1 p-4 text-sm text-slate-400"
    >
      Ничего не нашлось
    </div>

    <ul v-else class="flex-1 space-y-2 overflow-auto p-4 pb-24">
      <li
        v-for="word in filteredWords"
        :key="word.id"
        class="rounded-md border border-slate-800 bg-slate-900 px-4 py-3 text-sm transition hover:border-slate-700"
        :class="selected[word.id] ? 'border-vue-500' : ''"
      >
        <label class="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            :checked="!!selected[word.id]"
            class="mt-1 h-4 w-4 accent-vue-500"
            @change="toggle(word.id)"
          >
          <div class="flex-1">
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
          </div>
        </label>
      </li>
    </ul>

    <div
      v-if="selectedCount > 0"
      class="fixed inset-x-0 bottom-0 z-30 border-t border-slate-800 bg-slate-900/95 p-4 backdrop-blur"
    >
      <button
        type="button"
        class="mx-auto block w-full max-w-md rounded-xl border border-vue-500 bg-vue-500/10 px-4 py-3 text-base font-semibold text-vue-400 hover:bg-vue-500/20"
        @click="startStudy"
      >
        Изучать ({{ selectedCount }})
      </button>
    </div>
  </div>
</template>
