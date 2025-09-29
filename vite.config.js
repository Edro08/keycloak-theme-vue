import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { resolve } from "path";

export default defineConfig({
  define: {
    'process.env': {}
  },
  plugins: [
    vue(),
    vueDevTools(),
  ],
  build: {
    outDir: resolve(__dirname, "keycloak-theme/login/resources"),
    emptyOutDir: true, // Clear resources/
    lib: {
      entry: "src/main.js",
      name: "keycloak-theme",
      fileName: "index",
    },
    rollupOptions: {},
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
