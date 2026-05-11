<script setup lang="ts">
import { useVocabQuery } from '@shared/api'
import { PageInfo } from '@shared/ui'
import { computed } from 'vue'

const { state, isLoading, error, refetch } = useVocabQuery()

const words = computed(() => state.value.data ?? [])

const statusStyle: Record<string, string> = {
  new: 'text-vue-400',
  learned: 'text-slate-500',
  ignored: 'text-error-400',
}
</script>

<template>
  <div class="h-full overflow-auto">
    <div v-if="isLoading" class="flex h-full items-center justify-center text-slate-400">
      Загружаем словарь…
    </div>

    <div
      v-else-if="error"
      class="flex h-full flex-col items-center justify-center gap-3 text-error-400"
    >
      <p>Ошибка: {{ error.message }}</p>
      <button
        type="button"
        class="rounded-md border border-error-500 px-3 py-1 text-sm hover:bg-error-500/10"
        @click="() => refetch()"
      >
        Повторить
      </button>
    </div>

    <div
      v-else-if="words.length === 0"
      class="flex h-full items-center justify-center text-slate-400"
    >
      Док пустой
    </div>

    <div v-else class="mx-auto max-w-3xl space-y-3 p-6">
      <header class="flex items-start justify-between gap-3">
        <div class="space-y-1">
          <h1 class="text-2xl font-semibold">Все слова</h1>
          <p class="text-sm text-slate-400">{{ words.length }} слов в словаре</p>
        </div>
        <PageInfo
          title="Все слова"
          description="Полный список всех слов из Google Doc. Здесь видно каждое слово независимо от его статуса и позиции в расписании. Используй для общего обзора словаря."
        />
      </header>

      <ul class="space-y-2">
        <li
          v-for="word in words"
          :key="word.id"
          class="rounded-md border border-slate-800 bg-slate-900 px-4 py-3 text-sm"
        >
          <div class="flex items-baseline justify-between gap-3">
            <span class="font-semibold text-vue-400">{{ word.en }}</span>
            <span
              class="text-xs tracking-wide uppercase"
              :class="statusStyle[word.status] ?? 'text-slate-500'"
            >
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
  </div>
</template>
