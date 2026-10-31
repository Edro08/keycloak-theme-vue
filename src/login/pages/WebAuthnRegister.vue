<script setup>
  import { ref } from 'vue';
  import { useKeycloakContext } from '@/login/core/adapters/kc-ctx';
  import { useFormSubmit } from '@/login/core/adapters/form-submit';
  import InputField from '@/login/components/ui/InputField.vue';

  const { realm, urls, message, config, webauthn } = useKeycloakContext();
  const { submitKCForm } = useFormSubmit();

  const texts = config.pages?.webauthn || {};
  const isSubmitting = ref(false);
  const localError = ref('');

  const keyName = ref('Mi llave de seguridad');

  // Base64URL helper
  const bufferToBase64Url = (buffer) => {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  };

  const base64UrlToBuffer = (base64url) => {
    if (!base64url) return new ArrayBuffer(0);
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  };

  const onRegisterKey = async () => {
    localError.value = '';

    if (!window.PublicKeyCredential) {
      localError.value = texts.errorUnsupported || 'Tu navegador o dispositivo no soporta autenticación WebAuthn / FIDO2.';
      return;
    }

    isSubmitting.value = true;

    try {
      // Build PublicKeyCredentialCreationOptions from Keycloak context
      const challengeBuf = webauthn?.challenge ? base64UrlToBuffer(webauthn.challenge) : new Uint8Array(32).buffer;
      const userHandleBuf = webauthn?.userId ? base64UrlToBuffer(webauthn.userId) : new TextEncoder().encode(webauthn?.username || 'user');

      const publicKey = {
        challenge: challengeBuf,
        rp: {
          name: webauthn?.rpEntityName || realm.name || 'Keycloak Auth',
          id: webauthn?.rpId || window.location.hostname
        },
        user: {
          id: userHandleBuf,
          name: webauthn?.username || 'user',
          displayName: webauthn?.username || 'user'
        },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 },  // ES256
          { type: 'public-key', alg: -257 } // RS256
        ],
        timeout: (webauthn?.createTimeout && webauthn.createTimeout > 0) ? webauthn.createTimeout * 1000 : 60000,
        authenticatorSelection: {
          requireResidentKey: webauthn?.requireResidentKey === 'Yes' || false,
          userVerification: webauthn?.userVerificationRequirement || 'preferred'
        },
        attestation: webauthn?.attestationConveyancePreference || 'none'
      };

      if (webauthn?.authenticatorAttachment && webauthn.authenticatorAttachment !== 'not specified') {
        publicKey.authenticatorSelection.authenticatorAttachment = webauthn.authenticatorAttachment;
      }

      // Invoke WebAuthn API on browser / Windows Hello / YubiKey
      const credential = await navigator.credentials.create({ publicKey });

      if (credential) {
        const clientDataJSON = bufferToBase64Url(credential.response.clientDataJSON);
        const attestationObject = bufferToBase64Url(credential.response.attestationObject);
        const transports = credential.response.getTransports ? credential.response.getTransports().join(',') : '';

        submitKCForm({
          action: urls.loginAction,
          method: 'POST',
          fields: {
            clientDataJSON,
            attestationObject,
            authenticatorLabel: keyName.value || 'Mi llave de seguridad',
            transports,
            publicKeyCredentialId: credential.id
          }
        });
      }
    } catch (err) {
      isSubmitting.value = false;
      console.error('WebAuthn error:', err);
      if (err.name === 'NotAllowedError') {
        localError.value = 'Operación cancelada o rechazada en el dispositivo.';
      } else {
        localError.value = err.message || 'Error al comunicarse con el autenticador de seguridad.';
      }
    }
  };

  const onSkip = () => {
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
      
      <!-- Status Pill -->
      <div class="kc-status-pill kc-status-pill-blue">
        <svg class="kc-status-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
        <span>{{ texts.pill || 'FIDO2 & Passkeys' }}</span>
      </div>

      <!-- Title & Subtitle -->
      <h1 class="kc-compact-title">{{ texts.title || 'Registra tu Clave de Seguridad' }}</h1>
      <p class="kc-compact-desc">
        {{ texts.subtitle || 'Añade una llave física (YubiKey), biometría de tu equipo (Windows Hello, Touch ID) o tu smartphone para ingresar sin contraseñas.' }}
      </p>

      <!-- Error Alerts -->
      <div v-if="localError || message.hasError" class="kc-error-card" role="alert" style="margin-bottom: 1.15rem;">
        <svg class="kc-error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="kc-error-text">{{ localError || message.summary }}</span>
      </div>

      <!-- Info Box -->
      <div class="kc-webauthn-box">
        <div class="kc-webauthn-icon-ring">
          <svg width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 004.07 7.07" />
          </svg>
        </div>
        <div class="kc-webauthn-text-block">
          <span class="kc-webauthn-title">{{ texts.boxTitle || 'Autenticación Biométrica y Llaves Físicas' }}</span>
          <span class="kc-webauthn-hint">{{ texts.boxDesc || 'Ten listo tu lector de huella, PIN de Windows Hello o conecta tu llave USB antes de continuar.' }}</span>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="onRegisterKey">
        
        <div class="kc-form-group">
          <label class="kc-field-label" for="kc-webauthn-name">{{ texts.labelName || 'Nombre descriptivo de la clave' }}</label>
          <div class="kc-input-wrapper">
            <svg class="kc-input-leading-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <InputField
              class-name="kc-input-with-icon"
              id="kc-webauthn-name"
              v-model="keyName"
              :placeholder="texts.placeholderName || 'Ej. Mi laptop de trabajo o YubiKey 5C'"
              :disabled="isSubmitting"
            />
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="kc-submit-btn"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting">Conectando con autenticador...</span>
          <template v-else>
            <span>{{ texts.submitButton || 'Registrar clave de seguridad' }}</span>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </template>
        </button>

        <!-- Skip Link -->
        <div class="kc-back-link-wrapper">
          <a href="#" class="kc-link" @click.prevent="onSkip">
            {{ texts.skipLink || 'Omitir por ahora' }}
          </a>
        </div>

      </form>

    </div>

  </div>
</template>
