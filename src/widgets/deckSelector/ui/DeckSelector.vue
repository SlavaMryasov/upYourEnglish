<script setup lang="ts">
import {
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'
import { useDeckOptions } from '../model/useDeckOptions'

const { options, selectedValue } = useDeckOptions()
</script>

<template>
  <div class="border-b border-slate-800 px-4 py-2">
    <SelectRoot v-model="selectedValue">
      <SelectTrigger
        class="flex w-full items-center justify-between gap-2 rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800 focus-visible:border-vue-500"
      >
        <SelectValue placeholder="Выбери колоду" />
        <SelectIcon class="text-slate-500">▼</SelectIcon>
      </SelectTrigger>
      <SelectPortal>
        <SelectContent
          position="popper"
          :side-offset="6"
          class="z-50 max-h-[400px] min-w-[var(--reka-select-trigger-width)] overflow-hidden rounded-md border border-slate-700 bg-slate-900 shadow-xl"
        >
          <SelectScrollUpButton
            class="flex h-6 items-center justify-center bg-slate-900 text-slate-500"
          >
            ▲
          </SelectScrollUpButton>
          <SelectViewport class="max-h-[360px] overflow-y-auto p-1">
            <SelectItem
              v-for="option in options"
              :key="option.value"
              :value="option.value"
              class="relative flex cursor-pointer items-center rounded px-3 py-2 text-sm text-slate-300 outline-none select-none data-[highlighted]:bg-slate-800 data-[highlighted]:text-slate-50 data-[state=checked]:text-vue-400"
            >
              <SelectItemText>{{ option.label }}</SelectItemText>
              <SelectItemIndicator class="ml-auto pl-2 text-vue-400">✓</SelectItemIndicator>
            </SelectItem>
          </SelectViewport>
          <SelectScrollDownButton
            class="flex h-6 items-center justify-center bg-slate-900 text-slate-500"
          >
            ▼
          </SelectScrollDownButton>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
  </div>
</template>
