<script setup lang="ts">
import { useVocabQuery } from '@shared/api'
import { getCurrentDay } from '@shared/config'
import { getIntroductionDay } from '@shared/lib'
import { PageInfo } from '@shared/ui'
import { computed } from 'vue'

const { state, isLoading, error, refetch } = useVocabQuery()

const words = computed(() => state.value.data ?? [])
const currentDay = computed(() => getCurrentDay())

const planWords = computed(() =>
  words.value.filter((word) => getIntroductionDay(word.id) === currentDay.value),
)
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

    <div v-else class="mx-auto max-w-3xl space-y-3 p-6">
      <header class="flex items-start justify-between gap-3">
        <div class="space-y-1">
          <h1 class="text-2xl font-semibold">План</h1>
          <p class="text-sm text-slate-400">
            Сегодняшние новые слова · {{ planWords.length }} шт. · день {{ currentDay }}
          </p>
        </div>
        <PageInfo
          title="План"
          description="Только новые слова на сегодняшний день курса (по расписанию Эббингауза, 5 слов в день). Повторения прошлых дней сюда не входят — для тренировки повторений открой Карточки на сегодня."
        />
      </header>

      <div v-if="planWords.length === 0" class="text-slate-400">
        Сегодня новых слов нет — только повторения
      </div>

      <ul v-else class="space-y-2">
        <li
          v-for="word in planWords"
          :key="word.id"
          class="rounded-md border border-slate-800 bg-slate-900 px-4 py-3 text-sm"
        >
          <div class="flex items-baseline justify-between gap-3">
            <span class="font-semibold text-vue-400">{{ word.en }}</span>
            <span class="text-xs tracking-wide text-slate-500 uppercase">
              #{{ word.id }} · день {{ getIntroductionDay(word.id) }}
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
