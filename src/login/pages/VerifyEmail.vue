<script setup>
  import { ref } from 'vue';
  import { useKeycloakContext } from "@/login/core/adapters/kc-ctx";
  import Button from "@/login/components/ui/Button.vue";

  const { realm, urls, user, message, config } = useKeycloakContext();

  const texts = config.pages?.verifyEmail || {};
  const isResending = ref(false);

  const onResend = () => {
    isResending.value = true;
    window.location.href = urls.loginAction;
  };
</script>

<template>
  <div class="kc-compact-card">
    
    <!-- Top Dark Header with Brand -->
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

    <!-- Body -->
    <div class="kc-compact-body">
      
      <!-- Status Pill -->
      <div class="kc-status-pill kc-status-pill-blue">
        <svg class="kc-status-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span>{{ texts.pill || 'Verificación Pendiente' }}</span>
      </div>

      <h1 class="kc-compact-title">{{ texts.title || 'Revisa tu correo' }}</h1>
      <p class="kc-compact-desc">
        {{ texts.desc || 'Hemos enviado un enlace de confirmación a' }}
        <span class="kc-email-highlight" style="font-weight: 700; color: var(--color-slate-800);">{{ user.email || 'tu correo' }}</span>.
        {{ texts.descEnd || 'Por favor abre el enlace para activar tu cuenta.' }}
      </p>

      <!-- Message Alert (Success or Info if re-sent) -->
      <div v-if="message.summary" :class="message.hasError ? 'kc-error-card' : (message.isSuccess ? 'kc-success-card' : 'kc-info-card')" role="alert">
        <svg v-if="message.hasError" class="kc-error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg v-else-if="message.isSuccess" class="kc-success-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <svg v-else class="kc-info-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ message.summary }}</span>
      </div>

      <!-- Contextual Help Box -->
      <div class="kc-help-box">
        <div class="kc-dot-indicator kc-dot-blue"></div>
        <div class="kc-help-text">
          <span class="kc-help-bold">{{ texts.helpBold || '¿No recibiste el correo?' }}</span>
          {{ texts.helpText || 'Revisa tu carpeta de correo no deseado o spam. Si aún no lo encuentras, solicita un nuevo enlace abajo.' }}
        </div>
      </div>

      <!-- Resend Button -->
      <div class="kc-submit-wrapper">
        <Button
          class-name="kc-submit-btn"
          :label="texts.resendButton || 'Reenviar correo de verificación'"
          type="button"
          :loading="isResending"
          :disabled="isResending"
          :onClick="onResend"
        />
      </div>

      <!-- Back to Login -->
      <div class="kc-back-link-wrapper" style="margin-top: 1.25rem; text-align: center;">
        <a :href="urls.login" class="kc-back-link" style="font-size: 0.8rem; font-weight: 600; color: var(--color-slate-500); text-decoration: none;">
          {{ texts.backToLogin || 'Volver al inicio de sesión' }}
        </a>
      </div>

    </div>
  </div>
</template>
