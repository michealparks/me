import { assets, scene } from 'three-kit'
import * as THREE from 'three'
import * as sword from 'sword'
import { createRandomTransform } from '../util'

const elements = [
  'Body',
  'LeftStick',
  'RightStick',
  'Pad',
  'Screen',
  ...Array.from({ length: 6 }).map((_, i) => `Button${i + 1}`),
]

const gltf = await assets.loadGLTF('switch.glb')

gltf.scene.traverse((child) => {
  child.castShadow = true
  child.receiveShadow = true
})

const group = new THREE.Group()
group.name = 'Switch'

for (const name of elements) {
  const element = gltf.scene.getObjectByName(name) as THREE.Mesh
  group.add(element)
}

createRandomTransform(group.position, group.quaternion)

const collider = gltf.scene.getObjectByName('Collider')

const id = await sword.createRigidBody(group, {
  canSleep: false,
  type: sword.RigidBodyType.Dynamic,
  collider: sword.ColliderType.ConvexHull,
  vertices: new Float32Array(collider!.geometry.attributes.position!.array),
  indices: new Uint16Array(collider.geometry.attributes.index!),
})

scene.add(group)

export { id }
