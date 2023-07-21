import * as THREE from 'three'
import { injectPlugin, useFrame } from '@threlte/core'

const propKeysRequiringMatrixUpdate = [
  'position',
  'position.x',
  'position.y',
  'position.z',
  'rotation',
  'rotation.x',
  'rotation.y',
  'rotation.z',
  'rotation.order',
  'quaternion',
  'quaternion.x',
  'quaternion.y',
  'quaternion.z',
  'quaternion.w',
  'scale',
  'scale.x',
  'scale.y',
  'scale.z',
]

const objectsToUpdate: THREE.Object3D[] = []

export const matrixPlugin = () => {
  useFrame(
    ({ invalidate }) => {
      if (objectsToUpdate.length === 0) return
      
      objectsToUpdate.forEach((object) => object.updateMatrix())
      objectsToUpdate.splice(0, objectsToUpdate.length)
      invalidate()
    },
    {
      order: Number.NEGATIVE_INFINITY,
      invalidate: false,
    }
  )

  injectPlugin<{ matrixAutoUpdate?: boolean }>('matrix-update', ({ ref, props }) => {
    if (!(ref instanceof THREE.Object3D)) return
    if (props.matrixAutoUpdate) return

    ref.matrixAutoUpdate = false
    ref.matrixWorldAutoUpdate = false

    const checkForMatrixUpdate = (props: Record<string, unknown>) => {
      if (propKeysRequiringMatrixUpdate.some((key) => props[key] !== undefined)) {
        objectsToUpdate.push(ref as THREE.Object3D<Event>)
      }
      // if (Object.keys(props).some((key) => propKeysRequiringMatrixUpdate.has(key))) {
      //   objectsToUpdate.push(ref)
      // }
    }
    checkForMatrixUpdate(props)
    return {
      pluginProps: ['matrixAutoUpdate'],
      onRefChange: (ref: THREE.Object3D) => {
        ref.updateMatrix()
        ref.updateMatrixWorld()
      },
      onRestPropsChange: (restProps) => checkForMatrixUpdate(restProps),
    }
  })
}
