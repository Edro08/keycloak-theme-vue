<script setup>
  import { computed, ref, onMounted } from 'vue';
  import Login from "@/login/pages/Login.vue";
  import Register from "@/login/pages/Register.vue";
  import ResetPassword from "@/login/pages/ResetPassword.vue";
  import UpdatePassword from "@/login/pages/UpdatePassword.vue";
  import UpdateProfile from "@/login/pages/UpdateProfile.vue";
  import VerifyEmail from "@/login/pages/VerifyEmail.vue";
  import ConfigureTotp from "@/login/pages/ConfigureTotp.vue";
  import LoginOtp from "@/login/pages/LoginOtp.vue";
  import PageExpired from "@/login/pages/PageExpired.vue";
  import RequiredAction from "@/login/pages/RequiredAction.vue";
  import Terms from "@/login/pages/Terms.vue";
  import IdpReviewProfile from "@/login/pages/IdpReviewProfile.vue";
  import IdpLinkConfirm from "@/login/pages/IdpLinkConfirm.vue";
  import SelectAuthenticator from "@/login/pages/SelectAuthenticator.vue";
  import LogoutConfirm from "@/login/pages/LogoutConfirm.vue";
  import WebAuthnRegister from "@/login/pages/WebAuthnRegister.vue";
  import OAuthGrant from "@/login/pages/OAuthGrant.vue";
  import RecoveryCodesConfig from "@/login/pages/RecoveryCodesConfig.vue";
  import RecoveryCodeInput from "@/login/pages/RecoveryCodeInput.vue";
  import DeleteAccountConfirm from "@/login/pages/DeleteAccountConfirm.vue";
  import DeviceVerifyUserCode from "@/login/pages/DeviceVerifyUserCode.vue";
  import Error from "@/login/pages/Error.vue";
  import { useKeycloakContext } from "@/login/core/adapters/kc-ctx";
  import Header from "@/login/components/layout/Header.vue";
  import Footer from "@/login/components/layout/Footer.vue";

  const { urls, config } = useKeycloakContext();
  const i18nLoaded = ref(false);

  const pageId = window.kc_context?.pageId;
  const currentAction = urls.loginAction || '';
  const formMap = config.actions || {};
  const executionMap = config.executionActions || {};

  const currentForm = computed(() => {
    // 1. Direct pageId from FTL layout (safest and most reliable)
    if (pageId && pageId !== '') {
      return pageId;
    }

    // 2. Base action mapping via URL
    const baseAction = Object.entries(formMap).find(([key]) => currentAction.includes(key))?.[1];
    
    // If it's a required-action, check the execution parameter
    if (baseAction === 'required-action') {
      const urlParams = new URLSearchParams(window.location.search);
      const execution = urlParams.get('execution');
      
      if (execution && executionMap[execution]) {
        return executionMap[execution];
      }
    }
    
    return baseAction || 'login';
  });

  // Wait for i18n to load before rendering
  onMounted(async () => {
    if (config.i18nReady) {
      await config.i18nReady;
    }
    i18nLoaded.value = true;
  });
</script>

<template>
  <main class="kc-main">
    <Header/>
    <template v-if="i18nLoaded">
      <Login v-if="currentForm === 'login'" />
      <Register v-else-if="currentForm === 'register'" />
      <ResetPassword v-else-if="currentForm === 'reset-password'" />
      <UpdatePassword v-else-if="currentForm === 'update-password'" />
      <UpdateProfile v-else-if="currentForm === 'update-profile' || currentForm === 'login-update-profile'" />
      <VerifyEmail v-else-if="currentForm === 'verify-email' || currentForm === 'login-verify-email'" />
      <ConfigureTotp v-else-if="currentForm === 'configure-totp'" />
      <LoginOtp v-else-if="currentForm === 'login-otp'" />
      <PageExpired v-else-if="currentForm === 'page-expired'" />
      <Terms v-else-if="currentForm === 'terms'" />
      <IdpReviewProfile v-else-if="currentForm === 'idp-review-user-profile'" />
      <IdpLinkConfirm v-else-if="currentForm === 'login-idp-link-confirm'" :is-email-step="false" />
      <IdpLinkConfirm v-else-if="currentForm === 'login-idp-link-email'" :is-email-step="true" />
      <SelectAuthenticator v-else-if="currentForm === 'select-authenticator'" />
      <LogoutConfirm v-else-if="currentForm === 'logout-confirm'" />
      <WebAuthnRegister v-else-if="currentForm === 'webauthn-register' || currentForm === 'webauthn'" />
      <OAuthGrant v-else-if="currentForm === 'login-oauth-grant' || currentForm === 'oauth-grant'" />
      <RecoveryCodesConfig v-else-if="currentForm === 'login-recovery-authn-code-config' || currentForm === 'recovery-codes-config'" />
      <RecoveryCodeInput v-else-if="currentForm === 'login-recovery-authn-code-input' || currentForm === 'recovery-code-input'" />
      <DeleteAccountConfirm v-else-if="currentForm === 'delete-account-confirm'" />
      <DeviceVerifyUserCode v-else-if="currentForm === 'login-oauth2-device-verify-user-code' || currentForm === 'device-verify-user-code'" />
      <RequiredAction v-else-if="currentForm === 'info' || currentForm === 'required-action'" />
      <Error v-else />
    </template>
    <Footer/>
  </main>
</template>
