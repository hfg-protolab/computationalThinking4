<script setup lang="ts">
import { Plus as PlusIcon } from '@lucide/vue'

const { boards, loadBoards, createBoard, renameBoard, deleteBoard } = useBoards()
await loadBoards()

// A new board opens right away; it can be renamed there.
async function onCreate() {
  const board = await createBoard()
  await navigateTo(`/boards/${board.id}`)
}
</script>

<template>
  <!-- Same dotted background as the canvas of a board. -->
  <main
    class="min-h-screen bg-background px-6 py-12 sm:px-12"
    :style="{
      backgroundImage: 'radial-gradient(circle, color-mix(in oklch, var(--muted-foreground) 40%, transparent) 1px, transparent 1px)',
      backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
    }"
  >
    <div class="mx-auto max-w-6xl">
      <h1 class="mb-8 text-3xl font-semibold">Meine Boards</h1>
      <div class="grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-6">
        <button
          class="flex aspect-4/3 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-muted-foreground/30 bg-white/60 text-muted-foreground transition-colors hover:border-muted-foreground/60 hover:bg-white hover:text-foreground"
          @click="onCreate"
        >
          <PlusIcon class="size-8" />
          <span class="font-medium">Neues Board</span>
        </button>
        <BoardTile
          v-for="board in boards"
          :key="board.id"
          :board="board"
          @rename="name => renameBoard(board.id, name)"
          @delete="deleteBoard(board.id)"
        />
      </div>
    </div>
  </main>
</template>
