# Keycloak Theme Vue

[![Keycloak](https://img.shields.io/badge/Keycloak-26.x%2B-blue.svg?logo=keycloak&logoColor=white)](https://www.keycloak.org/)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-42b883.svg?logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Tema de autenticación y autoservicio para **Keycloak**, construido con **Vue 3**, **Vite** y **Design Tokens (CSS Variables)**. Diseñado con arquitectura desacoplada, soporte para múltiples idiomas en caliente y cobertura para los flujos de identidad.

---

## ✨ Características Principales

- **Design System con Tokens:** Paleta corporativa, microinteracciones y variables CSS centralizadas en `theme.css` y `components.css`.
- **Cobertura Total (21 Pantallas):** Cubre el 100% de los flujos de autenticación, autoservicio, recuperación y autorización de Keycloak.
- **Autenticación Moderna:** Soporte nativo para llaves físicas FIDO2, biometría (Windows Hello / Touch ID) mediante **WebAuthn / Passkeys**, y **Social Login con Google**.
- **MFA Empresarial:** Configuración de TOTP con códigos QR / llave manual y sistema de **Códigos de Respaldo 2FA (Backup Codes)** con descarga `.txt` y copiado rápido.
- **Internacionalización Dinámica (i18n):** Traducciones en Español (`es`) e Inglés (`en`) editables en caliente sin necesidad de recompilar Vite.
- **Arquitectura Limpia:** Separación estricta entre vistas (`pages/`), componentes atómicos (`components/ui/`), layout (`components/layout/`) y adaptadores del contexto Keycloak (`kc-ctx.js`).
- **Build Reproducible:** Compilación y despliegue agnóstico mediante Docker y Node 20.

---

## 📱 Matriz de Pantallas Implementadas

| Categoría | Plantilla Keycloak | Componente Vue | Descripción |
| :--- | :--- | :--- | :--- |
| **Inicio de Sesión** | `login.ftl` | `Login.vue` | Formulario Split-Screen con soporte Google IDP y remember-me |
| **Registro** | `register.ftl` | `Register.vue` | Alta de usuarios con validaciones de contraseña y términos |
| **Recuperación** | `login-reset-password.ftl` | `ResetPassword.vue` | Solicitud de restablecimiento vía correo electrónico |
| **Actualización** | `login-update-password.ftl` | `UpdatePassword.vue` | Cambio forzado o voluntario con medidores de seguridad |
| **Perfil** | `login-update-profile.ftl` | `UpdateProfile.vue` | Completar datos faltantes (nombre, apellido, email) |
| **Verificación Email** | `login-verify-email.ftl` | `VerifyEmail.vue` | Aviso de confirmación de buzón con reenvío de enlace |
| **Términos** | `terms.ftl` | `Terms.vue` | Aceptación legal con texto dinámico inyectado desde el Realm |
| **MFA TOTP** | `login-otp.ftl` | `LoginOtp.vue` | Ingreso de código temporal de 6 dígitos |
| **Configuración TOTP** | `login-config-totp.ftl` | `ConfigureTotp.vue` | Escaneo de código QR o ingreso manual de secreto |
| **Selector Métodos** | `select-authenticator.ftl` | `SelectAuthenticator.vue` | Selector interactivo cuando el usuario tiene múltiples factores |
| **Passkeys / FIDO2** | `webauthn-register.ftl` | `WebAuthnRegister.vue` | Registro criptográfico con `navigator.credentials.create` |
| **Códigos Respaldo** | `login-recovery-authn-code-config.ftl` | `RecoveryCodesConfig.vue` | Generación, descarga y copia de 10 códigos de emergencia |
| **Ingreso Respaldo** | `login-recovery-authn-code-input.ftl` | `RecoveryCodeInput.vue` | Acceso alternativo por código de un solo uso |
| **Revisar Perfil IDP** | `idp-review-user-profile.ftl` | `IdpReviewProfile.vue` | Confirmación de datos al ingresar por primera vez con Google |
| **Vincular Cuenta IDP**| `login-idp-link-confirm.ftl` | `IdpLinkConfirm.vue` | Resolución de colisión de cuentas por correo existente |
| **Consentimiento OAuth**| `login-oauth-grant.ftl` | `OAuthGrant.vue` | Autorización de scopes de aplicaciones clientes (OIDC) |
| **Dispositivos / CLI** | `login-oauth2-device-verify-user-code.ftl` | `DeviceVerifyUserCode.vue` | Vinculación RFC 8628 para Smart TVs y terminales de consola |
| **Eliminar Cuenta** | `delete-account-confirm.ftl` | `DeleteAccountConfirm.vue` | Diálogo de advertencia destructiva para borrado GDPR |
| **Cierre de Sesión** | `logout-confirm.ftl` | `LogoutConfirm.vue` | Confirmación de seguridad para finalizar sesión activa |
| **Errores & Sesión** | `error.ftl` / `page-expired.ftl` | `Error.vue` / `PageExpired.vue` | Manejo de tokens vencidos y sesiones caducadas |

---

## ✔ Requisitos

- [Docker](https://www.docker.com/) o [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Recomendado para compilar sin dependencias de host).
- [Keycloak](https://www.keycloak.org/) 24.x, 25.x o 26.x (Instancia local o en contenedor).
- *(Opcional para desarrollo local)*: [Node.js](https://nodejs.org/) `>= 20.19.0` y [pnpm](https://pnpm.io/) `>= 9.x`.

---

## ⚡ Inicio Rápido

### 1. Clonar el repositorio

```bash
git clone https://github.com/Edro08/keycloak-theme-vue.git
```

Entrar al directorio del proyecto:

```bash
cd keycloak-theme-vue
```

### 2. Compilar para Producción

Puedes compilar sin necesidad de tener Node instalado en tu máquina mediante el contenedor oficial de Docker:

```bash
docker run --rm -v "%cd%:/app" -w /app node:20-alpine sh -c "corepack enable && pnpm install && pnpm run build"
```

Los artefactos listos para Keycloak se generarán automáticamente en `dist/keycloak-theme/`.

### 3. Desplegar en Keycloak (Docker)

Copia el tema compilado directamente a la carpeta de temas de tu contenedor de Keycloak:

```bash
docker cp dist/keycloak-theme keycloak:/opt/keycloak/themes/
```

### 4. Activar el Tema en la Consola de Keycloak

1. Ingresa a la **Consola de Administración de Keycloak** (`http://localhost:8080/admin`).
2. Dirígete a **Realm Settings** ➔ pestaña **Themes**.
3. En el campo **Login theme**, selecciona `keycloak-theme`.
4. Haz clic en **Save**. ¡Tu tema Vue ya está activo en todos los flujos!

---

## 🌍 Personalización de Textos e Idiomas (i18n)

Los textos de toda la interfaz se encuentran desacoplados en archivos JSON dentro de `public/resources/i18n/`:

- **Editar textos existentes:** Modifica `es.json` o `en.json`. Los cambios se reflejarán **inmediatamente** al recargar el navegador, sin necesidad de ejecutar un nuevo build de Vite.
- **Agregar un nuevo idioma:** Agrega el archivo `public/resources/i18n/<codigo>.json` y actívalo en la consola de Keycloak (**Realm Settings ➔ Localization**).

---

## 📄 Licencia

Distribuido bajo la licencia **Apache License 2.0**. Consulta los archivos [`LICENSE`](./LICENSE) y [`NOTICE`](./NOTICE) para más información.
