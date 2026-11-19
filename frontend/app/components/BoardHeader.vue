<script setup lang="ts">
import { ArrowLeft as ArrowLeftIcon } from '@lucide/vue'

defineProps<{ name: string }>()
const emit = defineEmits<{ rename: [name: string] }>()

const renaming = ref(false)

function onRenamed(name?: string) {
  renaming.value = false
  if (name) emit('rename', name)
}
</script>

<template>
  <div class="fixed top-6 left-6 z-10 flex h-12 max-w-80 items-center gap-2 rounded-2xl border bg-white pr-4 pl-2 shadow-xl">
    <NuxtLink to="/" class="flex size-8 shrink-0 items-center justify-center rounded-lg hover:bg-muted" aria-label="Back to all boards">
      <ArrowLeftIcon class="size-5" />
    </NuxtLink>
    <BoardNameInput v-if="renaming" class="font-medium" :name="name" @done="onRenamed" />
    <span v-else class="truncate font-medium select-none" title="Doppelklick zum Umbenennen" @dblclick="renaming = true">
      {{ name }}
    </span>
  </div>
</template>
