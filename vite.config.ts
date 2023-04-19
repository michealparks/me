import { defineConfig } from 'vite'
import path from 'node:path'
import wasm from 'vite-plugin-wasm'
import define from './env'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: 'assets',
  build: {
    target: 'esnext',
  },
  plugins: [wasm(), svelte()],
  worker: {
    format: "es",
    plugins: [
      wasm(),
    ]
  },
  envPrefix: ['THREE', 'SWORD'],
  resolve:{
    alias:{
      'sword/debug': path.resolve(__dirname, './src/sword/debug/index'),
      'sword' : path.resolve(__dirname, './src/sword/main'),
    },
  },
  define,
})
