<script setup lang="ts">
import type { FontSize } from '~/models/attributes'

const LABELS: Record<FontSize, string> = { sm: 'S', md: 'M', lg: 'L' }

defineProps<{ value: FontSize }>()
defineEmits<{ change: [value: FontSize] }>()
</script>

<template>
  <div class="flex gap-1">
    <button
      v-for="(label, size) in LABELS"
      :key="size"
      title="Schriftgröße"
      class="size-7 rounded text-xs font-medium"
      :class="size === value ? 'bg-muted' : 'hover:bg-muted'"
      @click="$emit('change', size)"
    >
      {{ label }}
    </button>
  </div>
</template>
