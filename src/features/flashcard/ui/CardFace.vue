<script setup lang="ts">
import { cn } from '@shared/lib'
import StreakDots from './StreakDots.vue'

defineProps<{
  position: number
  total: number
  streak: number
  required: number
  main: string
  sub: string
  hint: string
  back?: boolean
}>()
</script>

<template>
  <div
    class="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left shadow-xl"
  >
    <div class="flex items-center justify-between text-xs text-slate-500">
      <span class="font-medium tabular-nums">{{ position }} / {{ total }}</span>
      <StreakDots :streak="streak" :required="required" />
    </div>
    <div class="flex flex-1 flex-col items-center justify-center gap-4 px-2 text-center">
      <div
        :class="
          cn(
            'font-bold break-words',
            back ? 'text-3xl text-slate-100 md:text-4xl' : 'text-4xl text-vue-400 md:text-5xl',
          )
        "
      >
        {{ main }}
      </div>
      <div
        :class="
          cn(
            'italic',
            back ? 'text-base text-slate-400 md:text-lg' : 'text-lg text-slate-300 md:text-xl',
          )
        "
      >
        «{{ sub }}»
      </div>
    </div>
    <div class="text-center text-[11px] tracking-wider text-slate-500 uppercase">
      {{ hint }}
    </div>
  </div>
</template>
