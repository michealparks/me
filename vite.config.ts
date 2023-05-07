import { defineConfig } from 'vite'
import wasm from 'vite-plugin-wasm'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: 'assets',
  build: {
    target: 'esnext',
  },
  plugins: [wasm(), svelte()],
  worker: {
    format: 'es',
    plugins: [
      wasm(),
    ],
  },
})
