<script setup>
import { ref } from 'vue';

const props = defineProps({
  modelValue: String,
  className: String,
  id: String,
  placeholder: String,
  autocomplete: String,
  autofocus: Boolean
});

const emit = defineEmits(['update:modelValue']);
const showPassword = ref(false);

const toggleShow = () => {
  showPassword.value = !showPassword.value;
};
</script>

<template>
  <div class="kc-password-field-container">
    <input
        :type="showPassword ? 'text' : 'password'"
        :class="className"
        :id="id"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :autofocus="autofocus"
        :value="modelValue"
        @input="emit('update:modelValue', $event.target.value)"
    />
    <button
        type="button"
        class="kc-password-toggle-btn"
        @click="toggleShow"
        :title="showPassword ? 'Ocultar contraseña' : 'Ver contraseña'"
        tabindex="-1"
    >
      <!-- Eye Icon (View) -->
      <svg v-if="!showPassword" class="kc-eye-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      <!-- Eye Slash Icon (Hide) -->
      <svg v-else class="kc-eye-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
      </svg>
    </button>
  </div>
</template>
