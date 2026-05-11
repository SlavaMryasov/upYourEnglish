<script setup lang="ts">
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  VisuallyHidden,
} from 'reka-ui'
import { navItems } from '../model/navItems'
</script>

<template>
  <DialogPortal>
    <DialogOverlay
      class="fixed inset-0 z-40 bg-slate-950/70 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:fade-in"
    />
    <DialogContent
      class="fixed inset-x-0 bottom-0 z-50 flex flex-col gap-1 rounded-t-2xl border-t border-slate-800 bg-slate-900 p-4 pb-8 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom"
    >
      <VisuallyHidden>
        <DialogTitle>Navigation</DialogTitle>
        <DialogDescription>Pick a section</DialogDescription>
      </VisuallyHidden>
      <div class="mx-auto mb-3 h-1.5 w-10 rounded-full bg-slate-700" />
      <DialogClose
        v-for="item in navItems"
        :key="item.to"
        as-child
      >
        <RouterLink
          :to="item.to"
          active-class="bg-vue-500/10 text-vue-400"
          class="rounded-md px-4 py-3 text-base text-slate-300 hover:bg-slate-800 hover:text-slate-50"
        >
          {{ item.label }}
        </RouterLink>
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
