<script setup lang="ts">
import type { TextItem } from '~/models/TextItem'

defineProps<{ textItem: TextItem; selected: boolean; editing: boolean }>()
// select, move and resize are not declared here, so they fall through to BoardItemFrame.
defineEmits<{ edit: []; stopEdit: []; changeText: [text: string]; grow: [contentHeight: number] }>()
</script>

<template>
  <BoardItemFrame :item="textItem" :selected="selected" :editing="editing" @dblclick="$emit('edit')">
    <EditableText
      :text="textItem.text"
      :width="textItem.width"
      :height="textItem.height"
      :editing="editing"
      :text-class="textClasses(textItem.fontSize, textItem.bold)"
      @change-text="$emit('changeText', $event)"
      @grow="$emit('grow', $event)"
      @stop-edit="$emit('stopEdit')"
    />
  </BoardItemFrame>
</template>
