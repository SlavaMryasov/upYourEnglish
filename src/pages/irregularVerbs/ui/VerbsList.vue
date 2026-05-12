<script setup lang="ts">
import {
  VERB_FREQUENCIES,
  VERB_FREQUENCY_BADGE_CLASS,
  VERB_FREQUENCY_LABELS,
  type IrregularVerb,
} from '@entities/verb'
import { computed } from 'vue'

const props = defineProps<{
  verbs: IrregularVerb[]
}>()

const grouped = computed(() =>
  VERB_FREQUENCIES.map((freq) => ({
    freq,
    items: props.verbs.filter((verb) => verb.freq === freq),
  })).filter((group) => group.items.length > 0),
)
</script>

<template>
  <div
    class="flex-1 space-y-4 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950/40 p-3 shadow-inner shadow-slate-950/50"
  >
    <section v-for="group in grouped" :key="group.freq" class="space-y-2">
      <h2
        class="inline-flex items-center gap-2 rounded-md border px-3 py-1 text-xs font-semibold"
        :class="VERB_FREQUENCY_BADGE_CLASS[group.freq]"
      >
        {{ VERB_FREQUENCY_LABELS[group.freq] }} · {{ group.items.length }}
      </h2>
      <ul class="overflow-hidden rounded-md">
        <li
          v-for="verb in group.items"
          :key="`${group.freq}-${verb.v1}`"
          class="grid gap-1 border-b border-slate-700 px-3 py-3 last:border-0 sm:grid-cols-[1fr_1fr_1fr_auto_2fr] sm:items-stretch sm:gap-3"
        >
          <div class="font-semibold text-vue-400 sm:self-center">{{ verb.v1 }}</div>
          <div class="font-mono text-sm text-slate-200 sm:self-center">{{ verb.v2 }}</div>
          <div class="font-mono text-sm text-slate-200 sm:self-center">{{ verb.v3 }}</div>
          <div aria-hidden="true" class="hidden w-px self-stretch bg-slate-800/60 sm:block" />
          <div class="text-sm text-slate-400 sm:self-center">{{ verb.translation }}</div>
        </li>
      </ul>
    </section>
  </div>
</template>
