<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  className: String,
  id: String,
  text: String
});
</script>

<template>
  <label
      :class="className"
      :for="id"
  >{{ text }}</label>
</template>

<style scoped>
  label {
    display: block;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
</style>