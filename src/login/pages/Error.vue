<script setup>
  import { useKeycloakContext } from '@/core/adapters/kc-ctx';

  const { message, config } = useKeycloakContext();
  
  // Get texts from config
  const texts = config.pages?.error || {};
  
  // Check if there's a client base URL to return to
  const clientBaseUrl = window.kc_context?.client?.baseUrl || '';
  const skipLink = window.kc_context?.skipLink || false;
</script>

<template>
  <div class="kc-form">
    <div>
      <h1 class="kc-error-title">{{ texts.title || 'Error' }}</h1>
    </div>

    <div class="kc-error-message">
      <p class="kc-error-instruction">{{ message.summary }}</p>
      
      <div v-if="!skipLink && clientBaseUrl" class="kc-back-to-app">
        <a :href="clientBaseUrl" id="backToApplication">
          {{ texts.backToApplication || 'Volver a la aplicación' }}
        </a>
      </div>
    </div>
  </div>
</template>
