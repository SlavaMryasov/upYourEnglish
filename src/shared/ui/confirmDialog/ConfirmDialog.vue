<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
} from 'reka-ui'

withDefaults(
  defineProps<{
    open: boolean
    title: string
    description: string
    confirmLabel?: string
    cancelLabel?: string
    variant?: 'default' | 'danger'
  }>(),
  {
    confirmLabel: 'Подтвердить',
    cancelLabel: 'Отмена',
    variant: 'default',
  },
)

const emit = defineEmits<{
  'update:open': [value: boolean]
  confirm: []
}>()
</script>

<template>
  <DialogRoot :open="open" @update:open="(value) => emit('update:open', value)">
    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0 z-40 bg-slate-950/70 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:fade-in"
      />
      <DialogContent
        class="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95"
      >
        <DialogTitle class="text-lg font-semibold text-slate-100">{{ title }}</DialogTitle>
        <DialogDescription class="mt-3 text-sm leading-relaxed text-slate-300">
          {{ description }}
        </DialogDescription>
        <div class="mt-5 flex gap-2">
          <DialogClose
            class="flex-1 rounded-md border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800"
          >
            {{ cancelLabel }}
          </DialogClose>
          <button
            type="button"
            class="flex-1 rounded-md px-3 py-2 text-sm font-semibold"
            :class="
              variant === 'danger'
                ? 'border border-error-500 bg-error-500/10 text-error-400 hover:bg-error-500/20'
                : 'border border-vue-500 bg-vue-500/10 text-vue-400 hover:bg-vue-500/20'
            "
            @click="emit('confirm')"
          >
            {{ confirmLabel }}
          </button>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
