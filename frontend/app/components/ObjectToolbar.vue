<script setup lang="ts">
import { Type as TypeIcon } from '@lucide/vue'
import type { ObjectTemplate } from '~/types/canvas-object'

const emit = defineEmits<{ add: [template: ObjectTemplate] }>()

// Sticky notes peek out of the bottom edge and lift up on hover.
const NOTE_CLASS = 'block size-12 translate-y-2 rounded-xs shadow-md transition-transform duration-150 hover:translate-y-0'
const NOTE_TILTS = ['-rotate-6', 'rotate-2', 'rotate-6']
</script>

<template>
  <div class="fixed bottom-6 left-1/2 flex h-14 -translate-x-1/2 items-end gap-3 overflow-hidden rounded-2xl border bg-white px-5 shadow-xl">
    <button
      v-for="(colorClass, color, index) in STICKY_NOTE_COLORS"
      :key="color"
      :aria-label="`Add ${color} post-it`"
      @click="emit('add', { type: 'sticky-note', color })"
    >
      <span :class="[NOTE_CLASS, colorClass, NOTE_TILTS[index]]" />
    </button>

    <div class="mx-2 w-px self-stretch bg-border my-2" />

    <button
      class="mb-2 flex size-10 items-center justify-center rounded-lg hover:bg-muted"
      aria-label="Add text"
      @click="emit('add', { type: 'text' })"
    >
      <TypeIcon class="size-6" />
    </button>

    <div class="mx-2 w-px self-stretch bg-border my-2" />

    <button
      v-for="(colorClass, color) in CIRCLE_COLORS"
      :key="color"
      :aria-label="`Add ${color} circle`"
      @click="emit('add', { type: 'circle', color })"
    >
      <span
        class="block size-10 translate-y-2 rounded-full border border-black/10 shadow-md transition-transform duration-150 hover:translate-y-0"
        :class="colorClass"
      />
    </button>
  </div>
</template>
