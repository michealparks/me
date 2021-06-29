import {
  WebGLRenderer,
  ACESFilmicToneMapping,
  sRGBEncoding,
  Scene,
  PerspectiveCamera,
  HalfFloatType,
  AmbientLight,
  AudioListener,
  Clock,
  Fog
} from 'three'

import {
  EffectComposer,
  EffectPass,
  RenderPass,
  SMAAEffect,
  SMAAPreset,
  BloomEffect,
  KernelSize,
  SMAAImageLoader
  // @ts-ignore
} from 'postprocessing'

import TWEEN from '@tweenjs/tween.js'

import {
  COLOR_AMBIENT_LIGHT,
  EXPOSURE,
  FAR,
  FOV,
  NEAR,
  SHADOWMAP
} from './constants'

export class Renderer {
  canvas: HTMLCanvasElement
  composer: EffectComposer
  camera: PerspectiveCamera
  ambientLight: AmbientLight

  gl: WebGLRenderer
  clock = new Clock()
  scene = new Scene()
  listener = new AudioListener()
  width = 0
  height = 0
  dpi = 0

  constructor (canvas: HTMLCanvasElement, width: number, height: number, dpi: number) {
    this.gl = new WebGLRenderer({
      canvas,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
    })
    this.canvas = canvas
    this.dpi = Math.min(dpi, 2)
    this.setSize(width, height)
    this.gl.toneMapping = ACESFilmicToneMapping
    this.gl.toneMappingExposure = EXPOSURE
    this.gl.outputEncoding = sRGBEncoding
    this.gl.physicallyCorrectLights = true
    this.gl.shadowMap.enabled = true
    this.gl.shadowMap.type = SHADOWMAP

    this.composer = new EffectComposer(this.gl, {
      frameBufferType: HalfFloatType
    })

    this.scene.fog = new Fog('black', 10, 20)
    this.camera = new PerspectiveCamera(FOV, width / height, NEAR, FAR)
    this.scene.add(this.camera)
    this.camera.add(this.listener)

    const intensity = 1.0
    this.ambientLight = new AmbientLight(COLOR_AMBIENT_LIGHT, intensity)
    this.scene.add(this.ambientLight)
  }

  init = async () => {
    const smaaImageLoader = new SMAAImageLoader()

    const [search, area] = await new Promise((resolve) =>
      smaaImageLoader.load(resolve)
    )

    const bloomEffect = new BloomEffect({
      height: 480,
      intensity: 1,
      kernelSize: KernelSize.VERY_LARGE
    })

    const smaaEffect = new SMAAEffect(search, area, SMAAPreset.ULTRA)
  
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    this.composer.addPass(new EffectPass(this.camera, smaaEffect, bloomEffect))
  }

  update = () => {
    const dt = this.clock.getDelta()
    const canvas = this.gl.domElement

    TWEEN.update()

    if (canvas.width === this.width && canvas.height === this.height) {
      this.composer.render(dt)
    } else {
      this.camera.aspect = this.width / this.height
      this.camera.updateProjectionMatrix()
      this.gl.setSize(this.width, this.height, false)
      this.composer.setSize(this.width, this.height, false)
    }

    return dt
  }

  setSize = (width: number, height: number) => {
    this.width = width * this.dpi | 0
    this.height = height * this.dpi | 0
  }

  add = (file: string) => {

  }
}
