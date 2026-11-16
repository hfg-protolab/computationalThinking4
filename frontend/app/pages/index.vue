<script setup lang="ts">
import type { Board } from '~/types/board'
import { Pencil as PencilIcon, Plus as PlusIcon, Trash2 as TrashIcon } from '@lucide/vue'

// Overview of all boards: open, create, rename and delete them.
const { boards, load, addBoard, renameBoard, removeBoard } = useBoards()
await load()

async function onAdd() {
  const name = window.prompt('Wie soll das Board heißen?', 'Neues Board')
  if (name) await navigateTo(`/boards/${await addBoard(name)}`)
}

function onRename(board: Board) {
  const name = window.prompt('Neuer Name', board.name)
  if (name && name !== board.name) renameBoard(board.id, name)
}

// Deleting a board also deletes every object on it, so ask first.
function onRemove(board: Board) {
  if (window.confirm(`„${board.name}“ und alles darauf löschen?`)) removeBoard(board.id)
}
</script>

<template>
  <main class="mx-auto max-w-5xl p-8">
    <div class="mb-8 flex items-center justify-between">
      <h1 class="text-2xl font-semibold">
        Boards
      </h1>
      <Button @click="onAdd">
        <PlusIcon />
        Neues Board
      </Button>
    </div>

    <p v-if="!boards.length" class="text-muted-foreground">
      Noch keine Boards – leg das erste an.
    </p>

    <ul class="grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-4">
      <li
        v-for="board in boards"
        :key="board.id"
        class="group relative rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md"
      >
        <NuxtLink :to="`/boards/${board.id}`" class="block p-5 pr-20">
          <span class="block truncate font-medium">{{ board.name }}</span>
          <span class="text-sm text-muted-foreground">{{ new Date(board.createdAt).toLocaleDateString('de-DE') }}</span>
        </NuxtLink>
        <div class="absolute right-2 top-2 flex opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <Button variant="ghost" size="icon-sm" aria-label="Rename board" @click="onRename(board)">
            <PencilIcon />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Delete board" @click="onRemove(board)">
            <TrashIcon />
          </Button>
        </div>
      </li>
    </ul>
  </main>
</template>
