import { defineConfig } from 'vite'
import path from 'node:path'
import define from './env'

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: 'assets',
  build: {
    assetsInlineLimit: 2048,
    target: 'esnext',
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
