window.env = {
    // Default locale
    locale: 'es',
    
    // Action URL mappings
    actions: {
        'login-actions/authenticate': 'login',
        'login-actions/reset-credentials': 'reset-password',
        'login-actions/required-action': 'required-action', // Will use execution parameter
        'login-page-expired': 'page-expired',
    },
    
    // Execution parameter mappings (for required-action)
    executionActions: {
        'UPDATE_PASSWORD': 'update-password',
        'VERIFY_EMAIL': 'verify-email',
        'UPDATE_PROFILE': 'update-profile',
        'CONFIGURE_TOTP': 'configure-totp',
    },
    
    // Validation regexps
    regexp: {
        username: '',
        password: '',
    }
};