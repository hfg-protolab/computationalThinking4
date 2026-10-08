<script setup lang="ts">
const props = defineProps<{ text: string; editing: boolean }>()
const emit = defineEmits<{ text: [text: string]; editEnd: []; overflow: [height: number] }>()

const root = useTemplateRef<HTMLElement>('root')
const textarea = useTemplateRef<HTMLTextAreaElement>('textarea')
const content = useTemplateRef<HTMLElement>('content')

// Reports the height (snapped up to the grid) the text needs when it no longer fits.
async function checkOverflow() {
  await nextTick()
  const inner = textarea.value ?? content.value
  if (!root.value || !inner) return
  const needed = root.value.clientHeight - inner.clientHeight + inner.scrollHeight
  if (needed > root.value.clientHeight) emit('overflow', ceilToGrid(needed))
}

let observer: ResizeObserver | undefined
onMounted(() => {
  observer = new ResizeObserver(checkOverflow)
  observer.observe(root.value!)
})
onBeforeUnmount(() => observer?.disconnect())
watch(() => [props.text, props.editing], checkOverflow)

watch(
  () => props.editing,
  async (editing) => {
    if (!editing) return
    await nextTick()
    textarea.value?.focus()
    textarea.value?.select()
  },
  { immediate: true },
)
</script>

<template>
  <div ref="root" class="size-full overflow-hidden text-lg">
    <textarea
      v-if="editing"
      ref="textarea"
      class="block size-full bg-transparent resize-none outline-none"
      :value="text"
      @input="emit('text', ($event.target as HTMLTextAreaElement).value)"
      @blur="emit('editEnd')"
      @keydown.escape="emit('editEnd')"
    />
    <div v-else ref="content" class="size-full overflow-hidden whitespace-pre-wrap break-words select-none">
      {{ text }}
    </div>
  </div>
</template>
