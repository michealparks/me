import { assets, scene } from 'three-kit'
import * as sword from 'sword'

const gltf = await assets.loadGLTF('name.glb')

const bb1 = gltf.scene.getObjectByName('BoundingBox1') as THREE.Mesh
const bb2 = gltf.scene.getObjectByName('BoundingBox2') as THREE.Mesh

bb1.rotation.x = Math.PI * 2

const [id1, id2] = await Promise.all([
  sword.createRigidBody(bb1, {
    type: sword.RigidBodyType.Fixed,
    collider: sword.ColliderType.ConvexHull,
    vertices: new Float32Array(bb1.geometry.attributes.position!.array),
    indices: new Uint16Array(bb1.geometry.index!.array),
  }),
  sword.createRigidBody(bb2, {
    type: sword.RigidBodyType.Fixed,
    collider: sword.ColliderType.ConvexHull,
    vertices: new Float32Array(bb2.geometry.attributes['position']!.array),
    indices: new Uint16Array(bb2.geometry.index!.array),
  }),
])

const title = gltf.scene.getObjectByName('Title') as THREE.Mesh
title.castShadow = true
title.receiveShadow = true

scene.add(title)

export { id1, id2 }
