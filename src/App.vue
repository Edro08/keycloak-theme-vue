<script setup>
  import './assets/css/base.css'
  import {ref, computed} from 'vue';
  import Login from "@/login/forms/Login.vue";
  import Register from "@/login/forms/Register.vue";
  import ResetPassword from "@/login/forms/ResetPassword.vue";

  const currentAction = ref(window.__KC_CONTEXT?.action || '')

  const formMap = {
    'login-actions/authenticate': 'login',
    'login-actions/registration': 'register',
    'login-actions/reset-credentials': 'reset-password'
  }

  const currentForm = computed(() => {
    return Object.entries(formMap).find(([key]) => currentAction.value.includes(key))?.[1] || null
  })
</script>

<template>
  <main class="kc-main">
    <Login v-if="currentForm === 'login'" />
    <Register v-else-if="currentForm === 'register'" />
    <ResetPassword v-else-if="currentForm === 'reset-password'" />
  </main>
</template>

