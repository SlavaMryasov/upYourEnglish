<script setup lang="ts">
import { usePreferencesStore } from '@features/preferences'
import { useVocabQuery } from '@shared/api'
import { PageInfo } from '@shared/ui'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import MatchByDate from './MatchByDate.vue'

const { state, isLoading, error, refetch } = useVocabQuery()
const preferences = usePreferencesStore()
const { frontSide } = storeToRefs(preferences)

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

    <div v-else class="mx-auto max-w-2xl space-y-4 p-4 sm:p-6">
      <header class="flex items-start justify-between gap-3">
        <div class="space-y-1">
          <h1 class="text-2xl font-semibold">Соединялка</h1>
          <p class="text-sm text-slate-400">
            Выбери дату — пройди слова из плана этого дня
          </p>
        </div>
        <PageInfo
          title="Соединялка"
          description="Слова из плана выбранной даты. На каждом шаге одно слово и 4 варианта перевода — нужно ткнуть правильный. Кнопка EN→RU / RU→EN меняет направление: или ты переводишь английское на русский, или наоборот. Дефолт — сегодня (если в доке есть ###-заголовок на сегодня), иначе ближайший прошедший день."
        />
      </header>

      <div class="flex items-center justify-end">
        <button
          type="button"
          class="rounded-md border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:bg-slate-800"
          @click="preferences.toggleFrontSide"
        >
          {{ frontSide === 'en' ? 'EN → RU' : 'RU → EN' }}
        </button>
      </div>

      <MatchByDate :words="words" />
    </div>
  </div>
</template>
