<script setup lang="ts">
import { computed } from "vue";

import { type Card } from "../codenames/types";
import { titleCase } from "../codenames/helpers";
import { ROLES } from "../codenames/constants";

interface HistoryEntry extends Card {
  turnTeam: "red" | "blue";
  wasSuccess: boolean;
}

interface Props {
  winner: "red" | "blue";
  history: HistoryEntry[];
}

interface Emits {
  restart: [];
}

const props = defineProps<Props>();
defineEmits<Emits>();

const displayHistory = computed(() =>
  props.history.map((entry, index, entries) => ({
    ...entry,
    showTeamHeader: index === 0 || entries[index - 1]?.turnTeam !== entry.turnTeam,
  }))
);

function roleColorClass(role: Card["role"]) {
  if (role === ROLES.red) {
    return "bg-red-100 text-red-800 border-red-300";
  }

  if (role === ROLES.blue) {
    return "bg-teal-100 text-teal-800 border-teal-300";
  }

  if (role === ROLES.assassin) {
    return "bg-surface-800 text-surface-100 border-surface-card";
  }

  return "bg-surface-200 text-surface-700 border-surface-card";
}
</script>

<template>
  <aside class="flex h-full flex-col gap-4 overflow-hidden rounded-3xl border-2 border-surface-card bg-surface-100 p-5 xl:sticky xl:top-6">
    <!-- Winner banner -->
    <div
      class="rounded-2xl px-4 py-3 text-xl font-black uppercase tracking-[0.08em] text-white"
      :class="winner === ROLES.red ? 'bg-red-500' : 'bg-teal-500'"
    >
      {{ titleCase(winner) }} wins!
    </div>

    <!-- Restart -->
    <button
      type="button"
      class="rounded-2xl bg-purple-400 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-600"
      @click="$emit('restart')"
    >
      New game
    </button>

    <hr class="border-surface-card" />

    <!-- Game history -->
    <div class="min-h-0">
      <div class="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-surface-700">Game History</div>
      <ol class="min-h-0 flex max-h-[min(50vh,28rem)] flex-col gap-1 overflow-auto pr-1">
        <li
          v-for="(card, index) in displayHistory"
          :key="card.id"
          class="contents"
        >
          <div
            v-if="card.showTeamHeader"
            class="mb-1 mt-2 text-[0.68rem] font-bold uppercase tracking-[0.24em]"
            :class="card.turnTeam === ROLES.red ? 'text-left text-red-700' : 'text-right text-teal-700'"
          >
            {{ card.turnTeam === ROLES.red ? "Red Team" : "Blue Team" }}
          </div>
          <div
            class="flex items-center gap-3 rounded-lg border px-3 py-2 text-sm"
            :class="roleColorClass(card.role)"
          >
            <span class="w-5 shrink-0 text-right text-xs font-semibold opacity-50">{{ index + 1 }}</span>
            <span class="font-bold uppercase tracking-wide">{{ titleCase(card.word) }}</span>
            <span
              class="ml-auto inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border"
              :class="
                card.wasSuccess
                  ? 'border-green-700 bg-green-500 text-white'
                  : 'border-orange-700 bg-orange-500 text-white'
              "
              :title="card.wasSuccess ? 'Success' : 'Failure'"
              :aria-label="card.wasSuccess ? 'Success' : 'Failure'"
            >
              <svg
                v-if="card.wasSuccess"
                viewBox="0 0 16 16"
                class="h-3 w-3"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M3.5 8.5l2.5 2.5 6-6" />
              </svg>
              <svg
                v-else
                viewBox="0 0 16 16"
                class="h-3 w-3"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                aria-hidden="true"
              >
                <path d="M4 4l8 8M12 4L4 12" />
              </svg>
            </span>
          </div>
        </li>
      </ol>
    </div>
  </aside>
</template>
