<script setup lang="ts">
import {
  BreakoutCanvas,
  type BreakoutDifficulty,
  type BreakoutGridSize,
  type BreakoutPattern,
} from '@features/breakout'
import { PageInfo } from '@shared/ui'
import {
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'
import { computed, ref } from 'vue'

const GRID_OPTIONS: { value: BreakoutGridSize; label: string }[] = [
  { value: 'small', label: 'Мало (8×6 = 48)' },
  { value: 'medium', label: 'Средне (12×9 = 108)' },
  { value: 'large', label: 'Много (16×12 = 192)' },
]

const DIFFICULTY_OPTIONS: { value: BreakoutDifficulty; label: string }[] = [
  { value: 'easy', label: 'Лёгкая' },
  { value: 'medium', label: 'Средняя' },
  { value: 'hard', label: 'Сложная' },
]

const PATTERN_OPTIONS: { value: BreakoutPattern; label: string }[] = [
  { value: 'full', label: 'Все блоки (радуга)' },
  { value: 'smiley', label: '😊 Смайлик' },
  { value: 'bird', label: '🕊 Птичка' },
  { value: 'claude', label: '✱ Логотип Claude' },
]

const gridSize = ref<BreakoutGridSize>('large')
const difficulty = ref<BreakoutDifficulty>('easy')
const pattern = ref<BreakoutPattern>('full')
const isStarted = ref(false)

const canPattern = computed(() => gridSize.value === 'large')

const start = () => {
  if (!canPattern.value) pattern.value = 'full'
  isStarted.value = true
}

const backToSetup = () => {
  isStarted.value = false
}
</script>

<template>
  <div class="h-full overflow-auto">
    <div class="mx-auto max-w-md space-y-4 p-6">
      <header class="flex items-start justify-between gap-3">
        <div class="space-y-1">
          <h1 class="text-2xl font-semibold">Дикий шарик</h1>
          <p class="text-sm text-slate-400">Отбивай платформой, сбивай блоки</p>
        </div>
        <PageInfo
          title="Дикий шарик"
          description="Классический арканоид. Перед стартом выбери количество блоков, сложность и (для большой сетки) рисунок. Платформа управляется мышью, пальцем или стрелками ←/→. Пробел / тап / клик запускает шарик. Угол отскока зависит от точки удара по платформе. У тебя 3 жизни."
        />
      </header>

      <div v-if="!isStarted" class="space-y-3">
        <label class="block space-y-1">
          <span class="text-sm text-slate-400">Количество блоков</span>
          <SelectRoot v-model="gridSize">
            <SelectTrigger
              class="group flex w-full items-center justify-between gap-2 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 focus-visible:border-vue-500"
            >
              <SelectValue />
              <SelectIcon class="text-slate-500 transition-transform group-data-[state=open]:rotate-180">▼</SelectIcon>
            </SelectTrigger>
            <SelectPortal>
              <SelectContent
                position="popper"
                :side-offset="6"
                class="z-50 min-w-[var(--reka-select-trigger-width)] overflow-hidden rounded-md border border-slate-600 bg-slate-800 shadow-2xl shadow-black/60 ring-1 ring-black/30"
              >
                <SelectViewport class="p-1">
                  <SelectItem
                    v-for="option in GRID_OPTIONS"
                    :key="option.value"
                    :value="option.value"
                    class="relative flex cursor-pointer items-center rounded px-3 py-2 text-sm text-slate-300 outline-none select-none data-[highlighted]:bg-slate-700 data-[highlighted]:text-slate-50 data-[state=checked]:text-vue-400"
                  >
                    <SelectItemText>{{ option.label }}</SelectItemText>
                    <SelectItemIndicator class="ml-auto pl-2 text-vue-400">✓</SelectItemIndicator>
                  </SelectItem>
                </SelectViewport>
              </SelectContent>
            </SelectPortal>
          </SelectRoot>
        </label>

        <label class="block space-y-1">
          <span class="text-sm text-slate-400">Сложность</span>
          <SelectRoot v-model="difficulty">
            <SelectTrigger
              class="group flex w-full items-center justify-between gap-2 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 focus-visible:border-vue-500"
            >
              <SelectValue />
              <SelectIcon class="text-slate-500 transition-transform group-data-[state=open]:rotate-180">▼</SelectIcon>
            </SelectTrigger>
            <SelectPortal>
              <SelectContent
                position="popper"
                :side-offset="6"
                class="z-50 min-w-[var(--reka-select-trigger-width)] overflow-hidden rounded-md border border-slate-600 bg-slate-800 shadow-2xl shadow-black/60 ring-1 ring-black/30"
              >
                <SelectViewport class="p-1">
                  <SelectItem
                    v-for="option in DIFFICULTY_OPTIONS"
                    :key="option.value"
                    :value="option.value"
                    class="relative flex cursor-pointer items-center rounded px-3 py-2 text-sm text-slate-300 outline-none select-none data-[highlighted]:bg-slate-700 data-[highlighted]:text-slate-50 data-[state=checked]:text-vue-400"
                  >
                    <SelectItemText>{{ option.label }}</SelectItemText>
                    <SelectItemIndicator class="ml-auto pl-2 text-vue-400">✓</SelectItemIndicator>
                  </SelectItem>
                </SelectViewport>
              </SelectContent>
            </SelectPortal>
          </SelectRoot>
        </label>

        <label class="block space-y-1" :class="canPattern ? '' : 'opacity-50'">
          <span class="text-sm text-slate-400">
            Рисунок
            <span v-if="!canPattern" class="text-xs">(только для большой сетки)</span>
          </span>
          <SelectRoot v-model="pattern" :disabled="!canPattern">
            <SelectTrigger
              class="group flex w-full items-center justify-between gap-2 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 focus-visible:border-vue-500 disabled:cursor-not-allowed"
            >
              <SelectValue />
              <SelectIcon class="text-slate-500 transition-transform group-data-[state=open]:rotate-180">▼</SelectIcon>
            </SelectTrigger>
            <SelectPortal>
              <SelectContent
                position="popper"
                :side-offset="6"
                class="z-50 min-w-[var(--reka-select-trigger-width)] overflow-hidden rounded-md border border-slate-600 bg-slate-800 shadow-2xl shadow-black/60 ring-1 ring-black/30"
              >
                <SelectViewport class="p-1">
                  <SelectItem
                    v-for="option in PATTERN_OPTIONS"
                    :key="option.value"
                    :value="option.value"
                    class="relative flex cursor-pointer items-center rounded px-3 py-2 text-sm text-slate-300 outline-none select-none data-[highlighted]:bg-slate-700 data-[highlighted]:text-slate-50 data-[state=checked]:text-vue-400"
                  >
                    <SelectItemText>{{ option.label }}</SelectItemText>
                    <SelectItemIndicator class="ml-auto pl-2 text-vue-400">✓</SelectItemIndicator>
                  </SelectItem>
                </SelectViewport>
              </SelectContent>
            </SelectPortal>
          </SelectRoot>
        </label>

        <button
          type="button"
          class="w-full rounded-xl border border-vue-500 bg-vue-500/10 px-4 py-3 text-base font-semibold text-vue-400 hover:bg-vue-500/20"
          @click="start"
        >
          Старт
        </button>
      </div>

      <template v-else>
        <button
          type="button"
          class="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-300 hover:bg-slate-800"
          @click="backToSetup"
        >
          ← Настройки
        </button>

        <BreakoutCanvas :pattern="pattern" :grid-size="gridSize" :difficulty="difficulty" />
      </template>
    </div>
  </div>
</template>
