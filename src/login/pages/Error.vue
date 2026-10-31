<script setup>
  import { computed } from 'vue';
  import { useKeycloakContext } from '@/login/core/adapters/kc-ctx';
  import Button from "@/login/components/ui/Button.vue";

  const { message, urls, realm, config } = useKeycloakContext();
  
  const texts = config.pages?.error || {};
  const clientBaseUrl = window.kc_context?.client?.baseUrl || urls.login || '/';
  const loginRestartUrl = urls.loginRestartFlowUrl || urls.login || '/';

  // Check if message indicates expiration
  const isExpired = computed(() => {
    const sum = (message.summary || '').toLowerCase();
    return sum.includes('expired') || sum.includes('expirad') || sum.includes('caducad');
  });

  // Action token expired (e.g. email reset password link)
  const isActionTokenExpired = computed(() => {
    const isTokenUrl = window.location.href.includes('action-token') || window.location.href.includes('key=');
    return isExpired.value && isTokenUrl;
  });

  // Login session / idle page expired
  const isSessionExpired = computed(() => {
    return (isExpired.value && !isActionTokenExpired.value) || window.kc_context?.pageId === 'page-expired';
  });

  // Check if it's a redirect / client configuration error
  const isRedirectError = computed(() => {
    const sum = (message.summary || '').toLowerCase();
    return sum.includes('redirect_uri') || sum.includes('client');
  });

  const requestNewLink = () => {
    window.location.href = urls.loginResetCredentials || urls.login || '/';
  };

  const restartLogin = () => {
    window.location.href = loginRestartUrl;
  };

  const goBack = () => {
    window.location.href = clientBaseUrl;
  };
</script>

<template>
  <div class="kc-compact-card">
    
    <!-- Dark Header at the top (with logo & realm name) -->
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
      
      <!-- ==============================================
           SCENARIO 1: ACTION TOKEN EXPIRED (Email link)
           ============================================== -->
      <template v-if="isActionTokenExpired">
        <div class="kc-status-pill kc-status-pill-amber">
          <svg class="kc-status-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ texts.expiredTokenPill || 'Token Caducado' }}</span>
        </div>

        <h1 class="kc-compact-title">{{ texts.expiredTokenTitle || 'El enlace ha expirado' }}</h1>
        <p class="kc-compact-desc">
          {{ texts.expiredTokenDesc || 'Este enlace ya no es válido porque se utilizó anteriormente o superó su tiempo de vigencia permitido.' }}
        </p>

        <div class="kc-help-box">
          <div class="kc-dot-indicator kc-dot-amber"></div>
          <div class="kc-help-text">
            <span class="kc-help-bold">{{ texts.expiredTokenHelpBold || '¿Cómo continuar?' }}</span>
            {{ texts.expiredTokenHelpText || 'Solicita un nuevo enlace de restablecimiento con tu correo electrónico registrado.' }}
          </div>
        </div>

        <div class="kc-submit-wrapper">
          <Button
            class-name="kc-submit-btn"
            :label="texts.expiredTokenButton || 'Solicitar nuevo enlace'"
            type="button"
            :onClick="requestNewLink"
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
      </template>

      <!-- ==============================================
           SCENARIO 2: LOGIN SESSION EXPIRED (Idle in login)
           ============================================== -->
      <template v-else-if="isSessionExpired">
        <div class="kc-status-pill kc-status-pill-amber">
          <svg class="kc-status-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ texts.sessionExpiredPill || 'Sesión Expirada' }}</span>
        </div>

        <h1 class="kc-compact-title">{{ texts.sessionExpiredTitle || 'La sesión ha caducado' }}</h1>
        <p class="kc-compact-desc">
          {{ texts.sessionExpiredDesc || 'Por seguridad, la sesión de acceso ha vencido debido a un periodo prolongado de inactividad. Puedes reiniciar el proceso para continuar.' }}
        </p>

        <div class="kc-help-box">
          <div class="kc-dot-indicator kc-dot-amber"></div>
          <div class="kc-help-text">
            <span class="kc-help-bold">{{ texts.sessionExpiredHelpBold || 'Protección de cuenta' }}</span>
            {{ message.summary || (texts.sessionExpiredHelpText || 'La sesión temporal de autenticación ha vencido.') }}
          </div>
        </div>

        <div class="kc-submit-wrapper">
          <Button
            class-name="kc-submit-btn"
            :label="texts.sessionRestartButton || 'Reiniciar inicio de sesión'"
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
      </template>

      <!-- ==============================================
           SCENARIO 3: REDIRECT OR GENERAL ERROR
           ============================================== -->
      <template v-else>
        <div class="kc-status-pill kc-status-pill-red">
          <svg class="kc-status-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{{ isRedirectError ? (texts.redirectPill || 'Error de Redirección') : (texts.generalPill || 'Error del Servidor') }}</span>
        </div>

        <h1 class="kc-compact-title">
          {{ isRedirectError ? (texts.redirectTitle || 'Solicitud no autorizada') : (texts.generalTitle || 'Error al procesar la solicitud') }}
        </h1>
        <p class="kc-compact-desc">
          {{ isRedirectError 
              ? (texts.redirectDesc || 'No se pudo completar el flujo porque los parámetros de retorno no están autorizados para este cliente.') 
              : (texts.generalDesc || 'Ocurrió un error inesperado al procesar la solicitud.') 
          }}
        </p>

        <!-- Technical Server Detail -->
        <div class="kc-tech-detail-box">
          <span class="kc-tech-label">{{ texts.techLabel || 'Detalle del Servidor' }}</span>
          <code class="kc-tech-code">{{ message.summary || (texts.techFallback || 'Error no especificado') }}</code>
        </div>

        <!-- Actions -->
        <div class="kc-submit-wrapper">
          <Button
            class-name="kc-submit-btn kc-btn-dark"
            :label="texts.backToApplication || 'Volver a la aplicación'"
            type="button"
            :onClick="goBack"
          />
        </div>

        <div class="kc-back-link-wrapper">
          <a :href="urls.login || '/'" class="kc-back-link">
            {{ texts.backToLogin || 'Volver al inicio de sesión' }}
          </a>
        </div>
      </template>

    </div>
  </div>
</template>
