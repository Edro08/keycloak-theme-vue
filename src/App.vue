<script setup>
  import { computed, ref, onMounted } from 'vue';
  import Login from "@/login/pages/Login.vue";
  import ResetPassword from "@/login/pages/ResetPassword.vue";
  import UpdatePassword from "@/login/pages/UpdatePassword.vue";
  import PageExpired from "@/login/pages/PageExpired.vue";
  import Error from "@/login/pages/Error.vue";
  import { useKeycloakContext } from "@/core/adapters/kc-ctx";
  import Header from "@/login/pages/Header.vue";
  import Footer from "@/login/pages/Footer.vue";

  const { urls, config } = useKeycloakContext()
  const i18nLoaded = ref(false);

  const currentAction = urls.loginAction
  const formMap = config.actions
  const executionMap = config.executionActions || {}

  const currentForm = computed(() => {
    // Find the base action
    const baseAction = Object.entries(formMap).find(([key]) => currentAction.includes(key))?.[1];
    
    // If it's a required-action, check the execution parameter
    if (baseAction === 'required-action') {
      const urlParams = new URLSearchParams(window.location.search);
      const execution = urlParams.get('execution');
      
      if (execution && executionMap[execution]) {
        return executionMap[execution];
      }
    }
    
    return baseAction || null;
  })

  // Wait for i18n to load before rendering
  onMounted(async () => {
    if (config.i18nReady) {
      await config.i18nReady;
    }
    i18nLoaded.value = true;
  });
</script>

<template>
  <main class="kc-main">
    <Header/>
    <template v-if="i18nLoaded">
      <Login v-if="currentForm === 'login'" />
      <ResetPassword v-else-if="currentForm === 'reset-password'" />
      <UpdatePassword v-else-if="currentForm === 'update-password'" />
      <PageExpired v-else-if="currentForm === 'page-expired'" />
      <Error v-else />
    </template>
    <Footer/>
  </main>
</template>