<script setup lang="ts">
import type { CanvasObject, Corner, GestureMode } from '~/types/canvas-object'

const HANDLE_CLASSES: Record<Corner, string> = {
  nw: 'left-0 top-0 cursor-nwse-resize',
  ne: 'left-full top-0 cursor-nesw-resize',
  sw: 'left-0 top-full cursor-nesw-resize',
  se: 'left-full top-full cursor-nwse-resize',
}

// Base component: position, selection, dragging and resize handles shared by every variant.
// Variants pass their look via `class` and their content via the default slot.
defineProps<{ object: CanvasObject; selected: boolean; editing: boolean }>()
const emit = defineEmits<{ grab: [event: PointerEvent, mode: GestureMode]; edit: [] }>()

function onPointerDown(event: PointerEvent, mode: GestureMode) {
  event.stopPropagation()
  emit('grab', event, mode)
}
</script>

<template>
  <div
    class="absolute touch-none"
    :class="[selected ? 'ring-2 ring-blue-300' : '', editing ? 'cursor-text' : 'cursor-move']"
    :style="{ left: `${object.x}px`, top: `${object.y}px`, width: `${object.width}px`, height: `${object.height}px` }"
    @pointerdown="onPointerDown($event, 'move')"
    @dblclick="emit('edit')"
  >
    <slot />

    <template v-if="selected && !editing">
      <div
        v-for="(classes, corner) in HANDLE_CLASSES"
        :key="corner"
        class="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-sm border-2 border-blue-500 bg-background"
        :class="classes"
        @pointerdown="onPointerDown($event, corner)"
      />
    </template>
  </div>
</template>
