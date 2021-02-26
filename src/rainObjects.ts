import {
  Object3D,
  Vector3,
  Mesh,
  Box3
} from 'three'

import type { Rigidbody } from './types'

import { gl } from './gl'
import { physics } from './physics'
import { BODYTYPE_DYNAMIC, BODYSHAPE_BOX } from './constants'

import { utils } from './utils'

const vec3 = new Vector3()
const box = new Box3()

export const rainObjects = async (objects: Mesh[]) => {
  const meshes: Object3D[] = []
  const rigidbodies: Rigidbody[] = []

  let l = 0

  for (const object of objects) {
    const transform = new Float32Array(10)
    utils.setRandomTransform(object, transform)

    box.setFromObject(object)
    box.getSize(vec3)
    transform[7] = vec3.x / 2
    transform[8] = vec3.y / 2
    transform[9] = vec3.z / 2

    rigidbodies.push({
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
    })

    gl.scene.add(object)
    meshes.push(object)

    l += 1
  }

  physics.addRigidbodies(meshes, rigidbodies)

  let i = 0

  setInterval(() => {
    console.log(i)
    const object = meshes[i]

    const transform = new Float32Array(7)
    utils.setRandomTransform(object, transform)

    physics.teleport(object.id, transform, true)

    i += 1
    
    if (i === l) i = 0
  }, 3000)
}
