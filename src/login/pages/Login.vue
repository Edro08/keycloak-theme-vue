<script setup>
  import { ref } from 'vue';
  import InputField from '@/login/components/ui/InputField.vue';
  import InputPassword from '@/login/components/ui/InputPassword.vue';
  import CheckBox from '@/login/components/ui/CheckBox.vue';
  import Button from "@/login/components/ui/Button.vue";
  import { useFormSubmit } from '@/login/core/adapters/form-submit';
  import { useKeycloakContext } from '@/login/core/adapters/kc-ctx';

  const { user, urls, realm, message, config, social } = useKeycloakContext();
  const { submitKCForm } = useFormSubmit();
  
  // Get texts from i18n
  const texts = config.pages?.login || {};
  const brand = config.brand || {};

  const username = ref(user.username || '');
  const password = ref('');
  const rememberMe = ref(realm.rememberMe || false);
  const loginAction = urls.loginAction;
  const isSubmitting = ref(false);

  const onSubmit = () => {
    // Prevent double submit
    if (isSubmitting.value) return;
    
    isSubmitting.value = true;
    
    submitKCForm({
      action: loginAction,
      method: 'POST',
      fields: {
        username: username.value,
        password: password.value,
        rememberMe: rememberMe.value
      }
    });
  };
</script>

<template>
  <div class="kc-split-card">
    
    <!-- Brand / Hero Column -->
    <div class="kc-split-brand">
      <div class="kc-brand-glow-1"></div>
      <div class="kc-brand-glow-2"></div>

      <div class="kc-brand-content">
        <!-- Logo & App Name -->
        <div class="kc-brand-header">
          <div class="kc-brand-badge">
            <svg class="kc-brand-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <span class="kc-brand-title">{{ realm.name || 'Keycloak Auth' }}</span>
        </div>

        <!-- Headline & Description -->
        <div class="kc-brand-pitch">
          <h2 class="kc-brand-pitch-title">{{ brand.pitchTitle || 'Acceso Unificado & Seguro' }}</h2>
          <p class="kc-brand-pitch-desc">
            {{ brand.pitchDesc || 'Plataforma centralizada de autenticación y gestión de identidades corporativas.' }}
          </p>
        </div>

      </div>
    </div>

    <!-- Login Form Column -->
    <div class="kc-split-form-container">
      <form class="kc-split-form" @submit.prevent="onSubmit">
        
        <!-- Header -->
        <div class="kc-form-header">
          <h1 class="kc-form-title">{{ texts.title || 'Inicia sesión con tu cuenta' }}</h1>
          <p class="kc-form-subtitle">{{ texts.subtitle || 'Ingresa tus credenciales para acceder a tu cuenta' }}</p>
        </div>

        <!-- Error Alert -->
        <div v-if="message.hasError" class="kc-error-card" role="alert">
          <svg class="kc-error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="kc-error-text">{{ message.summary }}</span>
        </div>

        <!-- Info / Success Alert -->
        <div v-else-if="message.summary && (message.isInfo || message.isSuccess)" :class="message.isSuccess ? 'kc-success-card' : 'kc-info-card'" role="alert">
          <svg v-if="message.isSuccess" class="kc-success-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else class="kc-info-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span :class="message.isSuccess ? 'kc-success-text' : 'kc-info-text'">{{ message.summary }}</span>
        </div>

        <!-- Username Input -->
        <div class="kc-form-group">
          <label class="kc-field-label" for="kc-in-username">{{ texts.usernameLabel || 'Usuario o Correo' }}</label>
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

        <!-- Password Input -->
        <div class="kc-form-group">
          <div class="kc-field-header-row">
            <label class="kc-field-label" for="kc-in-password">{{ texts.passwordLabel || 'Contraseña' }}</label>
            <a
              v-if="realm.resetPasswordAllowed"
              :href="urls.loginResetCredentials"
              class="kc-forgot-link"
            >
              {{ texts.forgotPassword || '¿Olvidaste tu contraseña?' }}
            </a>
          </div>
          <div class="kc-input-wrapper">
            <svg class="kc-input-leading-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <InputPassword
              class-name="kc-input-with-icon"
              id="kc-in-password"
              v-model="password"
              :placeholder="texts.passwordPlaceholder || '••••••••'"
              autocomplete="current-password"
            />
          </div>
        </div>

        <!-- Remember Me -->
        <div v-if="realm.rememberMe" class="kc-remember-row">
          <CheckBox
            class-name="kc-checkbox-label"
            id="kc-ck-remember"
            v-model="rememberMe"
            :label="texts.rememberMe || 'Recordarme'"
          />
        </div>

        <!-- Submit Button -->
        <div class="kc-submit-wrapper">
          <Button
            class-name="kc-submit-btn"
            :label="texts.submitButton || 'Iniciar sesión'"
            type="submit"
            :loading="isSubmitting"
            :disabled="isSubmitting"
          />
        </div>

        <!-- Social Providers Divider & Buttons -->
        <div v-if="social && social.providers && social.providers.length > 0" class="kc-social-section">
          <div class="kc-divider-row">
            <span class="kc-divider-line"></span>
            <span class="kc-divider-text">{{ texts.socialDivider || 'O continúa con' }}</span>
            <span class="kc-divider-line"></span>
          </div>

          <div class="kc-social-buttons">
            <a
              v-for="provider in social.providers"
              :key="provider.alias"
              :href="provider.loginUrl"
              class="kc-social-btn"
              :id="'social-' + provider.alias"
            >
              <!-- Google Icon -->
              <svg v-if="provider.alias === 'google'" class="kc-social-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <!-- GitHub Icon -->
              <svg v-else-if="provider.alias === 'github'" class="kc-social-icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <!-- Default Generic Icon -->
              <svg v-else class="kc-social-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span class="kc-social-text">Iniciar sesión con {{ provider.displayName }}</span>
            </a>
          </div>
        </div>

        <!-- Registration link -->
        <div v-if="realm.registrationAllowed" class="kc-back-link-wrapper" style="margin-top: 1.15rem; font-size: 0.8rem; color: var(--color-slate-500);">
          {{ texts.noAccount || '¿No tienes una cuenta?' }} 
          <a :href="urls.registration" class="kc-link" style="font-weight: 600; color: var(--primary-color); text-decoration: none;">
            {{ texts.registerLink || 'Regístrate' }}
          </a>
        </div>

      </form>
    </div>

  </div>
</template>
