import type {
  Vector3,
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
import { app } from './app'

import PhysicsWorker from './worker.ts?worker'

const worker = new PhysicsWorker()

worker.addEventListener('message', () => {
  worker.addEventListener('message', handleMessage, PASSIVE)
  if (resolver) resolver()
  ready = true
}, { once: true })

const bodyMap = new Map<number, Object3D>()
const dynamicBodies = new Set<Object3D>()

let transforms = new Float32Array(MAX_BODIES * 7)
let pendingUpdate = false
let i = 0
let shift = 0
let ready = false
let resolver: any

const init = () => {
  if (ready) return Promise.resolve()
  return new Promise((resolve) => {
    resolver = resolve
  })
}

const update = () => {
  if (pendingUpdate === true) {
    return
  }

  worker.postMessage({
    op: 'update',
    transforms
  }, [transforms.buffer])

  pendingUpdate = true
}

const handleMessage = (e: MessageEvent) => {
  switch (e.data.op) {
    case 'update': return updateBodies(e)
  }
}

const updateBodies = (e: MessageEvent) => {
  const { data } = e

  for (const [id, others] of e.data.collisionStart) {
    app.fire('collisionstart', { id, others })
  }

  transforms = data.transforms
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

  pendingUpdate = false
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

  worker.postMessage({
    op: 'createRigidbodies',
    objects: configs
  })
}

const applyCentralImpulse = (id: number, impulse: Vector3) => {
  worker.postMessage({
    op: 'applyCentralImpulse',
    id,
    impulse: { x: impulse.x, y: impulse.y, z: impulse.z }
  })
}

const applyCentralForce = (id: number, force: Vector3) => {
  worker.postMessage({
    op: 'applyCentralForce',
    id,
    force: { x: force.x, y: force.y, z: force.z }
  })
}

const teleport = (id: number, transform: Float32Array, clearForces = false) => {
  worker.postMessage({
    op: 'teleport',
    id,
    transform,
    clearForces
  })
}

const teleportMany = (ids: Uint16Array, transforms: Float32Array) => {
  worker.postMessage({
    op: 'teleportMany',
    ids,
    transforms
  })
}

const setGravity = (acceleration: Vector3) => {
  worker.postMessage({
    op: 'setGravity',
    acceleration: { x: acceleration.x, y: acceleration.y, z: acceleration.z }
  })
}

export const physics = {
  worker,
  bodyMap,
  dynamicBodies,
  init,
  update,
  addRigidbodies,
  applyCentralImpulse,
  applyCentralForce,
  teleport,
  teleportMany,
  setGravity,
}
