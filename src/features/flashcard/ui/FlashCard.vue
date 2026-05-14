<script setup lang="ts">
import { usePreferencesStore } from '@features/preferences'
import type { Word } from '@entities/word'
import { FlipCard } from '@shared/ui'
import { storeToRefs } from 'pinia'
import { computed, useTemplateRef } from 'vue'
import CardFace from './CardFace.vue'

const props = defineProps<{
  word: Word
  position: number
  total: number
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

const preferences = usePreferencesStore()
const { frontSide } = storeToRefs(preferences)

const front = computed(() =>
  frontSide.value === 'en'
    ? { main: props.word.en, sub: props.word.phrase }
    : { main: props.word.translation, sub: props.word.phraseTranslation },
)

const back = computed(() =>
  frontSide.value === 'en'
    ? { main: props.word.translation, sub: props.word.phraseTranslation }
    : { main: props.word.en, sub: props.word.phrase },
)

const hint = computed(() =>
  frontSide.value === 'en'
    ? 'тап — перевернуть · свайп вправо — знаю · влево — не знаю'
    : 'тап — посмотреть слово · свайп вправо — знаю · влево — не знаю',
)
</script>

<template>
  <FlipCard
    ref="flipCard"
    aspect-class="aspect-[5/7]"
    @known="$emit('known')"
    @unknown="$emit('unknown')"
  >
    <template #front>
      <CardFace
        :position="position"
        :total="total"
        :streak="streak"
        :required="required"
        :main="front.main"
        :sub="front.sub"
        :hint="hint"
      />
    </template>
    <template #back>
      <CardFace
        back
        :position="position"
        :total="total"
        :streak="streak"
        :required="required"
        :main="back.main"
        :sub="back.sub"
        hint="tap to flip back"
      />
    </template>
  </FlipCard>
</template>
