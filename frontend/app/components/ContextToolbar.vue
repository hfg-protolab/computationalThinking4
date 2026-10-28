<script setup lang="ts">
import type { Component } from 'vue'
import type { StyleAttribute, StyleAttributes } from '~/models/attributes'
import type { BoardItem } from '~/models/BoardItem'
import BoldEditor from '~/components/editors/BoldEditor.vue'
import BorderEditor from '~/components/editors/BorderEditor.vue'
import ColorEditor from '~/components/editors/ColorEditor.vue'
import FontSizeEditor from '~/components/editors/FontSizeEditor.vue'

// Every editor belongs to exactly one attribute.
// The toolbar only shows the editors whose attribute the selected item actually has.
const EDITORS: { attribute: StyleAttribute; component: Component }[] = [
  { attribute: 'color', component: ColorEditor },
  { attribute: 'fontSize', component: FontSizeEditor },
  { attribute: 'bold', component: BoldEditor },
  { attribute: 'border', component: BorderEditor },
]

const props = defineProps<{ item: BoardItem }>()
defineEmits<{ change: [attribute: StyleAttribute, value: StyleAttributes[StyleAttribute]] }>()

const editors = computed(() => EDITORS.filter(editor => editor.attribute in props.item))
const attributes = computed(() => props.item as unknown as StyleAttributes)
</script>

<template>
  <div
    v-if="editors.length"
    class="absolute -mt-3 flex -translate-y-full items-center gap-1 rounded-md border bg-background p-1 shadow-sm"
    :style="{ left: `${item.x}px`, top: `${item.y}px` }"
    @pointerdown.stop
    @dblclick.stop
  >
    <template v-for="(editor, index) in editors" :key="editor.attribute">
      <div v-if="index > 0" class="mx-1 h-5 w-px bg-border" />
      <component
        :is="editor.component"
        :value="attributes[editor.attribute]"
        @change="$emit('change', editor.attribute, $event)"
      />
    </template>
  </div>
</template>
