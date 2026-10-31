<script setup>
  import { ref, computed } from 'vue';
  import { useKeycloakContext } from '@/login/core/adapters/kc-ctx';

  const { realm, device, urls, config } = useKeycloakContext();
  const texts = computed(() => config.pages?.deviceVerify || {});

  const userCode = ref(device.userCode || '');
  const formAction = computed(() => device.verificationAction || urls.loginAction);

  const onInput = (e) => {
    let val = e.target.value.toUpperCase();
    userCode.value = val;
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
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>

      <h2 class="kc-page-title">{{ texts.title || 'Vincular dispositivo' }}</h2>
      <p class="kc-page-subtitle">{{ texts.subtitle || 'Introduce el código alfanumérico que aparece en la pantalla de tu consola, CLI o televisor.' }}</p>

      <form :action="formAction" method="POST">
        <div class="kc-code-input-wrapper">
          <label class="kc-label">{{ texts.label || 'Código de vinculación' }}</label>
          <input
            type="text"
            name="device_user_code"
            class="kc-input-device-code"
            :placeholder="texts.placeholder || 'WDJB-HGXX'"
            :value="userCode"
            @input="onInput"
            maxlength="10"
            autofocus
            dir="ltr"
            autocomplete="off"
            required
          />
        </div>

        <button type="submit" class="kc-btn-primary">
          {{ texts.submitButton || 'Continuar y autorizar' }}
          <svg style="width:16px;height:16px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </form>
    </div>
  </div>
</template>
