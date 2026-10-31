<script setup>
  import { ref, onMounted } from 'vue';
  import { useKeycloakContext } from '@/login/core/adapters/kc-ctx';
  import { useFormSubmit } from '@/login/core/adapters/form-submit';
  import Button from "@/login/components/ui/Button.vue";

  const { message, urls, realm, config } = useKeycloakContext();
  const { submitKCForm } = useFormSubmit();

  const texts = config.pages?.configureTotp || {};

  const totpData = window.kc_context?.totp || {};
  const totpSecretQrCode = totpData.totpSecretQrCode || '';
  const totpSecretEncoded = totpData.totpSecretEncoded || '';
  const totpSecret = totpData.totpSecret || '';
  const rawMode = window.kc_context?.mode || 'barcode';

  // Memory hygiene: clean sensitive TOTP secret from global window once read into component
  onMounted(() => {
    if (window.kc_context?.totp) {
      try { delete window.kc_context.totp; } catch (_) {}
    }
  });

  const otpCode = ref('');
  const userLabel = ref('');
  const logoutSessions = ref(false);
  const showManual = ref(rawMode === 'manual' || !totpSecretQrCode);
  const isCopied = ref(false);
  const isSubmitting = ref(false);

  const toggleManual = () => {
    showManual.value = !showManual.value;
  };

  const copySecret = async () => {
    try {
      await navigator.clipboard.writeText(totpSecretEncoded);
      isCopied.value = true;
      setTimeout(() => {
        isCopied.value = false;
      }, 2000);
    } catch (e) {
      const el = document.createElement('textarea');
      el.value = totpSecretEncoded;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      isCopied.value = true;
      setTimeout(() => {
        isCopied.value = false;
      }, 2000);
    }
  };

  const onSubmit = () => {
    if (!otpCode.value.trim()) return;
    
    isSubmitting.value = true;
    
    const fields = {
      totp: otpCode.value.trim(),
      userLabel: userLabel.value.trim() || 'Dispositivo autenticador',
      totpSecret: totpSecret,
      mode: showManual.value ? 'manual' : 'barcode'
    };

    if (logoutSessions.value) {
      fields['logout-sessions'] = 'on';
    }

    submitKCForm({
      action: urls.loginAction,
      method: 'post',
      fields
    });
  };
</script>

<template>
  <div class="kc-compact-card kc-totp-card">
    
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
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span>{{ texts.pill || 'Autenticación de Dos Factores' }}</span>
      </div>

      <h1 class="kc-compact-title">{{ texts.title || 'Configurar autenticador (OTP)' }}</h1>
      <p class="kc-compact-desc">
        {{ texts.desc || 'Escanea el código QR con tu aplicación autenticadora (Google Authenticator, Microsoft Authenticator o Authy) e introduce el código generado.' }}
      </p>

      <!-- Alert if previous attempt had error -->
      <div v-if="message.summary" class="kc-error-card" style="margin-bottom: 1.25rem;">
        <svg class="kc-error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="kc-error-text">{{ message.summary }}</span>
      </div>

      <!-- Step 1: QR Code Box -->
      <div class="kc-qr-container">
        <template v-if="!showManual && totpSecretQrCode">
          <img
            :src="'data:image/png;base64, ' + totpSecretQrCode"
            alt="Código QR TOTP"
            class="kc-qr-image"
          />
          <div class="kc-qr-hint">
            {{ texts.qrHint || 'Abre tu aplicación y escanea esta imagen' }}
          </div>
          <button type="button" class="kc-manual-toggle" @click="toggleManual">
            {{ texts.manualToggle || '¿No puedes escanear el código? Ver clave manual' }}
          </button>
        </template>

        <template v-else>
          <div style="width: 100%;">
            <span class="kc-tech-label">{{ texts.manualTitle || 'Clave Secreta Manual' }}</span>
            <div class="kc-manual-box">
              <span class="kc-manual-code">{{ totpSecretEncoded || totpSecret }}</span>
              <button type="button" class="kc-copy-btn" @click="copySecret">
                {{ isCopied ? (texts.copiedBtn || '¡Copiado!') : (texts.copyBtn || 'Copiar') }}
              </button>
            </div>
            <div class="kc-qr-hint" style="margin-top: 0.5rem; text-align: left;">
              {{ texts.manualHint || 'Introduce esta clave directamente en tu aplicación de autenticación.' }}
            </div>
          </div>
          <button v-if="totpSecretQrCode" type="button" class="kc-manual-toggle" @click="toggleManual" style="margin-top: 0.75rem;">
            {{ texts.manualBack || '← Volver a mostrar código QR' }}
          </button>
        </template>
      </div>

      <!-- Step 2: Form -->
      <form @submit.prevent="onSubmit">
        
        <!-- OTP Code Input -->
        <div class="kc-form-group">
          <label for="totp" class="kc-field-label">
            {{ texts.otpLabel || 'Código de autenticación' }} <span style="color: #ef4444;">*</span>
          </label>
          <div class="kc-input-wrapper">
            <svg class="kc-input-leading-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <input
              id="totp"
              name="totp"
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

        <!-- Device Name Input -->
        <div class="kc-form-group">
          <label for="userLabel" class="kc-field-label">
            {{ texts.deviceLabel || 'Nombre del dispositivo (opcional)' }}
          </label>
          <div class="kc-input-wrapper">
            <svg class="kc-input-leading-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <input
              id="userLabel"
              name="userLabel"
              v-model="userLabel"
              type="text"
              class="kc-input-with-icon"
              :placeholder="texts.devicePlaceholder || 'Ej. Mi celular / Google Authenticator'"
            />
          </div>
        </div>

        <!-- Logout other sessions checkbox -->
        <div class="kc-remember-row">
          <label class="kc-checkbox-label" for="kc-ck-logout">
            <input
              type="checkbox"
              id="kc-ck-logout"
              v-model="logoutSessions"
            />
            <span>{{ texts.logoutOtherSessions || 'Cerrar sesión en otros dispositivos' }}</span>
          </label>
        </div>

        <!-- Submit Button -->
        <div class="kc-submit-wrapper">
          <Button
            class-name="kc-submit-btn"
            :label="texts.submitButton || 'Guardar y Activar 2FA'"
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
