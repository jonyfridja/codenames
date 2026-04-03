<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

const phraseInput = ref("");
const extraStatus = ref("idle");

async function checkExtra() {
  const phraseToCheck = phraseInput.value;

  if (!phraseToCheck) {
    extraStatus.value = "idle";
    return;
  }

  extraStatus.value = "loading";

  try {
    const response = await fetch(
      `/extra?phrase=${encodeURIComponent(phraseToCheck)}`,
    );

    if (response.status === 200) {
      extraStatus.value = "authorized";
      return;
    }

    if (response.status === 403) {
      extraStatus.value = "forbidden";
      return;
    }

    extraStatus.value = `unexpected-${response.status}`;
  } catch {
    extraStatus.value = "error";
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    phraseInput.value = "";
    extraStatus.value = "idle";
    return;
  }

  if (event.key === "Enter") {
    void checkExtra();
    return;
  }

  if (event.key === "Backspace") {
    phraseInput.value = phraseInput.value.slice(0, -1);
    return;
  }

  if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
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
  <div class="min-h-screen bg-surface-100 text-surface-900">
    <main class="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-14">
      <header>
        <div class="score"></div>
        <div class="title"></div>
        <div class="actions"></div>

      </header>
      <div class="board">

      </div>
      <div class="bottom-actions">
        <div class="role-switch"></div>
        <div class="next"></div>
      </div>
    </main>
  </div>
</template>
