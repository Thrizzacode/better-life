import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'resignation-tracker-v1'

// Default preset categories with weights
export const PRESET_CATEGORIES = [
  {
    id: 'minor',
    label: '微阿雜',
    points: 1,
    emoji: '😤',
    color: 'teal',
    examples: ['同事雷了一下', '雜事太多', '咖啡機壞掉', '會議超時'],
  },
  {
    id: 'moderate',
    label: '有點火大',
    points: 3,
    emoji: '😠',
    color: 'amber',
    examples: ['主管朝令夕改', '被迫無意義加班', '客戶無理取鬧', '計畫臨時大改'],
  },
  {
    id: 'severe',
    label: '考慮翻桌',
    points: 5,
    emoji: '🤯',
    color: 'red',
    examples: ['被迫背黑鍋', '被嚴重凹', '主管大發飆', '薪資被剋扣'],
  },
]

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // Storage quota exceeded – silently fail
  }
}

function createDefaultState() {
  return {
    hasOnboarded: false,
    targetPoints: 100,
    currentPoints: 0,
    logs: [],
  }
}

// Singleton state shared across the app
const _stored = loadFromStorage()
const state = ref(_stored ?? createDefaultState())

// Persist on every change
watch(state, (val) => saveToStorage(val), { deep: true })

export function usePoints() {
  // ─── Computed ──────────────────────────────────────────────
  const hasOnboarded = computed(() => state.value.hasOnboarded)
  const targetPoints = computed(() => state.value.targetPoints)
  const currentPoints = computed(() => state.value.currentPoints)
  const logs = computed(() => [...state.value.logs].reverse()) // newest first

  const progressPercent = computed(() => {
    if (state.value.targetPoints <= 0) return 0
    return Math.min((state.value.currentPoints / state.value.targetPoints) * 100, 100)
  })

  const remainingPoints = computed(() =>
    Math.max(state.value.targetPoints - state.value.currentPoints, 0),
  )

  const hasReachedTarget = computed(() => state.value.currentPoints >= state.value.targetPoints)

  const progressLevel = computed(() => {
    const pct = progressPercent.value
    if (pct < 30) return 'calm'
    if (pct < 60) return 'warning'
    if (pct < 90) return 'danger'
    return 'critical'
  })

  // ─── Actions ───────────────────────────────────────────────
  function completeOnboarding(targetPts) {
    state.value = {
      ...state.value,
      hasOnboarded: true,
      targetPoints: Number(targetPts),
    }
  }

  function addPoints(categoryId, note = '') {
    const category = PRESET_CATEGORIES.find((c) => c.id === categoryId)
    if (!category) return

    const entry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      categoryId: category.id,
      categoryLabel: category.label,
      points: category.points,
      emoji: category.emoji,
      note: note.trim(),
    }

    state.value = {
      ...state.value,
      currentPoints: state.value.currentPoints + category.points,
      logs: [...state.value.logs, entry],
    }

    return entry
  }

  function deleteLog(id) {
    const entry = state.value.logs.find((l) => l.id === id)
    if (!entry) return

    state.value = {
      ...state.value,
      currentPoints: Math.max(state.value.currentPoints - entry.points, 0),
      logs: state.value.logs.filter((l) => l.id !== id),
    }
  }

  function updateTarget(newTarget) {
    state.value = {
      ...state.value,
      targetPoints: Number(newTarget),
    }
  }

  function resetAll() {
    state.value = createDefaultState()
  }

  return {
    // State
    hasOnboarded,
    targetPoints,
    currentPoints,
    logs,
    // Computed
    progressPercent,
    remainingPoints,
    hasReachedTarget,
    progressLevel,
    // Actions
    completeOnboarding,
    addPoints,
    deleteLog,
    updateTarget,
    resetAll,
  }
}
