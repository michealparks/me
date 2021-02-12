import {gl} from "./gl.js";
import {physics} from "./physics.js";
import {BODYTYPE_DYNAMIC, BODYSHAPE_BOX} from "./constants.js";
import {utils} from "./utils.js";
const setRandomTransform = (mesh, transform) => {
  const px = Math.random() * 4 - 3, py = 3, pz = 0;
  const qx = Math.random(), qy = Math.random(), qz = Math.random();
  mesh.position.set(px, py, pz);
  mesh.rotation.set(qx, qy, qz);
  mesh.updateMatrix();
  transform[0] = px;
  transform[1] = py;
  transform[2] = pz;
  transform[3] = mesh.quaternion.x;
  transform[4] = mesh.quaternion.y;
  transform[5] = mesh.quaternion.z;
  transform[6] = mesh.quaternion.w;
  return transform;
};
const rainCubes = async (numCubes = 50, i = 0) => {
  const template = utils.createCube(0.5);
  template.castShadow = true;
  template.receiveShadow = true;
  const cubes = [];
  const rigidbodies = [];
  for (i = 0; i < numCubes; i++) {
    const cube = template.clone();
    const transform = new Float32Array(10);
    setRandomTransform(cube, transform);
    transform[7] = transform[8] = transform[9] = 0.25;
    cube.updateMatrix();
    rigidbodies.push({
      id: cube.id,
      name: cube.name,
      type: BODYTYPE_DYNAMIC,
      shape: BODYSHAPE_BOX,
      transform,
      mass: 1,
      linearDamping: 0,
      angularDamping: 0,
      friction: 0.3,
      restitution: 0.9,
      enabled: false
    });
    gl.scene.add(cube);
    cubes.push(cube);
  }
  physics.addRigidbodies(cubes, rigidbodies);
  i = 0;
  setInterval(() => {
    const cube = cubes[i];
    const transform = new Float32Array(7);
    setRandomTransform(cube, transform);
    physics.teleport(cube.id, transform, true);
    i += 1;
    i %= numCubes - 1;
  }, 500);
};
export {rainCubes};
