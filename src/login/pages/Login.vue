<script setup>
  import { ref } from 'vue';
  import InputField from '@/components/InputField.vue';
  import InputPassword from '@/components/InputPassword.vue';
  import CheckBox from '@/components/CheckBox.vue';
  import LabelField from '@/components/LabelField.vue';
  import Button from "@/components/Button.vue";
  import { useFormSubmit } from '@/core/adapters/form-submit';
  import { useKeycloakContext } from '@/core/adapters/kc-ctx';

  const { user, urls, realm, message, config } = useKeycloakContext();
  const { submitKCForm } = useFormSubmit();
  
  // Get texts from config
  const texts = config.pages?.login || {};
  const username = ref(user.username || '');
  const password = ref('');
  const rememberMe = realm.rememberMe;
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
        rememberMe: rememberMe
      }
    });
  };
</script>

<template>
  <form class="kc-form" @submit.prevent="onSubmit">
    <div>
      <LabelField class-name="kc-main-title" :text="texts.title || 'Inicia sesión con tu cuenta'"/>
    </div>

    <!-- Username -->
    <div>
      <LabelField class-name="label" id="kc-lbl-username" text="Usuario"/>
      <InputField class-name="input" id="kc-in-username" v-model="username" autocomplete="username" autofocus/>
    </div>

    <!-- Password -->
    <div>
      <LabelField class-name="label" id="kc-lbl-password" text="Contraseña"/>
      <InputPassword class-name="input" id="kc-in-password" v-model="password" autocomplete="current-password"/>
    </div>

    <!-- Remember Me -->
    <div v-if="realm.rememberMe">
      <CheckBox class-name="checkbox" id="kc-ck-remember" v-model="rememberMe" :label="texts.rememberMe || 'Recordarme'"/>
    </div>

    <!-- Submit -->
    <div>
      <Button class-name="button" :label="texts.submitButton || 'Iniciar sesión'" type="submit" :disabled="isSubmitting"/>
    </div>

    <!-- Forgot Password Link -->
    <div v-if="realm.resetPasswordAllowed" class="kc-forgot-password">
      <a :href="urls.loginResetCredentials">{{ texts.forgotPassword || '¿Olvidaste tu contraseña?' }}</a>
    </div>

    <!-- Error -->
    <div v-if="message.hasError" class="kc-error">{{ message.summary }}</div>
  </form>
</template>
