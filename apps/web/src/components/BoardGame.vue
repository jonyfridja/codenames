<script setup lang="ts">
import { type BoardState } from "../codenames/types";
import Card from "./Card.vue";

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
  <div class="flex h-full flex-col rounded-3xl border-2 border-surface-card bg-surface-100 p-4 sm:p-5">
    <div class="grid grid-cols-2 gap-3 pb-4 sm:grid-cols-3 lg:grid-cols-5">
      <Card
        v-for="card in board.cards"
        :key="card.id"
        :card="card"
        :showSpymasterView="showSpymasterView"
        :disabled="card.revealed || !!board.winner"
        @reveal="$emit('revealCard', $event)"
      />
    </div>
  </div>
</template>
