import { assets, scene } from 'three-kit'
import * as THREE from 'three'
import * as sword from 'sword'
import { createRandomTransform } from '../util'

const gltf = await assets.loadGLTF('lego.glb')
const color = new THREE.Color()

const count = 30
const template = gltf.scene.getObjectByName('Lego') as THREE.Mesh
const collider = gltf.scene.getObjectByName('Collider') as THREE.Mesh
const mesh = new THREE.InstancedMesh(template.geometry, template.material, count)
mesh.name = 'Legos'
mesh.castShadow = true
mesh.receiveShadow = true

const colors = [
  '#146152',
  '#44803F',
  '#B4CF66',
  '#FFEC5C',
  '#FF5A33',
]

for (let i = 0; i < count; i += 1) {
  mesh.setMatrixAt(i, createRandomTransform())
  mesh.setColorAt(i, color.set(colors[i % colors.length]!))
}
mesh.instanceMatrix.needsUpdate = true

const ids = await sword.createRigidBodies(mesh, {
  density: 20,
  canSleep: false,
  type: sword.RigidBodyType.Dynamic,
  collider: sword.ColliderType.ConvexHull,
  vertices: new Float32Array(collider.geometry.attributes.position!.array),
  indices: new Uint16Array(collider.geometry.attributes.index!),
})

scene.add(mesh)

export { ids }
