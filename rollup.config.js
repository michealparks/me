import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import svelte from 'rollup-plugin-svelte'
import { terser } from 'rollup-plugin-terser'
import config from 'sapper/config/rollup.js'
import { md } from './rollup/rollup-plugin-md.js'
import pkg from './package.json'

const mode = process.env.NODE_ENV
const dev = mode === 'development'

const onwarn = (warning, onwarn) => {
  if (warning.message.includes('eval')) return
  return (warning.code === 'CIRCULAR_DEPENDENCY' && /[/\\]@sapper[/\\]/.test(warning.message)) || onwarn(warning)
}

export default {
  client: {
    input: config.client.input(),
    output: config.client.output(),
    plugins: [
      md(),
      json(),
      replace({
        'process.browser': true,
        'process.env.NODE_ENV': JSON.stringify(mode)
      }),
      svelte({
        dev,
        hydratable: true,
        emitCss: true
      }),
      resolve({
        browser: true,
        dedupe: ['svelte']
      }),
      commonjs(),
      !dev && terser({ module: true })
    ],

    preserveEntrySignatures: false,
    onwarn
  },

  server: {
    input: config.server.input(),
    output: config.server.output(),
    plugins: [
      md(),
      json(),
      replace({
        'process.browser': false,
        'process.env.NODE_ENV': JSON.stringify(mode)
      }),
      svelte({
        generate: 'ssr',
        dev
      }),
      resolve({ dedupe: ['svelte'] }),
      commonjs()
    ],
    external: [
      ...Object.keys(pkg.dependencies),
      ...require('module').builtinModules
    ],
    preserveEntrySignatures: 'strict',
    onwarn
  },

  serviceworker: {
    input: config.serviceworker.input(),
    output: config.serviceworker.output(),
    plugins: [
      json(),
      resolve(),
      replace({
        'process.browser': true,
        'process.env.NODE_ENV': JSON.stringify(mode)
      }),
      commonjs(),
      !dev && terser()
    ],

    preserveEntrySignatures: false,
    onwarn
  }
}
