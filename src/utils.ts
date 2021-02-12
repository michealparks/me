import {
  PointLight,
  SpotLight,
  TextGeometry,
  MeshNormalMaterial,
  MeshStandardMaterial,
  BoxGeometry,
  Mesh
} from 'three'

import { assets } from './assets'
import { COLORS, SHADOW_MAP } from './constants'

const createCube = (size = 1, color = 0x44aa88) => {
  return new Mesh(
    new BoxGeometry(size, size, size),
    new MeshNormalMaterial())
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

const createText = (text: string, size = 0.5, color = 0xffffff, font = 'helvetiker.typeface.json') => {
  const textGeometry = new TextGeometry(text, {
    font: assets.get(font),
    size,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5
  }).center()
  const textMaterial = new MeshNormalMaterial()
  return new Mesh(textGeometry, textMaterial)
}

export const utils = {
  createCube,
  createPointLight,
  createSpotLight,
  createText
}
