import svelte from 'rollup-plugin-svelte'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import serve from 'rollup-plugin-serve'
import { terser } from 'rollup-plugin-terser'
import { svelteHTML } from './svelte-html'

const DEV = process.env.NODE_ENV === 'development'

const plugins = [
  resolve(),
  replace({ DEV }),
  DEV === false && terser()
]

export default [
  // Server
  {
    input: 'src/App.svelte',
    output: {
      file: 'dist/main-server.js',
      format: 'cjs'
    },
    plugins: [
      ...plugins,
      svelte({
        generate: 'ssr',
        hydratable: true,
        css (css) {
          css.write('dist/main.css')
        }
      }),
      svelteHTML(),
      serve({
        contentBase: 'dist',
        open: true
      })
    ]
  },
  // Client
  {
    input: 'src/App.svelte',
    output: {
      file: 'dist/main.js',
      format: 'esm'
    },
    plugins: [
      ...plugins,
      svelte({
        hydratable: true,
        css: false
      })
    ]
  }
]
