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
      type="password"
      :class="className"
      :id="id"
      :autocomplete="autocomplete"
      :autofocus="autofocus"
      :value="modelValue"
      @input="emit('update:modelValue', $event.target.value)"
  />
</template>