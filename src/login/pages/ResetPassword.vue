<script setup>
  import { ref, computed } from 'vue';
  import InputField from '@/login/components/ui/InputField.vue';
  import Button from "@/login/components/ui/Button.vue";
  import { useFormSubmit } from '@/login/core/adapters/form-submit';
  import { useKeycloakContext } from '@/login/core/adapters/kc-ctx';

  const { user, urls, realm, message, config } = useKeycloakContext();
  const { submitKCForm } = useFormSubmit();
  
  // Get texts from i18n
  const texts = config.pages?.resetPassword || {};
  const brand = config.brand || {};
  
  // Determine the label based on realm configuration
  const usernameLabel = !realm.loginWithEmailAllowed 
    ? (texts.usernameLabel || 'Usuario') 
    : (!realm.registrationEmailAsUsername ? (texts.usernameLabel || 'Usuario o Correo') : 'Correo electrónico');
  
  // Get info message based on realm configuration
  const infoMessage = computed(() => {
    return realm.duplicateEmailsAllowed 
      ? texts.infoMessage?.duplicateEmailsAllowed 
      : texts.infoMessage?.default;
  });
  
  const username = ref(user.username || '');
  const loginAction = urls.loginAction;
  const isSubmitting = ref(false);

  const onSubmit = () => {
    if (isSubmitting.value) return;
    isSubmitting.value = true;

    submitKCForm({
      action: loginAction,
      method: 'POST',
      fields: {
        username: username.value
      }
    });
  };

  const goBackToLogin = () => {
    window.location.href = urls.login || '/';
  };
</script>

<template>
  <div class="kc-split-card">
    
    <!-- Brand Column -->
    <div class="kc-split-brand">
      <div class="kc-brand-glow-1"></div>
      <div class="kc-brand-glow-2"></div>

      <div class="kc-brand-content">
        <div class="kc-brand-header">
          <div class="kc-brand-badge">
            <svg class="kc-brand-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <span class="kc-brand-title">{{ realm.name || 'Keycloak Auth' }}</span>
        </div>

        <div class="kc-brand-pitch">
          <h2 class="kc-brand-pitch-title">{{ brand.pitchTitle || 'Acceso Unificado & Seguro' }}</h2>
          <p class="kc-brand-pitch-desc">
            {{ brand.pitchDesc || 'Plataforma centralizada de autenticación y gestión de identidades corporativas.' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Form Column -->
    <div class="kc-split-form-container">
      <form class="kc-split-form" @submit.prevent="onSubmit">
        
        <div class="kc-form-header">
          <h1 class="kc-form-title">{{ texts.title || 'Recuperar contraseña' }}</h1>
          <p class="kc-form-subtitle">{{ texts.subtitle || 'Ingresa tu usuario o correo electrónico para recibir las instrucciones.' }}</p>
        </div>

        <!-- Info alert -->
        <div v-if="infoMessage" class="kc-info-card">
          <svg class="kc-info-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="kc-info-card-text">{{ infoMessage }}</span>
        </div>

        <!-- Error alert -->
        <div v-if="message.hasError" class="kc-error-card" role="alert">
          <svg class="kc-error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="kc-error-text">{{ message.summary }}</span>
        </div>

        <!-- Username / Email -->
        <div class="kc-form-group">
          <label class="kc-field-label" for="kc-in-username">{{ usernameLabel }}</label>
          <div class="kc-input-wrapper">
            <svg class="kc-input-leading-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <InputField
              class-name="kc-input-with-icon"
              id="kc-in-username"
              v-model="username"
              :placeholder="texts.usernamePlaceholder || 'nombre@empresa.com'"
              autocomplete="username"
              :autofocus="true"
            />
          </div>
        </div>

        <!-- Submit Button -->
        <div class="kc-submit-wrapper">
          <Button
            class-name="kc-submit-btn"
            :label="texts.submitButton || 'Enviar instrucciones'"
            type="submit"
            :loading="isSubmitting"
            :disabled="isSubmitting"
          />
        </div>

        <!-- Back to login -->
        <div class="kc-back-link-wrapper">
          <a @click.prevent="goBackToLogin" href="#" class="kc-back-link">
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
