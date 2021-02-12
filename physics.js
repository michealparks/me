import * as __SNOWPACK_ENV__ from './_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import {
  BODYTYPE_DYNAMIC,
  PASSIVE,
  MAX_BODIES
} from "./constants.js";
import {app} from "./app.js";
const worker = new Worker(new URL("./worker.js", import.meta.url));
const bodyMap = new Map();
const dynamicBodies = new Set();
let transforms = new Float32Array(MAX_BODIES * 7);
let pendingUpdate = false;
let i = 0;
let shift = 0;
const init = () => {
  return new Promise((resolve) => {
    worker.addEventListener("message", () => {
      worker.addEventListener("message", handleMessage, PASSIVE);
      resolve();
    }, {once: true});
  });
};
const update = () => {
  if (pendingUpdate === true) {
    return;
  }
  worker.postMessage({
    op: "update",
    transforms
  }, [transforms.buffer]);
  pendingUpdate = true;
};
const handleMessage = (e) => {
  switch (e.data.op) {
    case "update":
      return updateBodies(e);
  }
};
const updateBodies = (e) => {
  const {data} = e;
  for (const [id, others] of e.data.collisionStart) {
    app.fire("collisionstart", {id, others});
  }
  transforms = data.transforms;
  i = 0;
  for (const object of dynamicBodies) {
    shift = 7 * i;
    object.position.set(transforms[shift + 0], transforms[shift + 1], transforms[shift + 2]);
    object.quaternion.set(transforms[shift + 3], transforms[shift + 4], transforms[shift + 5], transforms[shift + 6]);
    object.updateMatrix();
    i += 1;
  }
  pendingUpdate = false;
};
const addRigidbodies = (objects, configs) => {
  i = 0;
  for (const object of objects) {
    bodyMap.set(object.id, object);
    object.matrixAutoUpdate = false;
    switch (configs[i].type) {
      case BODYTYPE_DYNAMIC:
        dynamicBodies.add(object);
        break;
    }
    i += 1;
  }
  worker.postMessage({
    op: "createRigidbodies",
    objects: configs
  });
};
const addTriggerVolumes = (objects, configs) => {
  for (const object of objects) {
    bodyMap.set(object.id, object);
  }
  worker.postMessage({
    op: "createTriggerVolumes",
    objects: configs
  });
};
const applyCentralImpulse = (id, impulse) => {
  worker.postMessage({
    op: "applyCentralImpulse",
    id,
    impulse: {x: impulse.x, y: impulse.y, z: impulse.z}
  });
};
const applyCentralForce = (id, force) => {
  worker.postMessage({
    op: "applyCentralForce",
    id,
    force: {x: force.x, y: force.y, z: force.z}
  });
};
const teleport = (id, transform, clearForces = false) => {
  worker.postMessage({
    op: "teleport",
    id,
    transform,
    clearForces
  });
};
const teleportMany = (ids, transforms2) => {
  worker.postMessage({
    op: "teleportMany",
    ids,
    transforms: transforms2
  });
};
const setGravity = (id, acceleration) => {
  worker.postMessage({
    op: "setGravity",
    id,
    acceleration: {x: acceleration.x, y: acceleration.y, z: acceleration.z}
  });
};
const setFriction = (id, friction) => {
  worker.postMessage({
    op: "setFriction",
    id,
    friction
  });
};
const removeRigidbody = (object) => {
  bodyMap.delete(object.id);
  dynamicBodies.delete(object);
  const ids = new Uint16Array(1);
  ids[0] = object.id;
  worker.postMessage({
    op: "removeRigidbodies",
    ids
  });
};
const removeRigidbodies = (objects) => {
  const ids = new Uint16Array(objects.length);
  let i2 = 0;
  for (const object of objects) {
    ids[i2] = object.id;
    bodyMap.delete(object.id);
    dynamicBodies.delete(object);
    i2++;
  }
  worker.postMessage({
    op: "removeRigidbodies",
    ids
  });
};
export const physics = {
  worker,
  bodyMap,
  dynamicBodies,
  init,
  update,
  addRigidbodies,
  addTriggerVolumes,
  applyCentralImpulse,
  applyCentralForce,
  teleport,
  teleportMany,
  setGravity,
  setFriction,
  removeRigidbody,
  removeRigidbodies
};
