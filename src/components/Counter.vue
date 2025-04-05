<script setup lang="ts">
import { ref } from "vue";

const count = ref(0);
</script>
<template>
  <div>
    Count: {{ count }}
    <button @click="count++">+</button>
  </div>
</template>

<style></style>
