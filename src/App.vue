<script setup lang="ts">
import CounterOpts from "./components/Counter-Opts.vue";
</script>

<template>
  <CounterOpts></CounterOpts>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  color:red;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #20cc7eaa);
}
</style>
