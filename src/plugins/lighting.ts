import { enhanceShaderLighting } from 'enhance-shader-lighting'
import * as THREE from 'three'
import { injectPlugin } from '@threlte/core'

const options = {
  aoPower: 1,
  aoSmoothing: 0,
  aoMapGamma: 1,
  lightMapGamma: 10,
  lightMapSaturation: 1,
  envPower: 1,
  roughnessPower: 1,
  sunIntensity:   0,
  mapContrast:    1,
  lightMapContrast: 1,
  smoothingPower: 0.25,
  irradianceIntensity: Math.PI,
  radianceIntensity: 1,
}

export const lightingPlugin = () => {
  injectPlugin<{ shadows?: boolean }>('lighting', ({ ref, props }) => {
    if (!(ref instanceof THREE.Mesh)) return
    if (!(ref.material instanceof THREE.Material)) return

    return {
      pluginProps: ['shadows'],
      onRefChange: (ref: THREE.Mesh) => {
        ref.material.onBeforeCompile = (shader) => enhanceShaderLighting(shader, options)
      },
    }
  })
}
