<script setup lang="ts">
import type { BoardItem } from '~/models/BoardItem'
import { Circle } from '~/models/Circle'
import { StickyNote } from '~/models/StickyNote'
import { TextItem } from '~/models/TextItem'

const emit = defineEmits<{ add: [item: BoardItem] }>()

function addNote(color: string) {
  emit('add', new StickyNote({ x: 0, y: 0, width: GRID_SIZE * 8, height: GRID_SIZE * 8 }, color))
}

function addText() {
  emit('add', new TextItem({ x: 0, y: 0, width: GRID_SIZE * 10, height: GRID_SIZE * 3 }, 'Text'))
}

function addCircle(color: string) {
  emit('add', new Circle({ x: 0, y: 0, width: GRID_SIZE * 6, height: GRID_SIZE * 6 }, color))
}
</script>

<template>
  <div class="fixed bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-xl border bg-background p-2 shadow-lg">
    <button
      v-for="color in NOTE_COLORS"
      :key="color"
      title="Post-it"
      class="size-9 shadow-sm"
      :style="{ backgroundColor: color }"
      @click="addNote(color)"
    />
    <div class="h-6 w-px bg-border" />
    <button title="Text" class="size-9 rounded text-lg font-semibold hover:bg-muted" @click="addText">T</button>
    <div class="h-6 w-px bg-border" />
    <button
      v-for="color in CIRCLE_COLORS"
      :key="color"
      title="Kreis"
      class="size-9 rounded-full shadow-sm"
      :style="{ backgroundColor: color }"
      @click="addCircle(color)"
    />
  </div>
</template>
