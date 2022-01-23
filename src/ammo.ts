import type { Vector3 } from 'three'
import type { Rigidbody } from './types'

import {
  MAX_SUBSTEPS,
  FIXED_TIMESTEP,
  GRAVITY,
  BODYTYPE_STATIC,
  BODYTYPE_DYNAMIC,
  BODYTYPE_KINEMATIC,
  // Collision shapes
  BODYSHAPE_BOX,
  BODYSHAPE_SPHERE,
  BODYSHAPE_MESH,
  // Collision flags
  BODYFLAG_STATIC_OBJECT,
  BODYFLAG_KINEMATIC_OBJECT,
  BODYFLAG_NORESPONSE_OBJECT,
  // Activation states
  BODYSTATE_DISABLE_DEACTIVATION,
  // Groups
  BODYGROUP_DYNAMIC,
  BODYGROUP_STATIC,
  // Masks
  BODYMASK_ALL,
  BODYMASK_NOT_STATIC,
} from './constants'

const dynamicBodies = new Set<any>()
const bodyMap = new Map<number, any>()
const collisions = new Map()
const frameCollisions = new Map()
const collisionStart = new Map()
const collisionEnd = new Map()
const triggerEnter = new Map()
const triggerLeave = new Map()

let world: any
let motionState: any
let body: any
let now = 0, then = 0, dt = 0
let i = 0, shift = 0
let position: any, quaternion: any
let ammo: any
let ammoTransform: any
let ammoVec: any
let ammoVec2: any
let ammoVec3: any
let ammoQuat: any

const init = async () => {
  ammo = await (globalThis as any).Ammo()
  ammoTransform = new ammo.btTransform()
  ammoVec = new ammo.btVector3()
  ammoVec2 = new ammo.btVector3()
  ammoVec3 = new ammo.btVector3()
  ammoQuat = new ammo.btQuaternion()

  const collisionConfiguration = new ammo.btDefaultCollisionConfiguration()
  const dispatcher = new ammo.btCollisionDispatcher(collisionConfiguration)
  const broadphase = new ammo.btDbvtBroadphase()
  const solver = new ammo.btSequentialImpulseConstraintSolver()

  world = new ammo.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration)
  world.setGravity(new ammo.btVector3(0, GRAVITY, 0))
}

const update = (transforms: Float32Array) => {
  now = performance.now()
  dt = ((now - then) / 1000)
  then = now

  world.stepSimulation(dt, MAX_SUBSTEPS, FIXED_TIMESTEP)

  i = 0
  for (body of dynamicBodies) {
    if (body.isActive() === false) {
      continue
    }

    motionState = body.getMotionState()
    motionState.getWorldTransform(ammoTransform)
    position = ammoTransform.getOrigin()
    quaternion = ammoTransform.getRotation()
    shift = 7 * i
    transforms[shift + 0] = position.x()
    transforms[shift + 1] = position.y()
    transforms[shift + 2] = position.z()
    transforms[shift + 3] = quaternion.x()
    transforms[shift + 4] = quaternion.y()
    transforms[shift + 5] = quaternion.z()
    transforms[shift + 6] = quaternion.w()

    if (body.linkedRigidbodyId !== undefined) {
      bodyMap.get(body.linkedRigidbodyId)?.setMotionState(motionState)
    }

    i += 1
  }

  const globalEvents: any[] = []
  
  checkForCollisions(globalEvents)
  cleanOldCollisions(globalEvents)
}

const storeCollision = (body: Rigidbody, other: Rigidbody) => {
  const { id } = body
  let isNewCollision = false

  if (collisions.has(id) === false) {
    collisions.set(id, { body, others: new Map() })
  }

  const collision = collisions.get(id)

  if (collision.others.has(other.id) === false) {
    collision.others.set(other.id, other)
    isNewCollision = true
  }

  if (frameCollisions.has(id) === false) {
    frameCollisions.set(id, { body, others: new Map() })
  }

  frameCollisions.get(id).others.set(other.id, other)

  return isNewCollision
}

const registerEvent = (events: Map<number, any>, id: number, data: any) => {
  if (events.has(id) === false) {
    events.set(id, [])
  }

  events.get(id).push(data)
}

const checkForCollisions = (globalEvents: any[]) => {
  triggerEnter.clear()
  collisionStart.clear()
  frameCollisions.clear()

  const dispatcher = world.getDispatcher()
  const numManifolds = dispatcher.getNumManifolds()

  for (i = 0; i < numManifolds; i++) {
    const manifold = dispatcher.getManifoldByIndexInternal(i)
    const numContacts = manifold.getNumContacts()

    if (numContacts === 0) continue

    const body0 = ammo.castObject(manifold.getBody0(), ammo.btRigidBody)
    const body1 = ammo.castObject(manifold.getBody1(), ammo.btRigidBody)
    const flags0 = body0.getCollisionFlags()
    const flags1 = body1.getCollisionFlags()

    let isNewCollision = false

    const isTriggerBody0 = (flags0 & BODYFLAG_NORESPONSE_OBJECT) === BODYFLAG_NORESPONSE_OBJECT
    const isTriggerBody1 = (flags1 & BODYFLAG_NORESPONSE_OBJECT) === BODYFLAG_NORESPONSE_OBJECT

    // TODO only store, report collisions if event is present
    // Handle triggers
    if (isTriggerBody0 || isTriggerBody1) {

      isNewCollision = storeCollision(body0, body1)
      if (isNewCollision && isTriggerBody1 === false) {
        registerEvent(triggerEnter, body0.id, body1.id)

        if (body0.enter && (body1.name === body0.entity || body0.entity === 'any')) {
          globalEvents.push([body0.enter, body0.id, body1.id])
        }
      }

      isNewCollision = storeCollision(body1, body0)
      if (isNewCollision && isTriggerBody0 === false) {
        registerEvent(triggerEnter, body1.id, body0.id)

        if (body1.enter && (body0.name === body1.entity || body1.entity === 'any')) {
          globalEvents.push([body1.enter, body1.id, body0.id])
        }
      }

    // Handle collisions
    } else {

      isNewCollision = storeCollision(body0, body1)
      if (isNewCollision) {
        registerEvent(collisionStart, body0.id, body1.id)
      }

      isNewCollision = storeCollision(body1, body0)
      if (isNewCollision) {
        registerEvent(collisionStart, body1.id, body0.id)
      }

    }
  }
}

const cleanOldCollisions = (globalEvents: any[]) => {
  triggerLeave.clear()
  collisionEnd.clear()
  
  for (const [id, collision] of collisions) {
    const frameCollision = frameCollisions.get(id)
    const { body, others } = collision

    for (const [otherid, other] of others) {
      if (frameCollision === undefined || frameCollision.others.has(otherid) === false) {
        others.delete(otherid)

        if (body.trigger === true) {
          registerEvent(triggerLeave, body.id, other.id)

          if (body.leave && (other.name === body.entity || body.entity === 'any')) {
            globalEvents.push([body.leave, body.id, other.id])
          }
        } else if (other.trigger === false) {
          registerEvent(collisionEnd, body.id, other.id)
        }
      }
    }

    if (others.size === 0) {
      collisions.delete(id)
    }
  }
}

const createShape = (name: string, shapeType: number, transform: Float32Array, triangles: Float32Array | undefined) => {
  switch (shapeType) {

    case BODYSHAPE_BOX:
      ammoVec.setValue(transform[7], transform[8], transform[9])
      return new ammo.btBoxShape(ammoVec)

    case BODYSHAPE_MESH:
      if (triangles === undefined) {
        throw new Error(`${name}: vertices is undefined`)
      }

      {
        const triMesh = new ammo.btTriangleMesh()
        const useQuantizedAabbCompression = true
      
        for (let i = 0, l = triangles.length; i < l; i += 9) {
          ammoVec.setValue(triangles[i + 0], triangles[i + 1], triangles[i + 2])
          ammoVec2.setValue(triangles[i + 3], triangles[i + 4], triangles[i + 5])
          ammoVec3.setValue(triangles[i + 6], triangles[i + 7], triangles[i + 8])
          triMesh.addTriangle(ammoVec, ammoVec2, ammoVec3, true)
        }
    
        return new ammo.btBvhTriangleMeshShape(triMesh, useQuantizedAabbCompression) 
      }

    case BODYSHAPE_SPHERE:
      return new ammo.btSphereShape(transform[7])

    default:
      throw new Error('Shape not specified.')

  }
}

const createRigidBody = (object: Rigidbody, inertia: boolean, flag: number | undefined) => {
  const { transform } = object

  let localInertia: any
  
  const shape = createShape(object.name, object.shape, transform, object.triangles)
  shape.setMargin(0.0)

  if (inertia === true) {
    localInertia = new ammo.btVector3(0, 0, 0)
    shape.calculateLocalInertia(object.mass ?? 0, localInertia)
  }

  ammoVec.setValue(transform[0], transform[1], transform[2])
  ammoQuat.setValue(transform[3], transform[4], transform[5], transform[6])
  ammoTransform.setOrigin(ammoVec)
  ammoTransform.setRotation(ammoQuat)

  const motionState = new ammo.btDefaultMotionState(ammoTransform)
  const bodyInfo = new ammo.btRigidBodyConstructionInfo(object.mass ?? 0, motionState, shape, localInertia)
  const body = new ammo.btRigidBody(bodyInfo)

  body.type = object.type
  body.trigger = false
  body.id = object.id
  body.name = object.name
  body.linkedRigidbodyId = object.linkedRigidbodyId

  body.setRestitution(object.restitution ?? 0)
  body.setFriction(object.friction ?? 0)
  body.setDamping(object.linearDamping ?? 0, object.angularDamping ?? 0)
  
  // This is only because we have zero gravity set
  body.setActivationState(BODYSTATE_DISABLE_DEACTIVATION)

  if (flag !== undefined) {
    body.setCollisionFlags(body.getCollisionFlags() | flag)
  }

  ammo.destroy(bodyInfo)
  
  if (inertia === true) {
    ammo.destroy(localInertia)
  }

  bodyMap.set(body.id, body)

  return body
}

const createRigidbodies = (objects: Rigidbody[]) => {
  let flag, body, inertia

  for (const object of objects) {
    switch (object.type) {
      
      case BODYTYPE_STATIC:
        inertia = false
        flag = BODYFLAG_STATIC_OBJECT
        body = createRigidBody(object, inertia, flag)
        world.addRigidBody(body, BODYGROUP_STATIC, BODYMASK_NOT_STATIC)
        break

      case BODYTYPE_DYNAMIC:
        inertia = (object.mass || 0) !== 0
        flag = undefined
        body = createRigidBody(object, inertia, flag)
        dynamicBodies.add(body)
        world.addRigidBody(body, BODYGROUP_DYNAMIC, BODYMASK_ALL)
        break

      case BODYTYPE_KINEMATIC:
        inertia = false
        flag = BODYFLAG_KINEMATIC_OBJECT
        body = createRigidBody(object, inertia, flag)
        body.setActivationState(BODYSTATE_DISABLE_DEACTIVATION)
        world.addRigidBody(body)

    }
  }
}

const applyCentralImpulse = (id: number, impulse: Vector3) => {
  body = bodyMap.get(id)
  ammoVec.setValue(impulse.x, impulse.y, impulse.z)
  body.applyCentralImpulse(ammoVec)
  body.activate()
}

const applyCentralForce = (id: number, force: Vector3) => {
  body = bodyMap.get(id)
  ammoVec.setValue(force.x, force.y, force.z)
  body.applyCentralForce(ammoVec)
  body.activate()
}

const applyTorqueImpulse = (id: number, torque: Vector3) => {
  body = bodyMap.get(id)
  ammoVec.setValue(torque.x, torque.y, torque.z)
  body.applyTorqueImpulse(ammoVec)
  body.activate()
}

const teleport = (id: number, transform: Float32Array, clearForces = false, shift = 0) => {
  body = bodyMap.get(id)

  body.activate()

  if (clearForces === true) {
    ammoVec.setValue(0, 0, 0)
    body.setLinearVelocity(ammoVec)

    ammoVec.setValue(0, 0, 0)
    body.setAngularVelocity(ammoVec)
  }

  ammoVec.setValue(transform[shift + 0], transform[shift + 1], transform[shift + 2])
  ammoQuat.setValue(transform[shift + 3], transform[shift + 4], transform[shift + 5], transform[shift + 6])
  ammoTransform.setOrigin(ammoVec)
  ammoTransform.setRotation(ammoQuat)
  body.setWorldTransform(ammoTransform)

  if (body.type === BODYTYPE_KINEMATIC) {
    body.getMotionState()?.setWorldTransform(ammoTransform)
  }
}

const teleportMany = (ids: Uint16Array, transforms: Float32Array, clearForces = false) => {
  i = 0

  for (const id of ids) {
    teleport(id, transforms, clearForces, i)
    i += 7
  }
}

const setGravity = (acceleration: Vector3) => {
  ammoVec.setValue(acceleration.x, acceleration.y, acceleration.z)
  world.setGravity(ammoVec)
}

export const ammoLib = {
  collisionStart,
  collisionEnd,

  init,
  update,
  applyCentralImpulse,
  applyTorqueImpulse,
  applyCentralForce,
  teleport,
  teleportMany,
  createRigidbodies,
  setGravity
}
