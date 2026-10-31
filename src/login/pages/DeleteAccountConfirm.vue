<script setup>
  import { computed } from 'vue';
  import { useKeycloakContext } from '@/login/core/adapters/kc-ctx';

  const { realm, urls, triggered_from_aia, config } = useKeycloakContext();
  const texts = computed(() => config.pages?.deleteAccountConfirm || {});
</script>

<template>
  <div class="kc-compact-card">
    <div class="kc-compact-dark-header">
      <div class="kc-header-brand">
        <div class="kc-brand-icon-wrapper">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
        </div>
        <span class="kc-header-realm">{{ realm.name || 'dev' }}</span>
      </div>
    </div>

    <div class="kc-compact-body">
      <div class="kc-icon-circle-danger">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </div>

      <h2 class="kc-page-title">{{ texts.title || '¿Eliminar tu cuenta?' }}</h2>

      <div class="kc-warning-box">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span>
          <strong>{{ texts.warningBold || 'Advertencia irreversible:' }}</strong>
          {{ texts.warningDesc || 'Se eliminarán tus credenciales, sesiones activas y toda la información personal asociada a tu perfil en dev.' }}
        </span>
      </div>

      <form :action="urls.loginAction" method="POST">
        <div class="kc-btn-row">
          <button v-if="triggered_from_aia" type="submit" name="cancel-aia" value="true" class="kc-btn-secondary">
            {{ texts.cancelButton || 'Cancelar' }}
          </button>
          <a v-else :href="urls.login" class="kc-btn-secondary" style="text-decoration:none; display:flex; align-items:center; justify-content:center;">
            {{ texts.cancelButton || 'Cancelar' }}
          </a>

          <button type="submit" class="kc-btn-danger">
            {{ texts.confirmButton || 'Eliminar cuenta' }}
            <svg style="width:16px;height:16px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
