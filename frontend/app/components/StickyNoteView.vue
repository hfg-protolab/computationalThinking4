<script setup lang="ts">
import type { StickyNote } from '~/models/StickyNote'

defineProps<{ note: StickyNote; selected: boolean; editing: boolean }>()
// select, move and resize are not declared here, so they fall through to BoardItemFrame.
defineEmits<{ edit: []; stopEdit: []; changeText: [text: string]; grow: [contentHeight: number] }>()
</script>

<template>
  <BoardItemFrame
    :item="note"
    :selected="selected"
    :editing="editing"
    class="shadow-md"
    :style="{ backgroundColor: note.color }"
    @dblclick="$emit('edit')"
  >
    <EditableText
      :text="note.text"
      :width="note.width"
      :height="note.height"
      :editing="editing"
      :text-class="textClasses(note.fontSize, note.bold)"
      @change-text="$emit('changeText', $event)"
      @grow="$emit('grow', $event)"
      @stop-edit="$emit('stopEdit')"
    />
  </BoardItemFrame>
</template>
