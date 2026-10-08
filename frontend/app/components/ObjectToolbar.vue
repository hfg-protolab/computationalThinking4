<script setup lang="ts">
import type { ObjectTemplate } from '~/types/canvas-object'

const emit = defineEmits<{ add: [template: ObjectTemplate] }>()

// Shapes peek out of the bottom edge and lift up on hover.
const ITEM_CLASS = 'block translate-y-2 shadow-md transition-transform duration-150 hover:translate-y-0'
</script>

<template>
  <div class="fixed bottom-6 left-1/2 flex h-14 -translate-x-1/2 items-end gap-3 overflow-hidden rounded-2xl border bg-white px-5 shadow-xl">
    <button
      v-for="(colorClass, color, index) in STICKY_NOTE_COLORS"
      :key="color"
      :aria-label="`Add ${color} post-it`"
      @click="emit('add', { type: 'sticky-note', color })"
    >
      <span
        class="size-12 rounded-xs"
        :class="[ITEM_CLASS, colorClass, ['-rotate-6', 'rotate-2', 'rotate-6'][index]]"
      />
    </button>

    <div class="mx-2 w-px self-stretch bg-border my-2" />

    <button
      v-for="(colorClass, color) in CIRCLE_COLORS"
      :key="color"
      :aria-label="`Add ${color} circle`"
      @click="emit('add', { type: 'circle', color })"
    >
      <span class="size-11 rounded-full border border-black/10" :class="[ITEM_CLASS, colorClass]" />
    </button>
  </div>
</template>
