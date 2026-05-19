<template>
  <div class="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
    <div class="mb-5 flex items-center justify-between border-b-2 border-dashed border-black pb-4">
      <p class="text-xs font-bold uppercase tracking-widest text-neutral-500 font-mono">[ HISTORY LOGS ]</p>
      <span class="font-mono text-xs font-bold bg-black text-white px-2 py-0.5">共 {{ logs.length }} 筆</span>
    </div>

    <!-- Empty state -->
    <div v-if="logs.length === 0" class="py-12 text-center">
      <span class="mb-3 block text-5xl animate-brutal-bounce">🕊️</span>
      <p class="text-sm font-bold text-neutral-600 font-mono uppercase">目前一筆都沒有</p>
      <p class="text-xs text-neutral-400 mt-1">Peaceful days. Keep it up!</p>
    </div>

    <!-- Log list -->
    <TransitionGroup
      tag="ul"
      class="space-y-3 p-0"
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      leave-active-class="transition-all duration-200 ease-in"
      leave-to-class="opacity-0 -translate-x-4"
      move-class="transition-transform duration-300"
    >
      <li
        v-for="log in logs"
        :key="log.id"
        :id="`log-${log.id}`"
        class="group flex items-start gap-3 border-2 border-black bg-[#fcfbfa] p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
               transition-all hover:bg-white"
      >
        <!-- Emoji badge -->
        <div
          class="flex size-10 shrink-0 items-center justify-center border-2 border-black text-xl font-bold"
          :class="emojiBgClass(log.categoryId)"
        >{{ log.emoji }}</div>

        <!-- Content -->
        <div class="min-w-0 flex-1">
          <div class="mb-0.5 flex items-center gap-2">
            <span class="text-xs font-black uppercase tracking-wider" :class="categoryColorClass(log.categoryId)">{{ log.categoryLabel }}</span>
            <span class="text-xs font-bold font-mono border border-black px-1 bg-white leading-none shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]" :class="categoryColorClass(log.categoryId)">+{{ log.points }}</span>
          </div>
          <p v-if="log.note" class="truncate text-xs font-semibold text-neutral-800">{{ log.note }}</p>
          <p class="mt-1 text-[0.65rem] font-bold text-neutral-400 font-mono uppercase">{{ formatDate(log.timestamp) }}</p>
        </div>

        <!-- Delete -->
        <button
          :id="`delete-log-${log.id}`"
          class="flex size-8 shrink-0 items-center justify-center border-2 border-black bg-[#ff5c5c] text-white
                 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none hover:bg-red-500"
          title="刪除此紀錄"
          @click="handleDelete(log.id)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
        </button>
      </li>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { usePoints } from '../composables/usePoints.js'

const { logs, deleteLog } = usePoints()

function handleDelete(id) {
  if (window.confirm('確定要刪除這筆紀錄嗎？')) {
    deleteLog(id)
  }
}

function formatDate(iso) {
  const d = new Date(iso)
  const diffMs = Date.now() - d
  const diffMin = Math.max(0, Math.floor(diffMs / 60000))
  if (diffMin < 1) return '剛剛'
  if (diffMin < 60) return `${diffMin} 分鐘前`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr} 小時前`
  return d.toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function emojiBgClass(id) {
  const map = { minor: 'bg-[#bef264]', moderate: 'bg-[#ffde4d]', severe: 'bg-[#ff5c5c]' }
  return map[id] ?? 'bg-white'
}

function categoryColorClass(id) {
  const map = { minor: 'text-green-700', moderate: 'text-amber-700', severe: 'text-red-600' }
  return map[id] ?? 'text-neutral-700'
}
</script>
