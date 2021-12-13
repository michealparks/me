import type { Listener } from './types'

import {
  LoadingManager,
  TextureLoader,
  AudioLoader
} from 'three'

import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const manager = new LoadingManager()
const textureLoader = new TextureLoader()
const audioLoader = new AudioLoader()
const gltfLoader = new GLTFLoader()
const fontLoader = new FontLoader()

textureLoader.setPath('/assets/tex/')
audioLoader.setPath('/assets/mp3/')
gltfLoader.setPath('/assets/glb/')
fontLoader.setPath('/assets/fonts/')

const queued = new Set<string>()
const listeners = new Set<Listener>()
const promises = new Set()
const cache = new Map()

const loadJSON = async (file: string) => {
  const response = await fetch(`assets/json/${file}`)
  cache.set(file, await response.json())
}

const loadTexture = async (file: string) => {
  cache.set(file, await textureLoader.loadAsync(file))
}

const loadAudio = async (file: string) => {
  cache.set(file, await audioLoader.loadAsync(file))
}

const loadGLTF = async (file: string) => {
  cache.set(file, await gltfLoader.loadAsync(file))
}

const loadFont = async (file: string) => {
  cache.set(file, await fontLoader.loadAsync(file))
}

const loadOne = (file: string) => {
  if (file.includes('.typeface.json')) {
    return loadFont(file)
  }

  switch (file.split('.').pop()) {
    case 'glb': return loadGLTF(file)
    case 'png':
    case 'jpg': return loadTexture(file)
    case 'mp3': return loadAudio(file)
    case 'json': return loadJSON(file)
  }
}

const get = (file: string) => {
  return cache.get(file)
}

const queue = (...args: string[]) => {
  queueMany(args)
  return assets
}

const queueMany = (iterable: string[] | Set<string>) => {
  for (const file of iterable) {
    queued.add(file)
  }
  return assets
}

const on = (event: string, fn: Listener) => {
  switch (event) {
    case 'load': return listeners.add(fn)
  }
}

const load = (...queue: string[]) => {
  if (queue) queueMany(queue)

  for (const file of queued) {
    promises.add(loadOne(file))
  }

  return Promise.all(promises).then(() => {
    for (const listener of listeners) {
      listener()
    }

    queued.clear()
    promises.clear()

    return cache.get(queue[0])
  })
}

export const assets = {
  cache,
  manager,
  textureLoader,
  audioLoader,
  gltfLoader,
  get,
  queue,
  queueMany,
  on,
  load,
  loadOne
}
