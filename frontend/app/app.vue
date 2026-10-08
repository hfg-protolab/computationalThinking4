<script setup lang="ts">
import type { Component } from 'vue'
import type { BoardObject, GestureMode, ObjectTemplate, Rect } from '~/types/canvas-object'
import { CircleShape, PlainText, StickyNote } from '#components'

// Which component renders which variant of canvas object.
const VARIANTS: Record<BoardObject['type'], Component> = {
  'sticky-note': StickyNote,
  'text': PlainText,
  'circle': CircleShape,
}

const { objects, addObject, resizeObject, updateText, updateStyle } = useBoard()

// Local UI state of this user; it is not part of the shared board state.
const scale = ref(1)
const offset = ref({ x: 0, y: 0 })
const selectedId = ref<string | null>(null)
const editingId = ref<string | null>(null)

const gesture = useObjectGesture(scale)
useShortcuts(selectedId, editingId)

const selectedObject = computed(() => objects.value.find(object => object.id === selectedId.value))

// The context bar lives in screen space, centered above the selected object.
const contextBarPosition = computed(() => {
  const object = selectedObject.value
  if (!object) return {}
  const left = offset.value.x + (object.x + object.width / 2) * scale.value
  const top = offset.value.y + object.y * scale.value - 12
  return { left: `${left}px`, top: `${top}px` }
})

function onGrab(object: BoardObject, event: PointerEvent, mode: GestureMode) {
  selectedId.value = object.id
  if (editingId.value !== object.id) gesture.start(event, object, mode)
}

// New objects appear in the middle of the visible area and open straight into editing if they have text.
function onAdd(template: ObjectTemplate) {
  const centerX = (window.innerWidth / 2 - offset.value.x) / scale.value
  const centerY = (window.innerHeight / 2 - offset.value.y) / scale.value
  const id = addObject(template, centerX, centerY)
  onEdit(objects.value.find(object => object.id === id)!)
}

function onEdit(object: BoardObject) {
  selectedId.value = object.id
  if ('text' in object) editingId.value = object.id
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
  <ObjectContextBar
    v-if="selectedObject"
    :object="selectedObject"
    :style="contextBarPosition"
    @change="changes => updateStyle(selectedObject!.id, changes)"
  />
  <ObjectToolbar @add="onAdd" />
</template>
