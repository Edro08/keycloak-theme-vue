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
  <label :class="className">
    <input
        type="checkbox"
        :id="id"
        :checked="modelValue"
        @change="emit('update:modelValue', $event.target.checked)"/>
    {{ label }}
  </label>
</template>
