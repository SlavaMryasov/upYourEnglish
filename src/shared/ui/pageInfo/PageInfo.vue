<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'reka-ui'

defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <DialogRoot>
    <DialogTrigger
      class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-vue-500 bg-vue-500/15 text-base font-bold text-vue-400 transition hover:bg-vue-500 hover:text-slate-950"
      aria-label="Info"
    >
      ⓘ
    </DialogTrigger>
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
        <DialogClose
          class="mt-5 inline-flex w-full items-center justify-center rounded-md border border-vue-500 px-3 py-2 text-sm font-semibold text-vue-400 hover:bg-vue-500/10"
        >
          Понятно
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
