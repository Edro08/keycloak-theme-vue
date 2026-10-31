<script setup>
  import { ref, computed } from 'vue';
  import { useKeycloakContext } from "@/login/core/adapters/kc-ctx";
  import InputField from "@/login/components/ui/InputField.vue";
  import InputPassword from "@/login/components/ui/InputPassword.vue";
  import Button from "@/login/components/ui/Button.vue";
  import { useFormSubmit } from "@/login/core/adapters/form-submit";

  const { realm, urls, message, config, register } = useKeycloakContext();
  const { submitKCForm } = useFormSubmit();

  const brand = config.brand || {};
  const texts = config.pages?.register || {};

  const firstName = ref(register.firstName || '');
  const lastName = ref(register.lastName || '');
  const email = ref(register.email || '');
  const username = ref(register.username || '');
  const password = ref('');
  const passwordConfirm = ref('');

  const clientError = ref('');
  const isSubmitting = ref(false);

  const displayError = computed(() => {
    return clientError.value || (message.hasError ? message.summary : '');
  });

  const onSubmit = () => {
    clientError.value = '';

    if (password.value !== passwordConfirm.value) {
      clientError.value = texts.passwordMismatch || 'Las contraseñas no coinciden.';
      return;
    }

    isSubmitting.value = true;

    const fields = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      'password': password.value,
      'password-confirm': passwordConfirm.value,
    };

    if (realm.registrationEmailAsUsername) {
      fields.username = email.value;
    } else if (username.value) {
      fields.username = username.value;
    } else {
      fields.username = email.value;
    }

    submitKCForm({
      action: urls.registrationAction || urls.loginAction,
      method: 'POST',
      fields
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
          <span class="kc-brand-title">{{ realm.name || 'dev' }}</span>
        </div>

        <!-- Headline & Description -->
        <div class="kc-brand-pitch">
          <h2 class="kc-brand-pitch-title">{{ brand.pitchTitle || 'Crea tu cuenta corporativa' }}</h2>
          <p class="kc-brand-pitch-desc">
            {{ brand.pitchDesc || 'Accede a todos los servicios de la organización con una sola identidad protegida.' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Register Form Column -->
    <div class="kc-split-form-container">
      <form class="kc-split-form kc-split-form-lg" @submit.prevent="onSubmit">
        
        <!-- Header -->
        <div class="kc-form-header">
          <h1 class="kc-form-title">{{ texts.title || 'Registrarse' }}</h1>
          <p class="kc-form-subtitle">{{ texts.subtitle || 'Ingresa tus datos personales para crear tu acceso' }}</p>
        </div>

        <!-- Error Alert -->
        <div v-if="displayError" class="kc-error-card" role="alert">
          <svg class="kc-error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="kc-error-text">{{ displayError }}</span>
        </div>

        <!-- First Name & Last Name (Row) -->
        <div class="kc-form-row">
          <div class="kc-form-group">
            <label class="kc-field-label" for="kc-in-firstname">{{ texts.firstNameLabel || 'Nombre' }}</label>
            <div class="kc-input-wrapper">
              <svg class="kc-input-leading-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <InputField
                class-name="kc-input-with-icon"
                id="kc-in-firstname"
                v-model="firstName"
                :placeholder="texts.firstNamePlaceholder || 'Juan'"
                autocomplete="given-name"
                :autofocus="true"
              />
            </div>
          </div>

          <div class="kc-form-group">
            <label class="kc-field-label" for="kc-in-lastname">{{ texts.lastNameLabel || 'Apellidos' }}</label>
            <div class="kc-input-wrapper">
              <svg class="kc-input-leading-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <InputField
                class-name="kc-input-with-icon"
                id="kc-in-lastname"
                v-model="lastName"
                :placeholder="texts.lastNamePlaceholder || 'Pérez'"
                autocomplete="family-name"
              />
            </div>
          </div>
        </div>

        <!-- Email -->
        <div class="kc-form-group">
          <label class="kc-field-label" for="kc-in-email">{{ texts.emailLabel || 'Correo Electrónico' }}</label>
          <div class="kc-input-wrapper">
            <svg class="kc-input-leading-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <InputField
              class-name="kc-input-with-icon"
              id="kc-in-email"
              type="email"
              v-model="email"
              :placeholder="texts.emailPlaceholder || 'juan.perez@empresa.com'"
              autocomplete="email"
            />
          </div>
        </div>

        <!-- Optional Username (if registrationEmailAsUsername is false) -->
        <div v-if="!realm.registrationEmailAsUsername" class="kc-form-group">
          <label class="kc-field-label" for="kc-in-username">{{ texts.usernameLabel || 'Nombre de usuario' }}</label>
          <div class="kc-input-wrapper">
            <svg class="kc-input-leading-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <InputField
              class-name="kc-input-with-icon"
              id="kc-in-username"
              v-model="username"
              :placeholder="texts.usernamePlaceholder || 'juanperez'"
              autocomplete="username"
            />
          </div>
        </div>

        <!-- Passwords (Row) -->
        <div class="kc-form-row">
          <div class="kc-form-group">
            <label class="kc-field-label" for="kc-in-password">{{ texts.passwordLabel || 'Contraseña' }}</label>
            <div class="kc-input-wrapper">
              <svg class="kc-input-leading-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <InputPassword
                class-name="kc-input-with-icon"
                id="kc-in-password"
                v-model="password"
                :placeholder="texts.passwordPlaceholder || '••••••••'"
                autocomplete="new-password"
              />
            </div>
          </div>

          <div class="kc-form-group">
            <label class="kc-field-label" for="kc-in-password-confirm">{{ texts.passwordConfirmLabel || 'Confirmar Contraseña' }}</label>
            <div class="kc-input-wrapper">
              <svg class="kc-input-leading-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
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
        </div>

        <!-- Submit Button -->
        <div class="kc-submit-wrapper">
          <Button
            class-name="kc-submit-btn"
            :label="texts.submitButton || 'Crear cuenta'"
            type="submit"
            :loading="isSubmitting"
            :disabled="isSubmitting"
          />
        </div>

        <!-- Back to Login -->
        <div class="kc-back-link-wrapper" style="margin-top: 1.15rem; font-size: 0.8rem; color: var(--color-slate-500); text-align: center;">
          {{ texts.hasAccount || '¿Ya tienes una cuenta?' }} 
          <a :href="urls.login" class="kc-link" style="font-weight: 600; color: var(--primary-color); text-decoration: none;">
            {{ texts.loginLink || 'Inicia sesión' }}
          </a>
        </div>

      </form>
    </div>

  </div>
</template>
