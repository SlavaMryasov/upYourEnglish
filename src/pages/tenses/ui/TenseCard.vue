<script setup lang="ts">
import { ref } from 'vue'
import { TenseSchema, type ResolvedTenseExamples, type Tense } from '@entities/tense'

defineProps<{
  tense: Tense
  nameColorClass: string
  examples: ResolvedTenseExamples
}>()

const isFlipped = ref(false)
const toggleFlip = () => {
  isFlipped.value = !isFlipped.value
}
</script>

<template>
  <div class="relative min-h-72 [perspective:1200px]">
    <div
      class="absolute inset-0 cursor-pointer transition-transform duration-500 ease-out [transform-style:preserve-3d]"
      :class="isFlipped ? 'rotate-y-180' : ''"
      @click="toggleFlip"
    >
      <article
        class="absolute inset-0 flex flex-col gap-2 rounded-md border border-slate-800 bg-slate-900 p-3 text-sm backface-hidden"
      >
        <header class="flex items-center justify-between gap-3">
          <div class="space-y-0.5">
            <div class="font-semibold" :class="nameColorClass">{{ tense.name }}</div>
            <div class="text-xs text-slate-500">{{ tense.nameRu }}</div>
          </div>
          <TenseSchema :group="tense.group" :aspect="tense.aspect" />
        </header>
        <dl class="space-y-1 text-xs">
          <div>
            <dt class="inline text-slate-500">Утверждение: </dt>
            <dd class="inline font-mono text-slate-200">{{ tense.affirmative }}</dd>
          </div>
          <div>
            <dt class="inline text-slate-500">Отрицание: </dt>
            <dd class="inline font-mono text-slate-200">{{ tense.negative }}</dd>
          </div>
          <div>
            <dt class="inline text-slate-500">Вопрос: </dt>
            <dd class="inline font-mono text-slate-200">{{ tense.question }}</dd>
          </div>
        </dl>
        <p class="text-xs text-slate-300">{{ tense.when }}</p>
        <p class="mt-auto text-center text-[10px] tracking-wide text-slate-500 uppercase">
          тап — примеры
        </p>
      </article>

      <article
        class="absolute inset-0 flex flex-col gap-3 rounded-md border border-slate-800 bg-slate-900 p-3 text-sm rotate-y-180 backface-hidden"
      >
        <header class="space-y-0.5">
          <div class="font-semibold" :class="nameColorClass">{{ tense.name }}</div>
          <div class="text-xs text-slate-500">{{ tense.nameRu }}</div>
        </header>
        <div class="space-y-2.5 text-sm">
          <div>
            <div class="text-[10px] tracking-wide text-slate-500 uppercase">Утверждение</div>
            <div class="text-slate-100">{{ examples.affirmative.en }}</div>
            <div v-if="examples.affirmative.ru" class="text-xs text-slate-400">
              {{ examples.affirmative.ru }}
            </div>
          </div>
          <div>
            <div class="text-[10px] tracking-wide text-slate-500 uppercase">Отрицание</div>
            <div class="text-slate-100">{{ examples.negative.en }}</div>
            <div v-if="examples.negative.ru" class="text-xs text-slate-400">
              {{ examples.negative.ru }}
            </div>
          </div>
          <div>
            <div class="text-[10px] tracking-wide text-slate-500 uppercase">Вопрос</div>
            <div class="text-slate-100">{{ examples.question.en }}</div>
            <div v-if="examples.question.ru" class="text-xs text-slate-400">
              {{ examples.question.ru }}
            </div>
          </div>
        </div>
        <p class="mt-auto text-center text-[10px] tracking-wide text-slate-500 uppercase">
          тап — обратно
        </p>
      </article>
    </div>
  </div>
</template>
