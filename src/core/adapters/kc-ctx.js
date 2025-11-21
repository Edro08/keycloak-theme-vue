/**
 * Adapter to safely access Keycloak context and environment variables.
 * This decouples the application from the global window object.
 */
export const useKeycloakContext = () => {
    // Safely access globals, defaulting to empty objects if not present (e.g. in dev mode or tests)
    const env = window.env || {}
    const kc = window.kc_context || {};

    return {
        realm: {
            name: kc.realm || '',
            rememberMe: kc.login?.rememberMe || false,
            resetPasswordAllowed: kc.login?.forgotPassword || false,
        },

        login: {
            username: kc.username || '',
            actionUrl: kc.action || '#',
            resetCredentialsUrl: kc.login?.loginResetCredentialsUrl || '',
        },
        
        message: {
            hasError: !!kc.error,
            summary: kc.error || '',
        },
        
        config: env
    };
};
