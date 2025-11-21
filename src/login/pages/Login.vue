<script setup>
  import { ref } from 'vue';
  import InputField from '@/components/InputField.vue';
  import InputPassword from '@/components/InputPassword.vue';
  import CheckBox from '@/components/CheckBox.vue';
  import LabelField from '@/components/LabelField.vue';
  import Button from "@/components/Button.vue";
  import { useFormSubmit } from '@/core/adapters/form-submit';
  import { useKeycloakContext } from '@/core/adapters/kc-ctx';

  const { login, realm, message } = useKeycloakContext();
  const { submitKCForm } = useFormSubmit();
  const username = ref(login.username || '');
  const password = ref('');
  const rememberMe = realm.rememberMe;
  const loginAction = login.actionUrl;

  const onSubmit = () => {
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
      <LabelField class-name="kc-main-title" text="Inicia sesión con tu cuenta"/>
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
    <div>
      <CheckBox class-name="checkbox" id="kc-ck-remember" v-model="rememberMe" label="Recordarme"/>
    </div>

    <!-- Submit -->
    <div>
      <Button class-name="button" label="Iniciar sesión" type="submit"/>
    </div>

    <!-- Error -->
    <div v-if="message.hasError" class="kc-error">{{ message.summary }}</div>
  </form>
</template>
