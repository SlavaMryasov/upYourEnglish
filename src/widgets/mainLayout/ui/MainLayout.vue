<script setup lang="ts">
import MainSidebar from './MainSidebar.vue'
import MobileTapbar from './MobileTapbar.vue'
</script>

<template>
  <div class="flex h-full">
    <MainSidebar />
    <main class="flex-1 overflow-auto pb-14 md:pb-0">
      <slot />
    </main>
    <MobileTapbar />
  </div>
</template>
