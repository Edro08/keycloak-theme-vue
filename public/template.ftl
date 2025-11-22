<#macro layout>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>${msg("loginTitle", realm.name)!''}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="${url.resourcesPath}/app.css">
    </head>
    <body>
        <div id="app"></div>

        <script>
          window.kc_context = {
            // Realm configuration
            realm_config: {
              name: "${realm.name!''}",
              rememberMe: ${realm.rememberMe?c},
              resetPasswordAllowed: ${realm.resetPasswordAllowed?c},
              loginWithEmailAllowed: ${realm.loginWithEmailAllowed?c},
              registrationEmailAsUsername: ${realm.registrationEmailAsUsername?c},
              duplicateEmailsAllowed: ${realm.duplicateEmailsAllowed?c},
              isAppInitiatedAction: <#if isAppInitiatedAction??>true<#else>false</#if>
            },
            
            // User data
            user: {
              username: "${login.username!''}"
            },
            
            // URLs
            urls: {
              loginAction: "${url.loginAction!''}",
              loginResetCredentials: "${url.loginResetCredentialsUrl!''}",
              login: "${url.loginUrl!''}",
              resourcesPath: "${url.resourcesPath!''}",
              loginRestartFlowUrl: "${url.loginRestartFlowUrl!''}"
            },
            
            // Messages
            message: {
              error: "<#if message??>${message.summary!''}</#if>"
            }
          };
        </script>

        <script type="module" src="${url.resourcesPath}/env.js"></script>
        <script type="module" src="${url.resourcesPath}/app.js"></script>
    </body>
    </html>
</#macro>