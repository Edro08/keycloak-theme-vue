<script setup>
  import { ref } from 'vue';
  import InputPassword from '@/login/components/ui/InputPassword.vue';
  import CheckBox from '@/login/components/ui/CheckBox.vue';
  import Button from "@/login/components/ui/Button.vue";
  import { useFormSubmit } from '@/login/core/adapters/form-submit';
  import { useKeycloakContext } from '@/login/core/adapters/kc-ctx';

  const { urls, realm, message, config } = useKeycloakContext();
  const { submitKCForm } = useFormSubmit();
  
  // Get texts from i18n
  const texts = config.pages?.updatePassword || {};
  const brand = config.brand || {};
  
  const passwordNew = ref('');
  const passwordConfirm = ref('');
  const logoutSessions = ref(true);
  const isSubmitting = ref(false);
  const loginAction = urls.loginAction;
  
  const isAppInitiatedAction = realm.isAppInitiatedAction;

  const onSubmit = () => {
    if (isSubmitting.value) return;
    
    isSubmitting.value = true;
    
    submitKCForm({
      action: loginAction,
      method: 'POST',
      fields: {
        'password-new': passwordNew.value,
        'password-confirm': passwordConfirm.value,
        'logout-sessions': logoutSessions.value ? 'on' : 'off'
      }
    });
  };

  const onCancel = () => {
    submitKCForm({
      action: loginAction,
      method: 'POST',
      fields: {
        'cancel-aia': 'true'
      }
    });
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
          <h1 class="kc-form-title">{{ texts.title || 'Actualizar contraseña' }}</h1>
          <p class="kc-form-subtitle">{{ texts.subtitle || 'Establece una nueva contraseña segura para tu cuenta.' }}</p>
        </div>

        <!-- Error alert -->
        <div v-if="message.hasError" class="kc-error-card" role="alert">
          <svg class="kc-error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="kc-error-text">{{ message.summary }}</span>
        </div>

        <!-- New Password -->
        <div class="kc-form-group">
          <label class="kc-field-label" for="kc-in-password-new">{{ texts.passwordNewLabel || 'Nueva contraseña' }}</label>
          <div class="kc-input-wrapper">
            <svg class="kc-input-leading-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <InputPassword
              class-name="kc-input-with-icon"
              id="kc-in-password-new"
              v-model="passwordNew"
              :placeholder="texts.passwordNewPlaceholder || '••••••••'"
              autocomplete="new-password"
              :autofocus="true"
            />
          </div>
        </div>

        <!-- Confirm Password -->
        <div class="kc-form-group">
          <label class="kc-field-label" for="kc-in-password-confirm">{{ texts.passwordConfirmLabel || 'Confirmar contraseña' }}</label>
          <div class="kc-input-wrapper">
            <svg class="kc-input-leading-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <InputPassword
              class-name="kc-input-with-icon"
              id="kc-in-password-confirm"
              v-model="passwordConfirm"
              :placeholder="texts.passwordConfirmPlaceholder || '••••••••'"
              autocomplete="new-password"
            />
          </div>
        </div>

        <!-- Logout Other Sessions -->
        <div class="kc-remember-row">
          <CheckBox 
            class-name="kc-checkbox-label" 
            id="kc-ck-logout-sessions" 
            v-model="logoutSessions" 
            :label="texts.logoutOtherSessions || 'Cerrar sesión en otros dispositivos'"
          />
        </div>

        <!-- Actions -->
        <div class="kc-submit-wrapper">
          <div v-if="isAppInitiatedAction" class="kc-btn-row">
            <Button
              class-name="kc-submit-btn"
              :label="texts.submitButton || 'Actualizar contraseña'"
              type="submit"
              :loading="isSubmitting"
              :disabled="isSubmitting"
            />
            <Button
              class-name="kc-btn-secondary"
              :label="texts.cancelButton || 'Cancelar'"
              type="button"
              @click="onCancel"
            />
          </div>
          <div v-else>
            <Button
              class-name="kc-submit-btn"
              :label="texts.submitButton || 'Actualizar contraseña'"
              type="submit"
              :loading="isSubmitting"
              :disabled="isSubmitting"
            />
          </div>
        </div>

      </form>
    </div>

  </div>
</template>
