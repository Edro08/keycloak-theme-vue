<script setup>
  import './assets/css/base.css'
  import {ref, computed, getCurrentInstance} from 'vue';
  import Login from "@/login/forms/Login.vue";
  import Register from "@/login/forms/Register.vue";
  import ResetPassword from "@/login/forms/ResetPassword.vue";

  const { appContext } = getCurrentInstance()
  const $env = appContext.config.globalProperties.$env
  const $kc = appContext.config.globalProperties.$kc

  const currentAction = ref($kc?.action || '')
  const formMap = $env.app.actions

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