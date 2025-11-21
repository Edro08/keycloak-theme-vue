<script setup>
  import { computed } from 'vue';
  import Login from "@/login/pages/Login.vue";
  import ResetPassword from "@/login/pages/ResetPassword.vue";
  import UpdatePassword from "@/login/pages/UpdatePassword.vue";
  import { useKeycloakContext } from "@/core/adapters/kc-ctx";
  import Header from "@/login/pages/Header.vue";
  import Footer from "@/login/pages/Footer.vue";

  const { login, config } = useKeycloakContext()

  const currentAction = login.actionUrl
  const formMap = config.actions

  const currentForm = computed(() => {
    return Object.entries(formMap).find(([key]) => currentAction.includes(key))?.[1] || null
  })
</script>

<template>
  <main class="kc-main">
    <Header/>
    <Login v-if="currentForm === 'login'" />
    <ResetPassword v-else-if="currentForm === 'reset-password'" />
    <UpdatePassword v-else-if="currentForm === 'update-password'" />
    <Footer/>
  </main>
</template>