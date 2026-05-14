<script setup lang="ts">
import { useVocabQuery } from '@shared/api'
import { PageInfo } from '@shared/ui'
import { PlanByDate } from '@widgets/planByDate'
import { computed } from 'vue'

const { state, isLoading, error, refetch } = useVocabQuery()

const words = computed(() => state.value.data ?? [])
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

    <div v-else class="mx-auto max-w-3xl space-y-4 p-6">
      <header class="flex items-start justify-between gap-3">
        <div class="space-y-1">
          <h1 class="text-2xl font-semibold">План</h1>
          <p class="text-sm text-slate-400">
            Новые слова и повторения по датам — переключи режим и выбери день
          </p>
        </div>
        <PageInfo
          title="План"
          description="Слова по дням курса. Переключатель сверху меняет режим: «Новые» — слова, которые впервые показываются в этот день (из ###-заголовков дока). «На повторение» — слова, выученные раньше и попадающие на повторение по кривой Эббингауза (1, 3, 7, 16, 35 дней). Селект выбирает дату."
        />
      </header>

      <PlanByDate :words="words" />
    </div>
  </div>
</template>
