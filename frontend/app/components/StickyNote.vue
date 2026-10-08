<script setup lang="ts">
import type { Note } from '~/types/note'
import type { Corner, GestureMode } from '~/composables/useNoteGesture'

const HANDLE_CLASSES: Record<Corner, string> = {
  nw: 'left-0 top-0 cursor-nwse-resize',
  ne: 'left-full top-0 cursor-nesw-resize',
  sw: 'left-0 top-full cursor-nesw-resize',
  se: 'left-full top-full cursor-nwse-resize',
}

// Stateless: everything it shows comes in as props, everything the user does goes out as events.
const props = defineProps<{ note: Note; selected: boolean; editing: boolean }>()
const emit = defineEmits<{
  grab: [event: PointerEvent, mode: GestureMode]
  edit: []
  editEnd: []
  text: [text: string]
  fit: [height: number]
}>()

const textarea = useTemplateRef<HTMLTextAreaElement>('textarea')
const content = useTemplateRef<HTMLElement>('content')

function onPointerDown(event: PointerEvent, mode: GestureMode) {
  event.stopPropagation()
  emit('grab', event, mode)
}

// Asks for more height, snapped to the next grid line, when the text no longer fits.
async function fitToContent() {
  await nextTick()
  const element = textarea.value ?? content.value
  if (!element) return
  const needed = Math.max(MIN_NOTE_SIZE, Math.ceil(element.scrollHeight / GRID_SIZE) * GRID_SIZE)
  if (needed > props.note.height) emit('fit', needed)
}

watch(() => [props.note.text, props.note.width, props.note.height, props.editing], fitToContent)
onMounted(fitToContent)

watch(
  () => props.editing,
  async (editing) => {
    if (!editing) return
    await nextTick()
    textarea.value?.focus()
    textarea.value?.select()
  },
)
</script>

<template>
  <div
    class="absolute bg-yellow-200 shadow-md text-lg touch-none"
    :class="[selected ? 'ring-2 ring-blue-300' : '', editing ? 'cursor-text' : 'cursor-move']"
    :style="{ left: `${note.x}px`, top: `${note.y}px`, width: `${note.width}px`, height: `${note.height}px` }"
    @pointerdown="onPointerDown($event, 'move')"
    @dblclick="emit('edit')"
  >
    <textarea
      v-if="editing"
      ref="textarea"
      class="size-full p-4 bg-transparent resize-none outline-none"
      :value="note.text"
      @input="emit('text', ($event.target as HTMLTextAreaElement).value)"
      @blur="emit('editEnd')"
      @keydown.escape="emit('editEnd')"
    />
    <div v-else ref="content" class="size-full p-4 overflow-hidden whitespace-pre-wrap break-words select-none">
      {{ note.text }}
    </div>

    <template v-if="selected && !editing">
      <div
        v-for="(classes, corner) in HANDLE_CLASSES"
        :key="corner"
        class="absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-sm border-2 border-blue-500 bg-background"
        :class="classes"
        @pointerdown="onPointerDown($event, corner)"
      />
    </template>
  </div>
</template>
