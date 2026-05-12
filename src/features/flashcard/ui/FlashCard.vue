<script setup lang="ts">
import type { Word } from '@entities/word'
import { FlipCard } from '@shared/ui'
import { useTemplateRef } from 'vue'
import CardFace from './CardFace.vue'

defineProps<{
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
        :main="word.en"
        :sub="word.phrase"
        hint="тап — перевернуть · свайп вправо — знаю · влево — не знаю"
      />
    </template>
    <template #back>
      <CardFace
        back
        :position="position"
        :total="total"
        :streak="streak"
        :required="required"
        :main="word.translation"
        :sub="word.phraseTranslation"
        hint="tap to flip back"
      />
    </template>
  </FlipCard>
</template>
