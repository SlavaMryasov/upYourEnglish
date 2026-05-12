<script setup lang="ts">
import {
  VERB_FREQUENCIES,
  VERB_FREQUENCY_LABELS,
  type IrregularVerb,
  type VerbFrequency,
} from '@entities/verb'
import { useFlashcardKeyboard } from '@features/flashcard'
import { REQUIRED_VERB_STREAK, useVerbProgressStore } from '@features/verbProgress'
import { useIrregularVerbsQuery } from '@shared/api'
import { ConfirmDialog, PageInfo } from '@shared/ui'
import { BottomControls } from '@widgets/bottomControls'
import { computed, ref, useTemplateRef, watch } from 'vue'
import VerbCard from './VerbCard.vue'
import VerbsList from './VerbsList.vue'

const verbsQuery = useIrregularVerbsQuery()
const verbs = computed<IrregularVerb[]>(() => verbsQuery.state.value.data ?? [])
const verbProgress = useVerbProgressStore()

type ViewMode = 'list' | 'cards'
const viewMode = ref<ViewMode>('list')
const setMode = (mode: ViewMode) => {
  viewMode.value = mode
}

const query = ref('')
const selectedFreqs = ref<Record<VerbFrequency, boolean>>({
  high: true,
  medium: true,
  low: true,
})
const toggleFreq = (freq: VerbFrequency) => {
  selectedFreqs.value[freq] = !selectedFreqs.value[freq]
}

const filtered = computed<IrregularVerb[]>(() => {
  const normalized = query.value.trim().toLowerCase()
  return verbs.value.filter((verb) => {
    if (!selectedFreqs.value[verb.freq]) return false
    if (!normalized) return true
    return (
      verb.v1.toLowerCase().includes(normalized) ||
      verb.v2.toLowerCase().includes(normalized) ||
      verb.v3.toLowerCase().includes(normalized) ||
      verb.translation.toLowerCase().includes(normalized)
    )
  })
})

const CARD_COUNT_OPTIONS = [
  { value: '10', label: '10' },
  { value: '20', label: '20' },
  { value: '30', label: '30' },
  { value: '50', label: '50' },
  { value: '100', label: '100' },
  { value: 'all', label: 'Все' },
] as const

const cardCountKey = ref<string>('20')
const cardCount = computed<number | 'all'>(() =>
  cardCountKey.value === 'all' ? 'all' : Number(cardCountKey.value),
)

const shuffleOrder = ref<number[] | null>(null)

const baseDeck = computed<IrregularVerb[]>(() => {
  if (!shuffleOrder.value) return filtered.value
  return shuffleOrder.value.map((idx) => filtered.value[idx]).filter(Boolean)
})

const deck = computed<IrregularVerb[]>(() => {
  if (cardCount.value === 'all') return baseDeck.value
  return baseDeck.value.slice(0, cardCount.value)
})

const activeDeck = computed<IrregularVerb[]>(() =>
  deck.value.filter((verb) => !verbProgress.isClosed(verb.v1)),
)

const closedCount = computed(() => deck.value.length - activeDeck.value.length)

const currentIndex = ref(0)

const currentVerb = computed<IrregularVerb | null>(
  () => activeDeck.value[currentIndex.value] ?? null,
)

const advance = () => {
  if (activeDeck.value.length === 0) {
    currentIndex.value = 0
    return
  }
  currentIndex.value = (currentIndex.value + 1) % activeDeck.value.length
}

const retreat = () => {
  if (activeDeck.value.length === 0) {
    currentIndex.value = 0
    return
  }
  currentIndex.value =
    (currentIndex.value - 1 + activeDeck.value.length) % activeDeck.value.length
}

const onKnown = () => {
  const verb = currentVerb.value
  if (!verb) return
  verbProgress.markKnown(verb.v1)
  if (verbProgress.isClosed(verb.v1)) {
    if (currentIndex.value >= activeDeck.value.length) currentIndex.value = 0
  } else {
    advance()
  }
}

const onUnknown = () => {
  const verb = currentVerb.value
  if (!verb) return
  verbProgress.markUnknown(verb.v1)
  advance()
}

const verbCard = useTemplateRef<{
  triggerKnown: () => void
  triggerUnknown: () => void
}>('verbCard')

const requestKnown = () => verbCard.value?.triggerKnown()
const requestUnknown = () => verbCard.value?.triggerUnknown()

useFlashcardKeyboard({
  known: requestKnown,
  unknown: requestUnknown,
})

const shuffle = () => {
  const indices = filtered.value.map((_, idx) => idx)
  for (let i = indices.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[indices[i], indices[j]] = [indices[j], indices[i]]
  }
  shuffleOrder.value = indices
  currentIndex.value = 0
}

const resetShuffle = () => {
  shuffleOrder.value = null
  currentIndex.value = 0
}

watch([filtered, cardCount], () => {
  shuffleOrder.value = null
  currentIndex.value = 0
})

const isResetOpen = ref(false)
const confirmReset = () => {
  verbProgress.reset()
  currentIndex.value = 0
  isResetOpen.value = false
}

const refetch = () => {
  void verbsQuery.refetch()
}
</script>

<template>
  <div class="h-full overflow-y-auto md:overflow-hidden">
    <div
      class="mx-auto flex max-w-4xl flex-col gap-4 p-4 pb-20 sm:p-6 sm:pb-20 md:h-full md:overflow-hidden md:pb-6"
    >
      <header class="flex items-start justify-between gap-3">
        <div class="space-y-1">
          <h1 class="text-2xl font-semibold">Неправильные глаголы</h1>
          <p class="text-sm text-slate-400">
            Список с поиском, фильтром по частотности и тренировкой карточками
          </p>
        </div>
        <PageInfo
          title="Неправильные глаголы"
          description="Режим Список — поиск + фильтр по частотности. Режим Карточки — флешкарты с прогрессом: ✓ Знаю (стрелка ←) увеличивает стрик, после 3 ✓ подряд глагол закрывается; ✗ Не знаю (←) сбрасывает. Прогресс сохраняется в localStorage и автоматически очищается с новой датой."
        />
      </header>

      <div v-if="verbsQuery.isLoading.value" class="text-sm text-slate-400">
        Загружаем глаголы…
      </div>

      <div
        v-else-if="verbsQuery.error.value"
        class="flex flex-col gap-2 text-sm text-error-400"
      >
        <p>Ошибка: {{ verbsQuery.error.value.message }}</p>
        <button
          type="button"
          class="self-start rounded-md border border-error-500 px-3 py-1 text-sm hover:bg-error-500/10"
          @click="refetch"
        >
          Повторить
        </button>
      </div>

      <template v-else>
        <div class="inline-flex self-start rounded-md border border-slate-700 bg-slate-900 p-0.5 text-sm">
          <button
            type="button"
            class="rounded px-3 py-1.5 transition"
            :class="
              viewMode === 'list'
                ? 'bg-slate-700 text-slate-50'
                : 'text-slate-400 hover:text-slate-200'
            "
            @click="setMode('list')"
          >
            Список
          </button>
          <button
            type="button"
            class="rounded px-3 py-1.5 transition"
            :class="
              viewMode === 'cards'
                ? 'bg-slate-700 text-slate-50'
                : 'text-slate-400 hover:text-slate-200'
            "
            @click="setMode('cards')"
          >
            Карточки
          </button>
        </div>

        <div class="space-y-3">
          <input
            v-model="query"
            type="search"
            placeholder="Поиск по форме или переводу…"
            class="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:border-vue-500"
          >

          <div class="flex flex-wrap gap-2">
            <label
              v-for="freq in VERB_FREQUENCIES"
              :key="freq"
              class="flex cursor-pointer items-center gap-2 rounded-md border bg-slate-900 px-3 py-1.5 text-xs transition"
              :class="
                selectedFreqs[freq]
                  ? 'border-vue-500 text-slate-100'
                  : 'border-slate-700 text-slate-400'
              "
            >
              <input
                type="checkbox"
                :checked="!!selectedFreqs[freq]"
                class="h-4 w-4 accent-vue-500"
                @change="toggleFreq(freq)"
              >
              <span>{{ VERB_FREQUENCY_LABELS[freq] }}</span>
            </label>
          </div>

          <p class="text-xs text-slate-500">
            Найдено {{ filtered.length }} из {{ verbs.length }}
          </p>
        </div>

        <div
          v-if="filtered.length === 0"
          class="rounded-lg border border-slate-800 bg-slate-900 p-6 text-center text-sm text-slate-400"
        >
          Ничего не нашлось
        </div>

        <VerbsList v-else-if="viewMode === 'list'" :verbs="filtered" />

        <template v-else>
          <div class="flex flex-wrap items-center gap-2 text-xs">
            <span class="text-slate-500">Колода:</span>
            <button
              v-for="option in CARD_COUNT_OPTIONS"
              :key="option.value"
              type="button"
              class="rounded-md border bg-slate-900 px-2.5 py-1 transition"
              :class="
                cardCountKey === option.value
                  ? 'border-vue-500 text-vue-400'
                  : 'border-slate-700 text-slate-400 hover:text-slate-200'
              "
              @click="cardCountKey = option.value"
            >
              {{ option.label }}
            </button>
          </div>

          <div class="flex items-center justify-between gap-2 text-sm text-slate-400">
            <span class="font-medium tabular-nums">
              <template v-if="activeDeck.length > 0">
                {{ currentIndex + 1 }} / {{ activeDeck.length }}
              </template>
              <template v-else-if="deck.length > 0">Все закрыто</template>
              <template v-else>—</template>
              <span v-if="closedCount > 0" class="ml-2 text-xs text-slate-500">
                · закрыто {{ closedCount }}/{{ deck.length }}
              </span>
            </span>
            <div class="flex gap-2">
              <button
                type="button"
                class="rounded-md border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:bg-slate-800"
                @click="shuffle"
              >
                Перемешать
              </button>
              <button
                v-if="shuffleOrder"
                type="button"
                class="rounded-md border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:bg-slate-800"
                @click="resetShuffle"
              >
                Сбросить порядок
              </button>
              <button
                type="button"
                class="rounded-md border border-error-500/50 px-3 py-1 text-xs text-error-400 hover:bg-error-500/10"
                @click="isResetOpen = true"
              >
                Сбросить прогресс
              </button>
            </div>
          </div>

          <div class="flex items-center justify-center md:flex-1">
            <div class="w-full max-w-[380px]">
              <div
                v-if="activeDeck.length === 0 && deck.length > 0"
                class="flex aspect-[5/7] flex-col items-center justify-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center text-slate-300 shadow-xl"
              >
                <div class="text-6xl">🎉</div>
                <div class="text-xl font-semibold">Готово</div>
                <div class="text-sm text-slate-500">
                  Все {{ deck.length }} глаголов закрыты
                </div>
              </div>
              <VerbCard
                v-else-if="currentVerb"
                ref="verbCard"
                :key="currentVerb.v1"
                :verb="currentVerb"
                :streak="verbProgress.getStreak(currentVerb.v1)"
                :required="REQUIRED_VERB_STREAK"
                @known="onKnown"
                @unknown="onUnknown"
              />
            </div>
          </div>

          <BottomControls
            v-if="activeDeck.length > 0"
            @prev="retreat"
            @next="advance"
            @known="requestKnown"
            @unknown="requestUnknown"
          />
        </template>
      </template>
    </div>

    <ConfirmDialog
      v-model:open="isResetOpen"
      title="Стереть сегодняшний прогресс глаголов?"
      description="Все ✓ за сегодня обнулятся — закрытые глаголы вернутся в активную колоду."
      confirm-label="Стереть"
      variant="danger"
      @confirm="confirmReset"
    />
  </div>
</template>
