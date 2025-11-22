<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  label: { type: String, required: true },
  className: { type: String, default: '' },
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
  onClick: { type: Function }
});

</script>

<template>
  <button
      :type="type"
      :class="className"
      :disabled="disabled"
      @click="onClick ? onClick() : null">
    {{ label }}
  </button>
</template>
