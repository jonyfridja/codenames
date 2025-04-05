<script lang="ts">
export default {
  data() {
    return {
      count: 0,
    };
  },
  methods: {
    inc() {
      this.count++;
    },
    dec() {
      this.count--;
    },
  },
};
</script>
<template>
  <div>
    <button @click="dec">-</button>
    Count: {{ count }}
    <button @click="inc">+</button>
  </div>
</template>

<style></style>
