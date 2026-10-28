<script setup lang="ts">
import type { BoardItem, Corner, Rect } from '~/models/BoardItem'
import { Circle } from '~/models/Circle'
import { StickyNote } from '~/models/StickyNote'
import { TextItem } from '~/models/TextItem'

const board = useBoard()

// Selection and editing are view state, so they stay local instead of living in the store.
const selectedId = ref<string | null>(null)
const editingId = ref<string | null>(null)
const canvas = useTemplateRef('canvas')

const selectedItem = computed(() => board.items.value.find(item => item.id === selectedId.value))

useShortcuts(selectedId)

// New items appear in the middle of the visible part of the board.
function add(item: BoardItem) {
  const center = canvas.value!.toBoard(window.innerWidth / 2, window.innerHeight / 2)
  selectedId.value = board.addItemAt(item, center.x, center.y)
}

// All item views report the same events; each one becomes a store call or a change of local view state.
function itemEvents(id: string) {
  return {
    select: () => (selectedId.value = id),
    edit: () => (editingId.value = id),
    stopEdit: () => (editingId.value = null),
    move: (x: number, y: number) => board.moveItem(id, x, y),
    resize: (corner: Corner, start: Rect, dx: number, dy: number) => board.resizeItem(id, corner, start, dx, dy),
    grow: (contentHeight: number) => board.growItemToFit(id, contentHeight),
    changeText: (text: string) => board.setText(id, text),
  }
}
</script>

<template>
  <InfiniteCanvas ref="canvas" @pointerdown="selectedId = null">
    <template v-for="item in board.items.value" :key="item.id">
      <StickyNoteView
        v-if="item instanceof StickyNote"
        :note="item"
        :selected="selectedId === item.id"
        :editing="editingId === item.id"
        v-on="itemEvents(item.id)"
      />
      <TextItemView
        v-else-if="item instanceof TextItem"
        :text-item="item"
        :selected="selectedId === item.id"
        :editing="editingId === item.id"
        v-on="itemEvents(item.id)"
      />
      <CircleView
        v-else-if="item instanceof Circle"
        :circle="item"
        :selected="selectedId === item.id"
        v-on="itemEvents(item.id)"
      />
    </template>
    <ContextToolbar
      v-if="selectedItem && editingId !== selectedItem.id"
      :item="selectedItem"
      @change="(attribute, value) => board.setStyle(selectedItem!.id, attribute, value)"
    />
  </InfiniteCanvas>
  <ItemPalette @add="add" />
</template>
