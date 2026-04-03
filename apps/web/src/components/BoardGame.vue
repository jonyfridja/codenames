<script setup lang="ts">
import { type BoardState } from "../codenames/types";
import { titleCase } from "../codenames/helpers";

interface Props {
  board: BoardState;
  showSpymasterView: boolean;
}

interface Emits {
  revealCard: [cardId: number];
}

defineProps<Props>();
defineEmits<Emits>();
</script>

<template>
  <div class="rounded-3xl border-2 border-surface-600 bg-surface-100 p-4 sm:p-5">
    <div class="grid grid-cols-2 gap-3 pb-4 sm:grid-cols-3 lg:grid-cols-5">
      <button
        v-for="card in board.cards"
        :key="card.id"
        type="button"
        class="group aspect-[1.06] rounded-2xl border-2 px-3 py-4 text-left transition hover:bg-surface-300 disabled:cursor-default"
        :class="[
          card.revealed
            ? card.role === 'red'
              ? 'border-red-700 bg-red-500 text-red-900'
              : card.role === 'blue'
                ? 'border-teal-700 bg-teal-500 text-teal-900'
                : card.role === 'neutral'
                  ? 'border-surface-600 bg-surface-300 text-surface-900'
                  : 'border-surface-900 bg-surface-900 text-surface-100'
            : showSpymasterView
              ? card.role === 'red'
                ? 'border-red-300 bg-red-100 text-red-950'
                : card.role === 'blue'
                  ? 'border-teal-300 bg-teal-100 text-teal-950'
                  : card.role === 'neutral'
                    ? 'border-surface-500 bg-surface-200 text-surface-900'
                    : 'border-surface-700 bg-surface-400 text-surface-900'
              : 'border-surface-500 bg-surface-200 text-surface-900',
        ]"
        :disabled="card.revealed || !!board.winner"
        @click="$emit('revealCard', card.id)"
      >
        <div class="flex h-full flex-col justify-between gap-3">
          <span class="text-[0.65rem] font-semibold uppercase tracking-[0.28em] opacity-70">
            {{ card.revealed ? card.role : showSpymasterView ? card.role : "codename" }}
          </span>
          <span class="text-lg font-black uppercase leading-tight sm:text-xl">
            {{ titleCase(card.word) }}
          </span>
        </div>
      </button>
    </div>
  </div>
</template>
