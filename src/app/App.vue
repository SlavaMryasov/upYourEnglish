<script setup lang="ts">
import { routes } from '@shared/config'
</script>

<template>
  <div class="flex h-full flex-col">
    <nav class="flex gap-4 border-b border-white/10 p-4 text-sm">
      <RouterLink :to="routes.cards" class="hover:underline">Cards</RouterLink>
      <RouterLink :to="routes.allWords" class="hover:underline">All words</RouterLink>
      <RouterLink :to="routes.learned" class="hover:underline">Learned</RouterLink>
      <RouterLink :to="routes.unlearned" class="hover:underline">Unlearned</RouterLink>
    </nav>
    <main class="flex-1">
      <RouterView />
    </main>
  </div>
</template>
