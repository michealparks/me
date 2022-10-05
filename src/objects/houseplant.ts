import { assets, scene } from 'three-kit'
import * as THREE from 'three'
import * as sword from 'sword'
import { createRandomTransform } from '../util'

const gltf = await assets.load<{ scene: THREE.Scene }>('houseplant.glb')

const mesh = gltf.scene.getObjectByName('Plant') as THREE.Group
mesh.traverse((child) => {
  child.castShadow = true
  child.receiveShadow = true
})

const collider = gltf.scene.getObjectByName('Collider') as THREE.Mesh

createRandomTransform(mesh.position, mesh.quaternion)

const id = await sword.createRigidBody(mesh, {
  density: 0.1,
  canSleep: false,
  type: sword.RigidBodyType.Dynamic,
  collider: sword.ColliderType.ConvexHull,
  vertices: new Float32Array(collider.geometry.attributes.position!.array),
  indices: new Uint16Array(collider.geometry.attributes.index!),
})

scene.add(mesh)

export { id }
