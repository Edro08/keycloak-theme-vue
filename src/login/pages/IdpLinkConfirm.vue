<script setup>
  import { ref, computed } from 'vue';
  import { useKeycloakContext } from '@/login/core/adapters/kc-ctx';
  import { useFormSubmit } from '@/login/core/adapters/form-submit';

  const props = defineProps({
    isEmailStep: {
      type: Boolean,
      default: false
    }
  });

  const { realm, user, urls, message, config, idpAlias, idpDisplayName } = useKeycloakContext();
  const { submitKCForm } = useFormSubmit();

  const isSubmitting = ref(false);

  const textsConfirm = config.pages?.idpLinkConfirm || {};
  const textsEmail = config.pages?.idpLinkEmail || {};

  const providerLabel = computed(() => {
    return idpDisplayName || idpAlias || 'Google';
  });

  const targetEmail = computed(() => {
    return user.email || user.username || 'tu cuenta registrada';
  });

  const onConfirmLink = () => {
    if (isSubmitting.value) return;
    isSubmitting.value = true;
    submitKCForm({
      action: urls.loginAction,
      method: 'POST',
      fields: {
        submitAction: 'linkAccount'
      }
    });
  };

  const onCancel = () => {
    if (urls.login) {
      window.location.href = urls.login;
    }
  };

  const onResendEmail = () => {
    if (isSubmitting.value) return;
    isSubmitting.value = true;
    submitKCForm({
      action: urls.loginAction,
      method: 'GET',
      fields: {}
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
      
      <!-- MODE 1: Confirm Link Screen (login-idp-link-confirm) -->
      <template v-if="!isEmailStep">
        
        <!-- Status Pill -->
        <div class="kc-status-pill kc-status-pill-blue">
          <svg class="kc-status-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <span>{{ textsConfirm.pill || 'Vinculación de Cuentas' }}</span>
        </div>

        <h1 class="kc-compact-title">{{ textsConfirm.title || 'Vincular Cuenta Existente' }}</h1>
        <p class="kc-compact-desc">
          {{ textsConfirm.subtitle || 'Ya existe una cuenta con tu correo electrónico. Confirma para asociar tu acceso externo.' }}
        </p>

        <!-- Error Alert -->
        <div v-if="message.hasError" class="kc-error-card" role="alert" style="margin-bottom: 1.15rem;">
          <svg class="kc-error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="kc-error-text">{{ message.summary }}</span>
        </div>

        <!-- Visual Association Diagram Box -->
        <div class="kc-link-box">
          <div class="kc-link-diagram">
            
            <!-- External Node -->
            <div class="kc-node">
              <div class="kc-node-icon">
                <svg v-if="providerLabel.toLowerCase() === 'google'" width="22" height="22" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <svg v-else width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <span class="kc-node-label">{{ providerLabel }}</span>
            </div>

            <!-- Connector -->
            <div class="kc-link-connector">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <div class="kc-connector-line"></div>
            </div>

            <!-- Realm Account Node -->
            <div class="kc-node">
              <div class="kc-node-icon">
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span class="kc-node-label">Cuenta {{ realm.name || 'dev' }}</span>
            </div>

          </div>

          <div class="kc-link-notice">
            {{ textsConfirm.noticeIntro || 'Se vinculará el acceso con tu cuenta registrada:' }} <strong>{{ targetEmail }}</strong>. {{ textsConfirm.noticeDetail || 'En futuros accesos podrás ingresar tanto con tus credenciales habituales como mediante tu proveedor externo.' }}
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="kc-btn-row">
          <button
            type="button"
            class="kc-btn-secondary"
            @click="onCancel"
            :disabled="isSubmitting"
          >
            {{ textsConfirm.cancelButton || 'Cancelar' }}
          </button>

          <button
            type="button"
            class="kc-submit-btn"
            @click="onConfirmLink"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting">...</span>
            <span v-else>{{ textsConfirm.submitButton || 'Vincular cuenta' }}</span>
          </button>
        </div>

      </template>

      <!-- MODE 2: Email Confirmation Sent (login-idp-link-email) -->
      <template v-else>
        
        <!-- Status Pill -->
        <div class="kc-status-pill kc-status-pill-blue">
          <svg class="kc-status-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>{{ textsEmail.pill || 'Confirmación por Correo' }}</span>
        </div>

        <h1 class="kc-compact-title">{{ textsEmail.title || 'Confirma la Vinculación' }}</h1>
        <p class="kc-compact-desc">
          {{ textsEmail.subtitle || 'Se ha enviado un correo electrónico para verificar tu identidad y asociar el proveedor externo.' }}
        </p>

        <!-- Sent to email address highlight -->
        <div class="kc-highlight-email-box" style="background-color: var(--color-slate-50); border: 1px solid var(--color-slate-200); border-radius: var(--radius-sm); padding: 0.85rem 1rem; margin-bottom: 1.25rem; font-size: 0.82rem; color: var(--color-slate-700);">
          <span style="display: block; font-size: 0.72rem; color: var(--color-slate-500); margin-bottom: 0.2rem;">Enviado a:</span>
          <strong style="color: var(--color-slate-900);">{{ targetEmail }}</strong>
        </div>

        <!-- Help box -->
        <div class="kc-help-box" style="background-color: var(--primary-light); border: 1px solid #bfdbfe; border-radius: var(--radius-sm); padding: 0.85rem 1rem; margin-bottom: 1.25rem; font-size: 0.78rem; color: var(--color-slate-700); line-height: 1.45;">
          <strong style="color: var(--primary-hover); display: block; margin-bottom: 0.2rem;">{{ textsEmail.helpBold || '¿No recibiste el correo?' }}</strong>
          <span>{{ textsEmail.helpText || 'Revisa tu carpeta de spam o correo no deseado. Si aún no llega, puedes solicitar un nuevo reenvío.' }}</span>
        </div>

        <!-- Resend Button -->
        <button
          type="button"
          class="kc-submit-btn"
          @click="onResendEmail"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting">...</span>
          <template v-else>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>{{ textsEmail.resendButton || 'Reenviar correo de confirmación' }}</span>
          </template>
        </button>

        <!-- Back Link -->
        <div class="kc-back-link-wrapper" style="margin-top: 1.15rem; text-align: center;">
          <a :href="urls.login" class="kc-link" style="font-size: 0.8rem; font-weight: 600; color: var(--primary-color); text-decoration: none;">
            {{ textsEmail.backToLogin || 'Volver al inicio de sesión' }}
          </a>
        </div>

      </template>

    </div>

  </div>
</template>
