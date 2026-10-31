<script setup>
  import { ref, computed } from 'vue';
  import { useKeycloakContext } from '@/login/core/adapters/kc-ctx';

  const { realm, urls, recoveryCodesConfig, config } = useKeycloakContext();
  const texts = computed(() => config.pages?.recoveryCodesConfig || {});

  const codes = computed(() => recoveryCodesConfig.generatedRecoveryAuthnCodesList || []);
  const codesAsString = computed(() => recoveryCodesConfig.generatedRecoveryAuthnCodesAsString || '');
  const generatedAt = computed(() => recoveryCodesConfig.generatedAt || '');

  const isConfirmed = ref(false);
  const copySuccess = ref(false);

  // Format code into 4-char groups (e.g. 8492-1049)
  const formatCode = (code) => {
    if (!code) return '';
    return code.replace(/(.{4})/g, '$1-').replace(/-$/, '');
  };

  const copyAllCodes = async () => {
    try {
      const formatted = codes.value.map((c, i) => `${i + 1}. ${formatCode(c)}`).join('\n');
      await navigator.clipboard.writeText(formatted);
      copySuccess.value = true;
      setTimeout(() => { copySuccess.value = false; }, 2500);
    } catch (e) {
      console.error('Error copying codes', e);
    }
  };

  const downloadCodes = () => {
    const formatted = `=== CÓDIGOS DE RECUPERACIÓN 2FA (${realm.name || 'dev'}) ===\n\n` +
      codes.value.map((c, i) => `Código ${i + 1}: ${formatCode(c)}`).join('\n') +
      `\n\nGenerado: ${new Date().toLocaleString()}\nGuarda este archivo en un lugar seguro y confidencial.`;
    
    const blob = new Blob([formatted], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `recovery-codes-${realm.name || 'dev'}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
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
      <div class="kc-status-pill">
        <svg style="width:12px;height:12px" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
        {{ texts.step || 'Paso 2 de 2' }}
      </div>
    </div>

    <div class="kc-compact-body">
      <h2 class="kc-page-title">{{ texts.title || 'Códigos de recuperación 2FA' }}</h2>
      <p class="kc-page-subtitle">{{ texts.subtitle || 'Guarda estos códigos de un solo uso en un lugar seguro. Te permitirán acceder si pierdes el teléfono o la llave de seguridad.' }}</p>

      <div class="kc-codes-box">
        <div class="kc-codes-grid">
          <div v-for="(code, idx) in codes" :key="idx" class="kc-code-item">
            <span class="kc-code-num">{{ String(idx + 1).padStart(2, '0') }}</span>
            <span>{{ formatCode(code) }}</span>
          </div>
        </div>
      </div>

      <div class="kc-codes-actions">
        <button type="button" @click="copyAllCodes" class="kc-action-btn">
          <svg style="width:14px;height:14px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          {{ copySuccess ? (texts.copied || '¡Copiados!') : (texts.copyAll || 'Copiar todos') }}
        </button>
        <button type="button" @click="downloadCodes" class="kc-action-btn">
          <svg style="width:14px;height:14px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {{ texts.downloadTxt || 'Descargar archivo (.txt)' }}
        </button>
      </div>

      <form :action="urls.loginAction" method="POST">
        <input type="hidden" name="generatedRecoveryAuthnCodes" :value="codesAsString" />
        <input type="hidden" name="generatedAt" :value="generatedAt" />
        <input type="hidden" name="userLabel" value="Códigos de recuperación de respaldo" />

        <label class="kc-confirm-check">
          <input type="checkbox" v-model="isConfirmed" name="kcRecoveryCodesConfirmationCheck" />
          <span>{{ texts.confirmCheck || 'He guardado y respaldado estos códigos de recuperación en un lugar seguro y confidencial.' }}</span>
        </label>

        <button type="submit" :disabled="!isConfirmed" class="kc-btn-primary" :style="{ opacity: isConfirmed ? 1 : 0.6, cursor: isConfirmed ? 'pointer' : 'not-allowed' }">
          {{ texts.continueButton || 'Confirmar y continuar' }}
          <svg style="width:16px;height:16px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </form>
    </div>
  </div>
</template>
