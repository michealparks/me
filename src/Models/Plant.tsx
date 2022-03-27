import React, { useEffect, useRef } from 'react'
import { Mesh } from 'three'
import type { GLTF } from 'three-stdlib'
import { useGLTF, Merged } from '@react-three/drei'
import { utils } from '../utils'
import { physics } from '../physics'
import { BODYSHAPE_BOX, BODYTYPE_DYNAMIC } from '../constants'

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
    const transform = new Float32Array(10)
    utils.setRandomTransform(plant, transform)
    utils.getSize(new Mesh(nodes.BoundingBox.geometry), transform)

    physics.add(plant, {
      id: plant.id,
      name: plant.name,
      type: BODYTYPE_DYNAMIC,
      shape: BODYSHAPE_BOX,
      transform,
      mass: 1,
      linearDamping: 0,
      angularDamping: 0,
      friction: 0.3,
      restitution: 0.9,
    })

    utils.setRandomTorque(plant.id, 0.05)
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
