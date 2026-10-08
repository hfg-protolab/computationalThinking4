<script setup lang="ts">
import type { Component } from 'vue'
import type { BoardObject, GestureMode, ObjectTemplate, Rect } from '~/types/canvas-object'
import { CircleShape, StickyNote } from '#components'

// Which component renders which variant of canvas object.
const VARIANTS: Record<BoardObject['type'], Component> = {
  'sticky-note': StickyNote,
  'circle': CircleShape,
}

const { objects, addObject, resizeObject, updateText } = useBoard()

// Local UI state of this user; it is not part of the shared board state.
const scale = ref(1)
const offset = ref({ x: 0, y: 0 })
const selectedId = ref<string | null>(null)
const editingId = ref<string | null>(null)

const gesture = useObjectGesture(scale)

function onGrab(object: BoardObject, event: PointerEvent, mode: GestureMode) {
  selectedId.value = object.id
  if (editingId.value !== object.id) gesture.start(event, object, mode)
}

// New objects appear in the middle of the visible area and open straight into editing.
function onAdd(template: ObjectTemplate) {
  const centerX = (window.innerWidth / 2 - offset.value.x) / scale.value
  const centerY = (window.innerHeight / 2 - offset.value.y) / scale.value
  const id = addObject(template, centerX, centerY)
  selectedId.value = id
  editingId.value = id
}

function onEdit(object: BoardObject) {
  selectedId.value = object.id
  editingId.value = object.id
}
</script>

<template>
  <InfiniteCanvas v-model:scale="scale" v-model:offset="offset" @pointerdown="selectedId = null">
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
  <ObjectToolbar @add="onAdd" />
</template>
