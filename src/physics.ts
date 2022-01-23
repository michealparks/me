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
  ammo.createRigidbodies([config])

  switch (config.type) {
    case BODYTYPE_DYNAMIC:
      dynamicBodies.add(obj)
      break
  }
}

export const physics = {
  bodyMap,
  dynamicBodies,
  update,
  add,
  applyTorqueImpulse: ammo.applyTorqueImpulse,
  applyCentralImpulse: ammo.applyCentralImpulse,
  applyCentralForce: ammo.applyCentralForce,
  teleport: ammo.teleport,
  teleportMany: ammo.teleportMany,
  setGravity: ammo.setGravity,
}
