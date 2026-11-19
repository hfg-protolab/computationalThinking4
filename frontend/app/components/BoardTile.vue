<script setup lang="ts">
import { Ellipsis as EllipsisIcon, Pencil as PencilIcon, Trash2 as TrashIcon } from '@lucide/vue'
import type { Board } from '~/types/board'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

const props = defineProps<{ board: Board }>()
const emit = defineEmits<{ rename: [name: string]; delete: [] }>()

const renaming = ref(false)
const confirmingDelete = ref(false)
const createdOn = computed(() => new Date(props.board.createdAt).toLocaleDateString('de-DE'))

function onRenamed(name?: string) {
  renaming.value = false
  if (name) emit('rename', name)
}

// The menu usually gives focus back to the ⋯ button when it closes. That would take it
// away from the name field or the dialog that the menu just opened.
function onMenuClosed(event: Event) {
  if (renaming.value || confirmingDelete.value) event.preventDefault()
}
</script>

<template>
  <div class="group relative flex aspect-4/3 flex-col justify-end rounded-2xl border bg-white p-4 shadow-md transition-shadow hover:shadow-xl">
    <!-- The link covers the whole tile; the texts let clicks through to it. -->
    <NuxtLink :to="`/boards/${board.id}`" class="absolute inset-0 rounded-2xl" :aria-label="`Open ${board.name}`" />

    <BoardNameInput v-if="renaming" class="relative font-medium" :name="board.name" @done="onRenamed" />
    <p v-else class="pointer-events-none truncate font-medium">{{ board.name }}</p>
    <p class="pointer-events-none text-sm text-muted-foreground">erstellt am {{ createdOn }}</p>

    <DropdownMenu :modal="false">
      <DropdownMenuTrigger as-child>
        <button
          class="absolute top-2 right-2 flex size-8 items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 hover:bg-muted focus-visible:opacity-100 data-[state=open]:opacity-100"
          aria-label="Board options"
        >
          <EllipsisIcon class="size-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" class="w-auto" @close-auto-focus="onMenuClosed">
        <DropdownMenuItem @select="renaming = true">
          <PencilIcon /> Umbenennen
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" @select="confirmingDelete = true">
          <TrashIcon /> Löschen
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <AlertDialog v-model:open="confirmingDelete">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>„{{ board.name }}“ löschen?</AlertDialogTitle>
          <AlertDialogDescription>Alles auf diesem Board ist dann für immer weg.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
          <AlertDialogAction variant="destructive" @click="emit('delete')">Löschen</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
