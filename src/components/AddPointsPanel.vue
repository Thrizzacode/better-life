<template>
  <div class="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-6">
    <p class="mb-4 text-xs font-bold uppercase tracking-widest text-neutral-500 font-mono">
      [ LOG NEW STRESS EVENT ]
    </p>

    <!-- Category buttons -->
    <div class="mb-4 grid grid-cols-3 gap-3">
      <button
        v-for="cat in PRESET_CATEGORIES"
        :key="cat.id"
        :id="`add-points-${cat.id}`"
        class="relative flex flex-col items-center gap-2 border-3 border-black py-4 px-2 font-sans transition-all duration-100
               active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
        :class="categoryBtnClass(cat)"
        @click="selectCategory(cat)"
      >
        <!-- Custom point badge -->
        <span
          class="absolute -top-3 -right-2 border-2 border-black px-1.5 py-0.5 text-[0.65rem] font-black text-black font-mono shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
          :class="badgeClass(cat.color)"
        >+{{ cat.points }}</span>
        
        <span
          class="text-3xl leading-none transition-transform duration-100"
          :class="selectedCategory?.id === cat.id ? 'scale-110' : ''"
        >{{ cat.emoji }}</span>
        
        <span class="text-xs font-black uppercase tracking-tight">{{ cat.label }}</span>
      </button>
    </div>

    <!-- Example hint -->
    <Transition
      enter-active-class="transition-all duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      leave-active-class="transition-all duration-100 ease-in"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="selectedCategory" class="mb-4 border-2 border-dashed border-black bg-[#fcfbfa] p-3 text-xs">
        <p class="mb-1 font-bold text-black uppercase font-mono">🔍 常見例子：</p>
        <p class="text-neutral-600 leading-relaxed font-sans">{{ selectedCategory.examples.join('、') }}</p>
      </div>
    </Transition>

    <!-- Note input -->
    <Transition
      enter-active-class="transition-all duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      leave-active-class="transition-all duration-100 ease-in"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="selectedCategory" class="mb-4">
        <textarea
          id="note-input"
          v-model="note"
          :placeholder="`選填：說說發生什麼事？（限字數）`"
          rows="2"
          class="w-full resize-none border-3 border-black bg-white px-4 py-3 text-sm font-semibold text-black
                 placeholder:text-neutral-400 focus:bg-[#fffdf4] focus:outline-none transition-colors"
        ></textarea>
      </div>
    </Transition>

    <!-- Submit Button -->
    <button
      id="submit-points-btn"
      class="w-full border-4 border-black py-4 text-base font-black uppercase transition-all duration-100
             active:translate-x-[3px] active:translate-y-[3px] active:shadow-none disabled:opacity-50 disabled:pointer-events-none"
      :class="selectedCategory
        ? 'bg-[#3b82f6] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#60a5fa]'
        : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'"
      :disabled="!selectedCategory"
      @click="handleSubmit"
    >
      <span v-if="selectedCategory">記上 {{ selectedCategory.points }} 點 {{ selectedCategory.emoji }}</span>
      <span v-else>請先選擇類型</span>
    </button>

    <!-- Success flash -->
    <Transition
      enter-active-class="animate-wiggle"
      leave-active-class="transition-opacity duration-300"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showSuccess"
        class="mt-3 border-3 border-black bg-[#bef264] py-2 text-center text-sm font-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
      >
        ✅ 已記錄！再接再厲 💪
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { usePoints, PRESET_CATEGORIES } from '../composables/usePoints.js'

const { addPoints } = usePoints()
const selectedCategory = ref(null)
const note = ref('')
const showSuccess = ref(false)

function selectCategory(cat) { selectedCategory.value = cat }

function handleSubmit() {
  if (!selectedCategory.value) return
  addPoints(selectedCategory.value.id, note.value)
  note.value = ''
  selectedCategory.value = null
  triggerSuccess()
}

let _timer = null
function triggerSuccess() {
  showSuccess.value = true
  clearTimeout(_timer)
  _timer = setTimeout(() => { showSuccess.value = false }, 2500)
}

// Styling helpers — returns Tailwind class strings
function categoryBtnClass(cat) {
  if (selectedCategory.value?.id !== cat.id) {
    return 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#fcfbfa]'
  }
  const map = {
    teal: 'bg-[#bef264] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[2px] translate-y-[2px]',
    amber: 'bg-[#ffde4d] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[2px] translate-y-[2px]',
    red: 'bg-[#ff5c5c] text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-x-[2px] translate-y-[2px]'
  }
  return map[cat.color] ?? map.teal
}

function badgeClass(color) {
  const map = { teal: 'bg-[#bef264]', amber: 'bg-[#ffde4d]', red: 'bg-[#ff5c5c]' }
  return map[color] ?? 'bg-white'
}
</script>
