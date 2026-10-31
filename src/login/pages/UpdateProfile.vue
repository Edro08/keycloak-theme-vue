<script setup>
  import { ref } from 'vue';
  import { useKeycloakContext } from "@/login/core/adapters/kc-ctx";
  import InputField from "@/login/components/ui/InputField.vue";
  import Button from "@/login/components/ui/Button.vue";
  import { useFormSubmit } from "@/login/core/adapters/form-submit";

  const { realm, urls, user, message, config } = useKeycloakContext();
  const { submitKCForm } = useFormSubmit();

  const texts = config.pages?.updateProfile || {};

  const firstName = ref(user.firstName || '');
  const lastName = ref(user.lastName || '');
  const email = ref(user.email || '');
  const username = ref(user.username || '');

  const isSubmitting = ref(false);

  const onSubmit = () => {
    isSubmitting.value = true;

    const fields = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
    };

    if (user.editUsernameAllowed && username.value) {
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
    
    <!-- Top Dark Header with Brand -->
    <div class="kc-compact-dark-header">
      <div class="kc-header-brand">
        <div class="kc-brand-badge-sm">
          <svg class="kc-brand-svg-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <span class="kc-header-realm">{{ realm.name || 'dev' }}</span>
      </div>
    </div>

    <!-- Card Body -->
    <div class="kc-compact-body">
      
      <!-- Status Pill -->
      <div class="kc-status-pill kc-status-pill-blue">
        <svg class="kc-status-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span>{{ texts.pill || 'Acción Requerida' }}</span>
      </div>

      <h1 class="kc-compact-title">{{ texts.title || 'Completa tu perfil' }}</h1>
      <p class="kc-compact-desc">
        {{ texts.subtitle || 'Por favor verifica o actualiza la información básica de tu cuenta para poder continuar.' }}
      </p>

      <!-- Error Alert -->
      <div v-if="message.hasError" class="kc-error-card" role="alert">
        <svg class="kc-error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="kc-error-text">{{ message.summary }}</span>
      </div>

      <form @submit.prevent="onSubmit">
        
        <!-- First Name & Last Name (Row) -->
        <div class="kc-form-row">
          <div class="kc-form-group">
            <label class="kc-field-label" for="kc-in-up-firstname">{{ texts.firstNameLabel || 'Nombre' }}</label>
            <div class="kc-input-wrapper">
              <svg class="kc-input-leading-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <InputField
                class-name="kc-input-with-icon"
                id="kc-in-up-firstname"
                v-model="firstName"
                :placeholder="texts.firstNamePlaceholder || 'Juan'"
                autocomplete="given-name"
                :autofocus="true"
              />
            </div>
          </div>

          <div class="kc-form-group">
            <label class="kc-field-label" for="kc-in-up-lastname">{{ texts.lastNameLabel || 'Apellidos' }}</label>
            <div class="kc-input-wrapper">
              <svg class="kc-input-leading-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <InputField
                class-name="kc-input-with-icon"
                id="kc-in-up-lastname"
                v-model="lastName"
                :placeholder="texts.lastNamePlaceholder || 'Pérez'"
                autocomplete="family-name"
              />
            </div>
          </div>
        </div>

        <!-- Optional Username (if editUsernameAllowed) -->
        <div v-if="user.editUsernameAllowed" class="kc-form-group">
          <label class="kc-field-label" for="kc-in-up-username">{{ texts.usernameLabel || 'Nombre de usuario' }}</label>
          <div class="kc-input-wrapper">
            <svg class="kc-input-leading-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <InputField
              class-name="kc-input-with-icon"
              id="kc-in-up-username"
              v-model="username"
              :placeholder="texts.usernamePlaceholder || 'juanperez'"
              autocomplete="username"
            />
          </div>
        </div>

        <!-- Email -->
        <div class="kc-form-group">
          <label class="kc-field-label" for="kc-in-up-email">{{ texts.emailLabel || 'Correo Electrónico' }}</label>
          <div class="kc-input-wrapper">
            <svg class="kc-input-leading-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <InputField
              class-name="kc-input-with-icon"
              id="kc-in-up-email"
              type="email"
              v-model="email"
              :placeholder="texts.emailPlaceholder || 'juan.perez@empresa.com'"
              autocomplete="email"
            />
          </div>
        </div>

        <!-- Submit Button -->
        <div class="kc-submit-wrapper">
          <Button
            class-name="kc-submit-btn"
            :label="texts.submitButton || 'Guardar y continuar'"
            type="submit"
            :loading="isSubmitting"
            :disabled="isSubmitting"
          />
        </div>

        <!-- Back / Cancel Link -->
        <div class="kc-back-link-wrapper" style="margin-top: 1.25rem; text-align: center;">
          <a :href="urls.login" class="kc-back-link" style="font-size: 0.8rem; font-weight: 600; color: var(--color-slate-500); text-decoration: none;">
            {{ texts.cancelButton || 'Cancelar y volver al inicio' }}
          </a>
        </div>

      </form>
    </div>

  </div>
</template>
