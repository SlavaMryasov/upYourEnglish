<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  completed: number
  total: number
}>()

const percent = computed(() => (props.total === 0 ? 0 : (props.completed / props.total) * 100))
</script>

<template>
  <header class="flex items-center gap-3 border-b border-slate-800 px-4 py-3 text-xs text-slate-400">
    <span class="min-w-[60px] font-medium tabular-nums">{{ completed }} / {{ total }}</span>
    <div class="h-1 flex-1 overflow-hidden rounded-full bg-slate-800">
      <div
        class="h-full bg-vue-500 transition-all duration-300"
        :style="{ width: `${percent}%` }"
      />
    </div>
    <span class="min-w-[60px] text-right font-medium tabular-nums">{{ completed }} ✓</span>
  </header>
</template>
