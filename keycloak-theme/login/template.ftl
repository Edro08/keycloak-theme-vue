<#macro layout>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>${msg("loginTitle", realm.name)!''}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="${url.resourcesPath}/index.css">

        <script>
          window.__KC_CONTEXT = {
            realm: "${realm.name!''}",
            action: "${url.loginAction!''}",
            username: "${login.username!''}",
            error: "<#if message??>${message.summary!''}</#if>",
            login: {
              rememberMe: ${realm.rememberMe?c},
              forgotPassword: ${realm.resetPasswordAllowed?c},
              loginResetCredentialsUrl: "${url.loginResetCredentialsUrl!''}"
            }
          };
        </script>
    </head>
    <body>
        <div id="app"></div>
        <script type="module" src="${url.resourcesPath}/index.js"></script>
    </body>
    </html>
</#macro>


