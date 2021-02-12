importScripts("ammo.js");
const MAX_SUBSTEPS = 40;
const FIXED_TIMESTEP = 1 / 60;
const GRAVITY = -9.8;
const BODYTYPE_STATIC = 0;
const BODYTYPE_DYNAMIC = 1;
const BODYTYPE_KINEMATIC = 2;
const BODYSHAPE_BOX = 0;
const BODYSHAPE_SPHERE = 1;
const BODYSHAPE_MESH = 2;
const BODYFLAG_STATIC_OBJECT = 1;
const BODYFLAG_KINEMATIC_OBJECT = 2;
const BODYFLAG_NORESPONSE_OBJECT = 4;
const BODYSTATE_ACTIVE_TAG = 1;
const BODYSTATE_ISLAND_SLEEPING = 2;
const BODYSTATE_WANTS_DEACTIVATION = 3;
const BODYSTATE_DISABLE_DEACTIVATION = 4;
const BODYSTATE_DISABLE_SIMULATION = 5;
const BODYGROUP_NONE = 0;
const BODYGROUP_DEFAULT = 1;
const BODYGROUP_DYNAMIC = 1;
const BODYGROUP_STATIC = 2;
const BODYGROUP_KINEMATIC = 4;
const BODYGROUP_TRIGGER = 16;
const BODYMASK_NONE = 0;
const BODYMASK_ALL = 65535;
const BODYMASK_STATIC = 2;
const BODYMASK_NOT_STATIC = 65535 ^ 2;
const BODYMASK_NOT_STATIC_KINEMATIC = 65535 ^ (2 | 4);
const dynamicBodies = new Set();
const bodyMap = new Map();
const collisions = new Map();
const frameCollisions = new Map();
const collisionStart = new Map();
const collisionEnd = new Map();
const triggerEnter = new Map();
const triggerLeave = new Map();
let ammo;
let ammoTransform;
let ammoVec;
let ammoVec2;
let ammoVec3;
let ammoQuat;
let world;
let motionState;
let body;
let now = 0, then = 0, dt = 0;
let i = 0, shift = 0;
let position, quaternion;
const init = async () => {
  ammo = await self.Ammo();
  ammoTransform = new ammo.btTransform();
  ammoVec = new ammo.btVector3();
  ammoVec2 = new ammo.btVector3();
  ammoVec3 = new ammo.btVector3();
  ammoQuat = new ammo.btQuaternion();
  const collisionConfiguration = new ammo.btDefaultCollisionConfiguration();
  const dispatcher = new ammo.btCollisionDispatcher(collisionConfiguration);
  const broadphase = new ammo.btDbvtBroadphase();
  const solver = new ammo.btSequentialImpulseConstraintSolver();
  world = new ammo.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, collisionConfiguration);
  world.setGravity(new ammo.btVector3(0, GRAVITY, 0));
  postMessage({op: "init"});
};
const update = (transforms) => {
  now = performance.now();
  dt = (now - then) / 1e3;
  then = now;
  world.stepSimulation(dt, MAX_SUBSTEPS, FIXED_TIMESTEP);
  i = 0;
  for (body of dynamicBodies) {
    if (body.isActive() === true) {
      motionState = body.getMotionState();
      motionState.getWorldTransform(ammoTransform);
      position = ammoTransform.getOrigin();
      quaternion = ammoTransform.getRotation();
      shift = 7 * i;
      transforms[shift + 0] = position.x();
      transforms[shift + 1] = position.y();
      transforms[shift + 2] = position.z();
      transforms[shift + 3] = quaternion.x();
      transforms[shift + 4] = quaternion.y();
      transforms[shift + 5] = quaternion.z();
      transforms[shift + 6] = quaternion.w();
      if (body.linkedRigidbodyId !== void 0) {
        bodyMap.get(body.linkedRigidbodyId)?.setMotionState(motionState);
      }
    }
    i += 1;
  }
  const globalEvents = [];
  checkForCollisions(globalEvents);
  cleanOldCollisions(globalEvents);
  postMessage({
    op: "update",
    transforms,
    globalEvents,
    triggerEnter: [...triggerEnter],
    collisionStart: [...collisionStart],
    triggerLeave: [...triggerLeave],
    collisionEnd: [...collisionEnd]
  }, [transforms.buffer]);
};
const storeCollision = (body2, other) => {
  const {id} = body2;
  let isNewCollision = false;
  if (collisions.has(id) === false) {
    collisions.set(id, {body: body2, others: new Map()});
  }
  const collision = collisions.get(id);
  if (collision.others.has(other.id) === false) {
    collision.others.set(other.id, other);
    isNewCollision = true;
  }
  if (frameCollisions.has(id) === false) {
    frameCollisions.set(id, {body: body2, others: new Map()});
  }
  frameCollisions.get(id).others.set(other.id, other);
  return isNewCollision;
};
const registerEvent = (events, id, data) => {
  if (events.has(id) === false) {
    events.set(id, []);
  }
  events.get(id).push(data);
};
const checkForCollisions = (globalEvents) => {
  triggerEnter.clear();
  collisionStart.clear();
  frameCollisions.clear();
  const dispatcher = world.getDispatcher();
  const numManifolds = dispatcher.getNumManifolds();
  for (i = 0; i < numManifolds; i++) {
    const manifold = dispatcher.getManifoldByIndexInternal(i);
    const numContacts = manifold.getNumContacts();
    if (numContacts === 0)
      continue;
    const body0 = ammo.castObject(manifold.getBody0(), ammo.btRigidBody);
    const body1 = ammo.castObject(manifold.getBody1(), ammo.btRigidBody);
    const flags0 = body0.getCollisionFlags();
    const flags1 = body1.getCollisionFlags();
    let isNewCollision = false;
    const isTriggerBody0 = (flags0 & BODYFLAG_NORESPONSE_OBJECT) === BODYFLAG_NORESPONSE_OBJECT;
    const isTriggerBody1 = (flags1 & BODYFLAG_NORESPONSE_OBJECT) === BODYFLAG_NORESPONSE_OBJECT;
    if (isTriggerBody0 || isTriggerBody1) {
      isNewCollision = storeCollision(body0, body1);
      if (isNewCollision && isTriggerBody1 === false) {
        registerEvent(triggerEnter, body0.id, body1.id);
        if (body0.enter && (body1.name === body0.entity || body0.entity === "any")) {
          globalEvents.push([body0.enter, body0.id, body1.id]);
        }
      }
      isNewCollision = storeCollision(body1, body0);
      if (isNewCollision && isTriggerBody0 === false) {
        registerEvent(triggerEnter, body1.id, body0.id);
        if (body1.enter && (body0.name === body1.entity || body1.entity === "any")) {
          globalEvents.push([body1.enter, body1.id, body0.id]);
        }
      }
    } else {
      isNewCollision = storeCollision(body0, body1);
      if (isNewCollision) {
        registerEvent(collisionStart, body0.id, body1.id);
      }
      isNewCollision = storeCollision(body1, body0);
      if (isNewCollision) {
        registerEvent(collisionStart, body1.id, body0.id);
      }
    }
  }
};
const cleanOldCollisions = (globalEvents) => {
  triggerLeave.clear();
  collisionEnd.clear();
  for (const [id, collision] of collisions) {
    const frameCollision = frameCollisions.get(id);
    const {body: body2, others} = collision;
    for (const [otherid, other] of others) {
      if (frameCollision === void 0 || frameCollision.others.has(otherid) === false) {
        others.delete(otherid);
        if (body2.trigger === true) {
          registerEvent(triggerLeave, body2.id, other.id);
          if (body2.leave && (other.name === body2.entity || body2.entity === "any")) {
            globalEvents.push([body2.leave, body2.id, other.id]);
          }
        } else if (other.trigger === false) {
          registerEvent(collisionEnd, body2.id, other.id);
        }
      }
    }
    if (others.size === 0) {
      collisions.delete(id);
    }
  }
};
const createShape = (name, shapeType, transform, triangles) => {
  switch (shapeType) {
    case BODYSHAPE_BOX:
      ammoVec.setValue(transform[7], transform[8], transform[9]);
      return new ammo.btBoxShape(ammoVec);
    case BODYSHAPE_MESH:
      if (triangles === void 0) {
        throw new Error(`${name}: vertices is undefined`);
      }
      {
        const triMesh = new ammo.btTriangleMesh();
        const useQuantizedAabbCompression = true;
        for (let i2 = 0, l = triangles.length; i2 < l; i2 += 9) {
          ammoVec.setValue(triangles[i2 + 0], triangles[i2 + 1], triangles[i2 + 2]);
          ammoVec2.setValue(triangles[i2 + 3], triangles[i2 + 4], triangles[i2 + 5]);
          ammoVec3.setValue(triangles[i2 + 6], triangles[i2 + 7], triangles[i2 + 8]);
          triMesh.addTriangle(ammoVec, ammoVec2, ammoVec3, true);
        }
        return new ammo.btBvhTriangleMeshShape(triMesh, useQuantizedAabbCompression);
      }
    case BODYSHAPE_SPHERE:
      return new ammo.btSphereShape(transform[7]);
    default:
      throw new Error("Shape not specified.");
  }
};
const createRigidBody = (object, inertia, flag) => {
  const {transform} = object;
  let localInertia;
  const shape = createShape(object.name, object.shape, transform, object.triangles);
  shape.setMargin(0);
  if (inertia === true) {
    localInertia = new ammo.btVector3(0, 0, 0);
    shape.calculateLocalInertia(object.mass, localInertia);
  }
  ammoVec.setValue(transform[0], transform[1], transform[2]);
  ammoQuat.setValue(transform[3], transform[4], transform[5], transform[6]);
  ammoTransform.setOrigin(ammoVec);
  ammoTransform.setRotation(ammoQuat);
  const motionState2 = new ammo.btDefaultMotionState(ammoTransform);
  const bodyInfo = new ammo.btRigidBodyConstructionInfo(object.mass, motionState2, shape, localInertia);
  const body2 = new ammo.btRigidBody(bodyInfo);
  body2.type = object.type;
  body2.trigger = false;
  body2.id = object.id;
  body2.name = object.name;
  body2.linkedRigidbodyId = object.linkedRigidbodyId;
  body2.setRestitution(object.restitution ?? 0);
  body2.setFriction(object.friction ?? 0);
  body2.setDamping(object.linearDamping ?? 0, object.angularDamping ?? 0);
  if (flag !== void 0) {
    body2.setCollisionFlags(body2.getCollisionFlags() | flag);
  }
  ammo.destroy(bodyInfo);
  if (inertia === true) {
    ammo.destroy(localInertia);
  }
  bodyMap.set(body2.id, body2);
  return body2;
};
const createRigidbodies = (objects) => {
  let flag, body2, inertia;
  for (const object of objects) {
    switch (object.type) {
      case BODYTYPE_STATIC:
        inertia = false;
        flag = BODYFLAG_STATIC_OBJECT;
        body2 = createRigidBody(object, inertia, flag);
        world.addRigidBody(body2, BODYGROUP_STATIC, BODYMASK_NOT_STATIC);
        break;
      case BODYTYPE_DYNAMIC:
        inertia = object.mass !== 0;
        flag = void 0;
        body2 = createRigidBody(object, inertia, flag);
        dynamicBodies.add(body2);
        world.addRigidBody(body2, BODYGROUP_DYNAMIC, BODYMASK_ALL);
        break;
      case BODYTYPE_KINEMATIC:
        inertia = false;
        flag = BODYFLAG_KINEMATIC_OBJECT;
        body2 = createRigidBody(object, inertia, flag);
        body2.setActivationState(BODYSTATE_DISABLE_DEACTIVATION);
        world.addRigidBody(body2);
    }
  }
};
const createTriggerVolume = (object) => {
  const {transform} = object;
  const shape = createShape(object.name, object.shape, object.transform, void 0);
  shape.setMargin(0);
  ammoVec.setValue(transform[0], transform[1], transform[2]);
  ammoQuat.setValue(transform[3], transform[4], transform[5], transform[6]);
  ammoTransform.setOrigin(ammoVec);
  ammoTransform.setRotation(ammoQuat);
  const mass = 1;
  const motionState2 = new ammo.btDefaultMotionState(ammoTransform);
  const bodyInfo = new ammo.btRigidBodyConstructionInfo(mass, motionState2, shape);
  const body2 = new ammo.btRigidBody(bodyInfo);
  body2.type = BODYTYPE_STATIC;
  body2.trigger = true;
  body2.id = object.id;
  body2.name = object.name;
  body2.enter = object.enter;
  body2.leave = object.leave;
  body2.entity = object.entity;
  body2.linkedRigidbodyId = object.linkedRigidbodyId;
  body2.setRestitution(0);
  body2.setFriction(0);
  body2.setDamping(0, 0);
  ammoVec.setValue(0, 0, 0);
  body2.setLinearFactor(ammoVec);
  body2.setAngularFactor(ammoVec);
  body2.setCollisionFlags(body2.getCollisionFlags() | BODYFLAG_NORESPONSE_OBJECT);
  ammo.destroy(bodyInfo);
  bodyMap.set(body2.id, body2);
  return body2;
};
const createTriggerVolumes = (objects) => {
  const group = BODYGROUP_STATIC;
  const mask = BODYMASK_NOT_STATIC;
  for (const object of objects) {
    const body2 = createTriggerVolume(object);
    world.addRigidBody(body2, group, mask);
  }
};
const applyCentralImpulse = (id, impulse) => {
  body = bodyMap.get(id);
  ammoVec.setValue(impulse.x, impulse.y, impulse.z);
  body.applyCentralImpulse(ammoVec);
  body.activate();
};
const applyCentralForce = (id, force) => {
  body = bodyMap.get(id);
  ammoVec.setValue(force.x, force.y, force.z);
  body.applyCentralForce(ammoVec);
  body.activate();
};
const teleport = (id, transform, clearForces, shift2 = 0) => {
  body = bodyMap.get(id);
  body.activate();
  if (clearForces === true) {
    ammoVec.setValue(0, 0, 0);
    body.setLinearVelocity(ammoVec);
    ammoVec.setValue(0, 0, 0);
    body.setAngularVelocity(ammoVec);
  }
  ammoVec.setValue(transform[shift2 + 0], transform[shift2 + 1], transform[shift2 + 2]);
  ammoQuat.setValue(transform[shift2 + 3], transform[shift2 + 4], transform[shift2 + 5], transform[shift2 + 6]);
  ammoTransform.setOrigin(ammoVec);
  ammoTransform.setRotation(ammoQuat);
  body.setWorldTransform(ammoTransform);
  if (body.type === BODYTYPE_KINEMATIC) {
    body.getMotionState()?.setWorldTransform(ammoTransform);
  }
  body.activate();
};
const teleportMany = (ids, transforms, clearForces) => {
  i = 0;
  for (const id of ids) {
    teleport(id, transforms, clearForces, i);
    i += 7;
  }
};
const setGravity = (id, acceleration) => {
  body = bodyMap.get(id);
  ammoVec.setValue(acceleration.x, acceleration.y, acceleration.z);
  body.setGravity(ammoVec);
  body.activate();
};
const setFriction = (id, friction) => {
  body = bodyMap.get(id);
  body.setFriction(friction);
  body.activate();
};
const removeRigidbody = (id) => {
  const body2 = bodyMap.get(id);
  const linkedId = body2.linkedRigidbodyId;
  if (linkedId !== void 0) {
    const linkedBody = bodyMap.get(linkedId);
    bodyMap.delete(linkedId);
    dynamicBodies.delete(linkedBody);
    world.removeRigidBody(linkedBody);
    ammo.destroy(linkedBody);
  }
  bodyMap.delete(id);
  dynamicBodies.delete(body2);
  world.removeRigidBody(body2);
  const motionState2 = body2.getMotionState();
  if (motionState2 !== void 0) {
    ammo.destroy(motionState2);
  }
  ammo.destroy(body2);
};
const removeRigidbodies = (ids) => {
  for (const id of ids) {
    removeRigidbody(id);
  }
  for (body of dynamicBodies) {
    body.activate();
  }
  postMessage({op: "unpause"});
};
const removeTriggerVolumes = (ids) => {
};
onmessage = ({data}) => {
  switch (data.op) {
    case "update":
      return update(data.transforms);
    case "applyCentralImpulse":
      return applyCentralImpulse(data.id, data.impulse);
    case "applyCentralForce":
      return applyCentralForce(data.id, data.force);
    case "teleport":
      return teleport(data.id, data.transform, data.clearForces);
    case "teleportMany":
      return teleportMany(data.ids, data.transforms, data.clearForces);
    case "setGravity":
      return setGravity(data.id, data.acceleration);
    case "setFriction":
      return setFriction(data.id, data.friction);
    case "createRigidbodies":
      return createRigidbodies(data.objects);
    case "createTriggerVolumes":
      return createTriggerVolumes(data.objects);
    case "removeRigidbodies":
      return removeRigidbodies(data.ids);
    case "removeTriggerVolumes":
      return removeTriggerVolumes(data.ids);
  }
};
init();
