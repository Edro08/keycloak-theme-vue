<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  modelValue: String,
  className: String,
  id: String,
  autocomplete: String,
  autofocus: Boolean
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <input
      :class="className"
      :id="id"
      :autocomplete="autocomplete"
      :autofocus="autofocus"
      :value="modelValue"
      @input="emit('update:modelValue', $event.target.value)"
  />
</template>

<style scoped>
  input {
    width: 100%;
    height: 48px;
    background-color: #f8f8ff;
    padding: 0.5rem;
    box-sizing: border-box;
  }
</style>
