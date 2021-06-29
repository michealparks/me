import alias from '@rollup/plugin-alias'
import copy from 'rollup-plugin-copy'
import { terser } from 'rollup-plugin-terser'
import { terser as terserConfig } from './scripts/configs'

const { DEV, PROD } = process.env

export default {
  input: 'node_modules/ammo.js/builds/ammo.wasm.js',
  output: [{
    file: 'public/ammo.js',
    format: 'es',
    banner: 'globalThis.exports=globalThis;'
  }],
  plugins: [
    alias({
      entries: {
        fs: require.resolve('./scripts/noop'),
        path: require.resolve('./scripts/noop')
      }
    }),
    copy({
      targets: [
        {
          src: 'node_modules/ammo.js/builds/ammo.wasm.wasm',
          dest: 'public'
        }
      ]
    }),
    PROD && terser(terserConfig)
  ]
}
