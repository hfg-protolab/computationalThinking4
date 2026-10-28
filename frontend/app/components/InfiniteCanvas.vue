<script setup lang="ts">
const MIN_SCALE = 0.25
const MAX_SCALE = 4

const offset = reactive({ x: 0, y: 0 })
const scale = ref(1)
provide('canvasScale', scale)
let dragging = false

function zoomAt(pointX: number, pointY: number, factor: number) {
  const nextScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale.value * factor))
  const ratio = nextScale / scale.value
  offset.x = pointX - (pointX - offset.x) * ratio
  offset.y = pointY - (pointY - offset.y) * ratio
  scale.value = nextScale
}

// Trackpad pinch and Ctrl/Cmd + wheel zoom, plain wheel pans.
function onWheel(event: WheelEvent) {
  if (event.ctrlKey || event.metaKey) {
    zoomAt(event.clientX, event.clientY, Math.exp(-event.deltaY * 0.01))
    return
  }
  offset.x -= event.deltaX
  offset.y -= event.deltaY
}

function onPointerDown(event: PointerEvent) {
  dragging = true
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
}

function onPointerMove(event: PointerEvent) {
  if (!dragging) return
  offset.x += event.movementX
  offset.y += event.movementY
}

function onPointerUp() {
  dragging = false
}

// Converts a screen position into board coordinates.
function toBoard(clientX: number, clientY: number) {
  return { x: (clientX - offset.x) / scale.value, y: (clientY - offset.y) / scale.value }
}

defineExpose({ toBoard })
</script>

<template>
  <div
    class="fixed inset-0 overflow-hidden cursor-grab active:cursor-grabbing touch-none bg-background"
    :style="{
      backgroundImage: `radial-gradient(circle, color-mix(in oklch, var(--muted-foreground) 40%, transparent) ${scale}px, transparent ${scale}px)`,
      backgroundSize: `${GRID_SIZE * scale}px ${GRID_SIZE * scale}px`,
      backgroundPosition: `${offset.x - (GRID_SIZE * scale) / 2}px ${offset.y - (GRID_SIZE * scale) / 2}px`,
    }"
    @wheel.prevent="onWheel"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
  >
    <div
      class="absolute top-0 left-0 origin-top-left"
      :style="{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})` }"
    >
      <slot />
    </div>
  </div>
</template>
