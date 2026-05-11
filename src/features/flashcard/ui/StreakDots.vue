<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  streak: number
  required: number
}>()

const dots = computed(() =>
  Array.from({ length: props.required }, (_, index) => index < props.streak),
)
</script>

<template>
  <div class="flex gap-1">
    <span
      v-for="(filled, index) in dots"
      :key="index"
      class="h-2 w-2 rounded-full transition-colors"
      :class="filled ? 'bg-vue-500' : 'bg-slate-700'"
    />
  </div>
</template>
