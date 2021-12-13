import type {
  Object3D
} from 'three'

import type {
  Rigidbody
} from './types'

import {
  BODYTYPE_DYNAMIC,
  PASSIVE,
  MAX_BODIES
} from './constants'

import { ammoLib as ammo } from './ammo'

const bodyMap = new Map<number, Object3D>()
const dynamicBodies = new Set<Object3D>()

let transforms = new Float32Array(MAX_BODIES * 7)
let i = 0
let shift = 0

const init = () => ammo.init()

const update = () => {
  ammo.update(transforms)

  i = 0

  for (const object of dynamicBodies) {
    shift = 7 * i

    object.position.set(
      transforms[shift + 0],
      transforms[shift + 1],
      transforms[shift + 2]
    )

    object.quaternion.set(
      transforms[shift + 3],
      transforms[shift + 4],
      transforms[shift + 5],
      transforms[shift + 6]
    )

    object.updateMatrix()

    i += 1
  }
}

const add = (obj: Object3D, config: Rigidbody) => {
  bodyMap.set(obj.id, obj)
  obj.matrixAutoUpdate = false
  dynamicBodies.add(obj)
  ammo.createRigidbodies([config])
}

const addRigidbodies = (objects: Object3D[], configs: Rigidbody[]) => {
  i = 0

  for (const object of objects) {
    bodyMap.set(object.id, object)
    object.matrixAutoUpdate = false

    switch (configs[i].type) {

      case BODYTYPE_DYNAMIC:
        dynamicBodies.add(object)
        break

    }

    i += 1
  }

  ammo.createRigidbodies(configs)
}

export const physics = {
  bodyMap,
  dynamicBodies,
  init,
  update,
  add,
  addRigidbodies,
  applyCentralImpulse: ammo.applyCentralImpulse,
  applyCentralForce: ammo.applyCentralForce,
  teleport: ammo.teleport,
  teleportMany: ammo.teleportMany,
  setGravity: ammo.setGravity,
}
