<script setup lang="ts">
// Text field for renaming a board. Enter or clicking elsewhere saves, Escape cancels.
// An empty name is ignored, so the board keeps its old name.
const props = defineProps<{ name: string }>()
const emit = defineEmits<{ done: [name?: string] }>()

const input = useTemplateRef<HTMLInputElement>('input')
// Escape removes the field, which also fires blur; this keeps it from saving afterwards.
let finished = false

onMounted(() => {
  input.value?.focus()
  input.value?.select()
})

function finish(save: boolean) {
  if (finished) return
  finished = true
  const name = input.value?.value.trim()
  emit('done', save && name && name !== props.name ? name : undefined)
}
</script>

<template>
  <input
    ref="input"
    :value="name"
    class="w-full min-w-0 rounded-md bg-white px-1 -mx-1 outline-2 outline-ring"
    aria-label="Board name"
    @keydown.enter="finish(true)"
    @keydown.escape="finish(false)"
    @blur="finish(true)"
  >
</template>
