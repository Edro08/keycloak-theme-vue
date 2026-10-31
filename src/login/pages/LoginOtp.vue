<script setup>
  import { ref } from 'vue';
  import { useKeycloakContext } from '@/login/core/adapters/kc-ctx';
  import { useFormSubmit } from '@/login/core/adapters/form-submit';
  import Button from "@/login/components/ui/Button.vue";

  const { message, urls, realm, config } = useKeycloakContext();
  const { submitKCForm } = useFormSubmit();

  const texts = config.pages?.loginOtp || {};

  const otpLoginData = window.kc_context?.otpLogin || {};
  const credentials = otpLoginData.userOtpCredentials || [];
  const selectedCredentialId = ref(otpLoginData.selectedCredentialId || (credentials[0]?.id || ''));

  const otpCode = ref('');
  const isSubmitting = ref(false);

  const onSubmit = () => {
    if (!otpCode.value.trim()) return;
    
    isSubmitting.value = true;
    
    const fields = {
      otp: otpCode.value.trim(),
      login: 'true'
    };

    if (selectedCredentialId.value) {
      fields.selectedCredentialId = selectedCredentialId.value;
    }

    submitKCForm({
      action: urls.loginAction,
      method: 'post',
      fields
    });
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
      
      <!-- Status Pill -->
      <div class="kc-status-pill kc-status-pill-blue">
        <svg class="kc-status-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>{{ texts.pill || 'Verificación en Dos Pasos' }}</span>
      </div>

      <h1 class="kc-compact-title">{{ texts.title || 'Código de autenticación' }}</h1>
      <p class="kc-compact-desc">
        {{ texts.desc || 'Introduce el código de 6 dígitos que muestra tu aplicación de autenticación para verificar tu identidad.' }}
      </p>

      <!-- Alert if previous attempt had error -->
      <div v-if="message.summary" class="kc-error-card" style="margin-bottom: 1.25rem;">
        <svg class="kc-error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="kc-error-text">{{ message.summary }}</span>
      </div>

      <!-- Multiple credentials selection if applicable -->
      <div v-if="credentials.length > 1" class="kc-form-group" style="margin-bottom: 1.25rem;">
        <label class="kc-field-label">{{ texts.deviceSelectorLabel || 'Selecciona tu dispositivo' }}</label>
        <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.5rem;">
          <label
            v-for="cred in credentials"
            :key="cred.id"
            class="kc-checkbox-label"
            style="padding: 0.5rem 0.75rem; border: 1px solid var(--color-slate-200); border-radius: var(--radius-sm); cursor: pointer;"
          >
            <input
              type="radio"
              name="credentialSelector"
              :value="cred.id"
              v-model="selectedCredentialId"
            />
            <span style="font-weight: 600; font-size: 0.85rem; color: var(--color-slate-800);">
              {{ cred.userLabel }}
            </span>
          </label>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="onSubmit">
        
        <div class="kc-form-group">
          <label for="otp" class="kc-field-label">
            {{ texts.otpLabel || 'Código temporal' }} <span style="color: #ef4444;">*</span>
          </label>
          <div class="kc-input-wrapper">
            <svg class="kc-input-leading-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            <input
              id="otp"
              name="otp"
              v-model="otpCode"
              type="text"
              class="kc-input-with-icon"
              :placeholder="texts.otpPlaceholder || 'Ej. 123456'"
              inputmode="numeric"
              autocomplete="one-time-code"
              autofocus
              required
            />
          </div>
        </div>

        <!-- Submit Button -->
        <div class="kc-submit-wrapper">
          <Button
            class-name="kc-submit-btn"
            :label="texts.submitButton || 'Verificar e iniciar sesión'"
            type="submit"
            :loading="isSubmitting"
          />
        </div>

        <!-- Back to login link -->
        <div class="kc-back-link-wrapper">
          <a :href="urls.login || '/'" class="kc-back-link">
            <svg class="kc-arrow-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {{ texts.backToLogin || 'Volver al inicio de sesión' }}
          </a>
        </div>

      </form>

    </div>
  </div>
</template>
