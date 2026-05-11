<script setup lang="ts">
import { useEventListener } from '@vueuse/core'
import { computed, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue'
import {
  GRID_CONFIG,
  PATTERN_DATA,
  ROW_COLORS,
  SPEED_CONFIG,
  type BreakoutDifficulty,
  type BreakoutGridSize,
  type BreakoutPattern,
} from '../model/config'

const props = defineProps<{
  pattern: BreakoutPattern
  gridSize: BreakoutGridSize
  difficulty: BreakoutDifficulty
}>()

const VIEW_W = 480
const VIEW_H = 640
const PADDLE_W = 90
const PADDLE_H = 12
const PADDLE_Y = VIEW_H - 36
const BALL_R = 8
const PADDLE_SPEED = 7
const PADDLE_MAX_BOUNCE_SPEED = 7
const TOP_OFFSET = 60

const cols = computed(() => GRID_CONFIG[props.gridSize].cols)
const rows = computed(() => GRID_CONFIG[props.gridSize].rows)
const blockH = computed(() => GRID_CONFIG[props.gridSize].blockH)
const blockMargin = computed(() => GRID_CONFIG[props.gridSize].margin)
const ballSpeed = computed(() => SPEED_CONFIG[props.difficulty])

const canPattern = computed(() => props.gridSize === 'large')

type Block = {
  x: number
  y: number
  w: number
  h: number
  color: string
  alive: boolean
}

type Status = 'ready' | 'playing' | 'won' | 'lost'

const canvasEl = useTemplateRef<HTMLCanvasElement>('canvas')
const status = ref<Status>('ready')
const score = ref(0)
const lives = ref(3)

const paddleX = ref(VIEW_W / 2 - PADDLE_W / 2)
const ballX = ref(VIEW_W / 2)
const ballY = ref(PADDLE_Y - BALL_R)
const ballVx = ref(0)
const ballVy = ref(0)
const blocks = ref<Block[]>([])
const keyState = ref({ left: false, right: false })

const blockColorFor = (row: number, col: number): string => {
  if (props.pattern === 'full' || !canPattern.value) {
    return ROW_COLORS[row % ROW_COLORS.length]
  }
  const data = PATTERN_DATA[props.pattern]
  return data.cells[row][col] === 'X' ? data.fg : data.bg
}

const initBlocks = () => {
  const arr: Block[] = []
  const c = cols.value
  const r = rows.value
  const h = blockH.value
  const m = blockMargin.value
  const blockW = (VIEW_W - m * (c + 1)) / c
  for (let row = 0; row < r; row += 1) {
    for (let col = 0; col < c; col += 1) {
      arr.push({
        x: m + col * (blockW + m),
        y: TOP_OFFSET + row * (h + m),
        w: blockW,
        h,
        color: blockColorFor(row, col),
        alive: true,
      })
    }
  }
  blocks.value = arr
}

const resetBall = () => {
  ballX.value = paddleX.value + PADDLE_W / 2
  ballY.value = PADDLE_Y - BALL_R
  ballVx.value = 0
  ballVy.value = 0
}

const fullReset = () => {
  paddleX.value = VIEW_W / 2 - PADDLE_W / 2
  resetBall()
  score.value = 0
  lives.value = 3
  status.value = 'ready'
  initBlocks()
}

watch([() => props.pattern, () => props.gridSize, () => props.difficulty], fullReset)

const launch = () => {
  if (status.value !== 'ready') return
  const angle = Math.random() * 0.6 - 0.3 - Math.PI / 2
  ballVx.value = Math.cos(angle) * ballSpeed.value
  ballVy.value = Math.sin(angle) * ballSpeed.value
  status.value = 'playing'
}

const draw = (ctx: CanvasRenderingContext2D) => {
  ctx.clearRect(0, 0, VIEW_W, VIEW_H)

  for (const block of blocks.value) {
    if (!block.alive) continue
    ctx.fillStyle = block.color
    ctx.fillRect(block.x, block.y, block.w, block.h)
  }

  ctx.fillStyle = '#cbd5e1'
  ctx.fillRect(paddleX.value, PADDLE_Y, PADDLE_W, PADDLE_H)

  ctx.fillStyle = '#42d392'
  ctx.beginPath()
  ctx.arc(ballX.value, ballY.value, BALL_R, 0, Math.PI * 2)
  ctx.fill()
}

const step = () => {
  if (status.value === 'playing') {
    ballX.value += ballVx.value
    ballY.value += ballVy.value

    if (ballX.value - BALL_R < 0) {
      ballX.value = BALL_R
      ballVx.value = -ballVx.value
    }
    if (ballX.value + BALL_R > VIEW_W) {
      ballX.value = VIEW_W - BALL_R
      ballVx.value = -ballVx.value
    }
    if (ballY.value - BALL_R < 0) {
      ballY.value = BALL_R
      ballVy.value = -ballVy.value
    }

    if (
      ballY.value + BALL_R >= PADDLE_Y &&
      ballY.value + BALL_R <= PADDLE_Y + PADDLE_H &&
      ballX.value >= paddleX.value &&
      ballX.value <= paddleX.value + PADDLE_W &&
      ballVy.value > 0
    ) {
      const hitOffset = (ballX.value - paddleX.value) / PADDLE_W - 0.5
      ballVx.value = hitOffset * PADDLE_MAX_BOUNCE_SPEED * 2
      ballVy.value = -Math.abs(ballVy.value)
    }

    for (const block of blocks.value) {
      if (!block.alive) continue
      if (
        ballX.value + BALL_R >= block.x &&
        ballX.value - BALL_R <= block.x + block.w &&
        ballY.value + BALL_R >= block.y &&
        ballY.value - BALL_R <= block.y + block.h
      ) {
        block.alive = false
        score.value += 10

        const fromLeft = Math.abs(ballX.value - block.x)
        const fromRight = Math.abs(ballX.value - (block.x + block.w))
        const fromTop = Math.abs(ballY.value - block.y)
        const fromBottom = Math.abs(ballY.value - (block.y + block.h))
        const minSide = Math.min(fromLeft, fromRight, fromTop, fromBottom)
        if (minSide === fromTop || minSide === fromBottom) {
          ballVy.value = -ballVy.value
          ballY.value =
            minSide === fromTop ? block.y - BALL_R - 0.5 : block.y + block.h + BALL_R + 0.5
        } else {
          ballVx.value = -ballVx.value
          ballX.value =
            minSide === fromLeft ? block.x - BALL_R - 0.5 : block.x + block.w + BALL_R + 0.5
        }
        break
      }
    }

    if (ballY.value > VIEW_H) {
      lives.value -= 1
      if (lives.value <= 0) {
        status.value = 'lost'
      } else {
        status.value = 'ready'
        resetBall()
      }
    }

    if (blocks.value.every((block) => !block.alive)) {
      status.value = 'won'
    }
  } else if (status.value === 'ready') {
    ballX.value = paddleX.value + PADDLE_W / 2
    ballY.value = PADDLE_Y - BALL_R
  }

  const canvas = canvasEl.value
  if (canvas) {
    const ctx = canvas.getContext('2d')
    if (ctx) draw(ctx)
  }
}

let rafId = 0
const loop = () => {
  if (keyState.value.left) {
    paddleX.value = Math.max(0, paddleX.value - PADDLE_SPEED)
  }
  if (keyState.value.right) {
    paddleX.value = Math.min(VIEW_W - PADDLE_W, paddleX.value + PADDLE_SPEED)
  }
  step()
  rafId = requestAnimationFrame(loop)
}

const onPointerMove = (event: PointerEvent) => {
  const canvas = canvasEl.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  const scale = VIEW_W / rect.width
  const localX = (event.clientX - rect.left) * scale
  paddleX.value = Math.max(0, Math.min(VIEW_W - PADDLE_W, localX - PADDLE_W / 2))
}

const onPointerDown = (event: PointerEvent) => {
  onPointerMove(event)
  if (status.value === 'ready') {
    launch()
  } else if (status.value === 'won' || status.value === 'lost') {
    fullReset()
  }
}

useEventListener(window, 'keydown', (event: KeyboardEvent) => {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return
  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault()
      keyState.value.left = true
      break
    case 'ArrowRight':
      event.preventDefault()
      keyState.value.right = true
      break
    case ' ':
    case 'Spacebar':
      event.preventDefault()
      if (status.value === 'ready') launch()
      else if (status.value === 'won' || status.value === 'lost') fullReset()
      break
    default:
      break
  }
})

useEventListener(window, 'keyup', (event: KeyboardEvent) => {
  if (event.key === 'ArrowLeft') keyState.value.left = false
  if (event.key === 'ArrowRight') keyState.value.right = false
})

onMounted(() => {
  initBlocks()
  rafId = requestAnimationFrame(loop)
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
})
</script>

<template>
  <div class="mx-auto w-full max-w-md space-y-3">
    <header class="flex items-center justify-between text-sm text-slate-300">
      <span>
        Очки: <span class="font-semibold text-vue-400 tabular-nums">{{ score }}</span>
      </span>
      <span class="text-slate-500">
        {{ '♥'.repeat(lives) }}{{ '♡'.repeat(Math.max(0, 3 - lives)) }}
      </span>
      <button
        type="button"
        class="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-300 hover:bg-slate-800"
        @click="fullReset"
      >
        Заново
      </button>
    </header>

    <div class="relative">
      <canvas
        ref="canvas"
        :width="VIEW_W"
        :height="VIEW_H"
        class="block h-auto w-full touch-none rounded-lg border border-slate-800 bg-slate-950 select-none"
        @pointermove="onPointerMove"
        @pointerdown="onPointerDown"
      />

      <div
        v-if="status === 'ready'"
        class="pointer-events-none absolute inset-0 flex items-end justify-center pb-24 text-sm text-slate-400"
      >
        Тапни / кликни / пробел — запустить шарик
      </div>
      <div
        v-else-if="status === 'won'"
        class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-vue-400"
      >
        <div class="text-4xl">🎉</div>
        <div class="text-xl font-semibold">Победа!</div>
        <div class="text-sm text-slate-400">Тапни, чтобы начать заново</div>
      </div>
      <div
        v-else-if="status === 'lost'"
        class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-error-400"
      >
        <div class="text-4xl">💥</div>
        <div class="text-xl font-semibold">Game over</div>
        <div class="text-sm text-slate-400">Очки: {{ score }}. Тапни, чтобы начать заново</div>
      </div>
    </div>
  </div>
</template>
