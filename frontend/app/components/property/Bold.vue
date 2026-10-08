<script setup lang="ts">
import { Bold as BoldIcon } from '@lucide/vue'
import type { StyleChanges, TextObject } from '~/types/canvas-object'

defineProps<{ object: TextObject }>()
const emit = defineEmits<{ change: [changes: StyleChanges] }>()
</script>

<template>
  <Button
    variant="ghost"
    size="icon-sm"
    :class="object.bold ? 'bg-muted' : ''"
    aria-label="Bold"
    :aria-pressed="object.bold"
    @click="emit('change', { bold: !object.bold })"
  >
    <BoldIcon />
  </Button>
</template>
