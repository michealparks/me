import { assets, scene } from 'three-kit'
import * as THREE from 'three'
import * as sword from 'sword'
import { createRandomTransform } from '../util'

const gltf = await assets.loadGLTF('picture.glb')

const mesh = gltf.scene.getObjectByName('Portrait') as THREE.Mesh
mesh.castShadow = true
mesh.receiveShadow = true

createRandomTransform(mesh.position, mesh.quaternion)

const id = await sword.createRigidBody(mesh, {
  canSleep: false,
  type: sword.RigidBodyType.Dynamic,
  collider: sword.ColliderType.ConvexHull,
  vertices: new Float32Array(mesh.geometry.attributes.position!.array),
  indices: new Uint16Array(mesh.geometry.attributes.index!),
})

scene.add(mesh)

export { id }
