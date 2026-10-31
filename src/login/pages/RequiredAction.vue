<script setup>
  import { computed, onMounted } from 'vue';
  import { useKeycloakContext, safeUrl } from '@/login/core/adapters/kc-ctx';
  import Button from "@/login/components/ui/Button.vue";

  const { urls, realm, config } = useKeycloakContext();
  
  const texts = config.pages?.requiredAction || {};
  const rawActionUri = window.kc_context?.actionUri || '';
  const actionUri = safeUrl(rawActionUri ? rawActionUri.replace(/&amp;/g, '&') : '', '');
  const requiredActions = window.kc_context?.requiredActions || [];
  
  const rawRedirectUri = window.kc_context?.pageRedirectUri || window.kc_context?.client?.baseUrl || '';
  const pageRedirectUri = safeUrl(rawRedirectUri ? rawRedirectUri.replace(/&amp;/g, '&') : '', '');

  const messageType = (window.kc_context?.message?.type || '').toLowerCase();
  const messageSummary = window.kc_context?.message?.summary || '';
  const messageHeader = window.kc_context?.message?.header || '';

  // 1. Pending required action (with actionUri and remaining actions)
  const hasPendingAction = computed(() => {
    return !!actionUri && requiredActions.length > 0;
  });

  // 2. Success state (Keycloak server returned success type OR completed flow with redirectUri)
  const isSuccess = computed(() => {
    return messageType === 'success' || (!hasPendingAction.value && !!pageRedirectUri);
  });

  // 3. Dynamic Title (from Keycloak server header or i18n fallback)
  const displayTitle = computed(() => {
    if (messageHeader) return messageHeader;
    if (isSuccess.value) return texts.successTitle || 'Operación Exitosa';
    if (hasPendingAction.value) return texts.actionPill || 'Acción Requerida';
    return texts.infoTitleFallback || 'Información';
  });

  // 4. Dynamic Description (Keycloak provides translated summary natively)
  const displayDescription = computed(() => {
    if (messageSummary) return messageSummary;
    if (isSuccess.value) return texts.successDesc || 'La operación se completó exitosamente.';
    if (hasPendingAction.value) return texts.actionDesc || 'Se requiere completar esta acción en tu cuenta para continuar.';
    return texts.infoDescFallback || 'Tu solicitud ha sido procesada.';
  });

  // 5. Unified Status Theme (Pill, Dot, Icon, and Contextual Guidance)
  const statusTheme = computed(() => {
    if (hasPendingAction.value) {
      return {
        type: 'action',
        pillClass: 'kc-status-pill-blue',
        dotClass: 'kc-dot-blue',
        pillText: texts.actionPill || 'Acción Requerida',
        helpBold: texts.actionHelpBold || 'Redirección automática',
        helpText: texts.actionRedirectText || 'Te estamos dirigiendo al formulario correspondiente...',
      };
    }
    if (isSuccess.value) {
      return {
        type: 'success',
        pillClass: 'kc-status-pill-green',
        dotClass: 'kc-dot-green',
        pillText: texts.successPill || 'Operación Exitosa',
        helpBold: texts.successHelpBold || 'Cuenta protegida',
        helpText: messageSummary || (texts.successHelpFallback || 'Operación realizada con éxito.'),
      };
    }
    return {
      type: 'info',
      pillClass: 'kc-status-pill-blue',
      dotClass: 'kc-dot-blue',
      pillText: texts.infoPill || 'Información',
      helpBold: texts.emailHelpBold || 'Notificación',
      helpText: messageSummary || (texts.infoDescFallback || 'Tu solicitud ha sido procesada.'),
    };
  });

  // 6. Primary Button label
  const buttonLabel = computed(() => {
    if (hasPendingAction.value) {
      return texts.actionContinueBtn || 'Continuar al formulario';
    }
    if (pageRedirectUri) {
      return texts.successContinueApp || texts.continueBtn || 'Continuar a la aplicación';
    }
    return texts.successGoToLogin || texts.backToLogin || 'Ir al inicio de sesión';
  });

  // Primary action button handler
  const onPrimaryClick = () => {
    if (hasPendingAction.value && actionUri) {
      window.location.href = actionUri;
    } else if (pageRedirectUri) {
      window.location.href = pageRedirectUri;
    } else {
      window.location.href = urls.login || '/';
    }
  };

  onMounted(() => {
    if (hasPendingAction.value && actionUri) {
      setTimeout(() => {
        window.location.replace(actionUri);
      }, 300);
    }
  });
</script>

<template>
  <div class="kc-compact-card">
    
    <!-- Dark Header at top -->
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
      <div 
        class="kc-status-pill"
        :class="statusTheme.pillClass"
      >
        <!-- Success Check Icon -->
        <svg v-if="statusTheme.type === 'success'" class="kc-status-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <!-- Action Lock Icon -->
        <svg v-else-if="statusTheme.type === 'action'" class="kc-status-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <!-- Info Icon -->
        <svg v-else class="kc-status-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ statusTheme.pillText }}</span>
      </div>

      <!-- Title & Description -->
      <h1 class="kc-compact-title">{{ displayTitle }}</h1>
      <p class="kc-compact-desc">{{ displayDescription }}</p>

      <!-- Contextual Help Box -->
      <div class="kc-help-box">
        <div class="kc-dot-indicator" :class="statusTheme.dotClass"></div>
        <div class="kc-help-text">
          <span class="kc-help-bold">{{ statusTheme.helpBold }}</span>
          {{ statusTheme.helpText }}
        </div>
      </div>

      <!-- Submit / Redirect Button -->
      <div class="kc-submit-wrapper">
        <Button
          class-name="kc-submit-btn"
          :label="buttonLabel"
          type="button"
          :onClick="onPrimaryClick"
        />
      </div>

      <!-- Back Link -->
      <div v-if="!hasPendingAction" class="kc-back-link-wrapper">
        <a :href="urls.login || '/'" class="kc-back-link">
          {{ texts.backToLogin || 'Volver al inicio de sesión' }}
        </a>
      </div>

    </div>
  </div>
</template>
