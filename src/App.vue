<template>
  <Analytics />
  <!-- Onboarding -->
  <OnboardingScreen v-if="!hasOnboarded" />

  <!-- Main -->
  <div
    v-else
    class="min-h-screen bg-[#f7f4eb] text-black pb-12 font-sans relative"
  >
    <!-- Ambient background ticket grid pattern -->
    <div
      class="absolute inset-0 bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.07] pointer-events-none"
    ></div>

    <!-- Header -->
    <header class="sticky top-0 z-40 border-b-4 border-black bg-white">
      <div class="mx-auto flex max-w-lg items-center justify-between px-4 py-4">
        <div class="flex items-center gap-3">
          <div
            class="flex size-10 items-center justify-center border-2 border-black bg-[#ffde4d] text-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            😤
          </div>
          <div>
            <h1
              class="text-lg font-black leading-none uppercase tracking-tight text-black"
            >
              離職集點卡
            </h1>
            <p
              class="mt-0.5 text-[0.65rem] font-bold uppercase tracking-widest text-neutral-400 font-mono"
            >
              Resignation Card
            </p>
          </div>
        </div>

        <!-- Tab nav -->
        <nav
          class="flex gap-1 border-2 border-black bg-[#f7f4eb] p-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        >
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :id="`tab-${tab.id}`"
            class="px-3 py-1.5 text-xs font-black uppercase transition-all"
            :class="
              activeTab === tab.id
                ? 'border-2 border-black bg-[#ffde4d] text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                : 'text-neutral-500 hover:text-black border-2 border-transparent'
            "
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>
    </header>

    <!-- Content -->
    <main class="relative z-10 mx-auto max-w-lg px-4 py-6">
      <!-- Milestone banner -->
      <Transition
        enter-active-class="animate-wiggle"
        leave-active-class="transition-opacity duration-200"
        leave-to-class="opacity-0"
      >
        <div
          v-if="hasReachedTarget"
          class="mb-6 border-4 border-black bg-[#bef264] p-5 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
        >
          <div class="mb-2 text-5xl animate-brutal-bounce">🎉</div>
          <p class="text-2xl font-black uppercase text-black">你已經忍夠了！</p>
          <p class="mt-1 text-sm font-bold text-neutral-800">
            點數已全數集滿。是時候向這間公司說拜拜了！
          </p>
        </div>
      </Transition>

      <!-- Tabs -->
      <Transition
        mode="out-in"
        enter-active-class="transition-all duration-150 ease-out"
        enter-from-class="opacity-0 translate-y-2"
        leave-active-class="transition-all duration-100 ease-in"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="activeTab === 'dashboard'">
          <ProgressBar />
          <AddPointsPanel />
        </div>
        <div v-else-if="activeTab === 'history'">
          <HistoryList />
        </div>
        <div v-else-if="activeTab === 'settings'">
          <SettingsPanel />
        </div>
      </Transition>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Analytics } from "@vercel/analytics/vue";
import { usePoints } from "./composables/usePoints.js";
import OnboardingScreen from "./components/OnboardingScreen.vue";
import ProgressBar from "./components/ProgressBar.vue";
import AddPointsPanel from "./components/AddPointsPanel.vue";
import HistoryList from "./components/HistoryList.vue";
import SettingsPanel from "./components/SettingsPanel.vue";

const { hasOnboarded, hasReachedTarget } = usePoints();
const activeTab = ref("dashboard");

const tabs = [
  { id: "dashboard", label: "集點" },
  { id: "history", label: "紀錄" },
  { id: "settings", label: "設定" },
];
</script>
