<script setup lang="ts">
import { FlashCard, useFlashcardKeyboard, useFlashcardSession } from '@features/flashcard'
import { useProgressStore } from '@features/progress'
import { PageInfo } from '@shared/ui'
import { BottomControls } from '@widgets/bottomControls'
import { CardsHeader } from '@widgets/cardsHeader'
import { CustomPicker } from '@widgets/customPicker'
import { DeckSelector } from '@widgets/deckSelector'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui'
import { ref, useTemplateRef } from 'vue'

const session = useFlashcardSession()
const progressStore = useProgressStore()

const isResetOpen = ref(false)

const confirmReset = () => {
  progressStore.reset()
  isResetOpen.value = false
}
const {
  query,
  progress,
  words,
  deckWords,
  activeWords,
  currentWord,
  completedCount,
  position,
  isCustomPickerMode,
} = session

const flashCard = useTemplateRef<{
  triggerKnown: () => void
  triggerUnknown: () => void
}>('flashCard')

const requestKnown = () => flashCard.value?.triggerKnown()
const requestUnknown = () => flashCard.value?.triggerUnknown()

useFlashcardKeyboard({
  known: requestKnown,
  unknown: requestUnknown,
})
</script>

<template>
  <div v-if="query.isLoading.value" class="flex h-full items-center justify-center text-slate-400">
    Загружаем словарь…
  </div>

  <div
    v-else-if="query.error.value"
    class="flex h-full flex-col items-center justify-center gap-3 text-error-400"
  >
    <p>Ошибка: {{ query.error.value.message }}</p>
    <button
      type="button"
      class="rounded-md border border-error-500 px-3 py-1 text-sm hover:bg-error-500/10"
      @click="() => query.refetch()"
    >
      Повторить
    </button>
  </div>

  <div
    v-else-if="words.length === 0"
    class="flex h-full items-center justify-center text-slate-400"
  >
    Док пустой или формат не распознан
  </div>

  <div v-else class="flex h-full flex-col pb-14 md:pb-0">
    <div class="flex items-center gap-2 border-b border-slate-800 px-4 py-2">
      <h1 class="flex-1 text-sm font-semibold tracking-wide text-slate-300 uppercase">Карточки</h1>
      <button
        type="button"
        class="rounded-md border border-error-500/50 px-2 py-1 text-xs font-medium text-error-400 hover:bg-error-500/10"
        @click="isResetOpen = true"
      >
        Сбросить
      </button>
      <PageInfo
        title="Карточки"
        description="Флешкарты текущей колоды. Тап по карточке — перевернуть. Свайп / стрелка вправо — знаю, влево — не знаю (или кнопки ✓/✗ внизу, или K/N на клавиатуре). Новые слова закрываются после 5 ✓ подряд, повторы — после 3. В режиме «Свободное повторение» — всегда 5 ✓. Прогресс хранится в течение дня и автоматически сбрасывается с новой датой."
      />
    </div>
    <DeckSelector />

    <CustomPicker
      v-if="isCustomPickerMode"
      :words="words"
      @start="session.setCustomIds($event)"
    />

    <template v-else>
      <CardsHeader :completed="completedCount" :total="deckWords.length" />

      <div class="flex min-h-0 flex-1 items-center justify-center p-4">
        <div v-if="deckWords.length === 0" class="text-sm text-slate-400">
          В этой колоде ничего нет
        </div>
        <div
          v-else-if="activeWords.length === 0"
          class="flex flex-col items-center gap-3 text-center text-slate-300"
        >
          <div class="text-6xl">🎉</div>
          <div class="text-xl font-semibold">Готово</div>
          <div class="text-sm text-slate-500">Все {{ deckWords.length }} слов закрыты</div>
        </div>
        <div v-else class="w-full max-w-[280px] max-h-full sm:max-w-[340px]">
          <FlashCard
            v-if="currentWord"
            ref="flashCard"
            :key="currentWord.id"
            :word="currentWord"
            :position="position"
            :total="deckWords.length"
            :streak="progress.getStreak(currentWord.id)"
            :required="session.requiredFor(currentWord.id)"
            @known="session.onKnown"
            @unknown="session.onUnknown"
          />
        </div>
      </div>

      <BottomControls
        v-if="deckWords.length > 0 && activeWords.length > 0"
        @prev="session.retreat"
        @next="session.advance"
        @known="requestKnown"
        @unknown="requestUnknown"
      />
    </template>
  </div>

  <DialogRoot v-model:open="isResetOpen">
    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0 z-40 bg-slate-950/70 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:fade-in"
      />
      <DialogContent
        class="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95"
      >
        <DialogTitle class="text-lg font-semibold text-slate-100">
          Стереть сегодняшний прогресс?
        </DialogTitle>
        <DialogDescription class="mt-3 text-sm leading-relaxed text-slate-300">
          Все ✓ за сегодня обнулятся — закрытые слова станут активными снова. Отменить нельзя.
        </DialogDescription>
        <div class="mt-5 flex gap-2">
          <DialogClose
            class="flex-1 rounded-md border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800"
          >
            Отмена
          </DialogClose>
          <button
            type="button"
            class="flex-1 rounded-md border border-error-500 bg-error-500/10 px-3 py-2 text-sm font-semibold text-error-400 hover:bg-error-500/20"
            @click="confirmReset"
          >
            Стереть
          </button>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
