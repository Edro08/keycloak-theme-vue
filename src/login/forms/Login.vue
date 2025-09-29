<script setup>
  import '@/assets/css/base.css'

  import { ref } from 'vue';
  import InputField from '@/login/components/InputField.vue';
  import InputPassword from '@/login/components/InputPassword.vue';
  import CheckBox from '@/login/components/CheckBox.vue';
  import LabelField from '@/login/components/LabelField.vue';
  import { useKCSubmit } from '@/login/composables/useKCSubmit.js';
  import KcButton from "@/login/components/KcButton.vue";

  const kcContext = window.__KC_CONTEXT || {};
  const username = ref(kcContext.username || '');
  const password = ref('');
  const rememberMe = ref(kcContext.rememberMe || false);
  const loginAction = kcContext.action || '#';

  const { submitKCForm } = useKCSubmit();
  const onSubmit = () => {
    submitKCForm({
      action: loginAction,
      method: 'POST',
      fields: {
        username: username.value,
        password: password.value,
        rememberMe: rememberMe.value ? 'on' : ''
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
      <LabelField id="kc-lbl-username" text="Usuario"/>
      <InputField id="kc-in-username" v-model="username" autocomplete="username" autofocus/>
    </div>

    <!-- Password -->
    <div>
      <LabelField id="kc-lbl-password" text="Contraseña"/>
      <InputPassword id="kc-in-password" v-model="password" autocomplete="current-password"/>
    </div>

    <!-- Remember Me -->
    <div>
      <CheckBox class-name="kc-ck-remember" v-model="rememberMe" label="Recordarme"/>
    </div>

    <!-- Submit -->
    <div>
      <KcButton label="Iniciar sesión" type="submit"/>
    </div>

    <!-- Error -->
    <div v-if="kcContext.error" class="kc-error">{{ kcContext.error }}</div>
  </form>
</template>
