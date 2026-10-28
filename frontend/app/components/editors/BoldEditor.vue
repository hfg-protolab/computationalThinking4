<script setup lang="ts">
defineProps<{ value: boolean }>()
defineEmits<{ change: [value: boolean] }>()
</script>

<template>
  <button
    title="Fett"
    class="size-7 rounded text-sm font-bold"
    :class="value ? 'bg-muted' : 'hover:bg-muted'"
    @click="$emit('change', !value)"
  >
    B
  </button>
</template>
