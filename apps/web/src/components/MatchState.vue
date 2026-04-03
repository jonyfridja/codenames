<script setup lang="ts">
import { type BoardState } from "../codenames/types";
import { ROLES } from "../codenames/constants";

interface Props {
  board: BoardState;
  remainingCounts: { red: number; blue: number };
  unlockedExtraWords: string[];
}

interface Emits {
  nextTurn: [];
}

defineProps<Props>();
defineEmits<Emits>();
</script>

<template>
  <aside class="self-start flex max-h-[calc(100vh-3rem)] flex-col gap-4 overflow-y-auto rounded-3xl border-2 border-surface-card bg-surface-100 p-5 xl:sticky xl:top-6">
    <!-- Match state status -->
    <div class="px-1 py-1 text-xl font-black uppercase tracking-[0.08em] text-surface-900">
      <span :class="board.activeTeam === ROLES.red ? 'text-red-500' : 'text-teal-500'">{{ board.activeTeam }}</span>
      team to act
    </div>

    <!-- Team scores -->
    <div class="grid grid-cols-2 gap-2">
      <div class="rounded-lg border border-red-300 bg-red-50 px-3 py-2">
        <div class="text-xs text-red-600">Red</div>
        <div class="text-xl font-bold text-red-900">{{ remainingCounts.red }}</div>
      </div>
      <div class="rounded-lg border border-teal-300 bg-teal-50 px-3 py-2">
        <div class="text-xs text-teal-600">Blue</div>
        <div class="text-xl font-bold text-teal-900">{{ remainingCounts.blue }}</div>
      </div>
    </div>

    <!-- End turn button -->
    <button
      type="button"
      class="rounded-2xl bg-purple-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-600 disabled:opacity-50"
      :disabled="!!board.winner"
      @click="$emit('nextTurn')"
    >
      End turn
    </button>

    <!-- Divider -->
    <hr class="border-surface-card" />

    <!-- Extra Word Pool -->
    <div class="flex items-baseline justify-between">
      <div class="text-xs uppercase tracking-[0.2em] text-surface-700">Extra Word Pool</div>
      <div :class="unlockedExtraWords.length > 0 ? 'font-bold text-teal-700' : 'font-semibold text-surface-600'">
        {{ unlockedExtraWords.length > 0 ? "On" : "Off" }}
      </div>
    </div>
  </aside>
</template>
