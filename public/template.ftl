<#macro registrationLayout bodyClass="" displayInfo=false displayMessage=true displayRequiredFields=false pageId="">
<#assign safeLoginAction = "">
<#if pageId != "error" && pageId != "info">
    <#attempt>
        <#if url?? && url.loginAction??>
            <#assign safeLoginAction = url.loginAction>
        </#if>
    <#recover>
        <#assign safeLoginAction = "">
    </#recover>
</#if>
<!DOCTYPE html>
<html lang="<#if locale?? && locale.currentLanguageTag??>${locale.currentLanguageTag}<#else>es</#if>">
<head>
    <meta charset="UTF-8">
    <title><#if realm?? && realm.name??>${realm.name}<#else>Keycloak</#if></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Preconnect to Google Fonts for faster font loading (saves 150-300ms FCP) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <!-- Embedded Brand Favicon (Prevents 404 /favicon.ico requests) -->
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%232563eb'><path d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'/></svg>">

    <#if url?? && url.resourcesPath??>
        <link rel="stylesheet" href="${url.resourcesPath}/app.css">
    </#if>
</head>
<body>
    <div id="app"></div>

    <script>
      const cleanUrl = function(u) { return u ? u.replace(/&amp;/g, '&') : ''; };
      window.kc_context = {
        pageId: "${pageId?js_string}",
        
        // Locale
        locale: {
          current: "<#if locale?? && locale.currentLanguageTag??>${locale.currentLanguageTag?js_string}<#else>es</#if>",
          currentLabel: "<#if locale?? && locale.current??>${locale.current?js_string}<#else>Español</#if>",
          supported: [
            <#if realm?? && realm.internationalizationEnabled?? && realm.internationalizationEnabled && locale?? && locale.supported??>
              <#list locale.supported as l>
                {
                  label: "${l.label?js_string}",
                  languageTag: "<#if l.languageTag??>${l.languageTag?js_string}<#else></#if>",
                  url: cleanUrl("${l.url?js_string}")
                }<#sep>, 
              </#list>
            </#if>
          ]
        },
        
        // Realm configuration
        realm_config: {
          name: "<#if realm?? && realm.name??>${realm.name?js_string}</#if>",
          rememberMe: <#if realm?? && realm.rememberMe?? && realm.rememberMe>true<#else>false</#if>,
          resetPasswordAllowed: <#if realm?? && realm.resetPasswordAllowed?? && realm.resetPasswordAllowed>true<#else>false</#if>,
          loginWithEmailAllowed: <#if realm?? && realm.loginWithEmailAllowed?? && realm.loginWithEmailAllowed>true<#else>false</#if>,
          registrationAllowed: <#if realm?? && realm.registrationAllowed?? && realm.registrationAllowed>true<#else>false</#if>,
          registrationEmailAsUsername: <#if realm?? && realm.registrationEmailAsUsername?? && realm.registrationEmailAsUsername>true<#else>false</#if>,
          duplicateEmailsAllowed: <#if realm?? && realm.duplicateEmailsAllowed?? && realm.duplicateEmailsAllowed>true<#else>false</#if>,
          isAppInitiatedAction: <#if isAppInitiatedAction?? && isAppInitiatedAction>true<#else>false</#if>
        },
        
        // User data
        user: {
          username: "<#if user?? && user.username??>${user.username?js_string}<#elseif login?? && login.username??>${login.username?js_string}</#if>",
          firstName: "<#if user?? && user.firstName??>${user.firstName?js_string}</#if>",
          lastName: "<#if user?? && user.lastName??>${user.lastName?js_string}</#if>",
          email: "<#if user?? && user.email??>${user.email?js_string}</#if>",
          editUsernameAllowed: <#if user?? && user.editUsernameAllowed?? && user.editUsernameAllowed>true<#else>false</#if>
        },
        
        // Register form data (on validation error)
        register: {
          firstName: "<#if register?? && register.formData?? && register.formData.firstName??>${register.formData.firstName?js_string}</#if>",
          lastName: "<#if register?? && register.formData?? && register.formData.lastName??>${register.formData.lastName?js_string}</#if>",
          email: "<#if register?? && register.formData?? && register.formData.email??>${register.formData.email?js_string}</#if>",
          username: "<#if register?? && register.formData?? && register.formData.username??>${register.formData.username?js_string}</#if>"
        },
        
        // URLs
        urls: {
          loginAction: cleanUrl("<#if safeLoginAction != "">${safeLoginAction?js_string}</#if>"),
          loginResetCredentials: cleanUrl("<#if url?? && url.loginResetCredentialsUrl??>${url.loginResetCredentialsUrl?js_string}</#if>"),
          login: cleanUrl("<#if url?? && url.loginUrl??>${url.loginUrl?js_string}</#if>"),
          registrationAction: cleanUrl("<#if url?? && url.registrationAction??>${url.registrationAction?js_string}<#elseif safeLoginAction != "">${safeLoginAction?js_string}</#if>"),
          registration: cleanUrl("<#if url?? && url.registrationUrl??>${url.registrationUrl?js_string}</#if>"),
          resourcesPath: cleanUrl("<#if url?? && url.resourcesPath??>${url.resourcesPath?js_string}</#if>"),
          loginRestartFlowUrl: cleanUrl("<#if url?? && url.loginRestartFlowUrl??>${url.loginRestartFlowUrl?js_string}</#if>"),
          logoutConfirmAction: cleanUrl("<#if url?? && url.logoutConfirmAction??>${url.logoutConfirmAction?js_string}<#elseif safeLoginAction != "">${safeLoginAction?js_string}</#if>")
        },
        
        // Messages
        message: {
          type: "<#if message?? && message.type??>${message.type?js_string}</#if>",
          summary: "<#if message?? && message.summary??>${message.summary?js_string}<#elseif messageHeader??><#attempt>${msg(messageHeader)?js_string}<#recover>${messageHeader?js_string}</#recover></#if>",
          header: "<#if messageHeader??><#attempt>${msg(messageHeader)?js_string}<#recover>${messageHeader?js_string}</#recover></#if>",
          error: "<#if message?? && message.summary?? && (!message.type?? || message.type == 'error')>${message.summary?js_string}</#if>"
        },
        skipLink: <#if skipLink?? && skipLink>true<#else>false</#if>,

        // Client info & Actions
        client: {
          baseUrl: "<#if client?? && client.baseUrl??>${client.baseUrl?js_string}</#if>"
        },
        actionUri: "<#if actionUri??>${actionUri?js_string}</#if>",
        pageRedirectUri: "<#if pageRedirectUri??>${pageRedirectUri?js_string}</#if>",
        requiredActions: [<#if requiredActions??><#list requiredActions as action>"${action?js_string}"<#sep>, </#list></#if>],

        // Terms & Conditions
        termsText: "<#attempt><#if kcSanitize?? && msg("termsText")??>${kcSanitize(msg("termsText"))?js_string}<#elseif msg?? && msg("termsText")??>${msg("termsText")?js_string}</#if><#recover></#recover>",
        termsTitle: "<#attempt><#if msg?? && msg("termsTitle")??>${msg("termsTitle")?js_string}</#if><#recover></#recover>",

        // IDP / Broker Context
        idpAlias: "<#attempt><#if brokerContext?? && brokerContext.idpConfig?? && brokerContext.idpConfig.alias??>${brokerContext.idpConfig.alias?js_string}<#elseif idpAlias??>${idpAlias?js_string}</#if><#recover></#recover>",
        idpDisplayName: "<#attempt><#if brokerContext?? && brokerContext.idpConfig?? && brokerContext.idpConfig.displayName??>${brokerContext.idpConfig.displayName?js_string}<#elseif idpDisplayName??>${idpDisplayName?js_string}</#if><#recover></#recover>",

        // Social Identity Providers
        social: {
          displayInfo: <#if displayInfo?? && displayInfo>true<#else>false</#if>,
          providers: [
            <#if social?? && social.providers??>
              <#list social.providers as p>
                {
                  alias: "${p.alias?js_string}",
                  displayName: "${p.displayName?js_string}",
                  loginUrl: cleanUrl("${p.loginUrl?js_string}"),
                  iconClasses: "${(p.iconClasses!'')?js_string}"
                }<#sep>, 
              </#list>
            </#if>
          ]
        },

        // Multiple Authenticator Selections
        authExecutions: [
          <#if auth?? && auth.authenticationSelections??>
            <#list auth.authenticationSelections as exec>
              {
                authExecId: "${exec.authExecId?js_string}",
                displayName: "${exec.displayName?js_string}",
                helpText: "${(exec.helpText!'')?js_string}",
                iconCssClass: "${(exec.iconCssClass!'')?js_string}"
              }<#sep>, 
            </#list>
          </#if>
        ],

        // WebAuthn registration
        webauthn: {
          challenge: "<#attempt><#if authenticators?? && authenticators.challenge??>${authenticators.challenge?js_string}<#elseif challenge??>${challenge?js_string}</#if><#recover></#recover>",
          userId: "<#attempt><#if authenticators?? && authenticators.userId??>${authenticators.userId?js_string}<#elseif userId??>${userId?js_string}</#if><#recover></#recover>",
          username: "<#attempt><#if authenticators?? && authenticators.username??>${authenticators.username?js_string}<#elseif username??>${username?js_string}</#if><#recover></#recover>",
          signatureAlgorithms: [<#attempt><#if authenticators?? && authenticators.signatureAlgorithms??><#list authenticators.signatureAlgorithms as alg>"${alg?js_string}"<#sep>, </#list></#if><#recover></#recover>],
          rpEntityName: "<#attempt><#if authenticators?? && authenticators.rpEntityName??>${authenticators.rpEntityName?js_string}</#if><#recover></#recover>",
          rpId: "<#attempt><#if authenticators?? && authenticators.rpId??>${authenticators.rpId?js_string}</#if><#recover></#recover>",
          attestationConveyancePreference: "<#attempt><#if authenticators?? && authenticators.attestationConveyancePreference??>${authenticators.attestationConveyancePreference?js_string}</#if><#recover></#recover>",
          authenticatorAttachment: "<#attempt><#if authenticators?? && authenticators.authenticatorAttachment??>${authenticators.authenticatorAttachment?js_string}</#if><#recover></#recover>",
          requireResidentKey: "<#attempt><#if authenticators?? && authenticators.requireResidentKey??>${authenticators.requireResidentKey?js_string}</#if><#recover></#recover>",
          userVerificationRequirement: "<#attempt><#if authenticators?? && authenticators.userVerificationRequirement??>${authenticators.userVerificationRequirement?js_string}</#if><#recover></#recover>",
          createTimeout: <#attempt><#if authenticators?? && authenticators.createTimeout??>${authenticators.createTimeout?c}<#else>0</#if><#recover>0</#recover>,
          isUserIdentified: <#attempt><#if isUserIdentified?? && isUserIdentified>true<#else>false</#if><#recover>false</#recover>
        },

        // OTP & TOTP configuration
        totp: {
          totpSecretQrCode: "<#if totp?? && totp.totpSecretQrCode??>${totp.totpSecretQrCode?js_string}</#if>",
          totpSecretEncoded: "<#if totp?? && totp.totpSecretEncoded??>${totp.totpSecretEncoded?js_string}</#if>",
          totpSecret: "<#if totp?? && totp.totpSecret??>${totp.totpSecret?js_string}</#if>",
          manualUrl: "<#if totp?? && totp.manualUrl??>${totp.manualUrl?js_string}</#if>",
          qrUrl: "<#if totp?? && totp.qrUrl??>${totp.qrUrl?js_string}</#if>",
          policyType: "<#if totp?? && totp.policy?? && totp.policy.type??>${totp.policy.type?js_string}<#else>totp</#if>",
          policyDigits: <#if totp?? && totp.policy?? && totp.policy.digits??>${totp.policy.digits?c}<#else>6</#if>,
          policyPeriod: <#if totp?? && totp.policy?? && totp.policy.period??>${totp.policy.period?c}<#else>30</#if>
        },
        mode: "<#if mode??>${mode?js_string}</#if>",
        otpLogin: {
          selectedCredentialId: "<#if otpLogin?? && otpLogin.selectedCredentialId??>${otpLogin.selectedCredentialId?js_string}</#if>",
          userOtpCredentials: [
            <#if otpLogin?? && otpLogin.userOtpCredentials??>
              <#list otpLogin.userOtpCredentials as cred>
                {
                  id: "${cred.id?js_string}",
                  userLabel: "${cred.userLabel?js_string}"
                }<#sep>, 
              </#list>
            </#if>
          ]
        },
        oauth: {
          code: "<#if oauth?? && oauth.code??>${oauth.code?js_string}</#if>",
          action: "<#if url?? && url.oauthAction??>${cleanUrl(url.oauthAction)?js_string}</#if>",
          clientScopesRequested: [
            <#if oauth?? && oauth.clientScopesRequested??>
              <#list oauth.clientScopesRequested as clientScope>
                {
                  consentScreenText: "<#if clientScope.consentScreenText??>${kcSanitize(advancedMsg(clientScope.consentScreenText))?js_string}</#if>",
                  parameterizedScopeParameter: "<#if clientScope.parameterizedScopeParameter??>${clientScope.parameterizedScopeParameter?js_string}</#if>"
                }<#sep>,
              </#list>
            </#if>
          ]
        },
        client: {
          clientId: "<#if client?? && client.clientId??>${client.clientId?js_string}</#if>",
          name: "<#if client?? && client.name?has_content>${kcSanitize(advancedMsg(client.name))?js_string}<#elseif client?? && client.clientId??>${client.clientId?js_string}</#if>",
          logoUri: "<#if client?? && client.attributes?? && client.attributes.logoUri??>${client.attributes.logoUri?js_string}</#if>",
          tosUri: "<#if client?? && client.attributes?? && client.attributes.tosUri??>${client.attributes.tosUri?js_string}</#if>",
          policyUri: "<#if client?? && client.attributes?? && client.attributes.policyUri??>${client.attributes.policyUri?js_string}</#if>"
        },
        recoveryCodesConfig: {
          generatedRecoveryAuthnCodesList: [
            <#if recoveryAuthnCodesConfigBean?? && recoveryAuthnCodesConfigBean.generatedRecoveryAuthnCodesList??>
              <#list recoveryAuthnCodesConfigBean.generatedRecoveryAuthnCodesList as code>
                "${code?js_string}"<#sep>,
              </#list>
            </#if>
          ],
          generatedRecoveryAuthnCodesAsString: "<#if recoveryAuthnCodesConfigBean?? && recoveryAuthnCodesConfigBean.generatedRecoveryAuthnCodesAsString??>${recoveryAuthnCodesConfigBean.generatedRecoveryAuthnCodesAsString?js_string}</#if>",
          generatedAt: "<#if recoveryAuthnCodesConfigBean?? && recoveryAuthnCodesConfigBean.generatedAt??>${recoveryAuthnCodesConfigBean.generatedAt?c}</#if>"
        },
        device: {
          verificationAction: "<#if url?? && url.oauth2DeviceVerificationAction??>${cleanUrl(url.oauth2DeviceVerificationAction)?js_string}</#if>",
          userCode: "<#if deviceVerification?? && deviceVerification.userCode??>${deviceVerification.userCode?js_string}</#if>"
        },
        triggered_from_aia: <#if triggered_from_aia?? && triggered_from_aia>true<#else>false</#if>
      };
    </script>

    <#if url?? && url.resourcesPath??>
        <script type="module" src="${url.resourcesPath}/env.js"></script>
        <script type="module" src="${url.resourcesPath}/app.js"></script>
    </#if>
</body>
</html>
</#macro>

<#macro layout pageId="">
    <@registrationLayout pageId=pageId><#nested></@registrationLayout>
</#macro>
