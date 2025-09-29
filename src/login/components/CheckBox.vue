<script setup>
import {defineProps} from 'vue';

const props = defineProps({
  modelValue: Boolean,
  className: String,
  id: String,
  label: String
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <label>
    <input
        type="checkbox"
        :class="className"
        :id="id"
        :checked="modelValue"
        @change="emit('update:modelValue', $event.target.checked)"/>
    {{ label }}
  </label>
</template>

<style scoped>
  label {
    display: block;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
</style>
