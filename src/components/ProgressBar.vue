<template>
  <div class="mb-6 border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
    <!-- Stats Row -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <p class="mb-1 text-xs font-bold uppercase tracking-widest text-neutral-500 font-mono">
          [ STAMP CARD PROGRESS ]
        </p>
        <div class="flex items-baseline gap-2">
          <span
            class="font-mono text-6xl font-black leading-none transition-colors duration-500 text-black"
          >{{ currentPoints }}</span>
          <span class="font-mono text-xl font-bold text-neutral-400">/ {{ targetPoints }} PTS</span>
        </div>
      </div>

      <div class="sm:text-right">
        <p class="mb-1 text-xs font-bold uppercase tracking-widest text-neutral-500 font-mono">
          {{ hasReachedTarget ? '已達成 🎉' : '還差' }}
        </p>
        <span
          class="border-2 border-black px-3 py-1 text-lg font-extrabold uppercase font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-colors duration-500"
          :class="hasReachedTarget ? 'bg-[#ff5c5c] text-white animate-wiggle' : 'bg-[#ffde4d] text-black'"
        >
          {{ hasReachedTarget ? '離職吧！' : `${remainingPoints} 點` }}
        </span>
      </div>
    </div>

    <!-- Progress Track & Bar -->
    <div class="relative mb-4 h-8 border-4 border-black bg-[#f7f4eb]">
      <div
        class="h-full border-r-4 border-black transition-[width] duration-700 ease-[cubic-bezier(.4,0,.2,1)]"
        :class="barColorClass"
        :style="{ width: `${progressPercent}%` }"
      ></div>
      <!-- Background pattern overlay on progress bar for office ticket texture -->
      <div class="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_8px,rgba(0,0,0,0.05)_8px,rgba(0,0,0,0.05)_16px)] pointer-events-none"></div>
    </div>

    <!-- Level Indicator -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t-2 border-dashed border-black pt-4">
      <div class="flex items-center gap-3">
        <span class="text-3xl leading-none">{{ levelEmoji }}</span>
        <div>
          <p class="text-[0.65rem] font-bold text-neutral-400 uppercase font-mono leading-none mb-1">STRESS STATUS</p>
          <span class="text-sm font-extrabold" :class="scoreTextClass">{{ levelLabel }}</span>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="font-mono text-xs font-bold bg-black text-white px-2 py-0.5">{{ progressPercent.toFixed(1) }}% COMPLETED</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { usePoints } from '../composables/usePoints.js'

const { currentPoints, targetPoints, progressPercent, remainingPoints, hasReachedTarget, progressLevel } = usePoints()

const levelConfig = {
  calm:     { emoji: '😌', label: '目前還算平靜',       textClass: 'text-green-600',  bar: 'bg-[#a3e635]' },
  warning:  { emoji: '😤', label: '火氣開始上升中',     textClass: 'text-amber-600',  bar: 'bg-[#ffde4d]' },
  danger:   { emoji: '😠', label: '已相當不滿，注意！', textClass: 'text-orange-600', bar: 'bg-[#f97316]' },
  critical: { emoji: '🤯', label: '快撐不住了！',       textClass: 'text-red-600',    bar: 'bg-[#ff5c5c]' },
}

const config = computed(() => levelConfig[progressLevel.value] ?? levelConfig.calm)
const scoreTextClass   = computed(() => config.value.textClass)
const barColorClass    = computed(() => config.value.bar)
const levelEmoji       = computed(() => config.value.emoji)
const levelLabel       = computed(() => config.value.label)
</script>
