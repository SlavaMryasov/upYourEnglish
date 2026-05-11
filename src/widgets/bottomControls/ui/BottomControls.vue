<script setup lang="ts">
defineEmits<{
  prev: []
  next: []
  known: []
  unknown: []
}>()
</script>

<template>
  <footer class="flex gap-3 border-t border-slate-800 px-4 py-3">
    <button
      type="button"
      class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-xl text-slate-300 transition hover:bg-slate-800 active:scale-95"
      @click="$emit('prev')"
    >
      ‹
    </button>
    <button
      type="button"
      class="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-error-500 text-base font-semibold text-error-400 transition hover:bg-error-500/10 active:scale-[0.97]"
      @click="$emit('unknown')"
    >
      ✗ не знаю
    </button>
    <button
      type="button"
      class="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-vue-500 text-base font-semibold text-vue-400 transition hover:bg-vue-500/10 active:scale-[0.97]"
      @click="$emit('known')"
    >
      ✓ знаю
    </button>
    <button
      type="button"
      class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-xl text-slate-300 transition hover:bg-slate-800 active:scale-95"
      @click="$emit('next')"
    >
      ›
    </button>
  </footer>
</template>
