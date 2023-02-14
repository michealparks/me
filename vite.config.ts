import { defineConfig } from 'vite'
import path from 'node:path'
import wasm from 'vite-plugin-wasm'
import define from './env'

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: 'assets',
  build: {
    target: 'esnext',
  },
  plugins: [
    wasm(),
  ],
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
