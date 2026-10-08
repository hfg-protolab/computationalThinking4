<script setup lang="ts">
import { Bold as BoldIcon } from '@lucide/vue'
import type { BoardObject, StyleChanges } from '~/types/canvas-object'

const props = defineProps<{ object: BoardObject }>()
const emit = defineEmits<{ change: [changes: StyleChanges] }>()

// Each variant offers only its own colors.
const colors = computed(() => (props.object.type === 'sticky-note' ? STICKY_NOTE_COLORS : CIRCLE_COLORS))
const swatchShape = computed(() => (props.object.type === 'circle' ? 'rounded-full' : 'rounded-xs'))

const BUTTON_CLASS = 'flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-xs font-medium hover:bg-muted'
</script>

<template>
  <!-- mousedown.prevent keeps the text field focused while editing -->
  <div
    class="fixed z-10 flex -translate-x-1/2 -translate-y-full items-center gap-1 rounded-xl border bg-white p-1 shadow-lg"
    @mousedown.prevent
  >
    <button
      v-for="(colorClass, color) in colors"
      :key="color"
      :class="BUTTON_CLASS"
      :aria-label="`Color ${color}`"
      @click="emit('change', { color })"
    >
      <span
        class="size-5 border border-black/10"
        :class="[colorClass, swatchShape, color === object.color ? 'ring-2 ring-blue-400 ring-offset-1' : '']"
      />
    </button>

    <div class="mx-1 h-6 w-px bg-border" />

    <button
      v-for="(size, label) in FONT_SIZES"
      :key="label"
      :class="[BUTTON_CLASS, size === object.fontSize ? 'bg-muted' : '']"
      :aria-label="`Font size ${label}`"
      @click="emit('change', { fontSize: size })"
    >
      {{ label }}
    </button>

    <div class="mx-1 h-6 w-px bg-border" />

    <button
      :class="[BUTTON_CLASS, object.bold ? 'bg-muted' : '']"
      aria-label="Bold"
      :aria-pressed="object.bold"
      @click="emit('change', { bold: !object.bold })"
    >
      <BoldIcon class="size-4" />
    </button>
  </div>
</template>
