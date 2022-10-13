import { assets, scene } from 'three-kit'
import * as THREE from 'three'
import * as sword from 'sword'
import { createRandomTransform } from '../util'

const elements = [
  'Body',
  'WhiteKeys',
  'Edges',
  'BlackKeys',
  'Knobs',
  'Dials',
  'Screen',
]

const gltf = await assets.load<{ scene: THREE.Scene }>('synth.glb')
gltf.scene.traverse((child) => {
  child.castShadow = true
  child.receiveShadow = true
})

const group = new THREE.Group()
group.name = 'Synth'

for (let i = 0, l = elements.length; i < l; i += 1) {
  const element = gltf.scene.getObjectByName(elements[i]!) as THREE.Mesh
  group.add(element)
}

createRandomTransform(group.position, group.quaternion)

const collider = gltf.scene.getObjectByName('Collider')

const id = await sword.createRigidBody(group, {
  canSleep: false,
  type: sword.RigidBodyType.Dynamic,
  collider: sword.ColliderType.ConvexHull,
  vertices: new Float32Array(collider.geometry.attributes.position!.array),
  indices: new Uint16Array(collider.geometry.attributes.index!),
})

scene.add(group)

export { id }
