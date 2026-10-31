window.env = {
    // Default locale
    locale: 'es',
    
    // Action URL mappings
    actions: {
        'login-actions/authenticate': 'login',
        'login-actions/registration': 'register',
        'login-actions/reset-credentials': 'reset-password',
        'login-actions/action-token': 'update-password',
        'login-actions/required-action': 'required-action',
        'login-page-expired': 'page-expired',
        'login-config-totp': 'configure-totp',
        'login-otp': 'login-otp',
        'login-update-profile': 'update-profile',
        'login-verify-email': 'verify-email',
        'register': 'register',
        'terms': 'terms',
        'idp-review-user-profile': 'idp-review-user-profile',
        'login-idp-link-confirm': 'login-idp-link-confirm',
        'login-idp-link-email': 'login-idp-link-email',
        'select-authenticator': 'select-authenticator',
        'logout-confirm': 'logout-confirm',
        'webauthn-register': 'webauthn-register',
        'webauthn': 'webauthn-register',
        'login-oauth-grant': 'oauth-grant',
        'login-recovery-authn-code-config': 'recovery-codes-config',
        'login-recovery-authn-code-input': 'recovery-code-input',
        'delete-account-confirm': 'delete-account-confirm',
        'login-oauth2-device-verify-user-code': 'device-verify-user-code',
    },
    
    // Execution parameter mappings (for required-action)
    executionActions: {
        'UPDATE_PASSWORD': 'update-password',
        'VERIFY_EMAIL': 'verify-email',
        'UPDATE_PROFILE': 'update-profile',
        'CONFIGURE_TOTP': 'configure-totp',
        'TERMS_AND_CONDITIONS': 'terms',
        'webauthn-register': 'webauthn-register',
        'webauthn-register-passwordless': 'webauthn-register',
        'CONFIGURE_RECOVERY_AUTHN_CODES': 'recovery-codes-config',
        'delete_account': 'delete-account-confirm',
    },
    
    // Validation regexps
    regexp: {
        username: '',
        password: '',
    }
};
