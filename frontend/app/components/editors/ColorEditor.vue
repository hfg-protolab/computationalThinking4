<script setup lang="ts">
defineProps<{ value: string }>()
defineEmits<{ change: [value: string] }>()
</script>

<template>
  <div class="flex gap-1 px-1">
    <button
      v-for="color in COLORS"
      :key="color"
      title="Farbe"
      class="size-5 rounded-full border"
      :class="color === value ? 'ring-2 ring-blue-500 ring-offset-1' : ''"
      :style="{ backgroundColor: color }"
      @click="$emit('change', color)"
    />
  </div>
</template>
