<script setup lang="ts">
import type { CanvasObjectEmits, CircleObject } from '~/types/canvas-object'

const props = defineProps<{ object: CircleObject; selected: boolean; editing: boolean }>()
const emit = defineEmits<CanvasObjectEmits>()

// A circle stays round, so it grows in both directions when its text needs more room.
function onOverflow(size: number) {
  const { x, y } = props.object
  emit('resize', { x, y, width: size, height: size })
}
</script>

<template>
  <CanvasObjectFrame
    :object="object"
    :selected="selected"
    :editing="editing"
    :class="CIRCLE_COLORS[object.color]"
    class="rounded-full shadow-md"
    @grab="(event, mode) => emit('grab', event, mode)"
    @edit="emit('edit')"
  >
    <EditableText
      :text="object.text"
      :editing="editing"
      :font-size="object.fontSize"
      :bold="object.bold"
      class="p-[15%] text-center"
      @text="text => emit('text', text)"
      @edit-end="emit('editEnd')"
      @overflow="onOverflow"
    />
  </CanvasObjectFrame>
</template>
