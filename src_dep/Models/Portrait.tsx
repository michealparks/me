import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import type { GLTF } from 'three-stdlib'
import { utils } from '../utils'
import * as sword from 'sword'

type GLTFResult = GLTF & {
  nodes: {
    Portrait: THREE.Mesh
  }
  materials: {
    Bake: THREE.MeshStandardMaterial
  }
}

const url = new URL('../assets/glb/portrait.glb', import.meta.url).href

const Model = () => {
  const ref = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF(url) as GLTFResult

  useEffect(() => {
    const portrait = ref.current!
    utils.setRandomTransform(portrait)
    const size = utils.getSize(portrait)

    sword.createRigidBody(portrait, {
      canSleep: false,
      type: sword.RigidBodyType.Dynamic,
      collider: sword.ColliderType.Cuboid,
      hx: size.x / 2,
      hy: size.y / 2,
      hz: size.z / 2,
    }).then(id => utils.setRandomTorque(id, 0.05))
  }, [])

  return (
    <mesh
      name='Portrait'
      ref={ref} 
      castShadow
      receiveShadow
      geometry={nodes.Portrait.geometry}
      material={materials.Bake}
    />
  )
}

export default Model

useGLTF.preload(url)
