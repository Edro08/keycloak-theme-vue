import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { resolve } from "path";
import * as fs from 'fs';

const fileName = "app"
const dirDeployLogin = "dist/keycloak-theme/login/"
const dirPublic = "public"
const dirResources = "resources"

export default defineConfig({
  define: {
    'process.env': {}
  },
  plugins: [
    vue(),
    vueDevTools(),
    copyPublic(),
  ],
  build: {
    outDir: resolve(__dirname, dirDeployLogin + dirResources),
    emptyOutDir: true,
    copyPublicDir: false,
    lib: {
      entry: "src/main.js",
      name: "keycloak-theme",
      fileName: fileName,
      cssFileName: fileName
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})

function copyPublic() {
  return {
    name: 'copy-public',
    closeBundle() {
      const source = resolve(__dirname, dirPublic);
      const destination = resolve(__dirname, dirDeployLogin);
      if (fs.existsSync(source)) {
        fs.cpSync(source, destination, { recursive: true, force: true });
      }
    }
  };
}
