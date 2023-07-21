import * as THREE from 'three'
import { injectPlugin } from '@threlte/core'
import { shadows } from 'trzy'

export const shadowsPlugin = () => {
  injectPlugin<{ shadows?: boolean }>('shadows', ({ ref, props }) => {
    if (!(ref instanceof THREE.Mesh)) return
    if (props.shadows === false) return

    return {
      pluginProps: ['shadows'],
      onRefChange: (ref: THREE.Mesh) => shadows(ref),
    }
  })
}
