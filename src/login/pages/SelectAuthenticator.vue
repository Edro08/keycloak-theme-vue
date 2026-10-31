<script setup>
  import { ref, computed } from 'vue';
  import { useKeycloakContext } from '@/login/core/adapters/kc-ctx';
  import { useFormSubmit } from '@/login/core/adapters/form-submit';

  const { realm, urls, message, config, authExecutions } = useKeycloakContext();
  const { submitKCForm } = useFormSubmit();

  const texts = config.pages?.selectAuthenticator || {};
  const isSubmitting = ref(false);

  // Default fallback executions if none are provided
  const defaultExecutions = [
    {
      authExecId: 'webauthn',
      displayName: texts.webauthnTitle || 'Llave de Seguridad o Passkey',
      helpText: texts.webauthnDesc || 'Windows Hello, huella digital o llave física USB (FIDO2)',
      type: 'webauthn'
    },
    {
      authExecId: 'totp',
      displayName: texts.totpTitle || 'Código de Autenticación',
      helpText: texts.totpDesc || 'Google Authenticator, Microsoft Authenticator o código TOTP',
      type: 'totp'
    },
    {
      authExecId: 'password',
      displayName: texts.passwordTitle || 'Contraseña',
      helpText: texts.passwordDesc || 'Ingresa con tu contraseña habitual de tu cuenta',
      type: 'password'
    }
  ];

  const executionList = computed(() => {
    if (authExecutions && authExecutions.length > 0) {
      return authExecutions.map(exec => {
        let type = 'password';
        const name = (exec.displayName || '').toLowerCase();
        const help = (exec.helpText || '').toLowerCase();
        if (name.includes('webauthn') || name.includes('fido') || name.includes('security key') || name.includes('passkey') || help.includes('fido')) {
          type = 'webauthn';
        } else if (name.includes('otp') || name.includes('authenticator') || name.includes('código') || help.includes('totp') || help.includes('otp')) {
          type = 'totp';
        }
        return {
          ...exec,
          type
        };
      });
    }
    return defaultExecutions;
  });

  const onSelect = (exec) => {
    if (isSubmitting.value) return;
    isSubmitting.value = true;
    submitKCForm({
      action: urls.loginAction,
      method: 'POST',
      fields: {
        authExecId: exec.authExecId
      }
    });
  };
</script>

<template>
  <div class="kc-compact-card">
    
    <!-- Dark Header with Realm Brand -->
    <div class="kc-compact-dark-header">
      <div class="kc-header-brand">
        <div class="kc-brand-badge-sm">
          <svg class="kc-brand-svg-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <span class="kc-header-realm">{{ realm.name || 'Keycloak' }}</span>
      </div>
    </div>

    <!-- Body -->
    <div class="kc-compact-body">
      
      <!-- Status Pill -->
      <div class="kc-status-pill kc-status-pill-blue">
        <svg class="kc-status-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span>{{ texts.pill || 'Verificación de Identidad' }}</span>
      </div>

      <!-- Title & Subtitle -->
      <h1 class="kc-compact-title">{{ texts.title || 'Elige un método de acceso' }}</h1>
      <p class="kc-compact-desc">
        {{ texts.subtitle || 'Tienes varios factores de autenticación configurados. Selecciona cómo deseas continuar.' }}
      </p>

      <!-- Error Alert -->
      <div v-if="message.hasError" class="kc-error-card" role="alert" style="margin-bottom: 1.15rem;">
        <svg class="kc-error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="kc-error-text">{{ message.summary }}</span>
      </div>

      <!-- Options List -->
      <div class="kc-auth-list">
        <button
          v-for="exec in executionList"
          :key="exec.authExecId"
          type="button"
          class="kc-auth-option-card"
          @click="onSelect(exec)"
          :disabled="isSubmitting"
        >
          <!-- WebAuthn Icon -->
          <div v-if="exec.type === 'webauthn'" class="kc-auth-option-icon">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>

          <!-- TOTP Icon -->
          <div v-else-if="exec.type === 'totp'" class="kc-auth-option-icon">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>

          <!-- Password / Default Icon -->
          <div v-else class="kc-auth-option-icon">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <div class="kc-auth-option-info">
            <span class="kc-auth-option-title">{{ exec.displayName }}</span>
            <span class="kc-auth-option-desc">{{ exec.helpText }}</span>
          </div>

          <svg class="kc-auth-option-arrow" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Back Link -->
      <div class="kc-back-link-wrapper">
        <a :href="urls.login" class="kc-link">
          {{ texts.backToLogin || 'Volver al inicio de sesión' }}
        </a>
      </div>

    </div>

  </div>
</template>
