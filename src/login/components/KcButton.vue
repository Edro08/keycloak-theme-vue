<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  label: { type: String, required: true },
  className: { type: String, default: '' },
  type: { type: String, default: 'button' },
  onClick: { type: Function }
});

</script>

<template>
  <button
      :type="type"
      :class="className"
      @click="onClick ? onClick() : null">
    {{ label }}
  </button>
</template>


<style scoped>
  button {
    width: 100%;
    height: 48px;
    padding: 0.75rem;
    box-sizing: border-box;
    background-color: #1570EF;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
  }

  button:hover {
    background-color: #4338ca;
  }
</style>
