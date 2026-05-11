<script setup lang="ts">
import { useTenseExamplesQuery } from '@shared/api'
import { PageInfo } from '@shared/ui'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
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
import {
  ASPECT_ORDER,
  GROUP_ORDER,
  TENSE_ASPECTS,
  TENSE_GROUPS,
  TENSES,
  tenseCodeOf,
  TenseSchema,
  type ResolvedTenseExamples,
  type Tense,
  type TenseAspect,
  type TenseGroup,
} from '@entities/tense'
import TenseCard from './TenseCard.vue'

type ViewMode = 'tense' | 'aspect'
type AspectFilter = TenseAspect | 'all'

const viewMode = ref<ViewMode>('tense')
const aspectFilter = ref<AspectFilter>('all')
const selectedTense = ref<Tense | null>(null)
const isModalOpen = ref(false)

const aspectOptions: { value: AspectFilter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'simple', label: 'Simple' },
  { value: 'continuous', label: 'Continuous' },
  { value: 'perfect', label: 'Perfect' },
  { value: 'perfectContinuous', label: 'Perfect Continuous' },
]

const groupHeaderClass: Record<TenseGroup, string> = {
  present: 'bg-vue-900/50 text-vue-300 border-b border-vue-800',
  past: 'bg-amber-900/40 text-amber-300 border-b border-amber-800',
  future: 'bg-blue-900/40 text-blue-300 border-b border-blue-800',
}

const aspectHeaderClass: Record<TenseAspect, string> = {
  simple: 'bg-vue-900/40 text-vue-300 border-b border-vue-800',
  continuous: 'bg-blue-900/40 text-blue-300 border-b border-blue-800',
  perfect: 'bg-violet-900/40 text-violet-300 border-b border-violet-800',
  perfectContinuous: 'bg-violet-900/40 text-violet-300 border-b border-violet-800',
}

const tenseNameColor: Record<TenseGroup, string> = {
  present: 'text-vue-400',
  past: 'text-amber-400',
  future: 'text-blue-400',
}

const groupOrderIndex: Record<TenseGroup, number> = {
  future: 0,
  present: 1,
  past: 2,
}

const tenseExamplesQuery = useTenseExamplesQuery()

const resolveExamples = (tense: Tense): ResolvedTenseExamples => {
  const docData = tenseExamplesQuery.state.value.data?.[tenseCodeOf(tense.group, tense.aspect)]
  return {
    affirmative: docData?.affirmative ?? { en: tense.examples.affirmative },
    negative: docData?.negative ?? { en: tense.examples.negative },
    question: docData?.question ?? { en: tense.examples.question },
  }
}

const filteredTenses = computed<Tense[]>(() => {
  if (aspectFilter.value === 'all') return TENSES
  return TENSES.filter((tense) => tense.aspect === aspectFilter.value)
})

type Section = {
  key: string
  label: string
  headerClass: string
  tenses: Tense[]
}

const sections = computed<Section[]>(() => {
  if (viewMode.value === 'tense') {
    return GROUP_ORDER.map((group) => ({
      key: group,
      label: `${TENSE_GROUPS[group].label} · ${TENSE_GROUPS[group].ru}`,
      headerClass: groupHeaderClass[group],
      tenses: filteredTenses.value.filter((tense) => tense.group === group),
    }))
  }
  return ASPECT_ORDER.map((aspect) => ({
    key: aspect,
    label: `${TENSE_ASPECTS[aspect].label} · ${TENSE_ASPECTS[aspect].ru}`,
    headerClass: aspectHeaderClass[aspect],
    tenses: filteredTenses.value
      .filter((tense) => tense.aspect === aspect)
      .sort((a, b) => groupOrderIndex[a.group] - groupOrderIndex[b.group]),
  }))
})

const setMode = (mode: ViewMode) => {
  viewMode.value = mode
}

const openTense = (tense: Tense) => {
  selectedTense.value = tense
  isModalOpen.value = true
}
</script>

<template>
  <div class="h-full overflow-auto">
    <div class="mx-auto max-w-6xl space-y-4 p-4 sm:p-6">
      <header class="flex items-start justify-between gap-3">
        <div class="space-y-1">
          <h1 class="text-2xl font-semibold">Таблица времён</h1>
          <p class="text-sm text-slate-400">
            12 английских времён: формула, использование, пример
          </p>
        </div>
        <PageInfo
          title="Таблица времён"
          description="Шпаргалка по 12 английским временам. Переключатель сверху меняет группировку: «По временам» или «По группам». На десктопе — клик по строке открывает модалку с примерами. На мобиле — тап по карточке переворачивает её и показывает примеры."
        />
      </header>

      <div class="inline-flex rounded-md border border-slate-700 bg-slate-900 p-0.5 text-sm">
        <button
          type="button"
          class="rounded px-3 py-1.5 transition"
          :class="
            viewMode === 'tense'
              ? 'bg-slate-700 text-slate-50'
              : 'text-slate-400 hover:text-slate-200'
          "
          @click="setMode('tense')"
        >
          По временам
        </button>
        <button
          type="button"
          class="rounded px-3 py-1.5 transition"
          :class="
            viewMode === 'aspect'
              ? 'bg-slate-700 text-slate-50'
              : 'text-slate-400 hover:text-slate-200'
          "
          @click="setMode('aspect')"
        >
          По группам
        </button>
      </div>

      <div v-if="viewMode === 'tense'" class="md:hidden">
        <SelectRoot v-model="aspectFilter">
          <SelectTrigger
            class="group flex w-full items-center justify-between gap-2 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 focus-visible:border-vue-500"
          >
            <SelectValue placeholder="Все" />
            <SelectIcon class="text-slate-500 transition-transform group-data-[state=open]:rotate-180">▼</SelectIcon>
          </SelectTrigger>
          <SelectPortal>
            <SelectContent
              position="popper"
              :side-offset="6"
              class="z-50 min-w-[var(--reka-select-trigger-width)] overflow-hidden rounded-md border border-slate-700 bg-slate-900 shadow-xl"
            >
              <SelectViewport class="p-1">
                <SelectItem
                  v-for="option in aspectOptions"
                  :key="option.value"
                  :value="option.value"
                  class="relative flex cursor-pointer items-center rounded px-3 py-2 text-sm text-slate-300 outline-none select-none data-[highlighted]:bg-slate-800 data-[highlighted]:text-slate-50 data-[state=checked]:text-vue-400"
                >
                  <SelectItemText>{{ option.label }}</SelectItemText>
                  <SelectItemIndicator class="ml-auto pl-2 text-vue-400">✓</SelectItemIndicator>
                </SelectItem>
              </SelectViewport>
            </SelectContent>
          </SelectPortal>
        </SelectRoot>
      </div>

      <div class="space-y-4 md:hidden">
        <section v-for="section in sections" :key="section.key" class="space-y-2">
          <div
            v-if="section.tenses.length > 0"
            class="rounded-md px-3 py-2 text-center text-sm font-semibold"
            :class="section.headerClass"
          >
            {{ section.label }}
          </div>
          <TenseCard
            v-for="tense in section.tenses"
            :key="tense.name"
            :tense="tense"
            :name-color-class="tenseNameColor[tense.group]"
            :examples="resolveExamples(tense)"
          />
        </section>
      </div>

      <div class="hidden space-y-6 md:block">
        <section
          v-for="section in sections"
          :key="section.key"
          class="overflow-hidden rounded-lg border border-slate-800"
        >
          <div
            class="px-4 py-2 text-center text-base font-semibold"
            :class="section.headerClass"
          >
            {{ section.label }}
          </div>
          <table class="w-full table-fixed text-sm">
            <thead class="bg-slate-900/40">
              <tr class="divide-x divide-slate-800 border-b border-slate-800 text-left text-xs text-slate-500">
                <th class="w-48 px-3 py-2 font-medium">Время</th>
                <th class="w-32 px-3 py-2 font-medium">Схема</th>
                <th class="px-3 py-2 font-medium">Утверждение</th>
                <th class="px-3 py-2 font-medium">Отрицание</th>
                <th class="px-3 py-2 font-medium">Вопрос</th>
                <th class="w-72 px-3 py-2 font-medium">Когда применять</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="tense in section.tenses"
                :key="tense.name"
                class="cursor-pointer divide-x divide-slate-800 border-b border-slate-800 align-top transition-colors last:border-0 hover:bg-slate-800/40"
                @click="openTense(tense)"
              >
                <td class="px-3 py-3">
                  <div class="font-semibold" :class="tenseNameColor[tense.group]">
                    {{ tense.name }}
                  </div>
                  <div class="mt-0.5 text-xs text-slate-500">{{ tense.nameRu }}</div>
                </td>
                <td class="px-3 py-3">
                  <TenseSchema :group="tense.group" :aspect="tense.aspect" />
                </td>
                <td class="px-3 py-3 font-mono text-slate-200">{{ tense.affirmative }}</td>
                <td class="px-3 py-3 font-mono text-slate-200">{{ tense.negative }}</td>
                <td class="px-3 py-3 font-mono text-slate-200">{{ tense.question }}</td>
                <td class="px-3 py-3">
                  <p class="text-slate-300">{{ tense.when }}</p>
                  <p class="mt-1 text-xs text-slate-400 italic">{{ tense.example }}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>

    <DialogRoot v-model:open="isModalOpen">
      <DialogPortal>
        <DialogOverlay
          class="fixed inset-0 z-40 bg-slate-950/70 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:fade-in"
        />
        <DialogContent
          class="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95"
        >
          <template v-if="selectedTense">
            <DialogTitle
              class="text-xl font-semibold"
              :class="tenseNameColor[selectedTense.group]"
            >
              {{ selectedTense.name }}
            </DialogTitle>
            <DialogDescription class="mt-1 text-sm text-slate-400">
              {{ selectedTense.nameRu }}
            </DialogDescription>
            <div class="mt-5 space-y-4 text-sm">
              <div>
                <div class="text-xs tracking-wide text-slate-500 uppercase">Утверждение</div>
                <div class="mt-1 font-mono text-xs text-slate-400">
                  {{ selectedTense.affirmative }}
                </div>
                <div class="mt-1 text-slate-100">
                  {{ resolveExamples(selectedTense).affirmative.en }}
                </div>
                <div
                  v-if="resolveExamples(selectedTense).affirmative.ru"
                  class="mt-0.5 text-xs text-slate-400"
                >
                  {{ resolveExamples(selectedTense).affirmative.ru }}
                </div>
              </div>
              <div>
                <div class="text-xs tracking-wide text-slate-500 uppercase">Отрицание</div>
                <div class="mt-1 font-mono text-xs text-slate-400">
                  {{ selectedTense.negative }}
                </div>
                <div class="mt-1 text-slate-100">
                  {{ resolveExamples(selectedTense).negative.en }}
                </div>
                <div
                  v-if="resolveExamples(selectedTense).negative.ru"
                  class="mt-0.5 text-xs text-slate-400"
                >
                  {{ resolveExamples(selectedTense).negative.ru }}
                </div>
              </div>
              <div>
                <div class="text-xs tracking-wide text-slate-500 uppercase">Вопрос</div>
                <div class="mt-1 font-mono text-xs text-slate-400">
                  {{ selectedTense.question }}
                </div>
                <div class="mt-1 text-slate-100">
                  {{ resolveExamples(selectedTense).question.en }}
                </div>
                <div
                  v-if="resolveExamples(selectedTense).question.ru"
                  class="mt-0.5 text-xs text-slate-400"
                >
                  {{ resolveExamples(selectedTense).question.ru }}
                </div>
              </div>
            </div>
            <DialogClose
              class="mt-6 inline-flex w-full items-center justify-center rounded-md border border-vue-500 px-3 py-2 text-sm font-semibold text-vue-400 hover:bg-vue-500/10"
            >
              Закрыть
            </DialogClose>
          </template>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  </div>
</template>
