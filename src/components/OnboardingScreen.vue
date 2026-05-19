<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#f7f4eb] font-sans">
    <!-- Ambient layout Grid lines or decorative elements -->
    <div class="absolute inset-0 bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>

    <div class="relative z-10 w-full max-w-md border-4 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform">
      <!-- Top stamp pattern border -->
      <div class="absolute -top-3 left-4 right-4 flex justify-between">
        <div v-for="i in 8" :key="i" class="size-6 rounded-full border-2 border-black bg-[#f7f4eb]"></div>
      </div>

      <!-- Icon + heading -->
      <div class="mt-4 mb-8 text-center">
        <div class="mx-auto mb-4 flex size-20 items-center justify-center border-4 border-black bg-[#ffde4d] text-4xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-brutal-bounce">
          🎯
        </div>
        <h1 class="text-4xl font-extrabold uppercase tracking-tight text-black mb-3">
          離職集點卡
        </h1>
        <p class="text-sm font-semibold leading-relaxed text-neutral-700">
          每一次的忍耐，都值得為自己蓋一個章。<br />
          集滿目標點數，就勇敢遞出辭呈吧！
        </p>
      </div>

      <!-- Info ticket details -->
      <div class="mb-6 border-2 border-dashed border-black bg-[#fcfbfa] p-4 text-xs font-mono">
        <p class="font-bold text-black uppercase mb-1">📌 如何設定目標點數？</p>
        <p class="text-neutral-600 leading-relaxed">
          1 點 = 微阿雜 (抱怨一下就好)<br />
          3 點 = 有點火大 (心情受影響)<br />
          5 點 = 考慮翻桌 (理智線差點斷掉)<br />
          建議目標設定在 <span class="font-bold text-red-500">50 ~ 200 點</span>。
        </p>
      </div>

      <!-- Input Form -->
      <div class="mb-6">
        <label class="mb-2 block text-sm font-bold text-black uppercase tracking-wide">我的離職目標點數</label>
        <div class="relative">
          <input
            id="target-points-input"
            v-model.number="targetInput"
            type="number"
            min="1"
            max="9999"
            placeholder="100"
            class="w-full border-4 border-black bg-white px-4 py-3 text-center text-3xl font-black text-black font-mono
                   placeholder:text-neutral-300 focus:bg-[#fffdf4] focus:outline-none transition-colors"
            @keydown.enter="handleSubmit"
          />
          <span class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold uppercase text-black font-mono">POINTS</span>
        </div>
        <p v-if="error" class="mt-2 text-center text-xs font-bold text-red-600 uppercase">{{ error }}</p>
      </div>

      <!-- Preset shortcuts -->
      <div class="mb-8 flex gap-2">
        <button
          v-for="p in presets"
          :key="p"
          :id="`preset-${p}`"
          class="flex-1 border-3 border-black py-2 text-sm font-black font-mono transition-all
                 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          :class="targetInput === p
            ? 'bg-[#ff5c5c] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
            : 'bg-[#a3e635] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#bef264]'"
          @click="targetInput = p"
        >
          {{ p }}
        </button>
      </div>

      <!-- Submit -->
      <button
        id="onboarding-submit-btn"
        class="w-full border-4 border-black py-4 text-xl font-extrabold uppercase transition-all
               active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:opacity-50 disabled:pointer-events-none"
        :class="isValid
          ? 'bg-[#3b82f6] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#60a5fa]'
          : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'"
        :disabled="!isValid"
        @click="handleSubmit"
      >
        開始蓋章 🚀
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePoints } from '../composables/usePoints.js'

const { completeOnboarding } = usePoints()

const presets = [50, 100, 150, 200]
const targetInput = ref(100)
const error = ref('')

const isValid = computed(() => {
  const v = Number(targetInput.value)
  return Number.isInteger(v) && v >= 1 && v <= 9999
})

function handleSubmit() {
  const v = Number(targetInput.value)
  if (!v || v < 1) { error.value = '請輸入至少 1 點'; return }
  if (v > 9999)    { error.value = '最多 9999 點';    return }
  error.value = ''
  completeOnboarding(v)
}
</script>
