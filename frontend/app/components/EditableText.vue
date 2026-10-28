<script setup lang="ts">
const props = defineProps<{ text: string; width: number; height: number; editing: boolean; textClass: string }>()
const emit = defineEmits<{ changeText: [text: string]; grow: [contentHeight: number]; stopEdit: [] }>()

const textarea = useTemplateRef<HTMLTextAreaElement>('textarea')
const content = useTemplateRef<HTMLElement>('content')

watch(() => props.editing, async (value) => {
  if (!value) return
  await nextTick()
  textarea.value?.focus()
  textarea.value?.select()
})

// Reports how much height the text needs; the store decides whether the item grows.
async function reportContentHeight() {
  await nextTick()
  const element = textarea.value ?? content.value
  if (element) emit('grow', element.scrollHeight)
}

watch(() => [props.text, props.width, props.height, props.textClass, props.editing], reportContentHeight)
onMounted(reportContentHeight)
</script>

<template>
  <textarea
    v-if="editing"
    ref="textarea"
    class="size-full p-4 bg-transparent resize-none outline-none"
    :class="textClass"
    :value="text"
    @input="emit('changeText', ($event.target as HTMLTextAreaElement).value)"
    @blur="emit('stopEdit')"
    @keydown.escape="emit('stopEdit')"
  />
  <div v-else ref="content" class="size-full p-4 overflow-hidden whitespace-pre-wrap break-words select-none" :class="textClass">
    {{ text }}
  </div>
</template>
