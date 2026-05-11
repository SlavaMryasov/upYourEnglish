<script setup lang="ts">
import { DialogRoot, DialogTrigger } from 'reka-ui'
import MobileMenuSheet from './MobileMenuSheet.vue'
</script>

<template>
  <DialogRoot>
    <nav
      class="fixed inset-x-0 bottom-0 z-30 flex h-14 items-center justify-center border-t border-slate-800 bg-slate-900 md:hidden"
    >
      <DialogTrigger
        class="flex h-full w-full items-center justify-center gap-2 text-sm font-medium text-slate-200 hover:text-slate-50"
      >
        <span class="text-lg leading-none">≡</span>
        <span>Menu</span>
      </DialogTrigger>
    </nav>
    <MobileMenuSheet />
  </DialogRoot>
</template>
