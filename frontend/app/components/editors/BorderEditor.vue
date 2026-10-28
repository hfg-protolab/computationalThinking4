<script setup lang="ts">
import type { BorderWidth } from '~/models/attributes'

const OPTIONS: Record<BorderWidth, { title: string; preview: string }> = {
  none: { title: 'Kein Rand', preview: 'border border-dashed border-muted-foreground' },
  thin: { title: 'Dünner Rand', preview: 'border-2 border-foreground' },
  thick: { title: 'Dicker Rand', preview: 'border-4 border-foreground' },
}

defineProps<{ value: BorderWidth }>()
defineEmits<{ change: [value: BorderWidth] }>()
</script>

<template>
  <div class="flex gap-1">
    <button
      v-for="(option, width) in OPTIONS"
      :key="width"
      :title="option.title"
      class="flex size-7 items-center justify-center rounded"
      :class="width === value ? 'bg-muted' : 'hover:bg-muted'"
      @click="$emit('change', width)"
    >
      <span class="size-4 rounded-full" :class="option.preview" />
    </button>
  </div>
</template>
