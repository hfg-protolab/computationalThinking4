<script setup lang="ts">
import type { Component } from 'vue'
import type { BoardObject, StyleChanges } from '~/types/canvas-object'
import { PropertyBold, PropertyColor, PropertyFontSize } from '#components'

// Registry: one editor per property. A new property only needs a new entry here.
const PROPERTY_EDITORS: { property: keyof StyleChanges; component: Component }[] = [
  { property: 'color', component: PropertyColor },
  { property: 'fontSize', component: PropertyFontSize },
  { property: 'bold', component: PropertyBold },
]

const props = defineProps<{ object: BoardObject }>()
const emit = defineEmits<{ change: [changes: StyleChanges] }>()

// The bar shows exactly the editors for the properties this object has.
const editors = computed(() => PROPERTY_EDITORS.filter(({ property }) => property in props.object))
</script>

<template>
  <!-- mousedown.prevent keeps the text field focused while editing -->
  <div
    v-if="editors.length"
    class="fixed z-10 flex -translate-x-1/2 -translate-y-full items-center gap-1 rounded-xl border bg-white p-1 shadow-lg"
    @mousedown.prevent
  >
    <template v-for="({ property, component }, index) in editors" :key="property">
      <div v-if="index > 0" class="mx-1 h-6 w-px bg-border" />
      <component :is="component" :object="object" @change="(changes: StyleChanges) => emit('change', changes)" />
    </template>
  </div>
</template>
