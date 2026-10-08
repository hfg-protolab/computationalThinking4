<script setup lang="ts">
import type { CanvasObjectEmits, StickyNoteObject } from '~/types/canvas-object'

const props = defineProps<{ object: StickyNoteObject; selected: boolean; editing: boolean }>()
const emit = defineEmits<CanvasObjectEmits>()

// A sticky note only grows downwards when its text needs more room.
function onOverflow(height: number) {
  const { x, y, width } = props.object
  emit('resize', { x, y, width, height })
}
</script>

<template>
  <CanvasObjectFrame
    :object="object"
    :selected="selected"
    :editing="editing"
    :class="STICKY_NOTE_COLORS[object.color]"
    class="shadow-md"
    @grab="(event, mode) => emit('grab', event, mode)"
    @edit="emit('edit')"
  >
    <EditableText
      :text="object.text"
      :editing="editing"
      class="p-4"
      @text="text => emit('text', text)"
      @edit-end="emit('editEnd')"
      @overflow="onOverflow"
    />
  </CanvasObjectFrame>
</template>
