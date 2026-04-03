<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

import { type Card as CardType } from "../codenames/types";
import { titleCase } from "../codenames/helpers";
import { ROLES } from "../codenames/constants";

interface Props {
  card: CardType;
  showSpymasterView: boolean;
  disabled: boolean;
}

interface Emits {
  reveal: [cardId: number];
}

const props = defineProps<Props>();
defineEmits<Emits>();

const containerRef = ref<HTMLElement | null>(null);
const wordRef = ref<HTMLElement | null>(null);
const wordFontSize = ref(24);
let resizeObserver: ResizeObserver | null = null;

const interactionClass = computed(() => {
  if (props.card.revealed) {
    return "pointer-events-none";
  }

  if (props.disabled) {
    return "disabled:cursor-default";
  }

  return "cursor-pointer hover:bg-surface-card-hover";
});

const colorClass = computed(() => {
  if (props.card.revealed) {
    if (props.card.role === ROLES.red) {
      return "bg-red-500 text-red-100";
    }

    if (props.card.role === ROLES.blue) {
      return "bg-teal-500 text-teal-100";
    }

    if (props.card.role === ROLES.neutral) {
      return "bg-surface-card opacity-40";
    }

    return "bg-surface-assassin text-white";
  }

  if (props.showSpymasterView) {
    if (props.card.role === ROLES.red) {
      return "bg-red-100 text-red-950";
    }

    if (props.card.role === ROLES.blue) {
      return "bg-teal-100 text-teal-950";
    }

    if (props.card.role === ROLES.neutral) {
      return "bg-surface-200 text-surface-900";
    }

    return "bg-surface-assassin text-white";
  }

  return "bg-surface-card text-surface-assassin";
});

function fitWordSize() {
  const container = containerRef.value;
  const word = wordRef.value;

  if (!container || !word) {
    return;
  }

  const maxSize = 30;
  const minSize = 9;
  let nextSize = maxSize;

  word.style.fontSize = `${nextSize}px`;

  while (nextSize > minSize && word.scrollWidth > container.clientWidth) {
    nextSize -= 1;
    word.style.fontSize = `${nextSize}px`;
  }

  wordFontSize.value = nextSize;
}

async function refreshWordSize() {
  await nextTick();
  fitWordSize();
}

onMounted(() => {
  void refreshWordSize();

  if (containerRef.value) {
    resizeObserver = new ResizeObserver(() => {
      fitWordSize();
    });
    resizeObserver.observe(containerRef.value);
  }
});

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
});

watch(
  () => props.card.word,
  () => {
    void refreshWordSize();
  }
);
</script>

<template>
  <button
    type="button"
    class="group aspect-[1.06] rounded-2xl px-3 py-4 text-center transition"
    :class="[interactionClass, colorClass]"
    :disabled="props.disabled"
    @click="$emit('reveal', props.card.id)"
  >
    <div ref="containerRef" class="flex h-full items-center justify-center overflow-hidden">
      <span
        ref="wordRef"
        class="whitespace-nowrap font-black uppercase leading-none"
        :style="{ fontSize: `${wordFontSize}px` }"
      >
        {{ titleCase(props.card.word) }}
      </span>
    </div>
  </button>
</template>
