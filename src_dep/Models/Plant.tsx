import React, { useEffect, useRef } from 'react'
import { Mesh } from 'three'
import type { GLTF } from 'three-stdlib'
import { useGLTF, Merged } from '@react-three/drei'
import { utils } from '../utils'
import * as sword from 'sword'

type GLTFResult = GLTF & {
  nodes: {
    Circle: THREE.Mesh
    Circle_1: THREE.Mesh
    Circle_2: THREE.Mesh
    BoundingBox: THREE.Mesh
  }
  materials: {
    Dirt: THREE.MeshStandardMaterial
    Clay: THREE.MeshStandardMaterial
    Leaf: THREE.MeshStandardMaterial
  }
}

const url = new URL('../assets/glb/plant.glb', import.meta.url).href

const Model = () => {
  const ref = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF(url) as GLTFResult
  
  useEffect(() => {
    const plant = ref.current!
    utils.setRandomTransform(plant)

    const { geometry } = nodes.BoundingBox

    sword.createRigidBody(plant, {
      canSleep: false,
      type: sword.RigidBodyType.Dynamic,
      collider: sword.ColliderType.ConvexHull,
      vertices: new Float32Array(geometry.attributes.position!.array),
      indices: geometry.index ? new Uint16Array(geometry.index.array) : null,
    }).then(id => utils.setRandomTorque(id, 0.05))
  }, [])

  return (
    <group name='Plant' ref={ref}>
      <Merged castShadow receiveShadow meshes={[
        nodes.Circle,
        nodes.Circle_1,
        nodes.Circle_2,
      ]}>
        {(C, C1, C2) => (
          <>
            <C material={materials.Dirt} />
            <C1 material={materials.Clay} />
            <C2 material={materials.Leaf} />
          </>
        )}
      </Merged>
    </group>
  )
}

export default Model

useGLTF.preload(url)
