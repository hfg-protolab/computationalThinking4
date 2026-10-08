<script setup lang="ts">
import type { CanvasObjectEmits, PlainTextObject } from '~/types/canvas-object'

const props = defineProps<{ object: PlainTextObject; selected: boolean; editing: boolean }>()
const emit = defineEmits<CanvasObjectEmits>()

// Plain text grows downwards when it needs more room, like a sticky note.
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
    @grab="(event, mode) => emit('grab', event, mode)"
    @edit="emit('edit')"
  >
    <EditableText
      :text="object.text"
      :editing="editing"
      :font-size="object.fontSize"
      :bold="object.bold"
      class="p-2"
      @text="text => emit('text', text)"
      @edit-end="emit('editEnd')"
      @overflow="onOverflow"
    />
  </CanvasObjectFrame>
</template>
