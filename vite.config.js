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

export default defineConfig(({ command, mode }) => ({
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode === 'development' ? 'development' : 'production'),
    'process.env': {}
  },
  plugins: [
    vue(),
    // Only enable DevTools in local development serve, never in production build
    command === 'serve' && mode === 'development' ? vueDevTools() : null,
    copyPublic(),
  ].filter(Boolean),
  build: {
    outDir: resolve(import.meta.dirname, dirDeployLogin + dirResources),
    emptyOutDir: true,
    copyPublicDir: false,
    sourcemap: false,
    minify: true,
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
}))

function copyPublic() {
  return {
    name: 'copy-public',
    closeBundle() {
      const source = resolve(import.meta.dirname, dirPublic);
      const destination = resolve(import.meta.dirname, dirDeployLogin);
      if (fs.existsSync(source)) {
        fs.cpSync(source, destination, { recursive: true, force: true });
      }
    }
  };
}
