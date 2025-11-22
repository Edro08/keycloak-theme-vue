<script setup>
  import { ref } from 'vue';
  import InputPassword from '@/components/InputPassword.vue';
  import LabelField from '@/components/LabelField.vue';
  import CheckBox from '@/components/CheckBox.vue';
  import Button from "@/components/Button.vue";
  import { useFormSubmit } from '@/core/adapters/form-submit';
  import { useKeycloakContext } from '@/core/adapters/kc-ctx';

  const { urls, realm, config } = useKeycloakContext();
  const { submitKCForm } = useFormSubmit();
  
  // Get texts from config
  const texts = config.pages?.updatePassword || {};
  
  const passwordNew = ref('');
  const passwordConfirm = ref('');
  const logoutSessions = ref(true);
  const isSubmitting = ref(false);
  const loginAction = urls.loginAction;
  
  // Check if this is an app-initiated action (user can cancel)
  // vs forced password update (no cancel option)
  const isAppInitiatedAction = realm.isAppInitiatedAction;

  const onSubmit = () => {
    // Prevent double submit
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
  <form class="kc-form" @submit.prevent="onSubmit">
    <div>
      <LabelField class-name="kc-main-title" :text="texts.title || 'Actualizar contraseña'"/>
    </div>

    <!-- New Password -->
    <div>
      <LabelField class-name="label" id="kc-lbl-password-new" :text="texts.passwordNewLabel || 'Nueva contraseña'"/>
      <InputPassword class-name="input" id="kc-in-password-new" v-model="passwordNew" autocomplete="new-password" autofocus/>
    </div>

    <!-- Confirm Password -->
    <div>
      <LabelField class-name="label" id="kc-lbl-password-confirm" :text="texts.passwordConfirmLabel || 'Confirmar contraseña'"/>
      <InputPassword class-name="input" id="kc-in-password-confirm" v-model="passwordConfirm" autocomplete="new-password"/>
    </div>

    <!-- Logout Other Sessions -->
    <div>
      <CheckBox 
        class-name="checkbox" 
        id="kc-ck-logout-sessions" 
        v-model="logoutSessions" 
        :label="texts.logoutOtherSessions || 'Cerrar sesión en otros dispositivos'"
      />
    </div>

    <!-- Buttons -->
    <div v-if="isAppInitiatedAction" style="display: flex; gap: 1rem;">
      <Button class-name="button" :label="texts.submitButton || 'Actualizar'" type="submit" :disabled="isSubmitting"/>
      <Button class-name="button button-secondary" :label="texts.cancelButton || 'Cancelar'" type="button" @click="onCancel"/>
    </div>
    <div v-else>
      <Button class-name="button" :label="texts.submitButton || 'Actualizar'" type="submit" :disabled="isSubmitting"/>
    </div>
  </form>
</template>