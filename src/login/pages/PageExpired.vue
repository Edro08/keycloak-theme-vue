<script setup>
  import { useKeycloakContext } from '@/login/core/adapters/kc-ctx';
  import Button from "@/login/components/ui/Button.vue";

  const { urls, realm, config } = useKeycloakContext();
  const texts = config.pages?.pageExpired || {};
  
  // URLs for restart
  const loginRestartUrl = window.kc_context?.urls?.loginRestartFlowUrl || urls.login || '/';

  const restartLogin = () => {
    window.location.href = loginRestartUrl;
  };
</script>

<template>
  <div class="kc-compact-card">
    
    <!-- Dark Header at the top -->
    <div class="kc-compact-dark-header">
      <div class="kc-header-brand">
        <div class="kc-brand-badge-sm">
          <svg class="kc-brand-svg-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <span class="kc-header-realm">{{ realm.name || 'dev' }}</span>
      </div>
    </div>

    <!-- Card Content Body -->
    <div class="kc-compact-body">
      
      <div class="kc-status-pill kc-status-pill-amber">
        <svg class="kc-status-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ texts.pill || 'Sesión Expirada' }}</span>
      </div>

      <h1 class="kc-compact-title">{{ texts.title || 'La sesión ha caducado' }}</h1>
      <p class="kc-compact-desc">
        {{ texts.desc || 'Por seguridad, la sesión de acceso ha vencido debido a un periodo prolongado de inactividad. Puedes reiniciar el proceso para continuar.' }}
      </p>

      <div class="kc-help-box">
        <div class="kc-dot-indicator kc-dot-amber"></div>
        <div class="kc-help-text">
          <span class="kc-help-bold">{{ texts.helpBold || 'Protección de cuenta' }}</span>
          {{ texts.helpText || 'La sesión temporal de autenticación ha vencido.' }}
        </div>
      </div>

      <div class="kc-submit-wrapper">
        <Button
          class-name="kc-submit-btn"
          :label="texts.restartButton || 'Reiniciar inicio de sesión'"
          type="button"
          :onClick="restartLogin"
        />
      </div>

      <div class="kc-back-link-wrapper">
        <a :href="urls.login || '/'" class="kc-back-link">
          <svg class="kc-arrow-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {{ texts.backToLogin || 'Volver al inicio de sesión' }}
        </a>
      </div>

    </div>
  </div>
</template>
