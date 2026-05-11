<script setup lang="ts">
import { FlashCard, useFlashcardKeyboard, useFlashcardSession } from '@features/flashcard'
import { PageInfo } from '@shared/ui'
import { BottomControls } from '@widgets/bottomControls'
import { CardsHeader } from '@widgets/cardsHeader'
import { CustomPicker } from '@widgets/customPicker'
import { DeckSelector } from '@widgets/deckSelector'
import { useTemplateRef } from 'vue'

const session = useFlashcardSession()
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

  <div v-else class="flex h-full flex-col">
    <div class="flex items-center gap-2 border-b border-slate-800 px-4 py-2">
      <h1 class="flex-1 text-sm font-semibold tracking-wide text-slate-300 uppercase">Карточки</h1>
      <PageInfo
        title="Карточки"
        description="Флешкарты текущей колоды. Тап по карточке — перевернуть. Свайп / стрелка вправо — знаю, влево — не знаю (или кнопки ✓/✗ внизу, или K/N на клавиатуре). Новые слова закрываются после 5 ✓ подряд, повторы — после 3. В режиме «Свободное повторение» — всегда 5 ✓."
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

      <div class="flex flex-1 items-center justify-center p-4">
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
        <div v-else class="w-full max-w-[380px]">
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
</template>
