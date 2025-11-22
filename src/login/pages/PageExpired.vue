<script setup>
  import { useKeycloakContext } from '@/core/adapters/kc-ctx';

  const { urls, config } = useKeycloakContext();
  
  // Get texts from config
  const texts = config.pages?.pageExpired || {};
  
  // URLs for restart and continue
  const loginRestartUrl = window.kc_context?.urls?.loginRestartFlowUrl || urls.login;
  const loginContinueUrl = urls.loginAction;
</script>

<template>
  <div class="kc-form">
    <div>
      <h1 class="kc-page-expired-title">{{ texts.title || 'La página ha expirado' }}</h1>
    </div>

    <div class="kc-page-expired-message">
      <p class="kc-page-expired-instruction">
        {{ texts.message1 || 'Tu sesión ha expirado.' }}
        <a :href="loginRestartUrl" id="loginRestartLink">
          {{ texts.clickHere || 'Haz clic aquí' }}
        </a>
        {{ texts.toRestart || 'para reiniciar el proceso de inicio de sesión.' }}
      </p>
      
      <p class="kc-page-expired-instruction">
        {{ texts.message2 || 'Si deseas continuar donde lo dejaste,' }}
        <a :href="loginContinueUrl" id="loginContinueLink">
          {{ texts.clickHere || 'haz clic aquí' }}
        </a>
        {{ texts.toContinue || 'para intentar continuar.' }}
      </p>
    </div>
  </div>
</template>
