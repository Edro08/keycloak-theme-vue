<script setup>
  import { ref, computed } from 'vue';
  import { useKeycloakContext } from '@/login/core/adapters/kc-ctx';
  import { useFormSubmit } from '@/login/core/adapters/form-submit';

  const { realm, urls, message, config, termsText: rawTermsText, termsTitle: rawTermsTitle } = useKeycloakContext();
  const { submitKCForm } = useFormSubmit();

  const texts = config.pages?.terms || {};
  const accepted = ref(false);
  const isSubmitting = ref(false);

  // Fallback LAB terms in case Keycloak doesn't have termsText set
  const defaultLabTerms = `
    <p><strong>1. Entorno de Laboratorio y Pruebas (LAB)</strong><br>
    Este sistema, diseño y flujo de autenticación corresponden exclusivamente a un <strong>entorno de laboratorio, experimentación y pruebas técnicas (LAB)</strong>. No constituye un servicio de producción.</p>
    <p><strong>2. Manejo de Datos y Privacidad</strong><br>
    Por favor, <strong>no ingreses información confidencial, contraseñas reales ni datos personales sensibles</strong>. Todas las cuentas, correos y credenciales registradas aquí son tratados como datos ficticios con fines de prueba y validación de interfaz.</p>
    <p><strong>3. Disponibilidad y Purgado de Información</strong><br>
    Al tratarse de un entorno de pruebas en continuo desarrollo, las cuentas de usuario, sesiones y configuraciones pueden ser modificadas, reiniciadas o eliminadas sin previo aviso como parte de los despliegues del laboratorio.</p>
    <p><strong>4. Conformidad de Uso</strong><br>
    El acceso a esta plataforma está destinado a la evaluación funcional, pruebas de integración y diseño de experiencia de usuario (UX/UI).</p>
    <p><em>Al continuar y presionar «Aceptar y continuar», confirmas que comprendes y aceptas operar bajo las condiciones de este entorno de laboratorio (LAB).</em></p>
  `;

  const decodeEntities = (val) => {
    if (!val) return '';
    return val
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&');
  };

  // Use Keycloak terms text if provided and valid, otherwise fallback
  const termsContent = computed(() => {
    const raw = rawTermsText || window.kc_context?.termsText;
    if (raw && raw !== 'termsText' && raw.trim() !== '') {
      return decodeEntities(raw);
    }
    return defaultLabTerms;
  });

  const onAccept = () => {
    if (!accepted.value || isSubmitting.value) return;
    isSubmitting.value = true;
    submitKCForm({
      action: urls.loginAction,
      method: 'POST',
      fields: {
        accept: 'true'
      }
    });
  };

  const onCancel = () => {
    if (isSubmitting.value) return;
    isSubmitting.value = true;
    submitKCForm({
      action: urls.loginAction,
      method: 'POST',
      fields: {
        cancel: 'true'
      }
    });
  };
</script>

<template>
  <div class="kc-compact-card kc-card-wide">
    
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
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span>{{ texts.pill || 'Términos del Servicio' }}</span>
      </div>

      <!-- Title & Subtitle -->
      <h1 class="kc-compact-title">
        {{ (rawTermsTitle && rawTermsTitle !== 'termsTitle') ? rawTermsTitle : (texts.title || 'Términos y Condiciones') }}
      </h1>
      <p class="kc-compact-desc">
        {{ texts.subtitle || 'Por favor revisa y acepta los términos de uso y políticas del entorno de laboratorio para continuar.' }}
      </p>

      <!-- Alert if message error -->
      <div v-if="message.hasError" class="kc-error-card" role="alert" style="margin-bottom: 1.15rem;">
        <svg class="kc-error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="kc-error-text">{{ message.summary }}</span>
      </div>

      <!-- Scrollable Terms Box -->
      <div class="kc-terms-box" v-html="termsContent"></div>

      <!-- Acceptance Checkbox -->
      <label class="kc-checkbox-label">
        <input type="checkbox" v-model="accepted" :disabled="isSubmitting" />
        <span>{{ texts.acceptCheckbox || 'He leído y acepto los Términos del Servicio y las Políticas de Privacidad.' }}</span>
      </label>

      <!-- Action Buttons Row -->
      <div class="kc-btn-row">
        <button
          type="button"
          class="kc-btn-secondary"
          @click="onCancel"
          :disabled="isSubmitting"
        >
          {{ texts.declineButton || 'Rechazar' }}
        </button>

        <button
          type="button"
          class="kc-submit-btn"
          @click="onAccept"
          :disabled="!accepted || isSubmitting"
        >
          <span v-if="isSubmitting">...</span>
          <span v-else>{{ texts.acceptButton || 'Aceptar y continuar' }}</span>
        </button>
      </div>

    </div>

  </div>
</template>
