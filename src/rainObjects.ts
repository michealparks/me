import {
  Object3D,
  Vector3,
  Mesh,
  Box3,
  Scene
} from 'three'

import { assets } from './assets'

import { physics } from './physics'
import { BODYTYPE_DYNAMIC, BODYSHAPE_BOX } from './constants'
import { utils } from './utils'

const vec3 = new Vector3()
const box = new Box3()

const idle = () => new Promise(resolve => {
  'requestIdleCallback' in window ? window.requestIdleCallback(resolve) : resolve(undefined)
})

const delay = (ms: number) => new Promise(resolve => {
  setTimeout(resolve, ms)
})

const addShadows = (node: Object3D) => {
  if (node instanceof Mesh) {
    node.castShadow = true
    node.receiveShadow = true
  }
}

const getSize = (object: Object3D) => {
  const bb = object.getObjectByName('BoundingBox')
  if (bb) {
    box.setFromObject(bb)
    bb.visible = false
  } else {
    box.setFromObject(object)
  }
  box.getSize(vec3)
}

const prep = (object: Object3D) => {
  // addShadows(object)
  object.traverse(addShadows)
}

const startFall = async (object: Object3D) => {
  await idle()
  const transform = new Float32Array(7)
  utils.setRandomTransform(object, transform)
  physics.teleport(object.id, transform, true)
  setTimeout(startFall, 12000, object)
}

type Configs = { file: string, sel?: string }[]

export const rainObjects = async (configs: Configs, mainScene: Scene) => {
  utils.shuffleArray(configs)

  while (configs.length > 0) {
    const { file, sel } = configs.pop()!
    await idle()
    await assets.load(file)

    const scene = assets.get(file).scene as Object3D
    const object = sel ? scene.getObjectByName(sel)! : scene
    prep(object)

    const transform = new Float32Array(10)
    utils.setRandomTransform(object, transform)

    getSize(object)
    transform[7] = vec3.x / 2
    transform[8] = vec3.y / 2
    transform[9] = vec3.z / 2

    await idle()
    physics.addRigidbodies([object], [{
      id: object.id,
      name: object.name,
      type: BODYTYPE_DYNAMIC,
      shape: BODYSHAPE_BOX,
      transform,
      mass: 1,
      linearDamping: 0,
      angularDamping: 0,
      friction: 0.3,
      restitution: 0.9
    }])

    await idle()
    mainScene.add(object)
    startFall(object)

    await delay(2000)
  }
}
