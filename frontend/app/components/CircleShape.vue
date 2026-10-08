<script setup lang="ts">
import type { CanvasObjectEmits, CircleObject } from '~/types/canvas-object'

defineProps<{ object: CircleObject; selected: boolean; editing: boolean }>()
const emit = defineEmits<CanvasObjectEmits>()
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
  />
</template>
