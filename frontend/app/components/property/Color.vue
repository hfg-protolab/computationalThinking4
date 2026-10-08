<script setup lang="ts">
import type { CircleObject, StickyNoteObject, StyleChanges } from '~/types/canvas-object'

const props = defineProps<{ object: StickyNoteObject | CircleObject }>()
const emit = defineEmits<{ change: [changes: StyleChanges] }>()

const palette = computed(() => COLOR_PALETTES[props.object.type] ?? {})
const current = computed(() => props.object.color)
</script>

<template>
  <Button
    v-for="(colorClass, color) in palette"
    :key="color"
    variant="ghost"
    size="icon-sm"
    :aria-label="`Color ${color}`"
    @click="emit('change', { color })"
  >
    <span
      class="size-5 border border-black/10"
      :class="[colorClass, 'rounded-xs', color === current ? 'ring-2 ring-blue-400 ring-offset-1' : '']"
    />
  </Button>
</template>
