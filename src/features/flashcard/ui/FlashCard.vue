<script setup lang="ts">
import type { Word } from '@entities/word'
import { animate, Motion, useMotionValue, useTransform } from 'motion-v'
import { ref } from 'vue'
import CardFace from './CardFace.vue'

defineProps<{
  word: Word
  position: number
  total: number
  streak: number
  required: number
}>()

const emit = defineEmits<{
  known: []
  unknown: []
}>()

const isFlipped = ref(false)
const toggleFlip = () => {
  isFlipped.value = !isFlipped.value
}

const x = useMotionValue(0)
const rotate = useTransform(x, [-200, 0, 200], [-12, 0, 12])

const COMMIT_DISTANCE = 100
const COMMIT_VELOCITY = 500
const FLY_OUT = 480
const FLY_OUT_DURATION = 0.22
const SNAP_BACK_DURATION = 0.18

const isAnimating = ref(false)

const flyOut = async (direction: 'right' | 'left') => {
  if (isAnimating.value) return
  isAnimating.value = true
  await animate(x, direction === 'right' ? FLY_OUT : -FLY_OUT, {
    duration: FLY_OUT_DURATION,
    ease: 'easeOut',
  })
  if (direction === 'right') emit('known')
  else emit('unknown')
}

const snapBack = () => animate(x, 0, { duration: SNAP_BACK_DURATION, ease: 'easeOut' })

type DragInfo = {
  offset: { x: number; y: number }
  velocity: { x: number; y: number }
}

const onDragEnd = (_event: PointerEvent, info: DragInfo) => {
  const dx = info.offset.x
  const vx = info.velocity.x
  if (Math.abs(dx) > COMMIT_DISTANCE || Math.abs(vx) > COMMIT_VELOCITY) {
    flyOut(dx > 0 ? 'right' : 'left')
  } else {
    snapBack()
  }
}

defineExpose({
  triggerKnown: () => flyOut('right'),
  triggerUnknown: () => flyOut('left'),
})
</script>

<template>
  <div class="[perspective:1500px]">
    <Motion
      drag="x"
      :drag-snap-to-origin="false"
      :drag-elastic="0.5"
      :drag-momentum="false"
      :style="{ x, rotate, touchAction: 'pan-y' }"
      class="relative aspect-[5/7] w-full cursor-grab select-none active:cursor-grabbing"
      @press="toggleFlip"
      @drag-end="onDragEnd"
    >
      <div
        class="absolute inset-0 transition-transform duration-500 ease-out [transform-style:preserve-3d]"
        :class="isFlipped ? 'rotate-y-180' : ''"
      >
        <CardFace
          :position="position"
          :total="total"
          :streak="streak"
          :required="required"
          :main="word.en"
          :sub="word.phrase"
          hint="тап — перевернуть · свайп вправо — знаю · влево — не знаю"
        />
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
      </div>
    </Motion>
  </div>
</template>
