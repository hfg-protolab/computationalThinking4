<script setup lang="ts">
import type { StyleChanges, TextObject } from '~/types/canvas-object'

defineProps<{ object: TextObject }>()
const emit = defineEmits<{ change: [changes: StyleChanges] }>()
</script>

<template>
  <Button
    v-for="(size, label) in FONT_SIZES"
    :key="label"
    variant="ghost"
    size="sm"
    :class="size === object.fontSize ? 'bg-muted' : ''"
    :aria-label="`Font size ${label}`"
    @click="emit('change', { fontSize: size })"
  >
    {{ label }}
  </Button>
</template>
