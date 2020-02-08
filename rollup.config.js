import svelte from 'rollup-plugin-svelte'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

const DEV = process.env.NODE_ENV === 'development'

module.exports = [{
  input: 'src/main.js',
  output: {
    file: 'dist/main.js',
    format: 'esm'
  },
  plugins: [
    resolve(),
    replace({ DEV }),
    DEV ? undefined : terser(),
    svelte({
      generate: 'ssr',
      css (css) {
        css.write('dist/main.css')
      }
    })
  ]
}]
