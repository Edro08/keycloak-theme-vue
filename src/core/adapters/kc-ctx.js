/**
 * Adapter to safely access Keycloak context and environment variables.
 * This decouples the application from the global window object.
 */
import { loadLocale } from '@/services/i18n-service';

// Store for i18n texts (loaded asynchronously)
let i18nTexts = null;
let i18nPromise = null;

export const useKeycloakContext = () => {
    // Safely access globals, defaulting to empty objects if not present (e.g. in dev mode or tests)
    const env = window.env || {}
    const kc = window.kc_context || {};

    // Load i18n texts if not already loaded
    if (!i18nTexts && !i18nPromise) {
        const resourcesPath = kc.urls?.resourcesPath || '';
        i18nPromise = loadLocale(env.locale || 'es', resourcesPath).then(texts => {
            i18nTexts = texts;
            return texts;
        });
    }

    return {
        // Realm configuration
        realm: {
            name: kc.realm_config?.name || '',
            rememberMe: kc.realm_config?.rememberMe || false,
            resetPasswordAllowed: kc.realm_config?.resetPasswordAllowed || false,
            loginWithEmailAllowed: kc.realm_config?.loginWithEmailAllowed || true,
            registrationEmailAsUsername: kc.realm_config?.registrationEmailAsUsername || false,
            duplicateEmailsAllowed: kc.realm_config?.duplicateEmailsAllowed || false,
            isAppInitiatedAction: kc.realm_config?.isAppInitiatedAction || false,
        },

        // User data
        user: {
            username: kc.user?.username || '',
        },

        // URLs
        urls: {
            loginAction: kc.urls?.loginAction || '#',
            loginResetCredentials: kc.urls?.loginResetCredentials || '',
            login: kc.urls?.login || '/',
            resourcesPath: kc.urls?.resourcesPath || '',
        },
        
        // Messages
        message: {
            hasError: !!kc.message?.error,
            summary: kc.message?.error || '',
        },
        
        // Environment config with i18n texts
        config: {
            ...env,
            pages: i18nTexts?.pages || {},
            i18nReady: i18nPromise
        }
    };
};
