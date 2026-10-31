<script setup>
  import { computed } from 'vue';
  import { useKeycloakContext } from '@/login/core/adapters/kc-ctx';

  const { realm, oauth, client, config } = useKeycloakContext();
  const texts = computed(() => config.pages?.oauthGrant || {});

  const clientName = computed(() => client.name || client.clientId || 'Aplicación');
  const clientLogo = computed(() => client.logoUri || '');
  const clientInitial = computed(() => clientName.value.substring(0, 2).toUpperCase());
  const scopes = computed(() => oauth.clientScopesRequested || []);
  const formAction = computed(() => oauth.action || '#');
  const oauthCode = computed(() => oauth.code || '');

  // Scope icons fallback mapping
  const getScopeIcon = (text) => {
    const lower = (text || '').toLowerCase();
    if (lower.includes('email') || lower.includes('correo')) return 'email';
    if (lower.includes('offline') || lower.includes('conexión')) return 'refresh';
    return 'user';
  };
</script>

<template>
  <div class="kc-compact-card">
    <div class="kc-compact-dark-header">
      <div class="kc-header-brand">
        <div class="kc-brand-icon-wrapper">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
        </div>
        <span class="kc-header-realm">{{ realm.name || 'dev' }}</span>
      </div>
      <div class="kc-secure-badge">
        <svg style="width:12px;height:12px" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clip-rule="evenodd" />
        </svg>
        {{ texts.pill || 'OAuth 2.0' }}
      </div>
    </div>

    <div class="kc-compact-body">
      <div class="kc-app-grant-header">
        <div class="kc-app-avatar">
          <img v-if="clientLogo" :src="clientLogo" :alt="clientName" />
          <span v-else>{{ clientInitial }}</span>
        </div>
        <div class="kc-app-info">
          <h3>{{ clientName }}</h3>
          <p>{{ texts.subtitle || 'solicita acceso a tu cuenta de usuario' }}</p>
        </div>
      </div>

      <div class="kc-scope-list">
        <div v-for="(scope, idx) in scopes" :key="idx" class="kc-scope-item">
          <div class="kc-scope-icon">
            <svg v-if="getScopeIcon(scope.consentScreenText) === 'email'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <svg v-else-if="getScopeIcon(scope.consentScreenText) === 'refresh'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <svg v-else fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div class="kc-scope-text">
            <div class="kc-scope-title">{{ scope.consentScreenText }}</div>
            <div v-if="scope.parameterizedScopeParameter" class="kc-scope-desc">{{ scope.parameterizedScopeParameter }}</div>
          </div>
        </div>
      </div>

      <div class="kc-consent-alert">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span>{{ texts.alertNotice || 'Puedes revocar estos permisos en cualquier momento desde tu consola de cuenta.' }}</span>
      </div>

      <form :action="formAction" method="POST">
        <input type="hidden" name="code" :value="oauthCode" />
        <div class="kc-btn-row">
          <button type="submit" name="cancel" value="true" class="kc-btn-secondary">
            {{ texts.cancelButton || 'Denegar' }}
          </button>
          <button type="submit" name="accept" value="true" class="kc-btn-primary">
            {{ texts.acceptButton || 'Permitir acceso' }}
            <svg style="width:16px;height:16px" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
