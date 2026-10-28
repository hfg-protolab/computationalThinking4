<script setup lang="ts">
import type { BoardItem, Corner, Rect } from '~/models/BoardItem'

type Mode = 'move' | Corner

const HANDLE_CLASSES: Record<Corner, string> = {
  nw: 'left-0 top-0 cursor-nwse-resize',
  ne: 'left-full top-0 cursor-nesw-resize',
  sw: 'left-0 top-full cursor-nesw-resize',
  se: 'left-full top-full cursor-nwse-resize',
}

const props = defineProps<{ item: BoardItem; selected: boolean; editing?: boolean }>()
const emit = defineEmits<{
  select: []
  move: [x: number, y: number]
  resize: [corner: Corner, start: Rect, dx: number, dy: number]
}>()

const scale = inject<Ref<number>>('canvasScale', ref(1))

// Only remembers where the current drag started; the item itself is never changed here.
let interaction: { mode: Mode; startX: number; startY: number; start: Rect } | null = null

function startInteraction(event: PointerEvent, mode: Mode) {
  event.stopPropagation()
  emit('select')
  if (props.editing) return
  const { x, y, width, height } = props.item
  interaction = { mode, startX: event.clientX, startY: event.clientY, start: { x, y, width, height } }
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
}

function onPointerMove(event: PointerEvent) {
  if (!interaction) return
  const { mode, start } = interaction
  const dx = (event.clientX - interaction.startX) / scale.value
  const dy = (event.clientY - interaction.startY) / scale.value
  if (mode === 'move') emit('move', start.x + dx, start.y + dy)
  else emit('resize', mode, start, dx, dy)
}

function onPointerUp() {
  interaction = null
}
</script>

<template>
  <div
    class="absolute touch-none"
    :class="[selected ? 'ring-2 ring-blue-300' : '', editing ? 'cursor-text' : 'cursor-move']"
    :style="{ left: `${item.x}px`, top: `${item.y}px`, width: `${item.width}px`, height: `${item.height}px` }"
    @pointerdown="startInteraction($event, 'move')"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
  >
    <slot />

    <template v-if="selected && !editing">
      <div
        v-for="(classes, corner) in HANDLE_CLASSES"
        :key="corner"
        class="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-sm border-2 border-blue-500 bg-background"
        :class="classes"
        @pointerdown="startInteraction($event, corner)"
      />
    </template>
  </div>
</template>
