<script setup>
  import { ref, computed } from 'vue';
  import { useKeycloakContext } from '@/login/core/adapters/kc-ctx';

  const { realm, urls, message, config } = useKeycloakContext();
  const texts = computed(() => config.pages?.recoveryCodeInput || {});

  const recoveryCode = ref('');

  // Auto-format input as XXXX-XXXX or accept clean digits
  const onInput = (e) => {
    let val = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (val.length > 4) {
      val = val.substring(0, 4) + '-' + val.substring(4, 8);
    }
    recoveryCode.value = val;
  };
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
      <div class="kc-icon-circle">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      </div>

      <h2 class="kc-page-title">{{ texts.title || 'Código de recuperación' }}</h2>
      <p class="kc-page-subtitle">{{ texts.subtitle || 'Introduce uno de tus códigos de emergencia de un solo uso para verificar tu identidad y acceder.' }}</p>

      <div v-if="message.hasError" class="kc-alert kc-alert-danger" style="margin-bottom: 1rem;">
        <span>{{ message.summary }}</span>
      </div>

      <form :action="urls.loginAction" method="POST">
        <div class="kc-code-input-wrapper">
          <label class="kc-label">{{ texts.label || 'Código de respaldo' }}</label>
          <input
            type="text"
            name="recoveryCodeInput"
            class="kc-input-code"
            :placeholder="texts.placeholder || '8492-1049'"
            :value="recoveryCode"
            @input="onInput"
            autofocus
            autocomplete="one-time-code"
            required
          />
        </div>

        <button type="submit" class="kc-btn-primary" style="margin-bottom: 1.25rem;">
          {{ texts.submitButton || 'Verificar e ingresar' }}
          <svg style="width:16px;height:16px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>

        <div>
          <a :href="urls.loginRestartFlowUrl || urls.login" class="kc-back-link">
            <svg style="width:14px;height:14px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {{ texts.backLink || 'Volver a métodos habituales' }}
          </a>
        </div>
      </form>
    </div>
  </div>
</template>
