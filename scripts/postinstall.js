import { copyDir } from './copydir.js'
import fs from 'node:fs/promises'

await Promise.all([
  copyDir('./node_modules/sword/src', './src/sword'),
])

// @todo Remove when postprocessing v7 lands.
let contents = await fs.readFile('./node_modules/three/build/three.module.js', 'utf-8')

console.log(contents.includes('WebGLMultisampleRenderTarget'))
if (contents.includes('WebGLMultisampleRenderTarget') === false) {
  contents = `
  ${contents}

  export class DataTexture3D extends Data3DTexture {}

  export class WebGLMultisampleRenderTarget extends WebGLRenderTarget {
    constructor(...args) {
      super(...args);
      this.samples = 4;
    }
  }`

  await fs.writeFile('./node_modules/three/build/three.module.js', contents, 'utf-8')

}

