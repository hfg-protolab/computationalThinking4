<script setup lang="ts">
import type { Component } from 'vue'
import type { BoardObject, GestureMode, Rect } from '~/types/canvas-object'
import { CircleShape, StickyNote } from '#components'

// Which component renders which variant of canvas object.
const VARIANTS: Record<BoardObject['type'], Component> = {
  'sticky-note': StickyNote,
  'circle': CircleShape,
}

const { objects, resizeObject, updateText } = useBoard()

// Local UI state of this user; it is not part of the shared board state.
const scale = ref(1)
const selectedId = ref<string | null>(null)
const editingId = ref<string | null>(null)

const gesture = useObjectGesture(scale)

function onGrab(object: BoardObject, event: PointerEvent, mode: GestureMode) {
  selectedId.value = object.id
  if (editingId.value !== object.id) gesture.start(event, object, mode)
}

function onEdit(object: BoardObject) {
  selectedId.value = object.id
  editingId.value = object.id
}
</script>

<template>
  <InfiniteCanvas v-model:scale="scale" @pointerdown="selectedId = null">
    <component
      :is="VARIANTS[object.type]"
      v-for="object in objects"
      :key="object.id"
      :object="object"
      :selected="object.id === selectedId"
      :editing="object.id === editingId"
      @grab="(event: PointerEvent, mode: GestureMode) => onGrab(object, event, mode)"
      @edit="onEdit(object)"
      @edit-end="editingId = null"
      @text="(text: string) => updateText(object.id, text)"
      @resize="(rect: Rect) => resizeObject(object.id, rect)"
    />
  </InfiniteCanvas>
</template>
