<script setup lang="ts">
import { TENSES, TENSE_LABELS, type Tense } from '@entities/sentence'
import {
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from 'reka-ui'
import { computed } from 'vue'

const props = defineProps<{
  selected: Record<Tense, boolean>
}>()

const emit = defineEmits<{
  toggle: [tense: Tense]
  setAll: [value: boolean]
}>()

const selectedCount = computed(
  () => Object.values(props.selected).filter(Boolean).length,
)

const summary = computed(() => {
  if (selectedCount.value === 0) return 'Ничего'
  if (selectedCount.value === TENSES.length) return 'Все времена'
  return TENSES.filter((tense) => props.selected[tense])
    .map((tense) => TENSE_LABELS[tense])
    .join(', ')
})
</script>

<template>
  <PopoverRoot>
    <PopoverTrigger
      class="group flex w-full items-center justify-between gap-2 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 focus-visible:border-vue-500"
    >
      <span class="truncate text-left">
        <span class="text-slate-500">Времена: </span>{{ summary }}
      </span>
      <span
        class="shrink-0 text-slate-500 transition-transform group-data-[state=open]:rotate-180"
      >
        ▼
      </span>
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        :side-offset="6"
        align="start"
        class="z-50 max-h-[60vh] w-[var(--reka-popover-trigger-width)] overflow-hidden rounded-md border border-slate-600 bg-slate-800 shadow-2xl shadow-black/60 ring-1 ring-black/30"
      >
        <div
          class="flex items-center justify-between gap-2 border-b border-slate-700 px-3 py-2 text-xs text-slate-400"
        >
          <span>{{ selectedCount }} / 12</span>
          <div class="flex gap-2">
            <button
              type="button"
              class="rounded-md border border-slate-600 px-2 py-0.5 text-xs text-slate-300 hover:bg-slate-700"
              @click="emit('setAll', true)"
            >
              Все
            </button>
            <button
              type="button"
              class="rounded-md border border-slate-600 px-2 py-0.5 text-xs text-slate-300 hover:bg-slate-700"
              @click="emit('setAll', false)"
            >
              Снять
            </button>
          </div>
        </div>
        <ul class="max-h-[50vh] overflow-y-auto p-1 shadow-inner shadow-slate-950/60">
          <li v-for="tense in TENSES" :key="tense">
            <label
              class="flex cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm text-slate-200 hover:bg-slate-700"
            >
              <input
                type="checkbox"
                :checked="!!selected[tense]"
                class="h-4 w-4 accent-vue-500"
                @change="emit('toggle', tense)"
              >
              <span>{{ TENSE_LABELS[tense] }}</span>
            </label>
          </li>
        </ul>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
