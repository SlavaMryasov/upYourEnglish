<script setup lang="ts">
import { bottomNavItems, navItems } from '../model/navItems'
</script>

<template>
  <aside
    class="hidden w-52 shrink-0 flex-col gap-1 border-r border-slate-800 bg-slate-900 p-4 md:flex"
  >
    <div class="mb-4 flex items-center gap-2 px-2">
      <span class="text-lg leading-none text-vue-500">▲</span>
      <span class="text-sm font-semibold tracking-wide text-slate-300">
        Up Your English
      </span>
    </div>
    <nav class="flex flex-col gap-1">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        active-class="bg-vue-500/10 text-vue-400"
        class="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-slate-50"
      >
        <component :is="item.icon" class="h-4 w-4 shrink-0" :stroke-width="1.75" />
        <span>{{ item.label }}</span>
      </RouterLink>

      <div class="h-9" aria-hidden="true" />

      <RouterLink
        v-for="item in bottomNavItems"
        :key="item.to"
        :to="item.to"
        active-class="bg-vue-500/10 text-vue-400"
        class="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-slate-50"
      >
        <component :is="item.icon" class="h-4 w-4 shrink-0" :stroke-width="1.75" />
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>
