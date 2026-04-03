<script setup lang="ts">
import { onMounted, ref } from "vue";

const phraseInput = "open-sesame";
const extraStatus = ref("idle");

async function checkExtra() {
  extraStatus.value = "loading";

  try {
    const response = await fetch(
      `/extra?phrase=${encodeURIComponent(phraseInput)}`,
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

onMounted(() => {
  void checkExtra();
});
</script>

<template>
  <div class="min-h-screen bg-surface-100 text-surface-900">
    <main class="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-14">
      <header class="rounded-2xl border border-surface-200 bg-white p-8 shadow-sm">
        <p class="text-sm font-medium uppercase tracking-wide text-accent-700">Codenames</p>
        <h1 class="mt-3 text-4xl font-bold text-primary-700">Tailwind is configured</h1>
        <p class="mt-3 max-w-2xl text-base text-surface-600">
          Color palette overrides and explicit font-size overrides are now defined through
          the Tailwind v4 theme tokens.
        </p>
      </header>

      <section class="grid gap-4 sm:grid-cols-3">
        <div class="rounded-xl bg-primary-500 p-4 text-sm font-semibold text-white">bg-primary-500</div>
        <div class="rounded-xl bg-accent-500 p-4 text-sm font-semibold text-white">bg-accent-500</div>
        <div class="rounded-xl bg-surface-700 p-4 text-sm font-semibold text-white">bg-surface-700</div>
      </section>

      <section class="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm">
        <p class="text-xs text-surface-500">text-xs</p>
        <p class="text-sm text-surface-600">text-sm</p>
        <p class="text-base text-surface-700">text-base</p>
        <p class="text-lg text-surface-800">text-lg</p>
        <p class="text-xl font-semibold text-surface-900">text-xl</p>
      </section>

      <section class="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm">
        <p class="text-sm text-surface-600">Backend auth check phrase (static for now):</p>
        <p class="mt-1 text-base font-semibold text-surface-900">{{ phraseInput }}</p>
        <p class="mt-3 text-sm text-surface-700">/extra status: {{ extraStatus }}</p>
      </section>
    </main>
  </div>
</template>
