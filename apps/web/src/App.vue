<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";

import {
  advanceBoardTurn,
  createBoard,
  getBoardStatus,
  getRemainingCounts,
  normalizeWords,
  revealBoardCard,
} from "./codenames/helpers";
import BoardGame from "./components/BoardGame.vue";
import MatchState from "./components/MatchState.vue";

const phraseInput = ref("");
const unlockedExtraWords = ref<string[]>([]);
const showSpymasterView = ref(false);
const boardState = ref(createBoard([]));

const remainingCounts = computed(() => getRemainingCounts(boardState.value));

const boardStatus = computed(() => getBoardStatus(boardState.value));

function newBoard() {
  boardState.value = createBoard(unlockedExtraWords.value);
}

function revealCard(cardId: number) {
  boardState.value = revealBoardCard(boardState.value, cardId);
}

function nextTurn() {
  boardState.value = advanceBoardTurn(boardState.value);
}

async function checkExtra() {
  const phraseToCheck = phraseInput.value.trim();

  if (!phraseToCheck) {
    return;
  }

  try {
    const response = await fetch(`/extra?phrase=${encodeURIComponent(phraseToCheck)}`);

    if (response.status === 200) {
      const payload = (await response.json()) as unknown;

      if (Array.isArray(payload) && payload.every((value) => typeof value === "string")) {
        unlockedExtraWords.value = normalizeWords(payload);
        phraseInput.value = "";
        return;
      }
    }
  } catch {
    return;
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    phraseInput.value = "";

    return;
  }

  if (event.key === "Enter") {
    event.preventDefault();
    void checkExtra();
    return;
  }

  if (event.key === "Backspace") {
    phraseInput.value = phraseInput.value.slice(0, -1);
    return;
  }

  if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
    phraseInput.value += event.key;
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyDown);
});
</script>

<template>
  <div class="min-h-screen bg-surface-200 text-surface-900">
    <main class="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header class="rounded-3xl border-2 border-surface-600 bg-surface-100 p-5">
        <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div class="space-y-3">
            <h1 class="font-serif text-4xl font-black uppercase tracking-[0.08em] text-surface-900 sm:text-5xl">
              Codenames
            </h1>
          </div>
        </div>

        <div class="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            class="rounded-2xl border-2 border-surface-600 bg-surface-100 px-4 py-3 text-sm font-semibold text-surface-900 transition hover:bg-surface-300"
            @click="showSpymasterView = !showSpymasterView"
          >
            {{ showSpymasterView ? "Hide spymaster" : "Show spymaster" }}
          </button>

          <button
            type="button"
            class="rounded-2xl border-2 border-surface-900 bg-surface-900 px-4 py-3 text-sm font-semibold text-surface-100 transition hover:bg-surface-800"
            @click="newBoard"
          >
            New board
          </button>
        </div>
      </header>

      <section class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <BoardGame :board="boardState" :showSpymasterView="showSpymasterView" @reveal-card="revealCard" />
        <MatchState
          :board="boardState"
          :remainingCounts="remainingCounts"
          :boardStatus="boardStatus"
          :unlockedExtraWords="unlockedExtraWords"
          @next-turn="nextTurn"
        />
      </section>
    </main>
  </div>
</template>
