<script setup lang="ts">
import { type Card } from "../codenames/types";
import { titleCase } from "../codenames/helpers";
import { ROLES } from "../codenames/constants";

interface Props {
  winner: "red" | "blue";
  history: Card[];
}

interface Emits {
  restart: [];
}

defineProps<Props>();
defineEmits<Emits>();

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
  <aside class="self-start flex max-h-[calc(100vh-3rem)] flex-col gap-4 overflow-hidden rounded-3xl border-2 border-surface-card bg-surface-100 p-5 xl:sticky xl:top-6">
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
      <ol class="min-h-0 max-h-[min(50vh,28rem)] space-y-1.5 overflow-auto pr-1">
        <li
          v-for="(card, index) in history"
          :key="card.id"
          class="flex items-center gap-3 rounded-lg border px-3 py-2 text-sm"
          :class="roleColorClass(card.role)"
        >
          <span class="w-5 shrink-0 text-right text-xs font-semibold opacity-50">{{ index + 1 }}</span>
          <span class="font-bold uppercase tracking-wide">{{ titleCase(card.word) }}</span>
          <span class="ml-auto text-xs font-semibold uppercase opacity-60">{{ card.role }}</span>
        </li>
      </ol>
    </div>
  </aside>
</template>
