<script setup>
  import { ref, computed } from 'vue';
  import { useKeycloakContext } from '@/login/core/adapters/kc-ctx';
  import { useFormSubmit } from '@/login/core/adapters/form-submit';
  import InputField from '@/login/components/ui/InputField.vue';

  const { realm, user, urls, message, config, idpAlias, idpDisplayName } = useKeycloakContext();
  const { submitKCForm } = useFormSubmit();

  const texts = config.pages?.idpReview || {};
  const isSubmitting = ref(false);

  const firstName = ref(user.firstName || '');
  const lastName = ref(user.lastName || '');
  const email = ref(user.email || '');
  const username = ref(user.username || '');

  // Provider display name if provided by broker context
  const providerLabel = computed(() => {
    return idpDisplayName || idpAlias || 'IDP';
  });

  const onSubmit = () => {
    if (isSubmitting.value) return;
    isSubmitting.value = true;

    const fields = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value
    };

    if (!realm.registrationEmailAsUsername && username.value) {
      fields.username = username.value;
    }

    submitKCForm({
      action: urls.loginAction,
      method: 'POST',
      fields
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
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <span>{{ texts.pill || 'Social Login & IDP' }}</span>
      </div>

      <!-- Title & Subtitle -->
      <h1 class="kc-compact-title">{{ texts.title || 'Revisa tu Perfil' }}</h1>
      <p class="kc-compact-desc">
        {{ texts.subtitle || 'Te has autenticado mediante un proveedor de identidad. Por favor confirma tus datos antes de continuar.' }}
      </p>

      <!-- IDP Highlight Banner -->
      <div class="kc-idp-banner">
        <div class="kc-idp-avatar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
          </svg>
        </div>
        <div class="kc-idp-info">
          <span class="kc-idp-info-title">{{ texts.bannerTitle || 'Cuenta vinculada' }} ({{ providerLabel }})</span>
          <span class="kc-idp-info-desc">{{ texts.bannerDesc || 'Los datos provienen de tu proveedor de identidad externo' }}</span>
        </div>
      </div>

      <!-- Error Alert -->
      <div v-if="message.hasError" class="kc-error-card" role="alert" style="margin-bottom: 1.15rem;">
        <svg class="kc-error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="kc-error-text">{{ message.summary }}</span>
      </div>

      <!-- Form -->
      <form @submit.prevent="onSubmit">

        <!-- First & Last Name Row -->
        <div class="kc-form-row">
          <div class="kc-form-group">
            <label class="kc-field-label" for="kc-idp-firstname">{{ texts.firstNameLabel || 'Nombre' }}</label>
            <div class="kc-input-wrapper">
              <svg class="kc-input-leading-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <InputField
                class-name="kc-input-with-icon"
                id="kc-idp-firstname"
                v-model="firstName"
                autocomplete="given-name"
                :autofocus="true"
                required
              />
            </div>
          </div>

          <div class="kc-form-group">
            <label class="kc-field-label" for="kc-idp-lastname">{{ texts.lastNameLabel || 'Apellido' }}</label>
            <div class="kc-input-wrapper">
              <svg class="kc-input-leading-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <InputField
                class-name="kc-input-with-icon"
                id="kc-idp-lastname"
                v-model="lastName"
                autocomplete="family-name"
                required
              />
            </div>
          </div>
        </div>

        <!-- Email Field -->
        <div class="kc-form-group">
          <label class="kc-field-label" for="kc-idp-email">{{ texts.emailLabel || 'Correo Electrónico' }}</label>
          <div class="kc-input-wrapper">
            <svg class="kc-input-leading-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
            </svg>
            <InputField
              type="email"
              class-name="kc-input-with-icon"
              id="kc-idp-email"
              v-model="email"
              autocomplete="email"
              required
            />
          </div>
        </div>

        <!-- Username Field (if not email as username) -->
        <div v-if="!realm.registrationEmailAsUsername" class="kc-form-group">
          <label class="kc-field-label" for="kc-idp-username">{{ texts.usernameLabel || 'Nombre de Usuario' }}</label>
          <div class="kc-input-wrapper">
            <svg class="kc-input-leading-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <InputField
              class-name="kc-input-with-icon"
              id="kc-idp-username"
              v-model="username"
              autocomplete="username"
            />
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="kc-submit-btn"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting">...</span>
          <template v-else>
            <span>{{ texts.submitButton || 'Confirmar y continuar' }}</span>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </template>
        </button>

        <!-- Back Link -->
        <div class="kc-back-link-wrapper">
          <a :href="urls.login" class="kc-link">
            {{ texts.cancelLink || 'Cancelar y volver al inicio de sesión' }}
          </a>
        </div>

      </form>

    </div>

  </div>
</template>
