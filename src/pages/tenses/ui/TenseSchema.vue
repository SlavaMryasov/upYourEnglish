<script setup lang="ts">
import { computed } from 'vue'
import type { TenseAspect, TenseGroup } from '../model/tensesData'

const props = defineProps<{
  group: TenseGroup
  aspect: TenseAspect
}>()

type Mark =
  | { kind: 'dot'; x: number; color: string }
  | { kind: 'bar'; x1: number; x2: number; color: string }

const COLORS = {
  simple: '#42d392',
  continuous: '#60a5fa',
  perfect: '#a78bfa',
} as const

const SCHEMAS: Record<TenseGroup, Record<TenseAspect, Mark[]>> = {
  present: {
    simple: [{ kind: 'dot', x: 50, color: COLORS.simple }],
    continuous: [{ kind: 'bar', x1: 40, x2: 60, color: COLORS.continuous }],
    perfect: [
      { kind: 'bar', x1: 30, x2: 50, color: COLORS.perfect },
      { kind: 'dot', x: 50, color: COLORS.perfect },
    ],
    perfectContinuous: [
      { kind: 'bar', x1: 18, x2: 50, color: COLORS.perfect },
      { kind: 'dot', x: 50, color: COLORS.perfect },
    ],
  },
  past: {
    simple: [{ kind: 'dot', x: 25, color: COLORS.simple }],
    continuous: [{ kind: 'bar', x1: 17, x2: 33, color: COLORS.continuous }],
    perfect: [
      { kind: 'dot', x: 18, color: COLORS.perfect },
      { kind: 'dot', x: 38, color: COLORS.perfect },
    ],
    perfectContinuous: [
      { kind: 'bar', x1: 10, x2: 30, color: COLORS.perfect },
      { kind: 'dot', x: 38, color: COLORS.perfect },
    ],
  },
  future: {
    simple: [{ kind: 'dot', x: 75, color: COLORS.simple }],
    continuous: [{ kind: 'bar', x1: 67, x2: 83, color: COLORS.continuous }],
    perfect: [
      { kind: 'dot', x: 65, color: COLORS.perfect },
      { kind: 'dot', x: 85, color: COLORS.perfect },
    ],
    perfectContinuous: [
      { kind: 'bar', x1: 18, x2: 75, color: COLORS.perfect },
      { kind: 'dot', x: 85, color: COLORS.perfect },
    ],
  },
}

const marks = computed<Mark[]>(() => SCHEMAS[props.group][props.aspect])
</script>

<template>
  <svg
    viewBox="0 0 100 18"
    class="block h-5 w-28 shrink-0"
    aria-hidden="true"
    preserveAspectRatio="xMidYMid meet"
  >
    <line x1="2" y1="9" x2="94" y2="9" stroke="#475569" stroke-width="0.8" />
    <polygon points="94,6.5 94,11.5 98,9" fill="#475569" />
    <g v-for="(mark, idx) in marks" :key="idx">
      <circle v-if="mark.kind === 'dot'" :cx="mark.x" cy="9" r="2.4" :fill="mark.color" />
      <rect
        v-else
        :x="mark.x1"
        y="7"
        :width="mark.x2 - mark.x1"
        height="4"
        rx="1.2"
        :fill="mark.color"
      />
    </g>
    <line x1="50" y1="2" x2="50" y2="16" stroke="#f1f5f9" stroke-width="0.9" />
  </svg>
</template>
