import {
  PointLight,
  SpotLight,
  TextGeometry,
  MeshStandardMaterial,
  BoxGeometry,
  Mesh,
  PlaneGeometry,
  Object3D
} from 'three'

import { assets } from './assets'
import { COLORS, SHADOW_MAP } from './constants'

const setRandomTransform = (object: Object3D, transform: Float32Array) => {
  const px = Math.random() * 4 - 3, py = 7, pz = 0
  const qx = Math.random(), qy = Math.random(), qz = Math.random()

  object.position.set(px, py, pz)
  object.rotation.set(qx, qy, qz)
  object.updateMatrix()

  transform[0] = px
  transform[1] = py
  transform[2] = pz
  transform[3] = object.quaternion.x
  transform[4] = object.quaternion.y
  transform[5] = object.quaternion.z
  transform[6] = object.quaternion.w
  transform[7] = transform[8] = transform[9] = 0.25

  return transform
}

const shuffleArray = (arr: Array<any>) => {
  let i = arr.length - 1
  let j = 0
  let temp

  while (i > 0) {
    j = Math.random() * (i + 1) | 0
    temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp

    i -= 1
  }

  return arr
}

const createPlane = (size = 1, color = 0xffffff) => {
  return new Mesh(
    new PlaneGeometry(size, size, 1, 1),
    new MeshStandardMaterial({ color })
  )
}

const createCube = (size = 1, color = 0x44aa88) => {
  return new Mesh(
    new BoxGeometry(size, size, size),
    new MeshStandardMaterial({ color }))
}

const createPointLight = () => {
  const intensity = 3.0
  const color = COLORS.warmLight
  const light = new PointLight(color, intensity)
  light.castShadow = true
  light.shadow.mapSize.width = SHADOW_MAP.width
  light.shadow.mapSize.height = SHADOW_MAP.height
  light.shadow.radius = 8
  light.shadow.bias = -0.0001
  return light
}

const createSpotLight = () => {
  const intensity = 5.0
  const light = new SpotLight(COLORS.warmLight, intensity)
  light.castShadow = true
  light.angle = 50
  light.penumbra = 1
  light.shadow.mapSize.width = SHADOW_MAP.width
  light.shadow.mapSize.height = SHADOW_MAP.height
  light.shadow.radius = 8
  light.shadow.bias = -0.0001
  return light
}

export const utils = {
  createPlane,
  createCube,
  createPointLight,
  createSpotLight,
  setRandomTransform,
  shuffleArray
}
