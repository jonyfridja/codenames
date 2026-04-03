<script setup lang="ts">
import { type BoardState } from "../codenames/types";
import { titleCase } from "../codenames/helpers";

interface Props {
  board: BoardState;
  remainingCounts: { red: number; blue: number };
  boardStatus: string;
  unlockedExtraWords: string[];
}

interface Emits {
  nextTurn: [];
}

defineProps<Props>();
defineEmits<Emits>();
</script>

<template>
  <aside class="flex flex-col gap-4 rounded-3xl border-2 border-surface-600 bg-surface-100 p-5">
    <!-- Team scores -->
    <div class="grid gap-3 sm:grid-cols-2">
      <div class="rounded-2xl border-2 border-red-400 bg-red-100 p-4">
        <div class="text-xs font-semibold uppercase tracking-[0.25em] text-red-700">Red Remaining</div>
        <div class="mt-2 text-3xl font-black text-red-900">
          {{ remainingCounts.red }}
        </div>
      </div>
      <div class="rounded-2xl border-2 border-teal-400 bg-teal-100 p-4">
        <div class="text-xs font-semibold uppercase tracking-[0.25em] text-teal-700">Blue Remaining</div>
        <div class="mt-2 text-3xl font-black text-teal-900">
          {{ remainingCounts.blue }}
        </div>
      </div>
    </div>

    <!-- Match state -->
    <div>
      <div class="text-xs font-semibold uppercase tracking-[0.3em] text-surface-700">Match State</div>
      <div
        class="mt-3 text-2xl font-black uppercase tracking-[0.08em]"
        :class="board.activeTeam === 'red' ? 'text-red-700' : 'text-teal-700'"
      >
        {{ boardStatus }}
      </div>
      <p class="mt-2 text-sm text-surface-800">Starting team: {{ titleCase(board.startingTeam) }}</p>
    </div>

    <!-- End turn button -->
    <button
      type="button"
      class="rounded-2xl border-2 border-surface-600 bg-surface-200 px-4 py-3 text-sm font-semibold text-surface-900 transition hover:bg-surface-300 disabled:opacity-50"
      :disabled="!!board.winner"
      @click="$emit('nextTurn')"
    >
      End turn
    </button>

    <!-- Extra word pool -->
    <div class="rounded-2xl border-2 border-surface-500 bg-surface-200 p-4 text-sm text-surface-900">
      <div class="text-xs font-semibold uppercase tracking-[0.25em] text-surface-700">Extra Word Pool</div>
      <p class="mt-2 text-surface-800">
        {{
          unlockedExtraWords.length > 0
            ? "Unlocked words will be mixed into every new board."
            : "No extra words unlocked yet."
        }}
      </p>
      <div class="mt-3 flex flex-wrap gap-2">
        <span
          v-for="word in unlockedExtraWords"
          :key="word"
          class="rounded-full border border-teal-500 bg-teal-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-teal-900"
        >
          {{ word }}
        </span>
      </div>
    </div>

    <!-- Rules -->
    <div class="rounded-2xl border-2 border-surface-500 bg-surface-200 p-4 text-sm text-surface-900">
      <div class="text-xs font-semibold uppercase tracking-[0.25em] text-surface-700">Rules</div>
      <ul class="mt-3 space-y-2 text-surface-800">
        <li>Reveal cards with a click.</li>
        <li>Show spymaster mode to inspect the key.</li>
        <li>New board re-rolls words and roles using any unlocked extras.</li>
      </ul>
    </div>
  </aside>
</template>
