<script setup lang="ts">
import type { Note } from '~/types/note'
import type { GestureMode } from '~/composables/useNoteGesture'

const { notes, resizeNote, updateText } = useBoard()

// Local UI state of this user; it is not part of the shared board state.
const scale = ref(1)
const selectedId = ref<string | null>(null)
const editingId = ref<string | null>(null)

const gesture = useNoteGesture(scale)

function onGrab(note: Note, event: PointerEvent, mode: GestureMode) {
  selectedId.value = note.id
  if (editingId.value !== note.id) gesture.start(event, note, mode)
}

function onEdit(note: Note) {
  selectedId.value = note.id
  editingId.value = note.id
}

function onFit(note: Note, height: number) {
  resizeNote(note.id, { x: note.x, y: note.y, width: note.width, height })
}
</script>

<template>
  <InfiniteCanvas v-model:scale="scale" @pointerdown="selectedId = null">
    <StickyNote
      v-for="note in notes"
      :key="note.id"
      :note="note"
      :selected="note.id === selectedId"
      :editing="note.id === editingId"
      @grab="(event, mode) => onGrab(note, event, mode)"
      @edit="onEdit(note)"
      @edit-end="editingId = null"
      @text="text => updateText(note.id, text)"
      @fit="height => onFit(note, height)"
    />
  </InfiniteCanvas>
</template>
