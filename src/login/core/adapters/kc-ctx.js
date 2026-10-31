/**
 * Adapter to safely access Keycloak context and environment variables.
 * This decouples the application from the global window object.
 */
import { loadLocale } from '@/login/services/i18n-service.js';

// Store for i18n texts (loaded asynchronously)
let i18nTexts = null;
let i18nPromise = null;

export const safeUrl = (url, fallback = '') => {
  if (!url || typeof url !== 'string') return fallback;
  const cleaned = url.replace(/&amp;/g, '&').trim();
  if (cleaned.startsWith('/') && !cleaned.startsWith('//')) {
    return cleaned;
  }
  try {
    const parsed = new URL(cleaned, window.location.origin);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return cleaned;
    }
  } catch {
    return fallback;
  }
  return fallback;
};

export const useKeycloakContext = () => {
    // Safely access globals, defaulting to empty objects if not present (e.g. in dev mode or tests)
    const env = window.env || {};
    const kc = window.kc_context || {};

    const restartUrl = safeUrl(kc.urls?.loginRestartFlowUrl || '');
    const loginUrl = safeUrl(kc.urls?.login || '');

    // Load i18n texts if not already loaded
    if (!i18nTexts && !i18nPromise) {
        const resourcesPath = safeUrl(kc.urls?.resourcesPath || '');
        const currentLocale = kc.locale?.current || env.locale || 'es';
        const lang = currentLocale.substring(0, 2).toLowerCase();
        i18nPromise = loadLocale(lang, resourcesPath).then(texts => {
            i18nTexts = texts;
            return texts;
        });
    }

    return {
        // Realm configuration
        realm: {
            name: kc.realm_config?.name || '',
            rememberMe: !!kc.realm_config?.rememberMe,
            resetPasswordAllowed: !!kc.realm_config?.resetPasswordAllowed,
            registrationAllowed: !!kc.realm_config?.registrationAllowed,
            loginWithEmailAllowed: kc.realm_config?.loginWithEmailAllowed ?? true,
            registrationEmailAsUsername: !!kc.realm_config?.registrationEmailAsUsername,
            duplicateEmailsAllowed: !!kc.realm_config?.duplicateEmailsAllowed,
            isAppInitiatedAction: !!kc.realm_config?.isAppInitiatedAction,
        },

        // User data
        user: {
            username: kc.user?.username || '',
            firstName: kc.user?.firstName || '',
            lastName: kc.user?.lastName || '',
            email: kc.user?.email || '',
            editUsernameAllowed: !!kc.user?.editUsernameAllowed,
        },

        // Register form pre-filled data
        register: {
            firstName: kc.register?.firstName || '',
            lastName: kc.register?.lastName || '',
            email: kc.register?.email || '',
            username: kc.register?.username || '',
        },

        // Locale
        locale: {
            current: kc.locale?.current || 'es',
            currentLabel: kc.locale?.currentLabel || 'Español',
            supported: kc.locale?.supported || [],
        },

        // URLs (Sanitized against javascript: / data: protocols)
        urls: {
            loginAction: safeUrl(kc.urls?.loginAction, '#'),
            loginResetCredentials: safeUrl(kc.urls?.loginResetCredentials, ''),
            registrationAction: safeUrl(kc.urls?.registrationAction || kc.urls?.loginAction, '#'),
            registration: safeUrl(kc.urls?.registration, ''),
            loginRestartFlowUrl: restartUrl,
            login: safeUrl(restartUrl || loginUrl, '/'),
            logoutConfirmAction: safeUrl(kc.urls?.logoutConfirmAction || kc.urls?.loginAction, '#'),
            resourcesPath: safeUrl(kc.urls?.resourcesPath, ''),
        },
        
        // Messages
        message: {
            type: kc.message?.type || '',
            hasError: !!kc.message?.error || kc.message?.type === 'error',
            isInfo: kc.message?.type === 'info',
            isSuccess: kc.message?.type === 'success',
            summary: kc.message?.summary || kc.message?.error || '',
        },

        // Terms & Conditions from Keycloak
        termsText: kc.termsText || '',
        termsTitle: kc.termsTitle || '',

        // IDP Broker
        idpAlias: kc.idpAlias || '',
        idpDisplayName: kc.idpDisplayName || '',

        // Social IDP Providers
        social: {
            displayInfo: kc.social?.displayInfo || false,
            providers: kc.social?.providers || [],
        },

        // Multiple Authenticator Selections
        authExecutions: kc.authExecutions || [],

        // WebAuthn registration
        webauthn: kc.webauthn || {},

        // OAuth 2.0 Consent & Client
        oauth: kc.oauth || { clientScopesRequested: [] },
        client: kc.client || {},

        // Recovery codes config
        recoveryCodesConfig: kc.recoveryCodesConfig || { generatedRecoveryAuthnCodesList: [] },

        // Device flow verification
        device: kc.device || {},
        triggered_from_aia: !!kc.triggered_from_aia,
        
        // Environment config with i18n texts
        config: {
            ...env,
            brand: i18nTexts?.brand || {},
            pages: i18nTexts?.pages || {},
            i18nReady: i18nPromise
        }
    };
};
