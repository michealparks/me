import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import type { GLTF } from 'three-stdlib'
import { utils } from '../utils'
import { physics } from '../physics'
import { BODYSHAPE_BOX, BODYTYPE_DYNAMIC } from '../constants'

type GLTFResult = GLTF & {
  nodes: {
    Portrait: THREE.Mesh
  }
  materials: {
    Bake: THREE.MeshStandardMaterial
  }
}

const url = new URL('../assets/glb/portrait.glb', import.meta.url).href

export default function Model({ ...props }: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>()
  const { nodes, materials } = useGLTF(url) as GLTFResult

  useEffect(() => {
    const portrait = group.current
    const transform = new Float32Array(10)
    utils.setRandomTransform(portrait, transform)
    utils.getSize(portrait, transform)

    physics.add(portrait, {
      id: portrait.id,
      name: portrait.name,
      type: BODYTYPE_DYNAMIC,
      shape: BODYSHAPE_BOX,
      transform,
      mass: 1,
      linearDamping: 0,
      angularDamping: 0,
      friction: 0.3,
      restitution: 0.9
    })

    utils.setRandomTorque(portrait.id, 0.05)
  }, [])

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene" userData={{ glTF2ExportSettings: { export_extras: 1, use_selection: 1 } }}>
        <mesh
          name="Portrait"
          castShadow
          receiveShadow
          geometry={nodes.Portrait.geometry}
          material={materials.Bake}
        />
      </group>
    </group>
  )
}

useGLTF.preload(url)
