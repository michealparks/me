import * as Comlink from 'comlink'
import { Renderer } from './renderer'

export class ThreeWorker {
  renderer!: Renderer

  init (canvas: OffscreenCanvas) {
    this.renderer = new Renderer(canvas, innerWidth, innerHeight, devicePixelRatio)

    requestAnimationFrame(this.update)
  }

  update = () => {
    
    requestAnimationFrame(this.update)
  }
}

Comlink.expose(new ThreeWorker())
