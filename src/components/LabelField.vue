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