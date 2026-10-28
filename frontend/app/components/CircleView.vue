<script setup lang="ts">
import type { Circle } from '~/models/Circle'

// select, move and resize fall through to BoardItemFrame.
defineProps<{ circle: Circle; selected: boolean }>()
</script>

<template>
  <BoardItemFrame
    :item="circle"
    :selected="selected"
    class="rounded-full shadow-md"
    :class="BORDER_CLASSES[circle.border]"
    :style="{ backgroundColor: circle.color }"
  />
</template>
