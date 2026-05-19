<template>
  <div class="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
    <div class="mb-5 border-b-2 border-dashed border-black pb-4">
      <p class="text-xs font-bold uppercase tracking-widest text-neutral-500 font-mono">[ SETTINGS ]</p>
    </div>

    <!-- Target points -->
    <div class="mb-6">
      <label class="mb-2 block text-sm font-black uppercase text-black font-sans">🎯 離職目標點數</label>
      <div class="flex gap-3">
        <input
          id="settings-target-input"
          v-model.number="editTarget"
          type="number"
          min="1"
          max="9999"
          class="flex-1 border-3 border-black bg-white px-4 py-2.5 text-lg font-black text-black font-mono
                 focus:bg-[#fffdf4] focus:outline-none transition-colors"
        />
        <button
          id="settings-save-btn"
          class="shrink-0 border-3 border-black bg-[#bef264] px-5 py-2.5 text-sm font-black text-black uppercase
                 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-[2px] active:translate-y-[2px]
                 active:shadow-none hover:bg-[#bef264]/90"
          @click="saveTarget"
        >
          儲存
        </button>
      </div>
      <Transition
        enter-active-class="transition-all duration-150 ease-out"
        enter-from-class="opacity-0 -translate-y-1"
        leave-active-class="transition-opacity duration-300"
        leave-to-class="opacity-0"
      >
        <p v-if="savedMsg" class="mt-2 text-xs font-bold text-green-600 font-mono">✅ TARGET UPDATED SUCCESSFULLY</p>
      </Transition>
    </div>

    <!-- Divider -->
    <div class="my-6 border-t-2 border-dashed border-black"></div>

    <!-- Danger zone -->
    <div>
      <p class="mb-3 text-xs font-bold uppercase tracking-widest text-red-500 font-mono">[ DANGER ZONE ]</p>

      <button
        v-if="!confirmReset"
        id="reset-btn"
        class="w-full border-3 border-black bg-[#ff5c5c]/10 py-3 text-sm font-black text-[#ff5c5c] uppercase
               shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-[2px] active:translate-y-[2px]
               active:shadow-none hover:bg-[#ff5c5c]/25"
        @click="confirmReset = true"
      >
        🗑️ 清除所有紀錄，重新開始
      </button>

      <Transition
        enter-active-class="transition-all duration-150 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        leave-active-class="transition-all duration-100 ease-in"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="confirmReset" class="border-3 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p class="mb-3 text-sm font-extrabold text-red-600 uppercase font-mono">⚠️ 確定要清除所有資料嗎？此操作無法復原。</p>
          <p class="mb-4 text-xs font-bold text-neutral-600">確定要刪除你辛苦累積的怨氣值，重新開始嗎？</p>
          
          <div class="flex gap-3">
            <button
              id="reset-confirm-btn"
              class="flex-1 border-2 border-black bg-[#ff5c5c] py-2 text-sm font-black text-white uppercase
                     shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-[1px] active:translate-y-[1px]
                     active:shadow-none hover:bg-red-600"
              @click="handleReset"
            >
              確定清除
            </button>
            <button
              id="reset-cancel-btn"
              class="flex-1 border-2 border-black bg-white py-2 text-sm font-black text-black uppercase
                     shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-[1px] active:translate-y-[1px]
                     active:shadow-none hover:bg-neutral-50"
              @click="confirmReset = false"
            >
              取消
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { usePoints } from '../composables/usePoints.js'

const { targetPoints, updateTarget, resetAll } = usePoints()
const editTarget = ref(targetPoints.value)
const savedMsg = ref(false)
const confirmReset = ref(false)

let _timer = null

onUnmounted(() => {
  if (_timer) clearTimeout(_timer)
})

function saveTarget() {
  const v = Math.floor(Number(editTarget.value))
  if (isNaN(v) || v < 1 || v > 9999) return
  editTarget.value = v
  updateTarget(v)
  savedMsg.value = true
  clearTimeout(_timer)
  _timer = setTimeout(() => { savedMsg.value = false }, 2500)
}

function handleReset() {
  resetAll()
  confirmReset.value = false
  editTarget.value = 100
}
</script>
