# 🚀 Keycloak Theme Vue

Tema de login moderno para Keycloak construido con **Vue.js 3** y **Vite**, con soporte para múltiples idiomas y arquitectura limpia.

---

## ✨ Características

- 🎨 **UI Moderna**: Diseño limpio con CSS variables
- 🌍 **Multiidioma (i18n)**: Soporte para español e inglés con carga dinámica
- 🏗️ **Arquitectura limpia**: Adaptadores centralizados y componentes reutilizables
- 🔧 **Configuración flexible**: Textos y configuraciones sin necesidad de rebuild
- 📝 **Páginas implementadas**:

  | Página          | Componente           | Descripción                                        |
  | --------------- | -------------------- | -------------------------------------------------- |
  | Login           | `Login.vue`          | Autenticación con usuario y contraseña             |
  | Reset Password  | `ResetPassword.vue`  | Recuperación de contraseña                         |
  | Update Password | `UpdatePassword.vue` | Actualización de contraseña (forzada o voluntaria) |
  | Page Expired    | `PageExpired.vue`    | Sesión expirada con opciones de reinicio           |
  | Error           | `Error.vue`          | Página de error genérica con mensaje               |

---

## ✔ Requisitos

- [Node.js](https://nodejs.org/) v20.19.0 o superior (recomendado >=22.12.0)
- [npm](https://www.npmjs.com/) para gestión de paquetes
- [Keycloak](https://www.keycloak.org/) server (para deployment)

---

## ⚡ Inicio Rápido

### 1. Clonar el repositorio

```bash
git clone https://github.com/Edro08/keycloak-theme-vue.git
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Desarrollo local

```bash
npm run dev
```

El tema estará disponible en `http://localhost:5173`

### 4. Build para producción

```bash
npm run build
```

Los archivos compilados se generan en `dist/keycloak-theme/login/`

---

## 🌍 Sistema de Internacionalización (i18n)

### Agregar un nuevo idioma

1. Crea un nuevo archivo JSON en `public/resources/i18n/`:

   ```json
   // public/resources/i18n/pt.json (ejemplo: portugués)
   {
     "pages": {
       "login": {
         "title": "Entre na sua conta"
         // ...
       }
     }
   }
   ```

2. Los textos se cargan automáticamente según el `locale` configurado

### Actualizar textos sin rebuild

- Edita los archivos JSON en `public/resources/i18n/`
- Los cambios se reflejan inmediatamente al recargar
- No es necesario recompilar con `npm run build`

---

## 🔧 Configuración de Acciones

El mapeo de URLs a componentes se define en `public/resources/env.js`:

```javascript
window.env = {
  actions: {
    "login-actions/authenticate": "login",
    "login-actions/reset-credentials": "reset-password",
    "login-actions/required-action": "required-action",
    "login-page-expired": "page-expired",
  },

  // Para acciones requeridas con parámetro execution
  executionActions: {
    UPDATE_PASSWORD: "update-password",
    VERIFY_EMAIL: "verify-email",
    UPDATE_PROFILE: "update-profile",
    CONFIGURE_TOTP: "configure-totp",
  },
};
```

---

## 🚀 Deployment a Keycloak

### 1. Build del tema

```bash
npm run build
```

### 2. Opción A: Deploy automático (Docker)

Si tienes un contenedor Docker llamado `keycloak`, puedes usar el script incluido:

```bash
npm run deploy
```

Esto ejecutará el build y copiará los archivos al contenedor.

### 3. Opción B: Copiar manual

Los archivos generados en `dist/keycloak-theme/login/` deben copiarse a:

```
<KEYCLOAK_HOME>/themes/keycloak-theme-vue/login/
```

### 4. Seleccionar el tema en Keycloak

1. Accede a la consola de administración de Keycloak
2. Ve a **Realm Settings** → **Themes**
3. Selecciona `keycloak-theme-vue` en **Login Theme**
4. Guarda los cambios

### 5. Verificar

Abre la página de login del realm y deberías ver el nuevo tema.

---

## 🚨 Notas Importantes

- ⚠️ **Desarrollo Local**: Los datos de contexto (`window.kc_context`) pueden no estar disponibles en desarrollo. El código maneja esto con valores por defecto.
- 🔐 **Producción**: Asegúrate de probar el tema en un entorno de Keycloak real antes de desplegar a producción.
- 📦 **Archivos en /public**: Los archivos en la carpeta `public` se copian tal cual al build, incluyendo `.ftl` y archivos de recursos.

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.

---
