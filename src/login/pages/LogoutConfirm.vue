<script setup>
  import { ref } from 'vue';
  import { useKeycloakContext } from '@/login/core/adapters/kc-ctx';
  import { useFormSubmit } from '@/login/core/adapters/form-submit';

  const { realm, urls, message, config } = useKeycloakContext();
  const { submitKCForm } = useFormSubmit();

  const texts = config.pages?.logoutConfirm || {};
  const isSubmitting = ref(false);

  const onLogout = () => {
    if (isSubmitting.value) return;
    isSubmitting.value = true;
    submitKCForm({
      action: urls.logoutConfirmAction || urls.loginAction,
      method: 'POST',
      fields: {
        confirmLogout: 'true'
      }
    });
  };

  const onCancel = () => {
    if (urls.login) {
      window.location.href = urls.login;
    } else {
      window.history.back();
    }
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
    <div class="kc-compact-body" style="text-align: center;">
      
      <!-- Big Logout Warning Icon -->
      <div class="kc-logout-icon-wrapper">
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </div>

      <h1 class="kc-compact-title">{{ texts.title || '¿Deseas cerrar sesión?' }}</h1>
      <p class="kc-compact-desc">
        {{ texts.subtitle || 'Estás a punto de finalizar tu sesión activa. Para volver a acceder deberás introducir tus credenciales nuevamente.' }}
      </p>

      <!-- Error Alert -->
      <div v-if="message.hasError" class="kc-error-card" role="alert" style="margin-bottom: 1.15rem; text-align: left;">
        <svg class="kc-error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="kc-error-text">{{ message.summary }}</span>
      </div>

      <!-- Action Buttons Row -->
      <div class="kc-btn-row">
        <button
          type="button"
          class="kc-btn-secondary"
          @click="onCancel"
          :disabled="isSubmitting"
        >
          {{ texts.cancelButton || 'Permanecer conectado' }}
        </button>

        <button
          type="button"
          class="kc-btn-danger"
          @click="onLogout"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting">...</span>
          <span v-else>{{ texts.logoutButton || 'Cerrar sesión' }}</span>
        </button>
      </div>

    </div>

  </div>
</template>
