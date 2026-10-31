<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  modelValue: String,
  className: String,
  id: String,
  placeholder: String,
  autocomplete: String,
  autofocus: Boolean
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <input
      :class="className"
      :id="id"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :autofocus="autofocus"
      :value="modelValue"
      @input="emit('update:modelValue', $event.target.value)"
  />
</template>
