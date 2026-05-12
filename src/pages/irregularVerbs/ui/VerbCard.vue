<script setup lang="ts">
import {
  VERB_FREQUENCY_BADGE_CLASS,
  VERB_FREQUENCY_LABELS,
  type IrregularVerb,
} from '@entities/verb'
import { FlipCard } from '@shared/ui'
import { useTemplateRef } from 'vue'

defineProps<{
  verb: IrregularVerb
  streak: number
  required: number
}>()

defineEmits<{
  known: []
  unknown: []
}>()

const flipCard = useTemplateRef<{
  triggerKnown: () => void
  triggerUnknown: () => void
}>('flipCard')

defineExpose({
  triggerKnown: () => flipCard.value?.triggerKnown(),
  triggerUnknown: () => flipCard.value?.triggerUnknown(),
})
</script>

<template>
  <FlipCard
    ref="flipCard"
    aspect-class="aspect-[4/3]"
    @known="$emit('known')"
    @unknown="$emit('unknown')"
  >
    <template #front>
      <article
        class="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
      >
        <div class="flex items-center gap-2">
          <span
            class="rounded-md border px-2 py-0.5 text-[10px] tracking-wide uppercase"
            :class="VERB_FREQUENCY_BADGE_CLASS[verb.freq]"
          >
            {{ VERB_FREQUENCY_LABELS[verb.freq] }}
          </span>
          <span class="text-xs tabular-nums text-slate-500">
            ✓ {{ streak }} / {{ required }}
          </span>
        </div>
        <div class="text-5xl font-bold text-vue-400">{{ verb.v1 }}</div>
        <p class="px-4 text-center text-xs tracking-wide text-slate-500 uppercase">
          тап — формы · свайп → знаю · ← не знаю
        </p>
      </article>
    </template>
    <template #back>
      <article
        class="flex h-full flex-col items-center justify-center gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
      >
        <div class="text-center text-xs tracking-wide text-slate-500 uppercase">
          {{ verb.v1 }}
        </div>
        <div class="text-center font-mono text-2xl text-slate-100">
          <span>{{ verb.v2 }}</span>
          <span class="mx-2 text-slate-600">·</span>
          <span>{{ verb.v3 }}</span>
        </div>
        <div class="text-center text-sm text-slate-300">{{ verb.translation }}</div>
      </article>
    </template>
  </FlipCard>
</template>
