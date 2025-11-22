<script setup>
  import { ref, computed } from 'vue';
  import InputField from '@/components/InputField.vue';
  import LabelField from '@/components/LabelField.vue';
  import Button from "@/components/Button.vue";
  import { useFormSubmit } from '@/core/adapters/form-submit';
  import { useKeycloakContext } from '@/core/adapters/kc-ctx';

  const { user, urls, realm, config } = useKeycloakContext();
  const { submitKCForm } = useFormSubmit();
  
  // Get texts from config
  const texts = config.pages?.resetPassword || {};
  
  // Determine the label based on realm configuration
  const usernameLabel = !realm.loginWithEmailAllowed 
    ? 'Usuario' 
    : (!realm.registrationEmailAsUsername ? 'Usuario o Email' : 'Email');
  
  // Get info message based on realm configuration
  const infoMessage = computed(() => {
    return realm.duplicateEmailsAllowed 
      ? texts.infoMessage?.duplicateEmailsAllowed 
      : texts.infoMessage?.default;
  });
  
  const username = ref(user.username || '');
  const loginAction = urls.loginAction;

  const onSubmit = () => {
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
  <form class="kc-form" @submit.prevent="onSubmit">
    <div>
      <LabelField class-name="kc-main-title" :text="texts.title || 'Recuperar contraseña'"/>
    </div>

    <!-- Info Message -->
    <div class="kc-info-message" v-if="infoMessage">
      <span>{{ infoMessage }}</span>
    </div>

    <!-- Username/Email -->
    <div>
      <LabelField class-name="label" id="kc-lbl-username" :text="usernameLabel"/>
      <InputField class-name="input" id="kc-in-username" v-model="username" autocomplete="username" autofocus/>
    </div>

    <!-- Submit Button -->
    <div>
      <Button class-name="button" :label="texts.submitButton || 'Enviar'" type="submit"/>
    </div>

    <!-- Back to Login Link -->
    <div class="kc-back-to-login">
      <a @click.prevent="goBackToLogin" href="#">{{ texts.backToLogin || 'Volver al inicio de sesión' }}</a>
    </div>
  </form>
</template>